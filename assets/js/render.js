/* ============================================================================
   FR STUDIO — TEMPLATE
   ----------------------------------------------------------------------------
   Funzioni pure: ricevono i dati di data.js e restituiscono markup.
   Nessun effetto collaterale, nessun ascolto di eventi (quelli stanno in app.js).
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

    return `
      <div class="hero__testo">
        <p class="occhiello occhiello--filetto"><span class="occhiello__filetto" aria-hidden="true"></span>${esc(h.occhiello)}</p>
        <h1 class="hero__titolo" data-anim>${esc(h.titolo)}</h1>
        <p class="hero__sottotitolo" data-anim>${esc(h.sottotitolo)}</p>
        <div class="hero__azioni" data-anim>${cta}</div>
        <ul class="badge-lista" data-anim>${badge}</ul>
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

  /* ---------------------------------------------------------------- progetti */

  /** Card selezionabile nell'elenco di sinistra. */
  function progettoCard(p, indice, attivo) {
    return `
      <button type="button" class="progetto" data-progetto="${indice}" aria-pressed="${attivo ? "true" : "false"}" aria-controls="progetto-anteprima" data-anim>
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
    const elenco = d.progetti.elenco
      .map((p, i) => progettoCard(p, i, i === indiceAttivo))
      .join("");
    const attivo = d.progetti.elenco[indiceAttivo];

    return intestazione(d.progetti.titolo, d.progetti.sommario, "progetti-titolo") + `
      <div class="progetti">
        <div class="progetti__elenco">
          ${elenco}
          <p class="progetti__nota">${esc(d.progetti.nota)}</p>
        </div>
        <div class="progetti__anteprima">
          <div class="tablet" id="progetto-anteprima" role="region" aria-live="polite" aria-label="Anteprima del progetto selezionato">
            ${progettoAnteprima(attivo)}
          </div>
          <div class="progetti__didascalia">
            <span data-didascalia>${esc(attivo.didascalia)}</span>
            <span class="occhiello occhiello--muto">${esc(d.progetti.etichettaAnteprima)}</span>
          </div>
          <p class="progetti__disclaimer">${esc(d.progetti.disclaimer)}</p>
        </div>
      </div>`;
  }

  /* ---------------------------------------------------------- contatti intro */

  function contattiIntro(d) {
    const valori = {
      telefono: d.agenzia.telefono,
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

  function footer(d) {
    const a = d.agenzia;
    const t = d.footer.colonneTitoli;

    const pagine = d.nav
      .map((v) => `<a href="${esc(v.href)}">${esc(v.label)}</a>`)
      .join("");

    return `
      <div class="footer__griglia">
        <div class="footer__colonna footer__colonna--larga">
          <p class="footer__marchio">${esc(a.nome)}</p>
          <p class="footer__descrizione">${esc(d.footer.descrizione)}</p>
        </div>
        <div class="footer__colonna">
          <p class="occhiello occhiello--muto">${esc(t.sede)}</p>
          <p class="footer__testo">
            ${esc(a.indirizzo.via)}<br>
            ${esc(a.indirizzo.cap)} ${esc(a.indirizzo.citta)} (${esc(a.indirizzo.provincia)})<br>
            ${esc(a.indirizzo.nota)}
          </p>
        </div>
        <div class="footer__colonna">
          <p class="occhiello occhiello--muto">${esc(t.contatti)}</p>
          <p class="footer__testo">
            <a href="tel:${esc(a.telefonoHref)}">${esc(a.telefono)}</a><br>
            <a href="mailto:${esc(a.email)}">${esc(a.email)}</a><br>
            ${esc(a.orari)}
          </p>
        </div>
        <div class="footer__colonna footer__colonna--link">
          <p class="occhiello occhiello--muto">${esc(t.pagine)}</p>
          ${pagine}
          <button type="button" class="footer__privacy" data-apri-privacy>${esc(d.footer.privacyLabel)}</button>
        </div>
      </div>
      <div class="footer__legale">
        <span>© ${new Date().getFullYear()} ${esc(a.nome)} — P.IVA ${esc(a.piva)}</span>
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
    return `
      <p class="occhiello occhiello--errore">${esc(e.occhiello)}</p>
      <h3 class="esito__titolo">${esc(e.titolo)}</h3>
      <p class="esito__testo">${esc(chiaveMancante ? e.testoChiaveMancante : e.testo)}</p>
      <dl class="lista-dati lista-dati--bordata">
        <div class="lista-dati__riga">
          <dt class="lista-dati__voce">Telefono</dt>
          <dd class="lista-dati__valore"><a href="tel:${esc(a.telefonoHref)}">${esc(a.telefono)}</a></dd>
        </div>
        <div class="lista-dati__riga">
          <dt class="lista-dati__voce">Email</dt>
          <dd class="lista-dati__valore"><a href="mailto:${esc(a.email)}">${esc(a.email)}</a></dd>
        </div>
      </dl>
      <button type="button" class="btn btn--secondario" data-reset-form>${esc(e.riprova)}</button>`;
  }

  return {
    esc: esc,
    fill: fill,
    header: header,
    hero: hero,
    metodo: metodo,
    servizi: servizi,
    progetti: progetti,
    progettoAnteprima: progettoAnteprima,
    contattiIntro: contattiIntro,
    footer: footer,
    formSuccesso: formSuccesso,
    formErrore: formErrore
  };
})();
