/* ============================================================================
   FR STUDIO — APPLICAZIONE
   ----------------------------------------------------------------------------
   Monta le sezioni, gestisce l'anteprima progetti, il modulo Web3Forms,
   la modale privacy e le animazioni allo scroll (libreria `motion`).

   Tutto degrada in sicurezza: se `motion` non è disponibile il sito resta
   completamente visibile e utilizzabile.
   ========================================================================== */

(function () {
  "use strict";

  const D = window.FR_DATA;
  const R = window.FR_RENDER;

  if (!D || !R) {
    console.error("[FR Studio] data.js o render.js non caricati: controlla i tag <script> in index.html.");
    return;
  }

  const $ = (sel, root) => (root || document).querySelector(sel);
  const $$ = (sel, root) => Array.prototype.slice.call((root || document).querySelectorAll(sel));
  const mount = (nome) => $('[data-mount="' + nome + '"]');

  const motion = window.Motion || null;
  const riduciMovimento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const animazioniAttive = !!motion && !riduciMovimento;

  /* ======================================================== 1. MONTAGGIO DOM */

  function montaSezioni() {
    mount("header").innerHTML = R.header(D);
    mount("hero").innerHTML = R.hero(D);
    mount("metodo").innerHTML = R.metodo(D);
    mount("servizi").innerHTML = R.servizi(D);
    mount("progetti").innerHTML = R.progetti(D, statoProgetto);
    mount("contatti-intro").innerHTML = R.contattiIntro(D);
    mount("footer").innerHTML = R.footer(D);

    // Titolo del documento e recapiti coerenti con data.js
    document.title = D.agenzia.nome + " — Siti web per le attività locali di " + D.agenzia.indirizzo.citta;
  }

  /* ==================================================== 2. ANTEPRIMA PROGETTI */

  let statoProgetto = 0;

  function selezionaProgetto(indice) {
    if (indice === statoProgetto) return;
    statoProgetto = indice;

    const progetto = D.progetti.elenco[indice];
    const anteprima = $("#progetto-anteprima");
    const didascalia = $("[data-didascalia]");

    anteprima.innerHTML = R.progettoAnteprima(progetto);
    if (didascalia) didascalia.textContent = progetto.didascalia;

    $$("[data-progetto]").forEach((btn) => {
      btn.setAttribute("aria-pressed", String(Number(btn.dataset.progetto) === indice));
    });

    if (animazioniAttive) {
      motion.animate(
        anteprima.firstElementChild,
        { opacity: [0, 1], transform: ["translateY(8px)", "none"] },
        { duration: 0.35, ease: [0.16, 1, 0.3, 1] }
      );
    }
  }

  function collegaProgetti() {
    const elenco = $(".progetti__elenco");
    if (!elenco) return;
    elenco.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-progetto]");
      if (btn) selezionaProgetto(Number(btn.dataset.progetto));
    });
  }

  /* ========================================================= 3. MODALE PRIVACY */

  let triggerPrivacy = null;

  function collegaPrivacy() {
    const dialog = $("#privacy-modal");
    if (!dialog) return;

    document.addEventListener("click", (e) => {
      const apri = e.target.closest("[data-apri-privacy]");
      if (apri) {
        e.preventDefault();
        triggerPrivacy = apri;
        // showModal() gestisce nativamente ESC, il focus trap e l'inertizzazione della pagina
        if (typeof dialog.showModal === "function") dialog.showModal();
        else dialog.setAttribute("open", "");
        return;
      }
      if (e.target.closest("[data-chiudi-privacy]")) dialog.close();
    });

    // Chiusura cliccando sullo sfondo (fuori dal riquadro bianco)
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
    if (animazioniAttive) {
      motion.animate(esito, { opacity: [0, 1], transform: ["translateY(10px)", "none"] }, { duration: 0.4 });
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
      const attivo = Number(btn.dataset.modalita) === indice;
      btn.setAttribute("aria-pressed", String(attivo));
      btn.classList.toggle("is-attivo", attivo);
    });
    const submit = $("[data-submit-label]");
    if (submit) submit.textContent = modo.submit;
  }

  function montaModalita() {
    const box = mount("form-modalita");
    if (!box) return;
    box.innerHTML = D.form.modalita
      .map(
        (m, i) =>
          `<button type="button" class="chip" data-modalita="${i}" aria-pressed="${i === 0}">${R.esc(m.label)}</button>`
      )
      .join("");
    box.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-modalita]");
      if (btn) impostaModalita(Number(btn.dataset.modalita));
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

    // La access key vive in data.js: la iniettiamo nel campo nascosto richiesto da Web3Forms
    $("#f-access-key").value = D.form.accessKey;
    if (chiaveMancante()) {
      console.warn(
        "[FR Studio] Web3Forms access key non impostata. " +
          "Apri assets/js/data.js e sostituisci `accessKey: \"TUA_ACCESS_KEY_QUI\"` " +
          "con la chiave ricevuta da https://web3forms.com — finché resta il segnaposto il modulo non invia."
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

  /* ==================================================== 5. ANIMAZIONI (motion) */

  function rivelaTutto() {
    $$("[data-anim]").forEach((el) => el.classList.add("is-visibile"));
  }

  function collegaAnimazioni() {
    if (!animazioniAttive) {
      rivelaTutto();
      return;
    }

    const { animate, inView, scroll, stagger } = motion;

    // Ingresso delle sezioni: una sola volta, quando entrano nel viewport
    $$("[data-sezione]").forEach((sezione) => {
      const elementi = $$("[data-anim]", sezione);
      if (!elementi.length) return;

      // `amount: "some"` scatta appena la sezione entra nel viewport: a differenza di una
      // soglia percentuale non resta mai bloccato sulle sezioni più alte dello schermo.
      // Il margine negativo in basso ritarda l'innesco di ~10% dell'altezza della finestra.
      inView(
        sezione,
        () => {
          animate(
            elementi,
            { opacity: [0, 1], transform: ["translateY(16px)", "none"] },
            { duration: 0.55, delay: stagger(0.07), ease: [0.16, 1, 0.3, 1] }
          );
          elementi.forEach((el) => el.classList.add("is-visibile"));
        },
        { amount: "some", margin: "0px 0px -10% 0px" }
      );
    });

    // Filetto di avanzamento sotto l'header
    const barra = $("[data-scroll-bar]");
    if (barra) scroll(animate(barra, { scaleX: [0, 1] }, { ease: "linear" }));
  }

  /* ============================================================== 6. AVVIO */

  function avvia() {
    document.documentElement.classList.add("js");
    if (!motion) {
      console.warn(
        "[FR Studio] `motion` non trovato: esegui `npm install && npm run sync:motion` " +
          "per copiare la libreria in assets/vendor/. Il sito funziona comunque, senza animazioni."
      );
    }

    montaSezioni();
    collegaProgetti();
    collegaPrivacy();
    collegaModulo();
    collegaAnimazioni();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", avvia);
  } else {
    avvia();
  }
})();
