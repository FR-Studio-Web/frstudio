#!/usr/bin/env node
/* ============================================================================
   FR STUDIO — GENERAZIONE DELLE PAGINE
   ----------------------------------------------------------------------------
   Scrive i contenuti di data.js dentro l'HTML, così il testo del sito esiste
   davvero nel sorgente: lo leggono Google, l'anteprima di WhatsApp e chiunque
   non esegua JavaScript. Prima erano tutti iniettati dal browser.

       node build.js          (oppure: npm run build)

   Nessuna dipendenza: usa solo i moduli inclusi in Node.
   Non modificare i file .html generati — si rigenerano da:
       index.template.html    la home
       pagina.template.html   privacy, grazie, 404, pagine per categoria
   ========================================================================== */

"use strict";

const fs = require("fs");
const path = require("path");
const vm = require("vm");

const RADICE = __dirname;
const leggi = (f) => fs.readFileSync(path.join(RADICE, f), "utf8");

/**
 * Scrive un file solo se il contenuto è davvero cambiato, e dice se lo ha
 * fatto. Serve a due cose: non toccare la data di modifica dei file invariati,
 * e permettere alla sitemap di conservare il `lastmod` delle pagine ferme.
 */
function scrivi(f, testo) {
  const percorso = path.join(RADICE, f);
  let precedente = null;
  try {
    precedente = fs.readFileSync(percorso, "utf8");
  } catch (err) {
    /* file nuovo */
  }
  if (precedente === testo) return false;
  fs.writeFileSync(percorso, testo, "utf8");
  return true;
}

const generati = [];

/* ------------------------------------------------------------------ 1. dati */

/**
 * data.js e render.js sono pensati per il browser: assegnano a `window`.
 * Invece di duplicarli per Node, li eseguiamo in un contesto isolato con un
 * `window` finto e ne raccogliamo il risultato. Restano un file solo.
 */
function caricaSorgenti() {
  const contesto = { window: {}, console: console };
  vm.createContext(contesto);

  ["assets/js/data.js", "assets/js/render.js"].forEach((file) => {
    vm.runInContext(leggi(file), contesto, { filename: file });
  });

  const D = contesto.window.FR_DATA;
  const R = contesto.window.FR_RENDER;
  if (!D || !R) {
    throw new Error("data.js o render.js non hanno definito window.FR_DATA / window.FR_RENDER");
  }
  return { D: D, R: R };
}

/* -------------------------------------------------------------- 2. montaggio */

/**
 * Riempie ogni <tag data-mount="nome"></tag> vuoto del template.
 * Il template garantisce che siano vuoti, quindi non serve un parser HTML.
 */
function montaTemplate(html, mappa) {
  const mancanti = [];

  const risultato = html.replace(
    /(<([a-zA-Z][\w-]*)\b[^>]*\bdata-mount="([^"]+)"[^>]*>)(\s*)(<\/\2>)/g,
    (intero, apertura, tag, nome, spazi, chiusura) => {
      const produci = mappa[nome];
      if (!produci) {
        mancanti.push(nome);
        return intero;
      }
      return apertura + produci() + chiusura;
    }
  );

  // `form-modalita` non è nella mappa apposta: quei pulsanti hanno senso solo
  // con JavaScript attivo, quindi li costruisce app.js e non li segnaliamo.
  const daSegnalare = mancanti.filter((n) => n !== "form-modalita");
  if (daSegnalare.length) {
    console.warn("  ⚠ punti di montaggio senza contenuto: " + daSegnalare.join(", "));
  }
  return risultato;
}

/* ------------------------------------------------------------------ 3. head */

/**
 * Larghezza e altezza vere dell'immagine di anteprima, lette dall'intestazione
 * IHDR del PNG. Dichiararle a mano significa prima o poi dichiararle sbagliate,
 * e alcuni servizi rifiutano l'anteprima quando le misure non corrispondono.
 */
function misuraPng(percorso) {
  try {
    const dati = fs.readFileSync(path.join(RADICE, percorso));
    // 8 byte di firma, 4 di lunghezza, 4 di tipo ("IHDR"), poi 4+4 di misure
    if (dati.length < 24 || dati.toString("ascii", 12, 16) !== "IHDR") return null;
    return { larghezza: dati.readUInt32BE(16), altezza: dati.readUInt32BE(20) };
  } catch (err) {
    return null;
  }
}

/** JSON-LD sicuro da incollare dentro <script>: niente `</script>` per sbaglio. */
function jsonLd(oggetto) {
  const testo = JSON.stringify(oggetto, null, 2).replace(/</g, "\\u003c");
  return '<script type="application/ld+json">\n' + testo + "\n</script>";
}

/**
 * Le zone servite, nel formato che si aspetta schema.org.
 * La stringa in data.js è pensata per essere letta ("Scandiano, Casalgrande,
 * Albinea e Reggio Emilia"), qui diventa un elenco.
 */
function zoneServite(D) {
  return String(D.agenzia.zone)
    .split(/,| e /)
    .map((s) => s.trim())
    .filter(Boolean)
    .map((nome) => ({ "@type": "City", name: nome }));
}

/**
 * Indirizzo con le sole chiavi valorizzate.
 * Dichiarare a Google un `streetAddress` vuoto è peggio che non dichiararne
 * nessuno: comune, provincia e nazione bastano e restano utili per le
 * ricerche locali anche senza una sede aperta al pubblico.
 */
function indirizzoStrutturato(D) {
  const i = D.agenzia.indirizzo;
  const indirizzo = { "@type": "PostalAddress", addressCountry: "IT" };
  if (i.via) indirizzo.streetAddress = i.via;
  if (i.cap) indirizzo.postalCode = i.cap;
  if (i.citta) indirizzo.addressLocality = i.citta;
  if (i.provincia) indirizzo.addressRegion = i.provincia;
  return indirizzo;
}

function datiStrutturatiAgenzia(D, R) {
  const a = D.agenzia;
  const dato = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": R.url(D, "index.html") + "#agenzia",
    name: a.nome,
    description: D.footer.descrizione,
    url: R.url(D, "index.html"),
    image: R.url(D, D.sito.ogImage),
    logo: R.url(D, "assets/img/favicon.svg"),
    email: a.email,
    telephone: a.telefonoHref,
    priceRange: "€€",
    address: indirizzoStrutturato(D),
    areaServed: zoneServite(D),
    openingHoursSpecification: [{
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
      opens: "09:00",
      closes: "19:00"
    }],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: D.prezzi.titolo,
      itemListElement: D.prezzi.pacchetti.map((p) => ({
        "@type": "Offer",
        name: p.nome,
        description: p.per
      }))
    }
  };

  if (a.geo && a.geo.lat && a.geo.lon) {
    dato.geo = { "@type": "GeoCoordinates", latitude: a.geo.lat, longitude: a.geo.lon };
  }
  if (a.profili && a.profili.length) dato.sameAs = a.profili;
  if (a.fondatori) {
    // Senza partita IVA sono le persone a identificare l'attività
    dato.founder = a.fondatori
      .split(/\s+e\s+/)
      .map((nome) => ({ "@type": "Person", name: nome.trim() }));
  }

  return dato;
}

/**
 * Pagine per categoria: senza questi dati Google le legge come pagine
 * qualsiasi, senza capire che descrivono un servizio né dove stanno nella
 * gerarchia del sito.
 */
function datiStrutturatiServizio(D, R, p) {
  const servizio = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: p.titolo,
    description: p.descrizione,
    serviceType: "Realizzazione di siti web per " + p.settore,
    url: R.url(D, p.slug + ".html"),
    areaServed: zoneServite(D),
    provider: {
      "@type": "ProfessionalService",
      "@id": R.url(D, "index.html") + "#agenzia",
      name: D.agenzia.nome,
      url: R.url(D, "index.html")
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: D.prezzi.titolo,
      itemListElement: D.prezzi.pacchetti.map((v) => ({
        "@type": "Offer",
        name: v.nome,
        description: v.per
      }))
    }
  };

  const briciole = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: R.url(D, "index.html") },
      { "@type": "ListItem", position: 2, name: p.occhiello, item: R.url(D, p.slug + ".html") }
    ]
  };

  // Le pagine categoria includono la stessa sezione FAQ della home,
  // quindi il markup ci deve stare anche qui.
  return [servizio, briciole, datiStrutturatiFaq(D)];
}

function datiStrutturatiFaq(D) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: D.faq.voci.map((v) => ({
      "@type": "Question",
      name: v.domanda,
      acceptedAnswer: { "@type": "Answer", text: v.risposta }
    }))
  };
}

/**
 * Il blocco <head> variabile di una pagina: titolo, descrizione, canonical,
 * Open Graph, Twitter e dati strutturati. Sostituisce il segnaposto {{HEAD}}.
 */
function costruisciHead(D, R, p) {
  const e = R.esc;
  const canonical = R.url(D, p.percorso);
  const immagine = R.url(D, D.sito.ogImage);
  const righe = [];

  righe.push(`<title>${e(p.titolo)}</title>`);
  righe.push(`<meta name="description" content="${e(p.descrizione)}">`);
  righe.push(`<meta name="author" content="${e(D.agenzia.nome)}">`);
  righe.push(`<meta name="theme-color" content="#F8F9FA">`);
  if (p.noindex) righe.push(`<meta name="robots" content="noindex, follow">`);
  righe.push(`<link rel="canonical" href="${e(canonical)}">`);
  righe.push("");
  righe.push(`<meta property="og:type" content="website">`);
  righe.push(`<meta property="og:locale" content="it_IT">`);
  righe.push(`<meta property="og:site_name" content="${e(D.agenzia.nome)}">`);
  righe.push(`<meta property="og:url" content="${e(canonical)}">`);
  righe.push(`<meta property="og:title" content="${e(p.ogTitolo || p.titolo)}">`);
  righe.push(`<meta property="og:description" content="${e(p.descrizione)}">`);
  righe.push(`<meta property="og:image" content="${e(immagine)}">`);
  const misure = misuraPng(D.sito.ogImage);
  if (misure) {
    righe.push(`<meta property="og:image:width" content="${misure.larghezza}">`);
    righe.push(`<meta property="og:image:height" content="${misure.altezza}">`);
  }
  righe.push(`<meta property="og:image:alt" content="${e(D.sito.ogImageAlt)}">`);
  righe.push(`<meta name="twitter:card" content="summary_large_image">`);
  righe.push(`<meta name="twitter:title" content="${e(p.ogTitolo || p.titolo)}">`);
  righe.push(`<meta name="twitter:description" content="${e(p.descrizione)}">`);
  righe.push(`<meta name="twitter:image" content="${e(immagine)}">`);

  (p.datiStrutturati || []).forEach((dato) => {
    righe.push("");
    righe.push(jsonLd(dato));
  });

  return righe.join("\n");
}

/* --------------------------------------------------------------- 4. pagine */

function generaHome(D, R) {
  const html = montaTemplate(leggi("index.template.html"), R.mappaMount(D))
    .replace("{{HEAD}}", costruisciHead(D, R, {
      percorso: "index.html",
      titolo: D.agenzia.nome + " — Siti web per le attività locali di " + D.agenzia.indirizzo.citta,
      descrizione:
        "Realizziamo siti web moderni per ristoranti, negozi e artigiani di " +
        D.agenzia.indirizzo.citta + " e Reggio Emilia. Zero anticipo: prima ti mostriamo " +
        "la demo su tablet, poi decidi.",
      datiStrutturati: [datiStrutturatiAgenzia(D, R), datiStrutturatiFaq(D)]
    }))
    .replace("{{ACCESS_KEY}}", R.esc(D.form.accessKey))
    .replace("{{REDIRECT}}", R.esc(R.url(D, D.form.redirect)));

  generati.push({
    file: "index.html",
    sitemap: true,
    priorita: "1.0",
    cambiato: scrivi("index.html", html)
  });
}

function generaPagina(D, R, opzioni) {
  const mappa = R.mappaMount(D, { corpo: opzioni.corpo });
  const html = montaTemplate(leggi("pagina.template.html"), mappa)
    .replace("{{HEAD}}", costruisciHead(D, R, opzioni));

  generati.push({
    file: opzioni.percorso,
    sitemap: !opzioni.noindex,
    priorita: opzioni.priorita || "0.6",
    cambiato: scrivi(opzioni.percorso, html)
  });
}

function generaTutto(D, R) {
  generaHome(D, R);

  D.pagine.forEach((p) => {
    generaPagina(D, R, {
      percorso: p.slug + ".html",
      titolo: p.titoloPagina,
      descrizione: p.descrizione,
      corpo: R.paginaCategoria(D, p),
      datiStrutturati: datiStrutturatiServizio(D, R, p),
      priorita: "0.8"
    });
  });

  generaPagina(D, R, {
    percorso: "privacy.html",
    titolo: D.privacy.titoloPagina,
    descrizione:
      "Informativa sul trattamento dei dati personali di " + D.agenzia.nome +
      ": quali dati raccogliamo dal modulo di contatto, perché e per quanto tempo.",
    corpo: R.paginaPrivacy(D),
    priorita: "0.3"
  });

  generaPagina(D, R, {
    percorso: "grazie.html",
    titolo: D.grazie.titoloPagina,
    descrizione: "Richiesta inviata: ti ricontattiamo entro un giorno lavorativo.",
    corpo: R.paginaGrazie(D),
    noindex: true
  });

  generaPagina(D, R, {
    percorso: "404.html",
    titolo: D.errore404.titoloPagina,
    descrizione: "La pagina cercata non esiste.",
    corpo: R.pagina404(D),
    noindex: true
  });
}

/* ------------------------------------------------------- 5. dati a runtime */

/**
 * Il browser riceve le pagine già scritte: non gli serve rileggersi tutti i
 * contenuti una seconda volta. Qui estraiamo il minimo che serve davvero dopo
 * il caricamento — cambiare l'anteprima dei progetti e far funzionare il
 * modulo — e lo scriviamo in un file a parte.
 *
 * Senza questo passaggio ogni visitatore scaricherebbe due volte lo stesso
 * testo: una nell'HTML e una in data.js, con dentro anche i commenti e le
 * pagine per categoria che al browser non servono mai.
 */
function generaDatiRuntime(D) {
  const ridotto = {
    agenzia: {
      nome: D.agenzia.nome,
      telefono: D.agenzia.telefono,
      telefonoHref: D.agenzia.telefonoHref,
      whatsappHref: D.agenzia.whatsappHref,
      whatsappTesto: D.agenzia.whatsappTesto,
      email: D.agenzia.email
    },
    progetti: { elenco: D.progetti.elenco },
    form: D.form
  };

  scrivi("assets/js/dati.js",
    "/* ==========================================================================\n" +
    "   GENERATO DA build.js — NON MODIFICARE A MANO.\n" +
    "   Sorgente dei contenuti: assets/js/data.js\n" +
    "\n" +
    "   Contiene solo ciò che serve al browser DOPO il caricamento: l'anteprima\n" +
    "   dei progetti e il modulo di contatto. Tutto il resto del sito è già\n" +
    "   scritto nell'HTML e non va spedito una seconda volta.\n" +
    "   ========================================================================== */\n\n" +
    "window.FR_DATA = " + JSON.stringify(ridotto, null, 2) + ";\n");

  generati.push({ file: "assets/js/dati.js", sitemap: false });
}

/* ------------------------------------------------ 6. sitemap.xml e robots.txt */

/**
 * Le date di `lastmod` già presenti nella sitemap, per pagina.
 * Rileggerle è ciò che permette di non ridatare tutto a ogni build.
 */
function lastmodPrecedenti(D, R) {
  const mappa = {};
  let sitemap;
  try {
    sitemap = leggi("sitemap.xml");
  } catch (err) {
    return mappa;
  }

  const blocchi = sitemap.match(/<url>[\s\S]*?<\/url>/g) || [];
  blocchi.forEach((blocco) => {
    const loc = /<loc>([^<]+)<\/loc>/.exec(blocco);
    const data = /<lastmod>([^<]+)<\/lastmod>/.exec(blocco);
    if (!loc || !data) return;

    // Da indirizzo assoluto a nome di file, così un cambio di dominio
    // non fa perdere tutte le date.
    const file = loc[1].replace(/^https?:\/\/[^/]+\//, "") || "index.html";
    mappa[file] = data[1];
  });
  return mappa;
}

function generaSitemap(D, R) {
  const oggi = new Date().toISOString().slice(0, 10);
  const precedenti = lastmodPrecedenti(D, R);

  const url = generati
    .filter((g) => g.sitemap)
    .map((g) => {
      // Una pagina che non è cambiata tiene la sua data: rimetterci oggi
      // renderebbe il build diverso a ogni giorno che passa, e `lastmod`
      // direbbe a Google che il contenuto è nuovo quando non lo è.
      const lastmod = g.cambiato ? oggi : (precedenti[g.file] || oggi);
      return [
        "  <url>",
        "    <loc>" + R.esc(R.url(D, g.file)) + "</loc>",
        "    <lastmod>" + lastmod + "</lastmod>",
        "    <changefreq>monthly</changefreq>",
        "    <priority>" + g.priorita + "</priority>",
        "  </url>"
      ].join("\n");
    })
    .join("\n");

  scrivi("sitemap.xml",
    '<?xml version="1.0" encoding="UTF-8"?>\n' +
    "<!-- Generato da build.js: non modificare a mano. Il dominio arriva da data.js → sito.dominio -->\n" +
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    url + "\n</urlset>\n");

  scrivi("robots.txt",
    "# Generato da build.js: non modificare a mano.\n" +
    "User-agent: *\n" +
    "Allow: /\n\n" +
    "# Sorgenti delle immagini: pubblicati, ma non c'è motivo di indicizzarli\n" +
    "Disallow: /scripts/\n\n" +
    "Sitemap: " + R.url(D, "sitemap.xml") + "\n");
}

/** Il dominio personalizzato, che GitHub Pages legge da questo file. */
function generaCname(D) {
  const host = String(D.sito.dominio).replace(/^https?:\/\//, "").replace(/\/+$/, "");
  scrivi("CNAME", host + "\n");
}

/* ------------------------------------------------------------ 6. avvertenze */

/**
 * Un sito con i segnaposto ancora dentro non deve andare online per sbaglio:
 * meglio un avviso rumoroso a ogni build.
 */
function controllaSegnaposto(D) {
  const bloccanti = [];
  const daFare = [];

  // --- Cose che rompono qualcosa se restano così ---

  if (!D.form.accessKey || D.form.accessKey === "TUA_ACCESS_KEY_QUI") {
    bloccanti.push("Web3Forms access key mancante (form.accessKey) — il modulo non invia");
  }
  if (!fs.existsSync(path.join(RADICE, D.sito.ogImage))) {
    bloccanti.push("manca " + D.sito.ogImage + " — le condivisioni su WhatsApp restano senza immagine");
  }
  if (!/^https:\/\/[^/]+$/.test(D.sito.dominio)) {
    bloccanti.push("sito.dominio deve essere un indirizzo https senza barra finale");
  }
  if (D.chiSiamo.foto && !fs.existsSync(path.join(RADICE, D.chiSiamo.foto))) {
    bloccanti.push("chiSiamo.foto punta a un file che non esiste: " + D.chiSiamo.foto);
  }

  // --- Cose che il sito regge, ma che restano da completare ---
  // P.IVA, indirizzo e coordinate NON sono in elenco: possono legittimamente
  // restare vuoti, e il sito si adatta da solo.

  if (D.prezzi.pacchetti.every((p) => !p.prezzo)) {
    daFare.push("nessun prezzo in chiaro: \"quanto costa\" è la prima domanda di chi vi legge");
  }
  if (!D.chiSiamo.foto) {
    daFare.push("manca la foto di " + D.chiSiamo.nome + " (chiSiamo.foto): per ora si vedono le iniziali");
  }
  if (D.chiSiamo.testo.indexOf("Non c'è un centralino") === 0) {
    daFare.push("il testo di \"Chi ti risponde\" è ancora la bozza (chiSiamo.testo)");
  }
  if (D.progetti.disclaimer) {
    daFare.push("i progetti sono ancora mock-up dichiarati (progetti.disclaimer)");
  }
  if (D.privacy.nota) {
    daFare.push("l'informativa privacy non è stata verificata da un consulente (privacy.nota)");
  }
  if (/gmail\.com|libero\.it|hotmail/.test(D.agenzia.email)) {
    daFare.push("email su dominio altrui: il vostro dominio include le caselle di posta");
  }

  return { bloccanti: bloccanti, daFare: daFare };
}

/* ------------------------------------------------------------------ avvio */

function main() {
  const sorgenti = caricaSorgenti();
  const D = sorgenti.D;
  const R = sorgenti.R;

  generaTutto(D, R);
  generaDatiRuntime(D);
  generaSitemap(D, R);
  generaCname(D);

  console.log("Pagine generate:");
  generati.forEach((g) =>
    console.log("  · " + g.file + (g.cambiato === false ? "  (invariata)" : ""))
  );
  console.log("  · sitemap.xml\n  · robots.txt\n  · CNAME");

  const stato = controllaSegnaposto(D);

  if (stato.bloccanti.length) {
    console.log("\n⛔ Da sistemare PRIMA di pubblicare:");
    stato.bloccanti.forEach((p) => console.log("   - " + p));
  }
  if (stato.daFare.length) {
    console.log("\n○ Il sito funziona, ma resta da fare:");
    stato.daFare.forEach((p) => console.log("   - " + p));
  }
  if (!stato.bloccanti.length && !stato.daFare.length) {
    console.log("\n✓ Niente in sospeso.");
  }
}

main();
