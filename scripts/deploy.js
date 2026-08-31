#!/usr/bin/env node
"use strict";

const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const RADICE = path.resolve(__dirname, "..");
const DEST = path.join(RADICE, "fr-studio", "public");

console.log("1. Generazione del sito...");
execSync("node build.js", { cwd: RADICE, stdio: "inherit" });

console.log("\n2. Sincronizzazione file in fr-studio/public...");
if (fs.existsSync(DEST)) {
  fs.rmSync(DEST, { recursive: true, force: true });
}
fs.mkdirSync(DEST, { recursive: true });

// Copia file HTML generati
fs.readdirSync(RADICE).forEach((file) => {
  if (file.endsWith(".html") && !file.includes(".template.")) {
    fs.copyFileSync(path.join(RADICE, file), path.join(DEST, file));
  }
});

// Copia file speciali come _headers, sitemap e robots
["_headers", "sitemap.xml", "robots.txt"].forEach((f) => {
  if (fs.existsSync(path.join(RADICE, f))) {
    fs.copyFileSync(path.join(RADICE, f), path.join(DEST, f));
  }
});

// Copia cartella assets
fs.cpSync(path.join(RADICE, "assets"), path.join(DEST, "assets"), {
  recursive: true,
});

console.log("✓ File copiati con successo.");

console.log("\n3. Deploy su Cloudflare...");
execSync("npx wrangler deploy", {
  cwd: path.join(RADICE, "fr-studio"),
  stdio: "inherit",
});
