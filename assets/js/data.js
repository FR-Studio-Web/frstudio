/* ============================================================================
   FR STUDIO — CONTENUTI DEL SITO
   ----------------------------------------------------------------------------
   Questo è l'UNICO file da modificare per aggiornare i testi del sito.
   Non serve nessuna compilazione: salva e ricarica la pagina.

   I valori marcati con  ⚠️ SOSTITUIRE  sono segnaposto: vanno rimpiazzati con
   i dati reali dell'agenzia prima della pubblicazione.
   ========================================================================== */

window.FR_DATA = {

  /* --------------------------------------------------------------------------
     AGENZIA — dati usati in header, contatti, footer e informativa privacy
     ------------------------------------------------------------------------ */
  agenzia: {
    nome: "FR Studio",
    kicker: "Siti web per attività locali · Scandiano (RE)",
    telefono: "0522 000 000 · 340 000 0000",        // ⚠️ SOSTITUIRE
    telefonoHref: "+390522000000",                  // ⚠️ SOSTITUIRE (formato internazionale, senza spazi)
    whatsappHref: "+393400000000",                  // ⚠️ SOSTITUIRE
    email: "ciao@frstudio.it",                      // ⚠️ SOSTITUIRE
    emailPrivacy: "privacy@frstudio.it",            // ⚠️ SOSTITUIRE
    orari: "Lun-Sab, 9-19",
    indirizzo: {
      via: "Via —, 0",                              // ⚠️ SOSTITUIRE
      cap: "42019",
      citta: "Scandiano",
      provincia: "RE",
      nota: "Su appuntamento, anche direttamente da te."
    },
    piva: "00000000000",                            // ⚠️ SOSTITUIRE
    zone: "Scandiano, Casalgrande, Albinea e Reggio Emilia"
  },

  /* --------------------------------------------------------------------------
     NAVIGAZIONE
     ------------------------------------------------------------------------ */
  nav: [
    { label: "Il metodo", href: "#metodo" },
    { label: "Servizi",   href: "#servizi" },
    { label: "Progetti",  href: "#progetti" },
    { label: "Contatti",  href: "#contatti" }
  ],

  ctaHeader: { label: "Richiedi Demo Gratuita", href: "#contatti" },

  /* --------------------------------------------------------------------------
     HERO
     ------------------------------------------------------------------------ */
  hero: {
    occhiello: "Scandiano · Reggio Emilia",
    titolo: "Siti web moderni per le attività locali. Vedi la demo prima di decidere.",
    sottotitolo:
      "Non chiediamo anticipi: realizziamo prima la demo per la tua attività, " +
      "te la mostriamo di persona su tablet e poi decidi se acquistarla.",
    cta: [
      { label: "Richiedi la demo gratuita", href: "#contatti",  variante: "primario" },
      { label: "Guarda le anteprime",       href: "#progetti",  variante: "secondario" }
    ],
    badge: [
      { titolo: "Zero Rischi",       nota: "Paghi solo se ti piace" },
      { titolo: "100% Mobile",       nota: "Pensato prima per il telefono" },
      { titolo: "Assistenza Locale", nota: "Ci trovi in paese" }
    ],
    breve: {
      titolo: "In breve",
      righe: [
        { voce: "Anticipo richiesto", valore: "0 €" },
        { voce: "Demo pronta in",     valore: "5 giorni" },
        { voce: "Analisi iniziale",   valore: "Gratuita" },
        { voce: "Dove siamo",         valore: "Scandiano (RE)" }
      ],
      nota: "Veniamo noi da te, in negozio o in laboratorio, negli orari in cui hai meno gente."
    }
  },

  /* --------------------------------------------------------------------------
     IL NOSTRO METODO — 3 step
     ------------------------------------------------------------------------ */
  metodo: {
    titolo: "Il nostro metodo",
    sommario: "Tre passaggi, nessuna sorpresa: sai sempre cosa succede e quando.",
    step: [
      {
        num: "01",
        titolo: "Analisi locale",
        testo:
          "Guardiamo la tua presenza su Google: come ti trovano, cosa scrivono le recensioni, " +
          "cosa fanno le attività a due strade da te. Ti diciamo in chiaro cosa manca.",
        meta: "Gratuito · 2 giorni"
      },
      {
        num: "02",
        titolo: "Sviluppo demo",
        testo:
          "Creiamo il sito prima di chiedere 1 €. Testi, foto e menu impaginati da noi, pubblicati " +
          "su un indirizzo di prova: lo provi dal telefono e lo mostri a chi vuoi.",
        meta: "Nessun impegno · 5 giorni"
      },
      {
        num: "03",
        titolo: "Attivazione dominio & gestione",
        testo:
          "Il dominio è tuo, intestato alla tua attività. Modifiche di orari, menu e listini incluse: " +
          "ci scrivi un messaggio e le facciamo noi, in giornata.",
        meta: "Assistenza in paese"
      }
    ]
  },

  /* --------------------------------------------------------------------------
     SERVIZI
     ------------------------------------------------------------------------ */
  servizi: {
    titolo: "Servizi",
    sommario: "Quello che serve davvero a un'attività di paese, senza voci inutili in fattura.",
    voci: [
      {
        num: "01",
        titolo: "Siti vetrina",
        testo:
          "Una pagina sola, fatta bene: chi sei, cosa offri, dove ti trovano e come ti chiamano. " +
          "Veloce da caricare anche con la linea del telefono.",
        punti: ["Testi e impaginazione inclusi", "Ottimizzato per Google locale", "Dominio intestato a te"],
        meta: "Consegna in 5 giorni"
      },
      {
        num: "02",
        titolo: "Moduli contatto e prenotazione",
        testo:
          "Le richieste arrivano dove le leggi davvero: sulla tua email o su WhatsApp. " +
          "Niente pannelli da imparare, niente commissioni sui coperti.",
        punti: ["Richieste via email o WhatsApp", "Protezione antispam", "Conforme al GDPR"],
        meta: "Incluso nel sito vetrina"
      },
      {
        num: "03",
        titolo: "Manutenzione e assistenza",
        testo:
          "Orari, menu, listini e foto cambiano: ci scrivi e li cambiamo noi. " +
          "Aggiornamenti tecnici, backup e certificato di sicurezza sempre a posto.",
        punti: ["Modifiche testi e foto", "Backup e certificato SSL", "Un referente, sempre lo stesso"],
        meta: "Risposta in giornata"
      }
    ]
  },

  /* --------------------------------------------------------------------------
     ANTEPRIMA PROGETTI
     Mock-up dimostrativi: mostrano come si presenta il lavoro finito.
     Sostituiscili con i progetti reali man mano che vengono pubblicati.
     ------------------------------------------------------------------------ */
  progetti: {
    titolo: "Anteprima progetti",
    sommario: "Tre esempi di demo per attività del territorio. Scegli una scheda per vederla ingrandita.",
    nota: "Le demo restano online per 30 giorni. Se non le attivi, le cancelliamo e non paghi nulla.",
    disclaimer: "Mock-up dimostrativi realizzati da FR Studio: le attività rappresentate sono di esempio.", // ⚠️ RIMUOVERE quando saranno progetti reali
    etichettaAnteprima: "Anteprima su tablet",
    elenco: [
      {
        nome: "Trattoria del Boiardo",
        categoria: "Cucina emiliana · Scandiano centro",
        dominio: "trattoriadelboiardo.it",
        meta: "Sito vetrina + menu",
        swatch: "#E7E2D8",
        etichettaFoto: "Foto sala e tortelli",
        occhiello: "Aperto mar-dom, 12-14:30 / 19-22:30",
        claim: "Il tortello di zucca come lo faceva la nonna, in Piazza Boiardo.",
        testo:
          "Menu del giorno aggiornato ogni mattina, prenotazione diretta al telefono. " +
          "Nessuna commissione sui coperti.",
        cta: "Prenota un tavolo",
        nav: ["Menu", "Sala", "Contatti"],
        piede: ["Piazza Boiardo 6, Scandiano", "45 coperti + cortile", "Prenotazioni al telefono"],
        didascalia: "Demo consegnata in 4 giorni, attivata il giorno dopo la presentazione."
      },
      {
        nome: "Bottega 14",
        categoria: "Abbigliamento donna · Via Vallisneri",
        dominio: "bottega14scandiano.it",
        meta: "Vetrina + WhatsApp",
        swatch: "#E3E5E7",
        etichettaFoto: "Foto vetrina e capi",
        occhiello: "Lun-Sab, 9:30-13 / 15:30-19:30",
        claim: "Nuova collezione in vetrina: passa a provarla in negozio.",
        testo:
          "Novità pubblicate ogni settimana, capi da prenotare su WhatsApp e ritirare in bottega " +
          "entro il giorno dopo.",
        cta: "Scrivici su WhatsApp",
        nav: ["Novità", "Marchi", "Dove siamo"],
        piede: ["Via Vallisneri 14, Scandiano", "Cambio taglia in 7 giorni", "Ritiro in negozio"],
        didascalia: "Demo consegnata in 5 giorni: le prenotazioni arrivano su un unico numero."
      },
      {
        nome: "Autofficina Rinaldi",
        categoria: "Meccanico e gommista · Zona artigianale",
        dominio: "autofficinarinaldi.it",
        meta: "Vetrina + appuntamenti",
        swatch: "#DFE2DE",
        etichettaFoto: "Foto officina e ponte",
        occhiello: "Lun-Ven, 8-12:30 / 14-18:30",
        claim: "Tagliando, revisione e gomme: preventivo chiaro prima di iniziare.",
        testo:
          "Richiesta di appuntamento in tre campi, promemoria della revisione via messaggio, " +
          "auto di cortesia su richiesta.",
        cta: "Chiedi un preventivo",
        nav: ["Servizi", "Revisioni", "Appuntamenti"],
        piede: ["Via dell'Artigianato 27, Scandiano", "Revisioni ministeriali", "Auto di cortesia"],
        didascalia: "Demo consegnata in 6 giorni, con modulo appuntamenti in tre campi."
      }
    ]
  },

  /* --------------------------------------------------------------------------
     CONTATTI — colonna di sinistra della sezione form
     ------------------------------------------------------------------------ */
  contatti: {
    titolo: "Parliamone cinque minuti.",
    testo:
      "Ci racconti com'è fatta la tua attività, noi ti diciamo subito se possiamo esserti utili. " +
      "Se ha senso, prepariamo la demo e te la portiamo su tablet.",
    righe: [
      { voce: "Telefono e WhatsApp", chiave: "telefono" },
      { voce: "Email",               chiave: "email" },
      { voce: "Quando rispondiamo",  chiave: "orari" }
    ]
  },

  /* --------------------------------------------------------------------------
     FORM — configurazione Web3Forms e messaggi
     Il markup del modulo è dentro index.html (funziona anche senza JavaScript).
     ------------------------------------------------------------------------ */
  form: {
    // ⚠️ SOSTITUIRE con la chiave ricevuta via email da https://web3forms.com
    // (la chiave è pubblica per progetto: è pensata per stare nel codice sorgente)
    accessKey: "TUA_ACCESS_KEY_QUI",

    modalita: [
      { valore: "Appuntamento di 5 minuti", label: "Appuntamento di 5 minuti", submit: "Prenota i 5 minuti" },
      { valore: "Demo gratuita",            label: "Demo gratuita",            submit: "Richiedi la demo gratuita" }
    ],

    errori: {
      attivita: "Serve il nome dell'attività.",
      referente: "Scrivi nome e cognome di chi ci risponde.",
      telefono:  "Serve un numero valido per richiamarti.",
      email:     "Controlla l'indirizzo email.",
      privacy:   "Senza consenso privacy non possiamo ricontattarti."
    },

    successo: {
      occhiello: "Richiesta registrata",
      titolo:    "Grazie {nome}, ci sentiamo presto.",
      testo:     "Abbiamo preso nota della richiesta per {attivita}: {modalita}. Ti contattiamo al numero {telefono} entro un giorno lavorativo.",
      modalitaTesto: {
        "Appuntamento di 5 minuti": "una chiamata di cinque minuti",
        "Demo gratuita": "una demo gratuita da mostrarti su tablet"
      },
      dopoOcchiello: "Nel frattempo",
      dopoTesto: "Metti da parte cinque o sei foto della tua attività e gli orari aggiornati: con quelli in mano la demo è pronta in cinque giorni.",
      reset: "Invia un'altra richiesta"
    },

    errore: {
      occhiello: "Invio non riuscito",
      titolo: "Non siamo riusciti a inviare la richiesta.",
      testo: "Può capitare con una connessione instabile. Riprova tra un momento, oppure scrivici direttamente:",
      testoChiaveMancante: "Il modulo non è ancora collegato: inserisci la tua Web3Forms access key in assets/js/data.js. Nel frattempo puoi contattarci direttamente:",
      riprova: "Riprova"
    },

    invioInCorso: "Invio in corso…"
  },

  /* --------------------------------------------------------------------------
     FOOTER
     ------------------------------------------------------------------------ */
  footer: {
    descrizione: "Siti web per ristoranti, negozi e artigiani di Scandiano, Casalgrande, Albinea e Reggio Emilia.",
    colonneTitoli: { sede: "Sede", contatti: "Contatti", pagine: "Pagine" },
    privacyLabel: "Privacy Policy"
  }
};
