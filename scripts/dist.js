#!/usr/bin/env node
/* ============================================================================
   FR STUDIO — CARTELLA DA PUBBLICARE SU CLOUDFLARE (dist/)
   ----------------------------------------------------------------------------
       npm run dist          (da solo)
       npm run build:cf      (build.js + questo: è ciò che lancia Cloudflare)

   GitHub Pages pubblica la radice del repository così com'è. Cloudflare invece
   serve una cartella sola, e in radice ci sono anche i sorgenti: data.js,
   i template, build.js, .env.example. Qui dentro copiamo SOLO ciò che il
   browser scarica davvero.

   La regola è per elenco di ciò che ENTRA, non di ciò che resta fuori: un file
   nuovo in radice non finisce online per sbaglio. In compenso, se una pagina
   inizia a puntare a un file che non abbiamo copiato, il controllo in fondo
   se ne accorge e ferma il build invece di pubblicare un sito con i pezzi
   mancanti.

   dist/ NON va committata: la rigenera Cloudflare a ogni push (è in .gitignore).
   ========================================================================== */

"use strict";

const fs = require("fs");
const path = require("path");

const RADICE = path.join(__dirname, "..");
const USCITA = path.join(RADICE, "dist");

/* ------------------------------------------------------------ cosa entra */

// Le pagine le generiamo con build.js: prendiamo tutti gli .html di radice
// tranne i template, così una pagina nuova arriva qui senza toccare l'elenco.
const paginaGenerata = (f) => f.endsWith(".html") && !f.endsWith(".template.html");

const FILE_RADICE = ["robots.txt", "sitemap.xml"];

// Dentro assets/ copiamo solo estensioni che un browser sa caricare...
const ESTENSIONI = [".css", ".js", ".woff2", ".png", ".svg", ".jpg", ".jpeg", ".webp", ".avif", ".ico"];

// ...meno i sorgenti che vivono lì per comodità ma non servono online.
// data.js è il contenuto in chiaro: build.js lo trasforma in dati.js, ed è
// quest'ultimo che le pagine caricano.
const SORGENTI = ["assets/js/data.js"];

// Serve solo finché il sito di prova sta su workers.dev: tiene la copia fuori
// dai motori di ricerca, così non compete con il dominio vero.
const HEADERS = "/*\n  X-Robots-Tag: noindex, nofollow\n";

/* ------------------------------------------------------------------ copia */

const copiati = [];

function copia(relativo) {
  const da = path.join(RADICE, relativo);
  const a = path.join(USCITA, relativo);
  fs.mkdirSync(path.dirname(a), { recursive: true });
  fs.copyFileSync(da, a);
  copiati.push(relativo);
}

function percorriAssets(relativo) {
  for (const voce of fs.readdirSync(path.join(RADICE, relativo), { withFileTypes: true })) {
    const figlio = relativo + "/" + voce.name;
    if (voce.isDirectory()) {
      percorriAssets(figlio);
    } else if (ESTENSIONI.indexOf(path.extname(voce.name).toLowerCase()) !== -1
               && SORGENTI.indexOf(figlio) === -1) {
      copia(figlio);
    }
  }
}

fs.rmSync(USCITA, { recursive: true, force: true });
fs.mkdirSync(USCITA, { recursive: true });

fs.readdirSync(RADICE).filter(paginaGenerata).forEach(copia);
FILE_RADICE.filter((f) => fs.existsSync(path.join(RADICE, f))).forEach(copia);
percorriAssets("assets");

fs.writeFileSync(path.join(USCITA, "_headers"), HEADERS);
copiati.push("_headers");

/* -------------------------------------------------- controlli prima di uscire */

const problemi = [];

// 1. Ogni href/src delle pagine deve esistere dentro dist: se copiamo troppo
//    poco il sito esce monco, e vogliamo saperlo adesso, non dal browser.
const RIFERIMENTO = /(?:href|src)="([^"#:]+)"/g;

for (const pagina of copiati.filter(paginaGenerata)) {
  const html = fs.readFileSync(path.join(USCITA, pagina), "utf8");
  let m;
  while ((m = RIFERIMENTO.exec(html)) !== null) {
    const rif = m[1].replace(/^\.\//, "").split("?")[0];
    if (!rif || rif.charAt(0) === "/" || rif.indexOf("//") !== -1) continue;
    if (!fs.existsSync(path.join(USCITA, rif))) {
      problemi.push(pagina + " punta a " + rif + ", che in dist non c'è");
    }
  }
}

// 2. Niente sorgenti o segreti: l'elenco di ciò che entra dovrebbe già bastare,
//    ma un secondo controllo costa nulla e qui si sbaglia una volta sola.
const VIETATI = [
  /^\.env/, /^package(-lock)?\.json$/, /^bun\.lock$/, /\.template\.html$/,
  /^build\.js$/, /^server\.js$/, /^generate-logos\.js$/, /^scripts\//,
  /^README/i, /^\.git/, /^metadata\.json$/, /^assets\/js\/data\.js$/,
];

for (const f of copiati) {
  if (VIETATI.some((r) => r.test(f))) problemi.push("file non pubblico finito in dist: " + f);
}

/* ------------------------------------------------------------------ esito */

const peso = copiati.reduce((t, f) => t + fs.statSync(path.join(USCITA, f)).size, 0);

console.log("\ndist/ pronta — " + copiati.length + " file, " + Math.round(peso / 1024) + " KB");
for (const f of copiati.slice().sort()) console.log("  · " + f);

if (problemi.length) {
  console.error("\n✗ " + problemi.length + " problemi:");
  for (const p of problemi) console.error("  - " + p);
  process.exit(1);
}

console.log("\n✓ Tutti i riferimenti delle pagine risolvono, nessun sorgente copiato.");
