# FR Studio — sito ufficiale

Sito statico dell'agenzia, pubblicabile su **GitHub Pages**.
Nessun framework e nessuna dipendenza: l'unico strumento è uno script Node di
un centinaio di righe che scrive i contenuti dentro l'HTML.

---

## Avvio rapido

```bash
npm run dev       # genera le pagine e apre http://localhost:3000
npm run build     # solo la generazione
npm test          # genera e controlla che non si sia rotto niente
```

Non serve `npm install`: il progetto non ha dipendenze.

---

## Come funziona

I contenuti stanno in **un solo file**, `assets/js/data.js`. Da lì `build.js`
li scrive dentro le pagine HTML, che il browser riceve già complete.

```
assets/js/data.js  ──▶  build.js  ──▶  index.html, privacy.html, …
       (scrivi qui)                     (generati: non modificarli)
```

Questo è il motivo per cui esiste il passaggio di build: prima le sezioni erano
costruite dal browser, quindi nel sorgente non c'erano né l'H1 né una riga di
testo. Google, l'anteprima di WhatsApp e chiunque non esegua JavaScript
vedevano una pagina vuota.

### Struttura

```
data.js                    ⭐ TUTTI I CONTENUTI — è il file da modificare
build.js                   genera le pagine da data.js + render.js
index.template.html        sorgente della home
pagina.template.html       sorgente di privacy, grazie, 404, pagine categoria

assets/
  css/site.css             design system (token, componenti, responsive)
  js/render.js             template: dati → markup (funzioni pure)
  js/app.js                schede progetto, modulo, modale, animazioni
  js/dati.js               ⚙ generato: il minimo che serve al browser
  fonts/*.woff2            caratteri ospitati qui (npm run fonts)
  img/og.png               anteprima per WhatsApp e social (scripts/og.html)

scripts/
  scarica-font.js          aggiorna i caratteri da Google Fonts
  verifica.js              i controlli di `npm test`
  og.html, icona.html      sorgenti delle immagini
```

### File generati — non modificarli a mano

`index.html` · `privacy.html` · `grazie.html` · `404.html` ·
`siti-web-*.html` · `assets/js/dati.js` · `sitemap.xml` · `robots.txt` · `CNAME`

Vanno però **committati**: GitHub Pages pubblica i file così come sono.

Se modifichi `data.js` e dimentichi `npm run build`, online resta la versione
vecchia senza che nessuno se ne accorga. Per questo `.github/workflows/verifica.yml`
rigenera tutto a ogni push e fallisce se il risultato è diverso da quello che hai
committato. Il build è ripetibile: rilanciandolo senza aver cambiato niente, non
tocca nessun file (anche le date della sitemap restano quelle delle ultime
modifiche vere).

---

## Aggiornare i contenuti

1. apri `assets/js/data.js`
2. modifica il testo
3. `npm run build` (oppure lascia girare `npm run dev`)

Restano scritti a mano solo il markup del modulo di contatto e la struttura
delle pagine, dentro i due `*.template.html`.

### Cosa resta da completare

`npm run build` lo elenca da solo a ogni esecuzione, diviso in due:
quello che **rompe qualcosa** e quello che si può fare con calma.

| In `data.js` | Cosa |
|---|---|
| `prezzi.pacchetti` | **il listino** — finché `prezzo` è vuoto compare "Su preventivo" |
| `chiSiamo.foto` | una foto vera in `assets/img/`, quadrata, minimo 400×400 |
| `chiSiamo.testo` | è ancora la bozza: riscrivila con parole vostre |
| `progetti` | i tre mock-up, e il `disclaimer` che va tolto quando saranno reali |
| `privacy.nota` | va rimossa dopo che un consulente ha letto l'informativa |
| `agenzia.email` | il dominio include le caselle: `info@frstudioweb.it` |

**Campi che possono restare vuoti.** `agenzia.piva`, `agenzia.indirizzo.via` e
`agenzia.geo` non sono obbligatori: senza di loro il sito omette la riga invece
di stampare un'etichetta a metà, e i dati strutturati non dichiarano a Google un
indirizzo vuoto. All'apertura della partita IVA basta compilarli e rilanciare il
build — footer, dati strutturati e informativa privacy si aggiornano da soli,
perché il titolare del trattamento è composto con i segnaposto `{titolare}`.

Fuori dal codice, ma più importante di tutto il resto messo insieme:
**aprire e curare il profilo Google Business.** Per un'attività di paese vale
più di qualunque meta tag, e si può aprire come attività di servizio anche
senza un indirizzo aperto al pubblico.

---

## Modulo di contatto (Web3Forms)

La chiave sta in `data.js` → `form.accessKey`; `build.js` la scrive nell'HTML.
La si ottiene gratis su <https://web3forms.com> ed è pubblica per progetto:
è pensata per stare nel codice sorgente.

- **senza JavaScript** → `POST` classico verso Web3Forms, con atterraggio su
  `grazie.html` (una pagina nostra, non di terzi);
- **con JavaScript** → `app.js` valida i campi e mostra la conferma in pagina.

Contro lo spam c'è l'honeypot nativo di Web3Forms (campo `botcheck`).

---

## Caratteri

Archivo e Source Serif 4 sono ospitati insieme al sito, in `assets/fonts/`.
Servono due connessioni esterne in meno prima di poter disegnare il testo, e
nessun indirizzo IP dei visitatori esce da qui — cosa che permette di dire nella
privacy, senza mentire, che il sito non manda dati a terzi.

```bash
npm run fonts     # riscarica i .woff2 da Google Fonts
```

Sono file variabili con il solo sottoinsieme `latin`: 84 KB in tutto.
Di Source Serif 4 non scarichiamo l'asse `opsz`, che da solo pesava 69 KB per
una differenza di disegno invisibile a queste dimensioni.

### Perché il foglio di stile resta bloccante

È stato provato a metterlo in differita, con il CSS della prima schermata in
linea nel `<head>`. Misurato su rete lenta: il primo disegno arrivava 300 ms
prima, ma con i caratteri di sistema, e all'arrivo dei woff2 la pagina si
riassestava — **0,25 di CLS contro 0,00** (la soglia "scarso" è proprio 0,25).
Con `font-display: optional` lo scatto spariva, ma a costo di mostrare i
caratteri di sistema proprio alla prima visita.

Su una pagina fatta solo di testo, comparire un attimo dopo e stare ferma è
meglio che comparire subito e saltare. Se un giorno si aggiungono immagini
grandi sopra la piega, vale la pena rifare la misura.

---

## Animazioni

Niente librerie: le transizioni sono in CSS e `app.js` si limita ad accenderle
con un `IntersectionObserver`. Il filetto di avanzamento usa
`animation-timeline: scroll()` dove è supportato, altrimenti un listener leggero.

Tutto rispetta `prefers-reduced-motion`, e se JavaScript non parte la pagina
resta completamente visibile.

---

## Misurare i risultati (facoltativo)

Il sito non ha analitiche: senza, non si può sapere se porta clienti.
`app.js` chiama `window.frTraccia(evento)` — se non esiste, non succede nulla —
per tre eventi: `chiamata`, `whatsapp`, `modulo-inviato`.

Per collegare un'analitica **senza cookie** (quindi senza banner), aggiungi nel
`<head>` dei template il suo script e definisci la funzione. Con GoatCounter:

```html
<script data-goatcounter="https://TUOACCOUNT.goatcounter.com/count"
        async src="//gc.zgo.at/count.js"></script>
<script>
  window.frTraccia = function (evento) {
    if (window.goatcounter) window.goatcounter.count({ path: evento, event: true });
  };
</script>
```

---

## Pubblicazione su GitHub Pages

```bash
npm test                      # genera le pagine e le controlla
git add .
git commit -m "Sito FR Studio"
git push
```

Poi su GitHub: **Settings → Pages → Deploy from a branch → `main` / `/ (root)`**.

### Dominio

Il dominio si imposta in **un posto solo**: `data.js` → `sito.dominio`.
Da lì il build ricava canonical, Open Graph, sitemap, robots e il file `CNAME`
che GitHub Pages legge per servire il dominio personalizzato.

Dal pannello Aruba vanno puntati i DNS a GitHub Pages:

```
A     @      185.199.108.153
A     @      185.199.109.153
A     @      185.199.110.153
A     @      185.199.111.153
CNAME www    ppfantuzzi.github.io.
```

Poi in **Settings → Pages** inserire il dominio e attendere il certificato:
quando è pronto compare la casella **Enforce HTTPS**, da spuntare.
Da quel momento `ppfantuzzi.github.io/frstudio/` reindirizza da solo sul
dominio, e l'indirizzo canonico è `www.frstudioweb.it`.

---

## Verifica

`npm test` controlla da solo oltre 250 cose: pagine generate, contenuti presenti
nel sorgente, link interni, coerenza della sitemap, assenza di richieste a
Google, peso della pagina, misure dell'immagine di anteprima, dati strutturati
sulle pagine per categoria, e che i dati identificativi nell'informativa privacy
coincidano con quelli di `agenzia` — inclusa la verifica che non resti scritto
"P.IVA" seguito dal nulla finché la partita IVA non c'è.

Restano i controlli da fare a occhio:

- [ ] Invio reale del modulo: la richiesta arriva nella casella collegata
- [ ] Il link incollato su WhatsApp mostra l'immagine di anteprima
- [ ] Da telefono: la barra in basso chiama e apre WhatsApp
- [ ] Layout a 375, 768 e 1280 px
- [ ] Solo tastiera: skip link → menu → schede progetto (frecce) → modulo →
      modale privacy (ESC chiude e riporta il focus dov'era)
- [ ] Con `prefers-reduced-motion: reduce` non si muove nulla
- [ ] Con JavaScript disattivato si vede tutto e il modulo invia lo stesso
