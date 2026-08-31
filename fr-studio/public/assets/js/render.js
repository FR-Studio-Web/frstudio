/* ============================================================================
   FR STUDIO — TEMPLATE
   ----------------------------------------------------------------------------
   Funzioni pure: ricevono i dati di data.js e restituiscono markup.
   Nessun effetto collaterale, nessun ascolto di eventi (quelli stanno in app.js).

   Le stesse funzioni girano in due posti:
   - in Node dentro build.js, per scrivere l'HTML nelle pagine (pre-rendering);
   - nel browser dentro app.js, solo se un contenitore è rimasto vuoto.
   Per questo non toccano mai `document`.
   ========================================================================== */

window.FR_RENDER = (function () {
  "use strict";

  /** Neutralizza i caratteri speciali prima di inserire testo nel markup. */
  function esc(value) {
    return String(value == null ? "" : value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  /** Sostituisce i segnaposto {chiave} in una stringa di testo. */
  function fill(template, values) {
    return String(template).replace(/\{(\w+)\}/g, function (match, key) {
      return Object.prototype.hasOwnProperty.call(values, key) ? values[key] : match;
    });
  }

  /**
   * Testo con mini-formattazione, usato dove serve un minimo di enfasi
   * (informativa privacy). Prima si neutralizza TUTTO, poi si riabilitano
   * soltanto **grassetto** e una manciata di segnaposto: così nessun carattere
   * scritto in data.js può produrre markup involontario.
   *
   * I segnaposto dei dati identificativi esistono perché l'informativa è un
   * documento legale: riscrivere lì dentro indirizzo e P.IVA significherebbe
   * doverli aggiornare in due posti, e prima o poi dimenticarsene in uno.
   */
  function testoRicco(testo, d) {
    return esc(testo)
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/\{emailPrivacy\}/g, mailto(d.agenzia.emailPrivacy))
      .replace(/\{email\}/g, mailto(d.agenzia.email))
      .replace(/\{titolare\}/g, esc(titolareTesto(d)))
      .replace(/\{indirizzo\}/g, esc(indirizzoTesto(d)))
      .replace(/\{piva\}/g, esc(d.agenzia.piva))
      .replace(/\{nome\}/g, esc(d.agenzia.nome));
  }

  function mailto(indirizzo) {
    return '<a href="mailto:' + esc(indirizzo) + '">' + esc(indirizzo) + "</a>";
  }

  /**
   * Indirizzo in una riga, saltando i pezzi che mancano.
   * Senza sede pubblica resta il solo comune, che è comunque un'informazione
   * utile: dice a chi legge dove siete.
   */
  function indirizzoTesto(d) {
    const i = d.agenzia.indirizzo;
    const parti = [];
    if (i.via) parti.push(i.via);

    const comune = [i.cap, i.citta].filter(Boolean).join(" ");
    if (comune) parti.push(comune + (i.provincia ? " (" + i.provincia + ")" : ""));

    return parti.join(" — ");
  }

  /** Riga identificativa completa per l'informativa privacy. */
  function titolareTesto(d) {
    const a = d.agenzia;
    const parti = [a.nome];
    // Senza partita IVA il titolare del trattamento sono le persone fisiche:
    // i nomi non sono un vezzo, sono ciò che rende identificabile il titolare.
    if (a.fondatori) parti.push("di " + a.fondatori);

    const indirizzo = indirizzoTesto(d);
    if (indirizzo) parti.push(indirizzo);
    if (a.piva) parti.push("P.IVA " + a.piva);

    return parti.join(", ");
  }

  /** Indirizzo wa.me con il messaggio già scritto. Vuoto se manca il numero. */
  function whatsappUrl(d) {
    const numero = String(d.agenzia.whatsappHref || "").replace(/[^0-9]/g, "");
    if (!numero) return "";
    const testo = d.agenzia.whatsappTesto
      ? "?text=" + encodeURIComponent(d.agenzia.whatsappTesto)
      : "";
    return "https://wa.me/" + numero + testo;
  }

  /** Indirizzo assoluto, per canonical e Open Graph. */
  function url(d, percorso) {
    const base = String(d.sito.dominio || "").replace(/\/+$/, "");
    if (!percorso || percorso === "index.html") return base + "/";
    return base + "/" + String(percorso).replace(/^\/+/, "");
  }

  /* ------------------------------------------------------------------ header */

  function header(d) {
    const navLinks = d.nav
      .map((v) => `<a class="nav__link" href="${esc(v.href)}">${esc(v.label)}</a>`)
      .join("");

    return `
      <a class="logo" href="#top" aria-label="${esc(d.agenzia.nome)} — torna in cima">
        <span class="logo__nome">${esc(d.agenzia.nome)}</span>
        <span class="logo__kicker">${esc(d.agenzia.kicker)}</span>
      </a>
      <nav class="nav" aria-label="Navigazione principale">${navLinks}</nav>
      <a class="btn btn--primario btn--compatto header__cta" href="${esc(d.ctaHeader.href)}">${esc(d.ctaHeader.label)}</a>`;
  }

  /** Header delle pagine secondarie: i link puntano alla home. */
  function headerPagina(d) {
    const navLinks = d.nav
      .map((v) => `<a class="nav__link" href="index.html${esc(v.href)}">${esc(v.label)}</a>`)
      .join("");

    return `
      <a class="logo" href="index.html" aria-label="${esc(d.agenzia.nome)} — vai alla home">
        <span class="logo__nome">${esc(d.agenzia.nome)}</span>
        <span class="logo__kicker">${esc(d.agenzia.kicker)}</span>
      </a>
      <nav class="nav" aria-label="Navigazione principale">${navLinks}</nav>
      <a class="btn btn--primario btn--compatto header__cta" href="index.html${esc(d.ctaHeader.href)}">${esc(d.ctaHeader.label)}</a>`;
  }

  /* ------------------------------------------------------------ barra mobile */

  /**
   * Barra fissa in fondo allo schermo sui telefoni: chiamare e scrivere su
   * WhatsApp sono i due gesti che portano clienti, e devono stare a portata
   * di pollice in qualsiasi punto della pagina.
   */
  function barraMobile(d, hrefModulo) {
    const b = d.barraMobile;
    const wa = whatsappUrl(d);
    const modulo = hrefModulo || "#contatti";

    const bottoneWhatsapp = wa
      ? `<a class="barra-mobile__voce" href="${esc(wa)}" target="_blank" rel="noopener">
           ${iconaWhatsapp()}<span>${esc(b.whatsapp)}</span>
         </a>`
      : "";

    return `
      <a class="barra-mobile__voce" href="tel:${esc(d.agenzia.telefonoHref)}">
        ${iconaTelefono()}<span>${esc(b.chiama)}</span>
      </a>
      ${bottoneWhatsapp}
      <a class="barra-mobile__voce barra-mobile__voce--forte" href="${esc(modulo)}">
        ${iconaModulo()}<span>${esc(b.modulo)}</span>
      </a>`;
  }

  /* Icone inline: nessuna richiesta in più, nessuna libreria. */

  function iconaTelefono() {
    return `<svg class="barra-mobile__icona" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.2.4 2.4.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1A17 17 0 0 1 3 4c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.4 0 .8-.2 1z"/>
    </svg>`;
  }

  function iconaWhatsapp() {
    return `<svg class="barra-mobile__icona" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M12 2a10 10 0 0 0-8.6 15L2 22l5.2-1.4A10 10 0 1 0 12 2zm0 18.2c-1.6 0-3.1-.4-4.4-1.2l-.3-.2-3.1.8.8-3-.2-.3A8.2 8.2 0 1 1 12 20.2zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.4-3c-.2-.3.1-.5.2-.7l.4-.5c.1-.2.1-.3 0-.5l-.7-1.7c-.2-.4-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.8.8-1 1.8-.7 2.9.4 1.4 1.3 2.7 2.5 3.8 1.5 1.4 3 2 4.5 2.1 1 .1 1.9-.2 2.5-.9.2-.3.3-.6.3-.9v-.5c0-.2-.1-.3-.2-.4z"/>
    </svg>`;
  }

  function iconaModulo() {
    return `<svg class="barra-mobile__icona" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M4 4h16c.6 0 1 .4 1 1v14c0 .6-.4 1-1 1H4c-.6 0-1-.4-1-1V5c0-.6.4-1 1-1zm1 3.2V18h14V7.2l-7 4.4-7-4.4zM18.7 6H5.3l6.7 4.2L18.7 6z"/>
    </svg>`;
  }

  /* -------------------------------------------------------------------- hero */

  function hero(d) {
    const h = d.hero;

    const cta = h.cta
      .map(
        (c) =>
          `<a class="btn btn--${c.variante === "primario" ? "primario" : "secondario"}" href="${esc(c.href)}">${esc(c.label)}</a>`
      )
      .join("");

    const badge = h.badge
      .map(
        (b) => `<li class="badge">
            <span class="badge__titolo">${esc(b.titolo)}</span>
            <span class="badge__nota">${esc(b.nota)}</span>
          </li>`
      )
      .join("");

    const righe = h.breve.righe
      .map(
        (r) => `<div class="lista-dati__riga">
            <dt class="lista-dati__voce">${esc(r.voce)}</dt>
            <dd class="lista-dati__valore">${esc(r.valore)}</dd>
          </div>`
      )
      .join("");

    // Nota: niente `data-anim` qui dentro. La hero è il primo blocco che il
    // browser disegna e contiene l'H1 che misura il LCP: nasconderla in attesa
    // del JavaScript rallenterebbe il caricamento percepito.
    return `
      <div class="hero__testo">
        <p class="occhiello occhiello--filetto"><span class="occhiello__filetto" aria-hidden="true"></span>${esc(h.occhiello)}</p>
        <h1 class="hero__titolo">${esc(h.titolo)}</h1>
        <p class="hero__sottotitolo">${esc(h.sottotitolo)}</p>
        <div class="hero__azioni">${cta}</div>
        <ul class="badge-lista">${badge}</ul>
      </div>
      <aside class="hero__scheda" aria-label="${esc(h.breve.titolo)}">
        <p class="occhiello occhiello--muto">${esc(h.breve.titolo)}</p>
        <dl class="lista-dati">${righe}</dl>
        <p class="hero__scheda-nota">${esc(h.breve.nota)}</p>
      </aside>`;
  }

  /* ----------------------------------------------------- intestazione blocco */

  function intestazione(titolo, sommario, id) {
    return `
      <div class="sezione__testa">
        <h2 class="sezione__titolo" id="${esc(id)}">${esc(titolo)}</h2>
        <p class="sezione__sommario">${esc(sommario)}</p>
      </div>`;
  }

  /* ------------------------------------------------------------------ metodo */

  function metodo(d) {
    const card = d.metodo.step
      .map(
        (s) => `<article class="card" data-anim>
            <p class="card__num">${esc(s.num)}</p>
            <h3 class="card__titolo">${esc(s.titolo)}</h3>
            <p class="card__testo">${esc(s.testo)}</p>
            <p class="card__meta">${esc(s.meta)}</p>
          </article>`
      )
      .join("");

    return intestazione(d.metodo.titolo, d.metodo.sommario, "metodo-titolo") +
      `<div class="griglia-filetto">${card}</div>`;
  }

  /* ----------------------------------------------------------------- servizi */

  function servizi(d) {
    const card = d.servizi.voci
      .map(
        (s) => `<article class="card" data-anim>
            <p class="card__num">${esc(s.num)}</p>
            <h3 class="card__titolo">${esc(s.titolo)}</h3>
            <p class="card__testo">${esc(s.testo)}</p>
            <ul class="card__punti">
              ${s.punti.map((p) => `<li>${esc(p)}</li>`).join("")}
            </ul>
            <p class="card__meta">${esc(s.meta)}</p>
          </article>`
      )
      .join("");

    return intestazione(d.servizi.titolo, d.servizi.sommario, "servizi-titolo") +
      `<div class="griglia-filetto">${card}</div>`;
  }

  /* ------------------------------------------------------------------ prezzi */

  function prezzi(d) {
    const p = d.prezzi;

    // Senza cifra il riquadro grande sparisce e resta la sola nota: meglio di
    // un "Preventivo" scritto in caratteri da titolo, che promette un numero e
    // non lo dà. Appena `prezzo` viene compilato in data.js, torna da solo.
    const riquadroPrezzo = (v) =>
      v.prezzo
        ? `<p class="prezzo">
            <span class="prezzo__cifra">${esc(v.prezzo)}</span>
            <span class="prezzo__nota">${esc(v.prezzoNota)}</span>
            ${v.ricorrente ? `<span class="prezzo__ricorrente">${esc(v.ricorrente)}</span>` : ""}
          </p>`
        : `<p class="prezzo prezzo--attesa">${esc(v.prezzoNota)}</p>`;

    const card = p.pacchetti
      .map(
        (v) => `<article class="card card--prezzo${v.evidenza ? " card--evidenza" : ""}" data-anim>
            <p class="card__num">${esc(v.num)}</p>
            <h3 class="card__titolo">${esc(v.nome)}</h3>
            ${riquadroPrezzo(v)}
            <p class="card__testo">${esc(v.per)}</p>
            <ul class="card__punti">
              ${v.punti.map((x) => `<li>${esc(x)}</li>`).join("")}
            </ul>
            <p class="card__meta">${esc(v.meta)}</p>
          </article>`
      )
      .join("");

    return intestazione(p.titolo, p.sommario, "prezzi-titolo") + `
      <div class="griglia-filetto">${card}</div>
      <div class="prezzi__piede" data-anim>
        <p class="prezzi__nota">${esc(p.nota)}</p>
        <a class="btn btn--primario" href="${esc(p.cta.href)}">${esc(p.cta.label)}</a>
      </div>`;
  }

  /* --------------------------------------------------------------- chi siamo */

  function chiSiamo(d) {
    const c = d.chiSiamo;
    const iniziali = String(c.nome || "")
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((w) => w.charAt(0).toUpperCase())
      .join("");

    // Senza foto mostriamo le iniziali: meglio di un riquadro vuoto, e non
    // costringe a pubblicare un segnaposto finto.
    const ritratto = c.foto
      ? `<img class="chi-siamo__foto" src="${esc(c.foto)}" alt="${esc(c.fotoAlt)}" width="220" height="220" loading="lazy" decoding="async">`
      : `<span class="chi-siamo__iniziali" aria-hidden="true">${esc(iniziali)}</span>`;

    const wa = whatsappUrl(d);

    return `
      <div class="chi-siamo" data-anim>
        <div class="chi-siamo__ritratto">${ritratto}</div>
        <div class="chi-siamo__testo">
          <p class="occhiello occhiello--accento">${esc(c.occhiello)}</p>
          <p class="chi-siamo__nome">${esc(c.nome)}</p>
          <p class="chi-siamo__ruolo">${esc(c.ruolo)}</p>
          <p class="chi-siamo__racconto">${esc(c.testo)}</p>
          <p class="chi-siamo__recapiti">
            <a href="tel:${esc(d.agenzia.telefonoHref)}">${esc(d.agenzia.telefono)}</a>
            ${wa ? `<a href="${esc(wa)}" target="_blank" rel="noopener">WhatsApp</a>` : ""}
          </p>
        </div>
      </div>`;
  }

  /* ---------------------------------------------------------------- progetti */

  /**
   * Scheda selezionabile dell'elenco di sinistra.
   * Semantica `tab`: chi naviga da tastiera si sposta con le frecce e sente
   * annunciare "scheda 2 di 3", cosa che un bottone `aria-pressed` non dà.
   */
  function progettoCard(p, indice, attivo) {
    return `
      <button type="button" class="progetto" role="tab" id="progetto-tab-${indice}"
              data-progetto="${indice}" aria-selected="${attivo ? "true" : "false"}"
              aria-controls="progetto-anteprima" tabindex="${attivo ? "0" : "-1"}" data-anim>
        <span class="progetto__barra">
          <span class="progetto__pallino" aria-hidden="true"></span>
          <span class="progetto__pallino" aria-hidden="true"></span>
          <span class="progetto__dominio">${esc(p.dominio)}</span>
        </span>
        <span class="progetto__corpo">
          <span class="progetto__swatch" style="background:${esc(p.swatch)}" aria-hidden="true"></span>
          <span class="progetto__info">
            <span class="progetto__nome">${esc(p.nome)}</span>
            <span class="progetto__categoria">${esc(p.categoria)}</span>
            <span class="progetto__meta">${esc(p.meta)}</span>
          </span>
        </span>
      </button>`;
  }

  /** Contenuto del mock-up "tablet" a destra. */
  function progettoAnteprima(p) {
    return `
      <div class="tablet__schermo">
        <div class="tablet__barra">
          <span class="tablet__marchio">${esc(p.nome)}</span>
          <span class="tablet__nav">${p.nav.map((v) => `<span>${esc(v)}</span>`).join("")}</span>
        </div>
        <div class="tablet__corpo">
          <div class="tablet__colonna">
            <p class="occhiello occhiello--accento">${esc(p.occhiello)}</p>
            <p class="tablet__claim">${esc(p.claim)}</p>
            <p class="tablet__testo">${esc(p.testo)}</p>
            <span class="tablet__cta">${esc(p.cta)}</span>
          </div>
          <div class="tablet__foto" style="background:${esc(p.swatch)}">
            <span class="tablet__foto-label">${esc(p.etichettaFoto)}</span>
          </div>
        </div>
        <div class="tablet__piede">
          ${p.piede.map((r) => `<span>${esc(r)}</span>`).join("")}
        </div>
      </div>`;
  }

  function progetti(d, indiceAttivo) {
    const attivoIdx = indiceAttivo || 0;
    const elenco = d.progetti.elenco
      .map((p, i) => progettoCard(p, i, i === attivoIdx))
      .join("");
    const attivo = d.progetti.elenco[attivoIdx];

    // L'anteprima NON è un live region: sostituendo tutto il mock-up a ogni
    // scelta, uno screen reader rileggerebbe l'intera scheda. Annunciamo invece
    // una riga sola nel paragrafo nascosto qui sotto.
    return intestazione(d.progetti.titolo, d.progetti.sommario, "progetti-titolo") + `
      <div class="progetti">
        <div class="progetti__elenco" role="tablist" aria-orientation="vertical" aria-label="${esc(d.progetti.titolo)}">
          ${elenco}
        </div>
        <div class="progetti__anteprima">
          <div class="tablet" id="progetto-anteprima" role="tabpanel"
               aria-labelledby="progetto-tab-${attivoIdx}" tabindex="0">
            ${progettoAnteprima(attivo)}
          </div>
          <div class="progetti__didascalia">
            <span data-didascalia>${esc(attivo.didascalia)}</span>
            <span class="occhiello occhiello--muto">${esc(d.progetti.etichettaAnteprima)}</span>
          </div>
          <p class="progetti__disclaimer">${esc(d.progetti.disclaimer)}</p>
        </div>
      </div>
      <p class="progetti__nota">${esc(d.progetti.nota)}</p>
      <p class="u-visually-hidden" aria-live="polite" data-annuncio></p>`;
  }

  /* --------------------------------------------------------------------- faq */

  function faq(d) {
    const voci = d.faq.voci
      .map(
        (v) => `<details class="faq__voce" data-anim>
            <summary class="faq__domanda">${esc(v.domanda)}</summary>
            <div class="faq__risposta"><p>${esc(v.risposta)}</p></div>
          </details>`
      )
      .join("");

    return intestazione(d.faq.titolo, d.faq.sommario, "faq-titolo") +
      `<div class="faq">${voci}</div>`;
  }

  /* ---------------------------------------------------------- contatti intro */

  function contattiIntro(d) {
    const wa = whatsappUrl(d);
    const valori = {
      telefono: d.agenzia.telefono,
      whatsapp: d.agenzia.whatsappHref,
      email: d.agenzia.email,
      orari: d.agenzia.orari
    };

    const righe = d.contatti.righe
      .map((r) => {
        const valore = valori[r.chiave] || "";
        let contenuto = esc(valore);
        if (r.chiave === "telefono") {
          contenuto = `<a href="tel:${esc(d.agenzia.telefonoHref)}">${esc(valore)}</a>`;
        } else if (r.chiave === "email") {
          contenuto = `<a href="mailto:${esc(valore)}">${esc(valore)}</a>`;
        } else if (r.chiave === "whatsapp") {
          if (!wa) return "";
          contenuto = `<a href="${esc(wa)}" target="_blank" rel="noopener">Scrivici su WhatsApp</a>`;
        }
        return `<div class="lista-dati__riga">
            <dt class="lista-dati__voce">${esc(r.voce)}</dt>
            <dd class="lista-dati__valore">${contenuto}</dd>
          </div>`;
      })
      .join("");

    return `
      <h2 class="sezione__titolo sezione__titolo--stretto" id="contatti-titolo">${esc(d.contatti.titolo)}</h2>
      <p class="contatti__testo">${esc(d.contatti.testo)}</p>
      <dl class="lista-dati lista-dati--bordata">${righe}</dl>`;
  }

  /* ------------------------------------------------------------------ footer */

  function footer(d, relativo) {
    const a = d.agenzia;
    const t = d.footer.colonneTitoli;
    const casa = relativo ? "index.html" : "";
    const wa = whatsappUrl(d);

    const pagine = d.nav
      .map((v) => `<a href="${casa}${esc(v.href)}">${esc(v.label)}</a>`)
      .join("");

    const extra = (d.footer.pagineExtra || [])
      .map((v) => `<a href="${esc(v.href)}">${esc(v.label)}</a>`)
      .join("");

    // Riga legale composta a pezzi: senza partita IVA non deve restare la
    // scritta "P.IVA" seguita dal nulla. I nomi dei fondatori prendono il suo
    // posto come dato identificativo.
    const legale = ["© " + new Date().getFullYear() + " " + a.nome];
    if (a.fondatori) legale.push(a.fondatori);
    if (a.piva) legale.push("P.IVA " + a.piva);

    return `
      <div class="footer__griglia">
        <div class="footer__colonna footer__colonna--larga">
          <p class="footer__marchio">${esc(a.nome)}</p>
          <p class="footer__descrizione">${esc(d.footer.descrizione)}</p>
        </div>
        <div class="footer__colonna">
          <p class="occhiello occhiello--muto">${esc(t.sede)}</p>
          <p class="footer__testo">
            ${[indirizzoTesto(d), a.indirizzo.nota].filter(Boolean).map(esc).join("<br>")}
          </p>
        </div>
        <div class="footer__colonna">
          <p class="occhiello occhiello--muto">${esc(t.contatti)}</p>
          <p class="footer__testo">
            <a href="tel:${esc(a.telefonoHref)}">${esc(a.telefono)}</a><br>
            ${wa ? `<a href="${esc(wa)}" target="_blank" rel="noopener">WhatsApp</a><br>` : ""}
            <a href="mailto:${esc(a.email)}">${esc(a.email)}</a><br>
            ${esc(a.orari)}
          </p>
        </div>
        <div class="footer__colonna footer__colonna--link">
          <p class="occhiello occhiello--muto">${esc(t.pagine)}</p>
          ${pagine}
          ${extra}
          <!-- Link vero: senza JavaScript porta alla pagina, con JavaScript apre la modale -->
          <a href="privacy.html" data-apri-privacy>${esc(d.footer.privacyLabel)}</a>
        </div>
      </div>
      <div class="footer__legale">
        <span>${legale.map(esc).join(" — ")}</span>
        <span>${esc(a.indirizzo.citta)} (${esc(a.indirizzo.provincia)}), Emilia-Romagna</span>
      </div>`;
  }

  /* ------------------------------------------------------------ esiti modulo */

  function formSuccesso(d, dati) {
    const s = d.form.successo;
    const nome = String(dati.referente || "").trim().split(/\s+/)[0] || "";
    const testo = fill(s.testo, {
      nome: esc(nome),
      attivita: `<strong>${esc(dati.attivita)}</strong>`,
      modalita: esc(s.modalitaTesto[dati.modalita] || dati.modalita),
      telefono: esc(dati.telefono)
    });

    return `
      <p class="occhiello occhiello--accento">${esc(s.occhiello)}</p>
      <h3 class="esito__titolo">${esc(fill(s.titolo, { nome: nome }))}</h3>
      <p class="esito__testo">${testo}</p>
      <div class="esito__dopo">
        <p class="occhiello occhiello--muto">${esc(s.dopoOcchiello)}</p>
        <p class="esito__testo">${esc(s.dopoTesto)}</p>
      </div>
      <button type="button" class="btn btn--secondario" data-reset-form>${esc(s.reset)}</button>`;
  }

  function formErrore(d, chiaveMancante) {
    const e = d.form.errore;
    const a = d.agenzia;
    const wa = whatsappUrl(d);

    const rigaWhatsapp = wa
      ? `<div class="lista-dati__riga">
          <dt class="lista-dati__voce">WhatsApp</dt>
          <dd class="lista-dati__valore"><a href="${esc(wa)}" target="_blank" rel="noopener">Scrivici su WhatsApp</a></dd>
        </div>`
      : "";

    return `
      <p class="occhiello occhiello--errore">${esc(e.occhiello)}</p>
      <h3 class="esito__titolo">${esc(e.titolo)}</h3>
      <p class="esito__testo">${esc(chiaveMancante ? e.testoChiaveMancante : e.testo)}</p>
      <dl class="lista-dati lista-dati--bordata">
        <div class="lista-dati__riga">
          <dt class="lista-dati__voce">Telefono</dt>
          <dd class="lista-dati__valore"><a href="tel:${esc(a.telefonoHref)}">${esc(a.telefono)}</a></dd>
        </div>
        ${rigaWhatsapp}
        <div class="lista-dati__riga">
          <dt class="lista-dati__voce">Email</dt>
          <dd class="lista-dati__valore"><a href="mailto:${esc(a.email)}">${esc(a.email)}</a></dd>
        </div>
      </dl>
      <button type="button" class="btn btn--secondario" data-reset-form>${esc(e.riprova)}</button>`;
  }

  /* -------------------------------------------------------------- privacy */

  /** Corpo dell'informativa: identico nella modale e in privacy.html. */
  function privacyCorpo(d) {
    const p = d.privacy;

    const blocchi = p.blocchi
      .map(
        (b) => `<div class="modale__blocco">
            <h3>${esc(b.titolo)}</h3>
            <p>${testoRicco(b.testo, d)}</p>
          </div>`
      )
      .join("");

    return `
      <p class="modale__intro">${testoRicco(p.intro, d)}</p>
      <div class="modale__blocchi">${blocchi}</div>
      ${p.nota ? `<p class="modale__nota">${esc(p.nota)}</p>` : ""}`;
  }

  /* ------------------------------------------------------- pagine generate */

  /** Pagina di categoria: ristoranti, negozi, artigiani. */
  function paginaCategoria(d, p) {
    const punti = p.punti
      .map((x) => `<li>${esc(x)}</li>`)
      .join("");

    const anteprime = (p.progetti || [])
      .map((i) => d.progetti.elenco[i])
      .filter(Boolean)
      .map(
        (pr) => `<div class="tablet" data-anim>${progettoAnteprima(pr)}</div>`
      )
      .join("");

    const wa = whatsappUrl(d);

    return `
      <section class="hero hero--pagina" aria-label="Presentazione">
        <div class="hero__testo">
          <p class="occhiello occhiello--filetto"><span class="occhiello__filetto" aria-hidden="true"></span>${esc(p.occhiello)}</p>
          <h1 class="hero__titolo">${esc(p.titolo)}</h1>
          <p class="hero__sottotitolo">${esc(p.sottotitolo)}</p>
          <ul class="card__punti card__punti--grande">${punti}</ul>
          <div class="hero__azioni">
            <a class="btn btn--primario" href="index.html#contatti">${esc(d.ctaHeader.label)}</a>
            ${wa ? `<a class="btn btn--secondario" href="${esc(wa)}" target="_blank" rel="noopener">Scrivici su WhatsApp</a>` : ""}
          </div>
        </div>
      </section>

      ${anteprime ? `<section class="sezione" data-sezione aria-labelledby="esempio-titolo">
        <div class="sezione__testa">
          <h2 class="sezione__titolo" id="esempio-titolo">Un esempio</h2>
          <p class="sezione__sommario">${esc(d.progetti.disclaimer)}</p>
        </div>
        <div class="pagina__anteprime">${anteprime}</div>
      </section>` : ""}

      <section class="sezione" id="prezzi" data-sezione aria-labelledby="prezzi-titolo">
        ${prezzi(d)}
      </section>

      <section class="sezione" id="faq" data-sezione aria-labelledby="faq-titolo">
        ${faq(d)}
      </section>

      <section class="sezione richiamo" data-sezione aria-labelledby="richiamo-titolo">
        <h2 class="sezione__titolo sezione__titolo--stretto" id="richiamo-titolo">${esc(d.contatti.titolo)}</h2>
        <p class="contatti__testo">${esc(d.contatti.testo)}</p>
        <div class="hero__azioni">
          <a class="btn btn--primario" href="index.html#contatti">${esc(d.ctaHeader.label)}</a>
          <a class="btn btn--secondario" href="tel:${esc(d.agenzia.telefonoHref)}">${esc(d.agenzia.telefono)}</a>
        </div>
      </section>`;
  }

  /** Pagina di conferma dopo un invio senza JavaScript. */
  function paginaGrazie(d) {
    const g = d.grazie;
    const wa = whatsappUrl(d);

    return `
      <section class="sezione sezione--messaggio" aria-labelledby="grazie-titolo">
        <p class="occhiello occhiello--accento">${esc(g.occhiello)}</p>
        <h1 class="sezione__titolo" id="grazie-titolo">${esc(g.titolo)}</h1>
        <p class="contatti__testo">${esc(g.testo)}</p>
        <div class="esito__dopo">
          <p class="occhiello occhiello--muto">${esc(g.dopoOcchiello)}</p>
          <p class="esito__testo">${esc(g.dopoTesto)}</p>
        </div>
        <div class="hero__azioni">
          <a class="btn btn--primario" href="index.html">${esc(g.ritorno)}</a>
          <a class="btn btn--secondario" href="tel:${esc(d.agenzia.telefonoHref)}">${esc(d.agenzia.telefono)}</a>
          ${wa ? `<a class="btn btn--secondario" href="${esc(wa)}" target="_blank" rel="noopener">WhatsApp</a>` : ""}
        </div>
      </section>`;
  }

  function pagina404(d) {
    const e = d.errore404;
    return `
      <section class="sezione sezione--messaggio" aria-labelledby="errore-titolo">
        <p class="occhiello occhiello--muto">${esc(e.occhiello)}</p>
        <h1 class="sezione__titolo" id="errore-titolo">${esc(e.titolo)}</h1>
        <p class="contatti__testo">${esc(e.testo)}</p>
        <div class="hero__azioni">
          <a class="btn btn--primario" href="index.html">${esc(e.ritorno)}</a>
        </div>
      </section>`;
  }

  function paginaPrivacy(d) {
    const p = d.privacy;
    return `
      <section class="sezione sezione--messaggio" aria-labelledby="privacy-pagina-titolo">
        <h1 class="sezione__titolo sezione__titolo--stretto" id="privacy-pagina-titolo">${esc(p.titolo)}</h1>
        ${p.aggiornamento ? `<p class="occhiello occhiello--muto">${esc(p.aggiornamento)}</p>` : ""}
        <div class="privacy__corpo">${privacyCorpo(d)}</div>
        <div class="hero__azioni">
          <a class="btn btn--secondario" href="index.html">${esc(p.ritorno)}</a>
        </div>
      </section>`;
  }

  /* -------------------------------------------------------------- montaggio */

  /**
   * Nome del punto di montaggio → markup da inserirci.
   *
   * La usano tutti e due i lati: build.js per scrivere l'HTML nei file, app.js
   * per riempire nel browser gli eventuali contenitori rimasti vuoti. Un elenco
   * solo, quindi non può succedere che i due si disallineino.
   *
   * `form-modalita` è volutamente assente: quei pulsanti servono solo con il
   * JavaScript attivo e senza di esso sarebbero comandi morti.
   */
  function mappaMount(d, opzioni) {
    const o = opzioni || {};
    return {
      "header":              () => header(d),
      "header-pagina":       () => headerPagina(d),
      "hero":                () => hero(d),
      "metodo":              () => metodo(d),
      "servizi":             () => servizi(d),
      "prezzi":              () => prezzi(d),
      "progetti":            () => progetti(d, 0),
      "chi-siamo":           () => chiSiamo(d),
      "faq":                 () => faq(d),
      "contatti-intro":      () => contattiIntro(d),
      "footer":              () => footer(d, false),
      "footer-pagina":       () => footer(d, true),
      "barra-mobile":        () => barraMobile(d, "#contatti"),
      "barra-mobile-pagina": () => barraMobile(d, "index.html#contatti"),
      "privacy-titolo":      () => esc(d.privacy.titolo),
      "privacy-corpo":       () => privacyCorpo(d),
      "corpo":               () => o.corpo || ""
    };
  }

  return {
    esc: esc,
    fill: fill,
    testoRicco: testoRicco,
    mappaMount: mappaMount,
    whatsappUrl: whatsappUrl,
    url: url,
    header: header,
    headerPagina: headerPagina,
    barraMobile: barraMobile,
    hero: hero,
    metodo: metodo,
    servizi: servizi,
    prezzi: prezzi,
    chiSiamo: chiSiamo,
    progetti: progetti,
    progettoAnteprima: progettoAnteprima,
    faq: faq,
    contattiIntro: contattiIntro,
    footer: footer,
    formSuccesso: formSuccesso,
    formErrore: formErrore,
    privacyCorpo: privacyCorpo,
    paginaCategoria: paginaCategoria,
    paginaGrazie: paginaGrazie,
    pagina404: pagina404,
    paginaPrivacy: paginaPrivacy
  };
})();
