#!/usr/bin/env node
/* ============================================================================
   FR STUDIO — CONTROLLI SULLE PAGINE GENERATE
   ----------------------------------------------------------------------------
       npm test          (lancia prima `build.js`, poi questi controlli)

   Non è una suite di test del codice: è una lista di cose che, se saltano,
   rompono il sito in modo silenzioso — un link a una pagina che non esiste,
   un testo che sparisce dal sorgente, una richiesta a Google rimasta in giro.
   ========================================================================== */

"use strict";

const fs = require("fs");
const path = require("path");
const vm = require("vm");

const RADICE = path.join(__dirname, "..");
const leggi = (f) => fs.readFileSync(path.join(RADICE, f), "utf8");
const esiste = (f) => fs.existsSync(path.join(RADICE, f));

const errori = [];
const avvisi = [];
let passati = 0;

function verifica(descrizione, condizione, dettaglio) {
  if (condizione) {
    passati++;
  } else {
    errori.push(descrizione + (dettaglio ? " — " + dettaglio : ""));
  }
}

/* ------------------------------------------------------------------ dati */

function caricaDati() {
  const contesto = { window: {}, console: console };
  vm.createContext(contesto);
  vm.runInContext(leggi("assets/js/data.js"), contesto, { filename: "data.js" });
  return contesto.window.FR_DATA;
}

const D = caricaDati();

const PAGINE = ["index.html", "privacy.html", "grazie.html", "404.html"]
  .concat(D.pagine.map((p) => p.slug + ".html"));

/* --------------------------------------------------- 1. le pagine ci sono */

PAGINE.forEach((p) => verifica("manca la pagina " + p, esiste(p)));

/* ------------------------------------- 2. il contenuto è davvero nell'HTML */

const home = esiste("index.html") ? leggi("index.html") : "";

verifica(
  "l'H1 della hero non è nel sorgente di index.html",
  home.indexOf(D.hero.titolo.slice(0, 40)) !== -1,
  "senza, Google e l'anteprima di WhatsApp vedono una pagina vuota"
);

// Con il listino ancora da definire, `prezzo` è vuoto e in pagina deve
// comparire la nota al suo posto — non un riquadro a metà.
// La sezione prezzi è però opzionale: se manca in data.js non c'è niente da
// controllare (stessa guardia che usa build.js).
if (D.prezzi && D.prezzi.pacchetti && D.prezzi.pacchetti.length) {
  const primoPacchetto = D.prezzi.pacchetti[0];
  verifica(
    "la sezione prezzi non mostra niente",
    home.indexOf(primoPacchetto.prezzo || primoPacchetto.prezzoNota) !== -1
  );
}

verifica(
  "riquadro prezzo vuoto in pagina",
  home.indexOf('class="prezzo__cifra"></span>') === -1
);

verifica(
  "le domande frequenti non sono nel sorgente",
  home.indexOf(D.faq.voci[0].domanda.slice(0, 30)) !== -1
);

verifica(
  "i dati strutturati FAQPage non sono stati scritti",
  home.indexOf('"@type": "FAQPage"') !== -1
);

/* -------------------------------------------- 3. contenitori tutti riempiti */

PAGINE.filter(esiste).forEach((p) => {
  const html = leggi(p);
  const vuoti = (html.match(/data-mount="([^"]+)"[^>]*>\s*<\//g) || [])
    .map((m) => /data-mount="([^"]+)"/.exec(m)[1])
    .filter((nome) => nome !== "form-modalita");   // costruito da app.js, apposta
  verifica("contenitori vuoti in " + p, vuoti.length === 0, vuoti.join(", "));
});

/* ------------------------------------------------------ 4. modulo funzionante */

verifica(
  "la access key nell'HTML non è quella di data.js",
  home.indexOf('value="' + D.form.accessKey + '"') !== -1,
  "senza JavaScript il modulo verrebbe rifiutato da Web3Forms"
);

verifica(
  "la access key è ancora il segnaposto",
  D.form.accessKey && D.form.accessKey !== "TUA_ACCESS_KEY_QUI"
);

verifica(
  "il modulo non rimanda a grazie.html",
  home.indexOf("grazie.html") !== -1,
  "chi invia senza JavaScript finirebbe su un sito di terzi"
);

/* --------------------------- 4bis. campi facoltativi che restano coerenti */

// P.IVA, via e coordinate possono legittimamente mancare. Quello che NON deve
// succedere è che ne resti l'etichetta senza il valore: "P.IVA" seguito dal
// nulla in fondo a ogni pagina, o un indirizzo vuoto dichiarato a Google.

PAGINE.filter(esiste).forEach((p) => {
  const testo = leggi(p).replace(/\s+/g, " ");

  if (!D.agenzia.piva) {
    verifica("resta scritto \"P.IVA\" senza valore in " + p, testo.indexOf("P.IVA") === -1);
  } else {
    verifica("la P.IVA in " + p + " non è quella di data.js", testo.indexOf(D.agenzia.piva) !== -1);
  }

  if (!D.agenzia.indirizzo.via) {
    verifica("streetAddress vuoto nei dati strutturati di " + p, testo.indexOf("streetAddress") === -1);
  }
  if (!D.agenzia.geo.lat) {
    verifica("coordinate vuote nei dati strutturati di " + p, testo.indexOf("GeoCoordinates") === -1);
  }
});

// L'informativa è un documento legale: i dati identificativi devono venire da
// `agenzia`, non essere riscritti a mano dentro il testo.
if (esiste("privacy.html")) {
  const privacy = leggi("privacy.html").replace(/\s+/g, " ");
  verifica("i fondatori non compaiono nell'informativa privacy",
    !D.agenzia.fondatori || privacy.indexOf(D.agenzia.fondatori) !== -1,
    "senza partita IVA sono loro a identificare il titolare del trattamento");
  verifica("l'email del titolare non compare nell'informativa",
    privacy.indexOf(D.agenzia.emailPrivacy) !== -1);
  verifica("nell'informativa è rimasto un segnaposto non sostituito",
    !/\{(titolare|indirizzo|piva|nome|email|emailPrivacy)\}/.test(privacy));
}

/* ------------------------------ 4ter. dati strutturati sulle categorie */

D.pagine.forEach((p) => {
  const file = p.slug + ".html";
  if (!esiste(file)) return;
  const html = leggi(file);

  ["Service", "BreadcrumbList", "FAQPage"].forEach((tipo) => {
    verifica("manca il dato strutturato " + tipo + " in " + file,
      html.indexOf('"@type": "' + tipo + '"') !== -1);
  });
});

/* ------------------------------------------------ 4quater. foglio di stile */

// Il foglio è volutamente bloccante: caricarlo in differita anticipava il
// primo disegno ma faceva comparire la pagina con i caratteri di sistema, per
// poi riassestarla. Vedi la nota in cima a site.css.
PAGINE.filter(esiste).forEach((p) => {
  const html = leggi(p);
  verifica("il foglio di stile non è collegato in " + p,
    html.indexOf('<link rel="stylesheet" href="assets/css/site.css">') !== -1);
  verifica("i caratteri non sono in preload in " + p,
    html.indexOf('rel="preload"') !== -1);
});

/* -------------------------------------------- 5. niente richieste a terzi */

PAGINE.filter(esiste).concat(["assets/css/site.css"]).forEach((f) => {
  const testo = leggi(f);
  verifica("richiesta a Google Fonts rimasta in " + f, !/fonts\.(googleapis|gstatic)\.com/.test(testo));
  verifica("riferimento a motion rimasto in " + f, testo.indexOf("vendor/motion") === -1);
});

verifica("manca assets/fonts/archivo-latin.woff2", esiste("assets/fonts/archivo-latin.woff2"),
  "lancia `npm run fonts`");
verifica("manca assets/fonts/source-serif-4-latin.woff2", esiste("assets/fonts/source-serif-4-latin.woff2"),
  "lancia `npm run fonts`");

/* ------------------------------------------------ 6. immagine di anteprima */

if (esiste(D.sito.ogImage)) {
  const png = fs.readFileSync(path.join(RADICE, D.sito.ogImage));
  const larghezza = png.readUInt32BE(16);
  const altezza = png.readUInt32BE(20);
  verifica(
    "le misure dichiarate in og:image non corrispondono al file",
    home.indexOf('og:image:width" content="' + larghezza + '"') !== -1 &&
      home.indexOf('og:image:height" content="' + altezza + '"') !== -1
  );
  const rapporto = larghezza / altezza;
  if (rapporto < 1.85 || rapporto > 1.95) {
    avvisi.push("og.png ha rapporto " + rapporto.toFixed(2) + ": i social si aspettano circa 1,91");
  }
} else {
  errori.push("manca " + D.sito.ogImage + " — le condivisioni restano senza immagine");
}

/* ------------------------------------------------- 7. link interni validi */

PAGINE.filter(esiste).forEach((p) => {
  const html = leggi(p);
  const href = (html.match(/href="([^"]+)"/g) || []).map((m) => m.slice(6, -1));

  href.forEach((h) => {
    if (/^(https?:|mailto:|tel:|#|data:)/.test(h)) return;
    const file = h.split("#")[0];
    if (!file) return;
    verifica("link rotto in " + p + " → " + file, esiste(file));
  });
});

/* --------------------------------------------------- 8. sitemap coerente */

if (esiste("sitemap.xml")) {
  const sitemap = leggi("sitemap.xml");
  const loc = (sitemap.match(/<loc>([^<]+)<\/loc>/g) || []).map((m) => m.slice(5, -6));

  loc.forEach((u) => {
    const file = u.replace(/^https?:\/\/[^/]+\//, "") || "index.html";
    verifica("la sitemap indica una pagina inesistente: " + file, esiste(file));
  });

  verifica("grazie.html non deve stare nella sitemap", loc.every((u) => u.indexOf("grazie") === -1));
  verifica("404.html non deve stare nella sitemap", loc.every((u) => u.indexOf("404") === -1));

  D.pagine.forEach((p) => {
    verifica(
      "la pagina " + p.slug + " manca dalla sitemap",
      loc.some((u) => u.indexOf(p.slug) !== -1)
    );
  });
}

/* ------------------------------------- 9. il browser non riceve troppa roba */

const daScaricare = [
  "index.html", "assets/css/site.css", "assets/js/dati.js",
  "assets/js/render.js", "assets/js/app.js",
  "assets/fonts/archivo-latin.woff2", "assets/fonts/source-serif-4-latin.woff2"
];

const peso = daScaricare
  .filter(esiste)
  .reduce((t, f) => t + fs.statSync(path.join(RADICE, f)).size, 0);

verifica(
  "la pagina pesa " + Math.round(peso / 1024) + " KB, oltre il limite che ci siamo dati (260 KB)",
  peso < 260 * 1024
);

verifica(
  "dati.js contiene ancora contenuti che al browser non servono",
  esiste("assets/js/dati.js") && leggi("assets/js/dati.js").indexOf("titoloPagina") === -1
);

/* --------------------------------------------- 10. dominio e pubblicazione */

verifica("manca il file CNAME: GitHub Pages non servirebbe il dominio", esiste("CNAME"));

if (esiste("CNAME")) {
  const host = leggi("CNAME").trim();
  verifica(
    "il CNAME non corrisponde a sito.dominio",
    D.sito.dominio.indexOf(host) !== -1,
    "CNAME: " + host + " — data.js: " + D.sito.dominio
  );
}

verifica(
  "i sorgenti delle immagini in scripts/ sono indicizzabili",
  esiste("robots.txt") && leggi("robots.txt").indexOf("Disallow: /scripts/") !== -1
);

/* ------------------------------------------------------------------ esito */

console.log("\n" + passati + " controlli superati.");

if (avvisi.length) {
  console.log("\nAvvisi:");
  avvisi.forEach((a) => console.log("  ~ " + a));
}

if (errori.length) {
  console.log("\n✗ " + errori.length + " problemi:");
  errori.forEach((e) => console.log("  - " + e));
  process.exit(1);
}

console.log("✓ Tutto a posto.\n");
console.log("Restano i controlli da fare a occhio, elencati nel README:");
console.log("  · invio reale del modulo   · layout a 375 / 768 / 1280 px");
console.log("  · anteprima del link su WhatsApp   · giro completo da tastiera");
