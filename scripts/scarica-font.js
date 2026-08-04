#!/usr/bin/env node
/* ============================================================================
   FR STUDIO — SCARICA I CARATTERI IN LOCALE
   ----------------------------------------------------------------------------
       node scripts/scarica-font.js        (oppure: npm run fonts)

   Prende da Google Fonts il solo sottoinsieme `latin` in formato variabile e
   lo salva in assets/fonts/. Da quel momento il sito non fa più nessuna
   richiesta a Google: pagina più veloce (due connessioni esterne in meno prima
   di poter disegnare il testo) e nessun indirizzo IP dei visitatori che finisce
   a un fornitore terzo.

   Va rilanciato solo per aggiornare i caratteri: i .woff2 vanno committati.
   ========================================================================== */

"use strict";

const fs = require("fs");
const path = require("path");

// Serve un User-Agent moderno: a un client sconosciuto Google risponde con i
// vecchi formati (ttf/eot) invece dei woff2 variabili, molto più pesanti.
const UA =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 " +
  "(KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36";

const CARATTERI = [
  {
    file: "archivo-latin.woff2",
    query: "family=Archivo:wght@400..700",
    famiglia: "Archivo"
  },
  {
    // Volutamente senza l'asse `opsz` (dimensione ottica): tenerlo porterebbe il
    // file da 50 a 119 KB, per una differenza di disegno che alle dimensioni di
    // testo usate qui non si distingue. L'asse `wght` resta variabile.
    file: "source-serif-4-latin.woff2",
    query: "family=Source+Serif+4:wght@400..600",
    famiglia: "Source Serif 4"
  }
];

const CARTELLA = path.join(__dirname, "..", "assets", "fonts");

/** Estrae dal CSS di Google il blocco del sottoinsieme `latin`. */
function bloccoLatin(css) {
  // I blocchi sono preceduti dal commento con il nome del sottoinsieme.
  const parti = css.split("/*");
  const latin = parti.find((p) => p.trim().indexOf("latin */") === 0);
  if (!latin) return null;

  const url = /src:\s*url\((https:\/\/[^)]+\.woff2)\)/.exec(latin);
  const peso = /font-weight:\s*([^;]+);/.exec(latin);
  const range = /unicode-range:\s*([^;]+);/.exec(latin);
  if (!url) return null;

  return {
    url: url[1],
    peso: peso ? peso[1].trim() : "400",
    range: range ? range[1].trim() : ""
  };
}

async function scarica(carattere) {
  const cssUrl = "https://fonts.googleapis.com/css2?" + carattere.query + "&display=swap";
  const risposta = await fetch(cssUrl, { headers: { "User-Agent": UA } });
  if (!risposta.ok) throw new Error(cssUrl + " → HTTP " + risposta.status);

  const blocco = bloccoLatin(await risposta.text());
  if (!blocco) throw new Error("sottoinsieme `latin` non trovato per " + carattere.famiglia);

  const font = await fetch(blocco.url, { headers: { "User-Agent": UA } });
  if (!font.ok) throw new Error(blocco.url + " → HTTP " + font.status);

  const dati = Buffer.from(await font.arrayBuffer());
  fs.writeFileSync(path.join(CARTELLA, carattere.file), dati);

  return { file: carattere.file, byte: dati.length, peso: blocco.peso, range: blocco.range };
}

async function main() {
  fs.mkdirSync(CARTELLA, { recursive: true });

  const esiti = [];
  for (const carattere of CARATTERI) {
    const esito = await scarica(carattere);
    esiti.push(esito);
    console.log(
      "  ✓ " + esito.file +
      "  (" + Math.round(esito.byte / 1024) + " KB, pesi " + esito.peso + ")"
    );
  }

  console.log("\nCaratteri salvati in assets/fonts/ — vanno committati.");
  console.log("Le regole @font-face corrispondenti stanno in assets/css/site.css.");
  console.log("\nSottoinsiemi unicode scaricati (per riferimento):");
  esiti.forEach((e) => console.log("  " + e.file + "\n    " + e.range));
}

main().catch((err) => {
  console.error("\n✗ Download non riuscito: " + err.message);
  console.error("  Il sito continua a funzionare, ma con i caratteri di sistema.");
  process.exit(1);
});
