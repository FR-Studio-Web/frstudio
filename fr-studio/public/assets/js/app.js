/* ============================================================================
   FR STUDIO — APPLICAZIONE
   ----------------------------------------------------------------------------
   Le pagine arrivano dal browser già scritte (le genera build.js): qui non si
   costruisce il sito, si aggiunge soltanto quello che senza JavaScript non
   potrebbe funzionare — la scelta del progetto, il modulo, la modale privacy
   e le animazioni allo scroll.

   Nessuna libreria: le animazioni sono transizioni CSS accese da un
   IntersectionObserver. Se qualcosa non è disponibile la pagina resta
   completamente visibile e utilizzabile.
   ========================================================================== */

(function () {
  "use strict";

  const D = window.FR_DATA;
  const R = window.FR_RENDER;

  if (!D || !R) {
    console.error("[FR Studio] data.js o render.js non caricati: controlla i tag <script>.");
    rivelaTutto();
    return;
  }

  const $ = (sel, root) => (root || document).querySelector(sel);
  const $$ = (sel, root) => Array.prototype.slice.call((root || document).querySelectorAll(sel));

  const riduciMovimento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const osservabile = "IntersectionObserver" in window;

  /* ======================================================== 1. MONTAGGIO DOM */

  /**
   * Controllo di sanità: se un contenitore è vuoto vuol dire che build.js non
   * è stato lanciato dopo l'ultima modifica. Non proviamo a ricostruirlo qui —
   * il browser riceve solo i dati che gli servono dopo il caricamento, non
   * tutti i contenuti — ma lo diciamo chiaramente in console.
   */
  function controllaMontaggio() {
    const vuoti = $$("[data-mount]")
      .filter((el) => !el.innerHTML.trim())
      .map((el) => el.getAttribute("data-mount"))
      .filter((nome) => nome !== "form-modalita");   // costruito qui sotto, apposta

    if (vuoti.length) {
      console.warn(
        "[FR Studio] Sezioni vuote (" + vuoti.join(", ") + "): " +
          "lancia `npm run build` per riscrivere le pagine da data.js."
      );
    }
  }

  /**
   * L'altezza dell'header serve al CSS per l'ancoraggio dei link interni e per
   * la posizione del filetto di avanzamento. Misurarla è più affidabile che
   * tenerne una copia scritta a mano nel foglio di stile.
   */
  function misuraHeader() {
    const header = $(".site-header");
    if (!header) return;

    const applica = () => {
      const h = Math.round(header.getBoundingClientRect().height);
      if (h > 0) document.documentElement.style.setProperty("--header-h", h + "px");
    };

    applica();
    if ("ResizeObserver" in window) new ResizeObserver(applica).observe(header);
    else window.addEventListener("resize", applica);
  }

  /* ==================================================== 2. ANTEPRIMA PROGETTI */

  let statoProgetto = 0;

  function schedeProgetto() {
    return $$('[role="tab"][data-progetto]');
  }

  function selezionaProgetto(indice, spostaFocus) {
    const schede = schedeProgetto();
    if (!schede.length || indice < 0 || indice >= D.progetti.elenco.length) return;

    const progetto = D.progetti.elenco[indice];
    const anteprima = $("#progetto-anteprima");
    const didascalia = $("[data-didascalia]");
    const annuncio = $("[data-annuncio]");

    if (indice !== statoProgetto && anteprima) {
      anteprima.innerHTML = R.progettoAnteprima(progetto);
      anteprima.setAttribute("aria-labelledby", "progetto-tab-" + indice);
      if (didascalia) didascalia.textContent = progetto.didascalia;

      // Una riga sola, invece di far rileggere l'intero mock-up allo screen reader
      if (annuncio) annuncio.textContent = "Anteprima: " + progetto.nome;

      if (!riduciMovimento) {
        anteprima.classList.remove("is-entrato");
        // Forza un reflow: senza, il browser accorpa le due modifiche di classe
        // e la transizione non riparte.
        void anteprima.offsetWidth;
        anteprima.classList.add("is-entrato");
      }
    }

    statoProgetto = indice;

    // Tabindex mobile: una sola scheda raggiungibile con Tab, le altre con le frecce
    schede.forEach((scheda, i) => {
      const attivo = i === indice;
      scheda.setAttribute("aria-selected", String(attivo));
      scheda.setAttribute("tabindex", attivo ? "0" : "-1");
    });

    if (spostaFocus && schede[indice]) schede[indice].focus();
  }

  function collegaProgetti() {
    const elenco = $(".progetti__elenco");
    if (!elenco) return;

    elenco.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-progetto]");
      if (btn) selezionaProgetto(Number(btn.getAttribute("data-progetto")), false);
    });

    // Frecce, Home e Fine: comportamento atteso da chi naviga un gruppo di schede
    elenco.addEventListener("keydown", (e) => {
      const ultimo = D.progetti.elenco.length - 1;
      let destinazione = null;

      if (e.key === "ArrowDown" || e.key === "ArrowRight") destinazione = statoProgetto + 1;
      else if (e.key === "ArrowUp" || e.key === "ArrowLeft") destinazione = statoProgetto - 1;
      else if (e.key === "Home") destinazione = 0;
      else if (e.key === "End") destinazione = ultimo;
      else return;

      e.preventDefault();
      if (destinazione < 0) destinazione = ultimo;
      if (destinazione > ultimo) destinazione = 0;
      selezionaProgetto(destinazione, true);
    });
  }

  /* ========================================================= 3. MODALE PRIVACY */

  let triggerPrivacy = null;

  /**
   * I link all'informativa puntano davvero a privacy.html: senza JavaScript
   * portano alla pagina. Qui li intercettiamo per aprire la modale — ma solo
   * se il browser sa gestirla davvero, altrimenti il link fa il suo mestiere.
   */
  function collegaPrivacy() {
    const dialog = $("#privacy-modal");
    if (!dialog || typeof dialog.showModal !== "function") return;

    document.addEventListener("click", (e) => {
      const apri = e.target.closest("[data-apri-privacy]");
      if (apri) {
        // Lasciamo passare i click con Ctrl/Cmd o rotellina: chi vuole la pagina
        // in una scheda nuova deve poterla aprire.
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
        e.preventDefault();
        triggerPrivacy = apri;
        dialog.showModal();   // gestisce da sé ESC, focus trap e inertizzazione
        return;
      }
      if (e.target.closest("[data-chiudi-privacy]")) dialog.close();
    });

    // Chiusura cliccando sullo sfondo (fuori dal riquadro)
    dialog.addEventListener("click", (e) => {
      if (e.target === dialog) dialog.close();
    });

    dialog.addEventListener("close", () => {
      if (triggerPrivacy && document.contains(triggerPrivacy)) triggerPrivacy.focus();
      triggerPrivacy = null;
    });
  }

  /* ================================================== 4. MODULO WEB3FORMS */

  const form = $("#fr-form");
  const esito = $("#fr-esito");

  function chiaveMancante() {
    const k = (D.form.accessKey || "").trim();
    return !k || k === "TUA_ACCESS_KEY_QUI";
  }

  function mostraErroreCampo(nome, messaggio) {
    const span = $('[data-errore="' + nome + '"]');
    const campo = $("#f-" + nome);
    if (span) span.textContent = messaggio || "";
    if (campo) {
      campo.setAttribute("aria-invalid", messaggio ? "true" : "false");
      campo.classList.toggle("is-errore", !!messaggio);
    }
  }

  function validaModulo(valori) {
    const msg = D.form.errori;
    const errori = {};

    if (valori.attivita.trim().length < 2) errori.attivita = msg.attivita;
    if (valori.referente.trim().length < 2) errori.referente = msg.referente;
    if (valori.telefono.replace(/[^0-9]/g, "").length < 8) errori.telefono = msg.telefono;
    if (valori.email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(valori.email)) errori.email = msg.email;
    if (!valori.privacy) errori.privacy = msg.privacy;

    return errori;
  }

  function leggiModulo() {
    return {
      attivita: $("#f-attivita").value,
      referente: $("#f-referente").value,
      telefono: $("#f-telefono").value,
      email: $("#f-email").value,
      messaggio: $("#f-messaggio").value,
      privacy: $("#f-privacy").checked,
      modalita: $("#f-modalita").value
    };
  }

  function mostraEsito(html) {
    esito.innerHTML = html;
    form.hidden = true;
    esito.hidden = false;
    // Sposta il focus sull'esito: chi usa screen reader o tastiera lo sente subito
    esito.setAttribute("tabindex", "-1");
    esito.focus({ preventScroll: true });
    if (!riduciMovimento) {
      esito.classList.remove("is-entrato");
      void esito.offsetWidth;
      esito.classList.add("is-entrato");
    }
  }

  function ripristinaModulo() {
    form.reset();
    ["attivita", "referente", "telefono", "email", "privacy"].forEach((n) => mostraErroreCampo(n, ""));
    esito.hidden = true;
    esito.innerHTML = "";
    form.hidden = false;
    impostaModalita(0);
    $("#f-attivita").focus();
  }

  function impostaModalita(indice) {
    const modo = D.form.modalita[indice];
    $("#f-modalita").value = modo.valore;
    $$("[data-modalita]").forEach((btn) => {
      const attivo = Number(btn.getAttribute("data-modalita")) === indice;
      btn.setAttribute("aria-pressed", String(attivo));
      btn.classList.toggle("is-attivo", attivo);
    });
    const submit = $("[data-submit-label]");
    if (submit) submit.textContent = modo.submit;
  }

  function montaModalita() {
    const box = $('[data-mount="form-modalita"]');
    if (!box) return;
    box.innerHTML = D.form.modalita
      .map(
        (m, i) =>
          `<button type="button" class="chip" data-modalita="${i}" aria-pressed="${i === 0}">${R.esc(m.label)}</button>`
      )
      .join("");
    box.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-modalita]");
      if (btn) impostaModalita(Number(btn.getAttribute("data-modalita")));
    });
  }

  function collegaModulo() {
    if (!form || !esito) return;

    // Senza JS resta attiva la validazione nativa del browser; con JS usiamo la nostra,
    // che mostra i messaggi in italiano sotto ogni campo. `required` viene tradotto in
    // `aria-required` così i campi vuoti non risultano "non validi" già al caricamento.
    form.noValidate = true;
    $$("[required]", form).forEach((campo) => {
      campo.removeAttribute("required");
      campo.setAttribute("aria-required", "true");
    });

    if (chiaveMancante()) {
      console.warn(
        "[FR Studio] Web3Forms access key non impostata. " +
          "Apri assets/js/data.js, sostituisci `form.accessKey` con la chiave ricevuta " +
          "da https://web3forms.com e rilancia `npm run build`."
      );
    }

    montaModalita();
    impostaModalita(0);

    // Pulisce l'errore mentre si corregge il campo
    form.addEventListener("input", (e) => {
      if (e.target.id && e.target.id.indexOf("f-") === 0) {
        mostraErroreCampo(e.target.id.slice(2), "");
      }
    });

    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const valori = leggiModulo();
      const errori = validaModulo(valori);

      ["attivita", "referente", "telefono", "email", "privacy"].forEach((n) =>
        mostraErroreCampo(n, errori[n] || "")
      );

      const primoErrore = Object.keys(errori)[0];
      if (primoErrore) {
        const campo = $("#f-" + primoErrore);
        if (campo) campo.focus();
        return;
      }

      if (chiaveMancante()) {
        mostraEsito(R.formErrore(D, true));
        return;
      }

      const bottone = $("#f-submit");
      const etichettaOriginale = $("[data-submit-label]").textContent;
      bottone.disabled = true;
      $("[data-submit-label]").textContent = D.form.invioInCorso;

      try {
        const payload = Object.fromEntries(new FormData(form).entries());
        const risposta = await fetch(form.action, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify(payload)
        });
        const dati = await risposta.json();

        if (risposta.ok && dati.success) {
          mostraEsito(R.formSuccesso(D, valori));
          traccia("modulo-inviato");
        } else {
          console.error("[FR Studio] Web3Forms ha risposto con un errore:", dati);
          mostraEsito(R.formErrore(D, false));
        }
      } catch (err) {
        console.error("[FR Studio] Invio non riuscito:", err);
        mostraEsito(R.formErrore(D, false));
      } finally {
        bottone.disabled = false;
        $("[data-submit-label]").textContent = etichettaOriginale;
      }
    });

    // "Invia un'altra richiesta" / "Riprova"
    esito.addEventListener("click", (e) => {
      if (e.target.closest("[data-reset-form]")) ripristinaModulo();
    });
  }

  /* ==================================================== 5. ANIMAZIONI (CSS) */

  function rivelaTutto() {
    Array.prototype.forEach.call(document.querySelectorAll("[data-anim]"), (el) => {
      el.classList.add("is-visibile");
    });
  }

  /**
   * Comparsa allo scroll: la transizione è in CSS, qui si accende soltanto.
   * Ogni sezione compare una volta sola, con gli elementi a cascata.
   */
  function collegaAnimazioni() {
    if (riduciMovimento || !osservabile) {
      rivelaTutto();
      return;
    }

    const gestiti = new Set();

    $$("[data-sezione]").forEach((sezione) => {
      const elementi = $$("[data-anim]", sezione);
      if (!elementi.length) return;

      elementi.forEach((el, i) => {
        gestiti.add(el);
        // Cascata limitata a sette passi: su elenchi lunghi l'ultimo elemento
        // altrimenti arriverebbe con un ritardo fastidioso.
        el.style.transitionDelay = Math.min(i, 6) * 70 + "ms";
      });

      const osservatore = new IntersectionObserver(
        (voci, obs) => {
          if (!voci.some((v) => v.isIntersecting)) return;
          elementi.forEach((el) => el.classList.add("is-visibile"));
          obs.disconnect();
        },
        { rootMargin: "0px 0px -10% 0px", threshold: 0 }
      );
      osservatore.observe(sezione);
    });

    // Rete di sicurezza: qualsiasi elemento fuori da una sezione osservata
    // viene mostrato subito, invece di restare invisibile per sempre.
    $$("[data-anim]").forEach((el) => {
      if (!gestiti.has(el)) el.classList.add("is-visibile");
    });
  }

  /**
   * Filetto di avanzamento sotto l'header.
   * Dove il browser supporta `animation-timeline: scroll()` se ne occupa il CSS
   * da solo, senza far girare JavaScript a ogni scroll.
   */
  function collegaAvanzamento() {
    const barra = $("[data-scroll-bar]");
    if (!barra || riduciMovimento) return;
    if (window.CSS && CSS.supports && CSS.supports("animation-timeline: scroll()")) return;

    let inCoda = false;
    const aggiorna = () => {
      const doc = document.documentElement;
      const percorribile = doc.scrollHeight - doc.clientHeight;
      const quota = percorribile > 0 ? doc.scrollTop / percorribile : 0;
      barra.style.transform = "scaleX(" + quota + ")";
      inCoda = false;
    };

    window.addEventListener("scroll", () => {
      if (inCoda) return;
      inCoda = true;
      requestAnimationFrame(aggiorna);
    }, { passive: true });

    aggiorna();
  }

  /* ================================================== 6. MISURAZIONE (facolt.) */

  /**
   * Ponte verso un'analitica senza cookie (GoatCounter, Umami, Plausible…).
   * Finché non ne colleghi una non fa assolutamente nulla: nessuno script di
   * terze parti, nessun banner da mostrare. Vedi il README per collegarla.
   */
  function traccia(evento) {
    if (typeof window.frTraccia === "function") window.frTraccia(evento);
  }

  function collegaTracciamento() {
    document.addEventListener("click", (e) => {
      const link = e.target.closest("a[href]");
      if (!link) return;
      const href = link.getAttribute("href") || "";
      if (href.indexOf("tel:") === 0) traccia("chiamata");
      else if (href.indexOf("wa.me") !== -1) traccia("whatsapp");
    });
  }

  /* ============================================================== 7. AVVIO */

  function avvia() {
    try {
      controllaMontaggio();
      misuraHeader();
      collegaProgetti();
      collegaPrivacy();
      collegaModulo();
      collegaAnimazioni();
      collegaAvanzamento();
      collegaTracciamento();
    } catch (err) {
      // Meglio un sito senza fronzoli che un sito con del testo invisibile.
      console.error("[FR Studio] Avvio non riuscito:", err);
      rivelaTutto();
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", avvia);
  } else {
    avvia();
  }
})();
