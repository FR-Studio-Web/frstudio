# FR Studio — sito ufficiale

Sito statico dell'agenzia, pubblicabile direttamente su **GitHub Pages**.
Nessun framework, nessuna compilazione: i file che stanno nel repository sono
esattamente quelli che il browser scarica.

---

## Avvio rapido

```bash
npm install          # installa `motion` e copia la libreria in assets/vendor/
npm run dev          # apre un server locale su http://localhost:3000
```

Il sito funziona anche aprendo `index.html` con un doppio click: non usa `fetch`
né moduli ES, quindi non serve un server per provarlo.

---

## Struttura

```
index.html                 pagina unica: <head>, modulo di contatto, modale privacy
assets/
  css/site.css             design system completo (token, componenti, responsive)
  js/data.js               ⭐ TUTTI I CONTENUTI DEL SITO — è il file da modificare
  js/render.js             template: dati → markup (funzioni pure)
  js/app.js                montaggio, anteprima progetti, modulo, modale, animazioni
  vendor/motion.js         copia di node_modules/motion/dist/motion.js
  img/favicon.svg
robots.txt · sitemap.xml
```

---

## Aggiornare i contenuti

Quasi tutto vive in **`assets/js/data.js`**: testi, servizi, step del metodo,
progetti in anteprima, recapiti, messaggi del modulo. Modifica, salva, ricarica.

Restano scritti direttamente in `index.html` (cambiano di rado e devono essere
leggibili anche senza JavaScript):

- i meta tag SEO / Open Graph e i dati strutturati JSON-LD;
- il markup del modulo di contatto;
- il testo dell'informativa privacy dentro `<dialog id="privacy-modal">`.

### Prima di pubblicare

Cerca `⚠️ SOSTITUIRE` in tutto il progetto: marca ogni valore segnaposto.

| Dove | Cosa sostituire |
|---|---|
| `assets/js/data.js` | telefono, email, indirizzo, P.IVA, **Web3Forms access key** |
| `index.html` | `<link rel="canonical">`, URL Open Graph, JSON-LD, dati del titolare nella modale privacy |
| `robots.txt`, `sitemap.xml` | dominio definitivo |
| `assets/js/data.js` → `progetti.disclaimer` | rimuovilo quando i progetti saranno reali |

---

## Modulo di contatto (Web3Forms)

1. Vai su <https://web3forms.com>, inserisci l'email dove vuoi ricevere le richieste
   e ricevi la **access key** (è pubblica per progetto: è pensata per stare nel codice sorgente).
2. Incollala in `assets/js/data.js` → `form.accessKey`.
3. Prova un invio reale: la richiesta arriva sulla casella indicata.

Finché resta il segnaposto `TUA_ACCESS_KEY_QUI`, il modulo mostra un pannello di
errore con i recapiti diretti e stampa un avviso in console.

Come funziona:

- **senza JavaScript** → `POST` classico verso `https://api.web3forms.com/submit`
  con conferma sulla pagina di Web3Forms;
- **con JavaScript** → `app.js` intercetta l'invio, valida i campi, manda la
  richiesta in `fetch` e mostra la conferma direttamente in pagina.

Contro lo spam è attivo l'honeypot nativo di Web3Forms (campo `botcheck`).

---

## Animazioni

`motion` è installato via npm e copiato in `assets/vendor/motion.js` dallo script
`npm run sync:motion` (eseguito automaticamente dopo `npm install`). Serve il
bundle UMD `dist/motion.js` perché espone `window.Motion` senza bisogno di un bundler.

Dopo un aggiornamento della dipendenza:

```bash
npm update motion && npm run sync:motion
```

Le animazioni rispettano `prefers-reduced-motion` e, se la libreria non viene
caricata, la pagina resta completamente visibile e utilizzabile.

---

## Pubblicazione su GitHub Pages

```bash
git init
git add .
git commit -m "Sito FR Studio"
git branch -M main
git remote add origin https://github.com/<utente>/<repo>.git
git push -u origin main
```

Poi su GitHub: **Settings → Pages → Build and deployment → Deploy from a branch →
`main` / `/ (root)`**.

`index.html` sta nella radice, quindi il sito è online in un paio di minuti.
`node_modules/` è escluso dal repository, mentre `assets/vendor/motion.js` **va
committato**: GitHub Pages pubblica i file così come sono, senza eseguire npm.

Con un dominio personalizzato: aggiungi un file `CNAME` con il dominio e aggiorna
canonical, Open Graph, `robots.txt` e `sitemap.xml`.

---

## Verifica

- [ ] Nessun errore in console (atteso solo l'avviso sulla access key, finché non la imposti)
- [ ] Le card dei progetti cambiano l'anteprima su tablet, anche con `Tab` + `Invio`
- [ ] La modale privacy si apre dal footer e dal modulo, si chiude con `Esc`, con il pulsante e cliccando fuori
- [ ] Il modulo mostra gli errori sotto i campi e sposta il focus sul primo campo sbagliato
- [ ] Layout corretto a 375 px, 768 px e 1280 px
- [ ] Con `prefers-reduced-motion: reduce` tutto è visibile e nulla si anima
