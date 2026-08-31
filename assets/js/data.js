/* ============================================================================
   FR STUDIO — CONTENUTI DEL SITO (VERSIONE IRONICA & ESILARANTE)
   ----------------------------------------------------------------------------
   Questo è l'UNICO file da modificare per aggiornare i testi del sito.
   Dopo una modifica lancia `npm run build` (oppure `npm run dev`, che compila
   e apre il server): i contenuti finiscono scritti dentro le pagine HTML.
   ========================================================================== */

window.FR_DATA = {

  /* --------------------------------------------------------------------------
     SITO — dominio e identità, usati per canonical, Open Graph e sitemap
     ------------------------------------------------------------------------ */
  sito: {
    dominio: "https://www.frstudioweb.it",
    lingua: "it",
    ogImage: "assets/img/og.png",
    ogImageAlt: "FR Studio Web — siti web decenti per le attività di Scandiano"
  },

  /* --------------------------------------------------------------------------
     AGENZIA — dati usati in header, contatti, footer e informativa privacy
     ------------------------------------------------------------------------ */
  agenzia: {
    nome: "FR Studio Web",
    fondatori: "Pier Paolo Fantuzzi e Lorenzo Rossi",
    kicker: "Siti web che funzionano davvero · Scandiano (RE)",
    telefono: "339 256 2651",
    telefonoHref: "+393392562651",
    whatsappHref: "+393392562651",
    whatsappTesto: "Ciao! Ho un'attività a Scandiano e vorrei vedere una demo del sito.",
    email: "frstudio.re@gmail.com",
    emailPrivacy: "frstudio.re@gmail.com",
      orari: "Lun-Sab, 9-19",
    indirizzo: {
      via: "",
      cap: "42019",
      citta: "Scandiano",
      provincia: "RE",
      nota: "Su appuntamento: veniamo da te o ci vediamo davanti a un caffè."
    },
    geo: { lat: "", lon: "" },
    piva: "",
    zone: "Scandiano, Casalgrande, Albinea e Reggio Emilia",
    profili: []
  },

  /* --------------------------------------------------------------------------
     NAVIGAZIONE
     ------------------------------------------------------------------------ */
  nav: [
    { label: "Il metodo", href: "#metodo" },
    { label: "Servizi",   href: "#servizi" },
    { label: "Progetti",  href: "#progetti" },
    { label: "Contatti",  href: "#chiarimenti" }
  ],

  ctaHeader: { label: "Demo Personalizzata", href: "#contatti" },

  /* --------------------------------------------------------------------------
     BARRA MOBILE
     ------------------------------------------------------------------------ */
  barraMobile: {
    chiama: "Chiama",
    whatsapp: "WhatsApp",
    modulo: "Demo"
  },

  /* --------------------------------------------------------------------------
     HERO
     ------------------------------------------------------------------------ */
  hero: {
    occhiello: "Scandiano · Reggio Emilia",
    occhielloDestra: "La tua impresa",
    titolo: "Non siamo geni del marketing, facciamo solo siti che funzionano dannatamente bene. Guarda la demo gratis.",
    sottotitolo:
      "Non chiediamo anticipi: realizziamo prima la demo per la tua attività, " +
      "te la mostriamo dal vivo davanti a un caffè e poi decidi con calma, senza pagare nulla.",
    cta: [
      { label: "Richiedi la demo gratuita", href: "#contatti",  variante: "primario" },
      { label: "Guarda le anteprime",       href: "#progetti",  variante: "secondario" }
    ],
    badge: [
      { titolo: "Zero Rischi",       nota: "Paghi solo quando il sito ti convince", icona: "scudo" },
      { titolo: "Sviluppo con IA",   nota: "Demo pronta in 48 ore", icona: "ia" },
      { titolo: "100% Mobile",       nota: "Si legge bene anche sul divano", icona: "mobile" },
      { titolo: "Persone Vere",      nota: "Ci trovi al bar a Scandiano", icona: "persone" }
    ],
    breve: {
      titolo: "Sintesi spietata",
      righe: [
        { voce: "Anticipo richiesto", valore: "0 €" },
        { voce: "Demo pronta in",     valore: "2 giorni" },
        { voce: "Analisi iniziale",   valore: "Gratis" },
        { voce: "Sede reale",         valore: "Scandiano (RE)" }
      ],
      nota: "Veniamo noi nel tuo negozio o laboratorio negli orari in cui c'è meno casino."
    }
  },

  /* --------------------------------------------------------------------------
     IL NOSTRO METODO
     ------------------------------------------------------------------------ */
  metodo: {
    titolo: "Il nostro metodo",
    sommario: "Tre passaggi chiarissimi. Nessun 'funnel di conversion-growth', solo buon senso emiliano.",
    step: [
      {
        num: "01",
        titolo: "Check-up della tua presenza online",
        testo:
          "Diamo un'occhiata a cosa trova la gente quando ti cerca su Google: perché la tua scheda " +
          "dice ancora che sei chiuso per ferie nel 2021 e cosa combinano i tuoi concorrenti a due strade di distanza.",
        meta: ""
      },
      {
        num: "02",
        titolo: "Demo pronta per la tua attività",
        testo:
          "Costruiamo il sito VERO prima di chiederti 1 €. Testi, foto e menu già impaginati. " +
          "Te lo mostriamo dal vivo: se ti piace si va online, altrimenti amici come prima e lo cancelliamo.",
        meta: ""
      },
      {
        num: "03",
        titolo: "Messa online & Sopportazione continua",
        testo:
          "Il dominio è tuo al 100%, intestato a te. Quando devi cambiare gli orari di Ferragosto o il prezzo della gramigna, " +
          "ci mandi un vocale su WhatsApp e lo sistemiamo prima che finisca la giornata.",
        meta: ""
      }
    ]
  },

  /* --------------------------------------------------------------------------
     SERVIZI
     ------------------------------------------------------------------------ */
  servizi: {
    titolo: "Cosa facciamo (e cosa non ti serve)",
    sommario: "Soltanto ciò che serve per lavorare a Scandiano, con un'attenzione meticolosa a ogni dettaglio.",
    voci: [
      {
        num: "01",
        titolo: "Siti Vetrina Anti-Ragnatele",
        testo:
          "Una pagina sola, velocissima, che si carica anche con 1 tacca di telefono in cantina. " +
          "Chi sei, cosa vendi, dove sei e il bottone gigante per chiamarti senza dover copiare il numero a penna.",
        punti: ["Zero fronzoli, carica all'istante", "Dominio tuo, non in ostaggio"],
        meta: "Pronto in 2 giorni"
      },
      {
        num: "02",
        titolo: "Manutenzione 'Ci Pensiamo Noi'",
        testo:
          "Hai aumentato i prezzi? Cambiato gli orari della domenica? Non devi fare corsi di informatica: " +
          "ci mandi un messaggio e aggiorniamo noi tutto. Tu pensa a lavorare.",
        punti: ["Aggiornamenti in giornata", "Un referente unico (Lorenzo)"],
        meta: "Risposta rapida garantita"
      }
    ]
  },

  /* --------------------------------------------------------------------------
     PERCHE NOI
     ------------------------------------------------------------------------ */
  percheNoi: {
    titolo: "Perché noi",
    sommario: "Un lavoro accurato, un rapporto diretto e qualcuno che resta presente anche dopo la pubblicazione.",
    voci: [
      {
        num: "01",
        titolo: "Attenzione ai dettagli",
        testo: "Controlliamo testi, spaziature, immagini e comportamento su ogni schermo prima di consegnare il sito."
      },
      {
        num: "02",
        titolo: "Rapporto diretto",
        testo: "Parli sempre con noi, senza call center o passaggi inutili: le decisioni restano semplici e veloci."
      },
      {
        num: "03",
        titolo: "Assistenza locale",
        testo: "Siamo a Scandiano e continuiamo a seguirti per aggiornamenti, orari, servizi e nuove esigenze."
      }
    ]
  },

  /* --------------------------------------------------------------------------
     CHI SIAMO
     ------------------------------------------------------------------------ */
  chiSiamo: {
    occhiello: "Chi ti risponde davvero",
    nome: "Lorenzo Rossi",
    ruolo: "Sviluppatore & Domatore di Pixel · Scandiano (RE)",
    testo:
      "Niente call center o risponditori automatici: al telefono e su WhatsApp rispondo io in carne e ossa. " +
          "Per la creazione dei siti web facciamo uso anche dell'Intelligenza Artificiale, che ci permette di abbattere i tempi e prepararti una demo su misura in appena 48 ore, controllata con attenzione in ogni dettaglio. " +
      "Se il sito ha un problema, hai un riferimento diretto qui a Scandiano.",
    foto: "",
    fotoAlt: "Lorenzo Rossi — FR Studio"
  },

  /* --------------------------------------------------------------------------
     ANTEPRIMA PROGETTI
     ------------------------------------------------------------------------ */
  progetti: {
    titolo: "Esempi pratici (prima che ci credi sulla parola)",
    sommario: "Tre dimostrazioni di come trasformiamo un'attività locale in una macchina da contatti pulita e moderna.",
    nota: "Le demo restano online 30 giorni: se non le attivi, le eliminiamo senza chiederti un centesimo.",
    disclaimer: "Esempi dimostrativi realizzati da FR Studio per mostrare come lavoriamo.",
    etichettaAnteprima: "Anteprima interattiva",
    elenco: [
      {
        nome: "Trattoria del Boiardo",
        categoria: "Cucina emiliana · Scandiano centro",
        settore: "ristoranti",
        dominio: "trattoriadelboiardo.it",
        meta: "Sito vetrina + menu leggero",
        swatch: "#E7E2D8",
        etichettaFoto: "Tortelli di zucca e sala",
        occhiello: "Aperto mar-dom, 12-14:30 / 19-22:30",
        claim: "Il tortello di zucca come dio comanda, con menu digitale che si legge SENZA scaricare PDF da 50MB.",
        testo:
          "Menu del giorno aggiornato prima del servizio pranzo, prenotazione del tavolo in un tap e zero euro regali alle app di consegne.",
        cta: "Prenota un tavolo",
        nav: ["Menu", "Sala", "Dove siamo"],
        piede: ["Piazza Boiardo 6, Scandiano", "45 coperti + cortile estivo", "Prenotazioni dirette al telefono"],
        didascalia: "Demo consegnata in 4 giorni, attivata subito dopo il primo assaggio dei tortelli."
      },
      {
        nome: "Bottega 14",
        categoria: "Abbigliamento donna · Via Vallisneri",
        settore: "negozi",
        dominio: "bottega14scandiano.it",
        meta: "Vetrina + 'Tienimelo su WhatsApp'",
        swatch: "#E3E5E7",
        etichettaFoto: "Vetrina e nuovi arrivi",
        occhiello: "Lun-Sab, 9:30-13 / 15:30-19:30",
        claim: "La vetrina per chi dice 'non ho niente da mettermi' mentre cazzeggia sul divano.",
        testo:
          "Nuovi arrivi pubblicati ogni settimana. La cliente vede il capo dal telefono, ti manda il messaggio 'Tienimelo da parte!' e passa a provarlo il pomeriggio.",
        cta: "Scrivici su WhatsApp",
        nav: ["Novità", "Marchi", "Dove siamo"],
        piede: ["Via Vallisneri 14, Scandiano", "Prenotazione capi immediata", "Ritiro in negozio"],
        didascalia: "Demo consegnata in 2 giorni: ordini e richieste centralizzati su un solo numero."
      },
      {
        nome: "Autofficina Rinaldi",
        categoria: "Meccanico e gommista · Zona artigianale",
        settore: "artigiani",
        dominio: "autofficinarinaldi.it",
        meta: "Vetrina + Richiesta tagliando",
        swatch: "#DFE2DE",
        etichettaFoto: "Officina e ponti di sollevamento",
        occhiello: "Lun-Ven, 8-12:30 / 14-18:30",
        claim: "Tagliandi e revisioni spiegate in italiano, senza tecnicismi inutili.",
        testo:
          "Modulo in 3 campi per richiedere il preventivo mentre si hanno le mani sporche di grasso. Promemoria revisione inviato in automatico.",
        cta: "Richiedi preventivo",
        nav: ["Servizi", "Revisioni", "Contatti"],
        piede: ["Via dell'Artigianato 27, Scandiano", "Revisioni ministeriali", "Auto di cortesia disponibile"],
        didascalia: "Demo consegnata in 6 giorni con un modulo di prenotazione semplice da usare."
      }
    ]
  },

  /* --------------------------------------------------------------------------
     DOMANDE FREQUENTI
     ------------------------------------------------------------------------ */
  faq: {
    titolo: "Domande che ci fanno tutti",
    sommario: "Le risposte chiare alle domande che ci fanno più spesso.",
    voci: [
      {
        domanda: "Il dominio è mio o ve lo tenete in ostaggio?",
        risposta:
          "Tuo al 100%! Lo registriamo con i tuoi dati e la tua email. " +
          "Il sito resta tuo: puoi trasferirlo quando vuoi, senza vincoli."
      },
      {
        domanda: "Se dopo aver visto la demo il sito non mi convince, quanto vi devo?",
        risposta:
          "Esattamente zero euro e zero centesimi. L'analisi e la demo sono a rischio nostro: " +
          "se non ti convince, interrompiamo il progetto senza alcun costo."
      },
      {
        domanda: "Devo scrivervi io i testi in italiano accademico?",
        risposta:
          "I testi li scriviamo noi in italiano chiaro, senza parole astruse. " +
          "Tu devi solo dirci cosa fai di bello e mandarci qualche foto fatta col telefono."
      },
      {
        domanda: "In quanto tempo sarà pronto e online il mio sito web?",
        risposta:
          "2 giorni per l'analisi iniziale, 2 giorni per la demo personalizzata. " +
          "Appena ci dai il via libera, in 48 ore siamo online col tuo dominio ufficiale."
      },
      {
        domanda: "Cosa succede l'anno prossimo? Il prezzo cambia?",
        risposta:
          "Nessun inganno da contratto telefonico! L'hosting lo crea il cliente, " +
          "mentre noi pensiamo alla manutenzione continua del sito, ai certificati di sicurezza, ai backup quotidiani e a tutte le modifiche di orari e menu. " +
          "Zero vincoli: disdici quando vuoi."
      },
      {
        domanda: "Come faccio ad aggiornare i prezzi o gli orari? Devo fare un corso?",
        risposta:
          "Assolutamente no! Nessun corso e nessun pannello di controllo complicato. " +
          "Quando devi cambiare un prezzo, un orario o un piatto nel menu, ci mandi un semplice messaggio " +
          "o un vocale su WhatsApp e lo aggiorniamo noi entro la giornata."
      },
      {
        domanda: "Utilizzate anche l'intelligenza artificiale per creare i siti?",
        risposta:
          "Sì! Per la creazione dei siti web facciamo uso anche dell'Intelligenza Artificiale. " +
          "Ci permette di velocizzare la stesura dei testi, la grafica e la struttura del codice, così da consegnarti una demo perfetta in sole 48 ore mantenendo costi bassi e qualità altissima, sempre sotto la nostra regia e revisione."
      }
    ]
  },

  /* --------------------------------------------------------------------------
     CONTATTI
     ------------------------------------------------------------------------ */
  contatti: {
    titolo: "Hai dubbi o vuoi capire se siamo simpatici?",
    testo:
      "Scrivici o chiamaci senza timore: risponde Lorenzo direttamente, non una voce sintetica che ti mette in attesa con la musica di sottofondo.",
    righe: [
      { voce: "Telefono",           chiave: "telefono" },
      { voce: "WhatsApp",           chiave: "whatsapp" },
      { voce: "Email",              chiave: "email" }
    ]
  },

  /* --------------------------------------------------------------------------
     FORM
     ------------------------------------------------------------------------ */
  form: {
    accessKey: "102c74b9-fb37-4548-a08c-77ca567e8451",
    redirect: "grazie.html",

    modalita: [
      {
        valore: "Chiacchierata rapida di 5 min",
        label: "Chiacchierata rapida",
        badge: "5 minuti",
        descrizione: "Telefonata informale di 5 min per conoscerci, fare domande e chiarire ogni dubbio senza alcun impegno.",
        submit: "Prenota la chiacchierata (5 min)",
        icona: "telefono"
      },
      {
        valore: "Demo gratuita personalizzata",
        label: "Demo gratuita personalizzata",
        badge: "Bozza in 48 ore",
        descrizione: "Realizziamo una vera anteprima del tuo sito web su misura prima ancora che tu spenda 1€. Te la mostriamo dal vivo o online.",
        submit: "Richiedi la tua Demo Gratuita",
        icona: "ia"
      }
    ],

    errori: {
      attivita: "Ci serve il nome della tua attività!",
      referente: "Dicci come ti chiami, così sappiamo con chi parlare.",
      telefono:  "Metti un numero di telefono vero per farti ricontattare.",
      email:     "Controlla l'email, c'è un refuso.",
      disponibilita: "Scegli un giorno ed una data futuri.",
      incontro:  "Dicci se preferisci di persona o su Google Meet.",
      privacy:   "Senza spuntare la privacy non possiamo legalmente risponderti."
    },

    successo: {
      occhiello: "Richiesta registrata!",
      titolo:    "Grande {nome}! Ci sentiamo a brevissimo.",
      testo:     "Abbiamo preso nota per {attivita}: {modalita}. Ti chiamiamo al numero {telefono} entro un giorno lavorativo senza disturbarti negli orari di punta.",
      modalitaTesto: {
        "Chiacchierata rapida di 5 min": "una telefonata rapida di 5 minuti",
        "Demo gratuita personalizzata": "una demo spietata e bellissima fatta per la tua attività"
      },
      dopoOcchiello: "Nel frattempo",
      dopoTesto: "Prepara 4 o 5 foto carine del tuo locale/negozio e gli orari aggiornati: così la demo sarà pronta alla velocità della luce.",
      reset: "Invia un'altra richiesta"
    },

    errore: {
      occhiello: "Qualcosa è andato storto",
      titolo: "I cavi internet hanno fatto i capricci.",
      testo: "Non siamo riusciti ad inviare il modulo. Riprova oppure scrivici direttamente su WhatsApp:",
      testoChiaveMancante: "Il modulo attende la chiave Web3Forms in assets/js/data.js. Nel frattempo contattaci direttamente:",
      riprova: "Riprova ora"
    },

    invioInCorso: "Invio in corso (incrociamo le dita)…"
  },

  /* --------------------------------------------------------------------------
     PRIVACY POLICY
     ------------------------------------------------------------------------ */
  privacy: {
    titoloPagina: "Privacy Policy — FR Studio Web",
    titolo: "Privacy Policy — versione umana ed ex art. 13 Reg. UE 2016/679",
    aggiornamento: "Ultimo aggiornamento: agosto 2026",
    intro:
      "Questo è un sito statico e pulito: **zero cookie di profilazione e nessun tracciamento pubblicitario** " +
      "e zero tracciamenti invasivi. I dati che scrivi nel modulo servono solo ed esclusivamente a farti ricontattare da noi.",
    blocchi: [
      {
        titolo: "Titolare del trattamento",
        testo: "{titolare}. Email: {emailPrivacy}"
      },
      {
        titolo: "Quali dati raccogliamo",
        testo:
          "Solo quelli che inserisci spontaneamente nel modulo: nome dell'attività, tuo nome, telefono, " +
          "email e note. Nessun algoritmo traccia cosa hai mangiato a pranzo."
      },
      {
        titolo: "Finalità e base giuridica",
        testo:
          "I dati servono unicamente a fissare l'appuntamento o mostrati la demo (art. 6.1.b) " +
          "e a ricontattarti con il tuo consenso (art. 6.1.a). Non invieremo newsletter non richieste."
      },
      {
        titolo: "Cookie e Google Fonts",
        testo:
          "Zero cookie di profilazione. I font sono caricati direttamente dai nostri server locale: " +
          "**nessun dato passa a Google o altri colossi** mentre navighi qui."
      },
      {
        titolo: "Conservazione e destinatari",
        testo:
          "Teniamo i dati per 24 mesi dall'ultimo contatto. L'unico servizio di terze parti coinvolto nell'invio del modulo è Web3Forms."
      },
      {
        titolo: "I tuoi diritti",
        testo:
          "Puoi chiedere in qualsiasi momento di cancellare o modificare i tuoi dati scrivendo a {emailPrivacy}. Saremo felici di accontentarti subito."
      }
    ],
    nota:
      "⚠️ Informativa in attesa di verifica legale finale.",
    chiudi: "Chiudi",
    ritorno: "Torna al sito"
  },

  /* --------------------------------------------------------------------------
     PAGINA DI RINGRAZIAMENTO
     ------------------------------------------------------------------------ */
  grazie: {
    titoloPagina: "Richiesta ricevuta! — FR Studio Web",
    occhiello: "Richiesta registrata",
    titolo: "Ottimo lavoro! Abbiamo ricevuto la tua richiesta.",
    testo:
      "Ti ricontattiamo entro un giorno lavorativo negli orari in cui c'è meno casino nel tuo locale. " +
      "Se hai fretta, mandaci subito un messaggio su WhatsApp!",
    dopoOcchiello: "Cosa fare adesso",
    dopoTesto:
      "Raccogli 4 o 5 foto carine del tuo locale e gli orari di apertura: con quelle la demo sarà pronta in pochissimi giorni.",
    ritorno: "Torna alla home"
  },

  /* --------------------------------------------------------------------------
     PAGINA 404
     ------------------------------------------------------------------------ */
  errore404: {
    titoloPagina: "Pagina sparita nel nulla — FR Studio Web",
    occhiello: "Errore 404",
    titolo: "Ops! Questa pagina non esiste.",
    testo:
      "Forse l'indirizzo è sbagliato o ci siamo scordati di crearla mentre mangiavamo un erbazzone. " +
      "Niente panico: dalla home trovi tutto quello che ti serve.",
    ritorno: "Torna in salvo alla home"
  },

  /* --------------------------------------------------------------------------
     PAGINE PER CATEGORIA
     ------------------------------------------------------------------------ */
  pagine: [
    {
      slug: "siti-web-ristoranti-scandiano",
      settore: "ristoranti",
      titoloPagina: "Siti web per ristoranti e trattorie a Scandiano — FR Studio Web",
      descrizione:
        "Sito web per ristoranti, trattorie e pizzerie. Menu sempre aggiornato che si legge SENZA scaricare PDF iperpesanti e zero commissioni.",
      occhiello: "Ristoranti e trattorie · Scandiano",
      titolo: "Il sito del tuo ristorante, con il menu che la gente riesce ADDIRITTURA a leggere.",
      sottotitolo:
        "Chi ti cerca la sera vuole 3 cose: leggere il menu subito (senza scaricare PDF da 60 Megabyte), capire gli orari e chiamarti con un tap. Zero commissioni sui coperti.",
      punti: [
        "Menu del giorno aggiornabile al volo via WhatsApp",
        "Prenotazioni dirette al telefono: zero euro a piattaforme terze",
        "Foto dei piatti e dei tortelli impaginate a dovere",
        "Orari e festivi sempre sincronizzati con Google"
      ],
      progetti: [0]
    },
    {
      slug: "siti-web-negozi-scandiano",
      settore: "negozi",
      titoloPagina: "Siti web per negozi e botteghe a Scandiano — FR Studio Web",
      descrizione:
        "Sito web per negozi e botteghe a Scandiano. Novità in vetrina, prenotazione capi su WhatsApp e ritiro in negozio.",
      occhiello: "Negozi e botteghe · Scandiano",
      titolo: "La tua vetrina da mostrare a chi sta cazzeggiando sul divano.",
      sottotitolo:
        "Le novità della settimana viste dal telefono e il tasto WhatsApp 'Tienimelo da parte!' per far venire la gente in negozio prima che vada su Amazon.",
      punti: [
        "Novità e collezioni aggiornate in 5 minuti",
        "Tasto 'Tienimelo da parte' via WhatsApp per il ritiro in bottega",
        "Orari e chiusure straordinarie aggiornati su Google",
        "Nessun catalogo infinito da compilare: ci occupiamo noi delle foto"
      ],
      progetti: [1]
    },
    {
      slug: "siti-web-artigiani-scandiano",
      settore: "artigiani",
      titoloPagina: "Siti web per artigiani e officine a Scandiano — FR Studio Web",
      descrizione:
        "Sito web per artigiani, officine e idraulici a Scandiano. Richieste di preventivo e appuntamenti in 3 campi puliti.",
      occhiello: "Artigiani e officine · Scandiano",
      titolo: "Preventivi e appuntamenti senza dover rispondere al telefono con le mani sporche.",
      sottotitolo:
        "Un modulo di 3 campi che ti manda la richiesta su WhatsApp: la leggi quando hai un secondo libero, e intanto il cliente sa che l'hai ricevuta.",
      punti: [
        "Richiesta di appuntamento in 3 campi facilissimi",
        "Le notifiche arrivano su WhatsApp mentre sei al lavoro",
        "Foto dei lavori finiti e della tua officina",
        "Zona servita in evidenza per chi cerca 'vicino a me'"
      ],
      progetti: [2]
    }
  ],

  /* --------------------------------------------------------------------------
     FOOTER
     ------------------------------------------------------------------------ */
  footer: {
    descrizione: "Siti web simpatici e che funzionano davvero per ristoranti, negozi e artigiani di Scandiano e dintorni.",
    colonneTitoli: { sede: "Dove siamo", contatti: "Contatti rapidi", pagine: "Specialità" },
    privacyLabel: "Privacy Policy",
    pagineExtra: []
  }
};
