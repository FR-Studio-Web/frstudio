/* ============================================================================
   FR STUDIO — CONTENUTI DEL SITO
   ----------------------------------------------------------------------------
   Questo è l'UNICO file da modificare per aggiornare i testi del sito.
   Dopo una modifica lancia `npm run build` (oppure `npm run dev`, che compila
   e apre il server): i contenuti finiscono scritti dentro le pagine HTML.

   I valori marcati con  ⚠️ SOSTITUIRE  sono segnaposto: vanno rimpiazzati con
   i dati reali dell'agenzia prima della pubblicazione.
   ========================================================================== */

window.FR_DATA = {

  /* --------------------------------------------------------------------------
     SITO — dominio e identità, usati per canonical, Open Graph e sitemap
     ------------------------------------------------------------------------ */
  sito: {
    dominio: "https://www.frstudioweb.it",
    lingua: "it",
    ogImage: "assets/img/og.png",
    ogImageAlt: "FR Studio — siti web per le attività locali di Scandiano"
  },

  /* --------------------------------------------------------------------------
     AGENZIA — dati usati in header, contatti, footer e informativa privacy

     I campi `indirizzo.via`, `piva` e `geo` possono restare VUOTI: il sito si
     adatta da solo, omettendo la riga invece di stampare un campo a metà.
     Quando aprirete la partita IVA basta compilarli e rilanciare il build.
     ------------------------------------------------------------------------ */
  agenzia: {
    nome: "FR Studio",
    fondatori: "Pier Paolo Fantuzzi e Lorenzo Rossi",
    kicker: "Siti web per attività locali · Scandiano (RE)",
    telefono: "339 256 2651",
    telefonoHref: "+393392562651",                  // formato internazionale, senza spazi
    whatsappHref: "+393392562651",
    whatsappTesto: "Ciao! Ho un'attività a Scandiano e vorrei vedere una demo del sito.",
    // ⚠️ Il dominio include le caselle di posta: `info@frstudioweb.it` comunica
    //    un'altra cosa rispetto a un Gmail, per chi vende siti web.
    email: "frstudio.re@gmail.com",
    emailPrivacy: "frstudio.re@gmail.com",
    orari: "Lun-Sab, 9-19",
    indirizzo: {
      via: "",                                      // nessuna sede pubblica: si lavora su appuntamento
      cap: "42019",
      citta: "Scandiano",
      provincia: "RE",
      nota: "Su appuntamento, anche direttamente da te."
    },
    // Coordinate: da compilare quando ci sarà una sede da mostrare su Maps.
    geo: { lat: "", lon: "" },
    piva: "",                                       // ⚠️ da compilare all'apertura della partita IVA
    zone: "Scandiano, Casalgrande, Albinea e Reggio Emilia",
    // Profili pubblici (Facebook, Instagram, LinkedIn), usati nei dati strutturati.
    profili: []
  },

  /* --------------------------------------------------------------------------
     NAVIGAZIONE
     ------------------------------------------------------------------------ */
  nav: [
    { label: "Il metodo", href: "#metodo" },
    { label: "Servizi",   href: "#servizi" },
    { label: "Prezzi",    href: "#prezzi" },
    { label: "Progetti",  href: "#progetti" },
    { label: "Contatti",  href: "#contatti" }
  ],

  ctaHeader: { label: "Richiedi Demo Gratuita", href: "#contatti" },

  /* --------------------------------------------------------------------------
     BARRA MOBILE — fissa in basso sui telefoni, i due gesti che contano
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
     PREZZI

     ⚠️ LE CIFRE NON CI SONO ANCORA, in attesa dell'apertura della partita IVA.
     Il riquadro del prezzo si nasconde da solo finché `prezzo` è vuoto e mostra
     `prezzoNota` al suo posto; scrivendo la cifra ricompare, senza toccare il
     codice. Quando arriva il momento, compila `prezzo` e `ricorrente` dei primi
     due pacchetti e riscrivi `sommario` per dire che i prezzi sono in chiaro:
     è un vantaggio competitivo vero, vale la pena rivendicarlo.
     ------------------------------------------------------------------------ */
  prezzi: {
    titolo: "Quanto costa",
    sommario:
      "Ogni attività è diversa: dopo l'analisi gratuita ricevi un preventivo scritto, " +
      "prima che cominciamo. Paghi solo quando la demo ti convince.",
    pacchetti: [
      {
        num: "01",
        nome: "Vetrina",
        prezzo: "",                                 // ⚠️ es. "690 €"
        prezzoNota: "Su preventivo",
        ricorrente: "",                             // ⚠️ es. "+ 12 €/mese"
        per: "Negozi, artigiani, studi professionali.",
        punti: [
          "Sito di una pagina, testi e impaginazione inclusi",
          "Modulo contatti su email o WhatsApp",
          "Dominio .it intestato a te, primo anno incluso",
          "Scheda Google aggiornata"
        ],
        meta: "Consegna in 5 giorni"
      },
      {
        num: "02",
        nome: "Vetrina + prenotazioni",
        prezzo: "",                                 // ⚠️ es. "990 €"
        prezzoNota: "Su preventivo",
        ricorrente: "",                             // ⚠️ es. "+ 19 €/mese"
        per: "Ristoranti, parrucchieri, officine: chi lavora su appuntamento.",
        evidenza: true,
        punti: [
          "Tutto quello che c'è in Vetrina",
          "Menu o listino aggiornabile",
          "Richieste di prenotazione via WhatsApp",
          "Pagina dedicata per Google Maps"
        ],
        meta: "Consegna in 7 giorni"
      },
      {
        num: "03",
        nome: "Su misura",
        prezzo: "",
        prezzoNota: "Su preventivo",
        ricorrente: "",
        per: "Più sedi, e-commerce, cataloghi lunghi.",
        punti: [
          "Analisi iniziale sempre gratuita",
          "Preventivo scritto prima di iniziare",
          "Nessun costo finché non firmi"
        ],
        meta: "Ne parliamo in 5 minuti"
      }
    ],
    nota:
      "Il preventivo si divide in due voci: la realizzazione, una volta sola, e un canone mensile " +
      "che copre dominio, hosting, certificato di sicurezza, backup e le modifiche di orari, testi " +
      "e foto. Non è un abbonamento per usare il sito, che resta tuo, e non ha vincoli di durata.",
    cta: { label: "Richiedi l'analisi gratuita", href: "#contatti" }
  },

  /* --------------------------------------------------------------------------
     CHI SIAMO — un volto e un nome: in paese la fiducia passa da lì
     ------------------------------------------------------------------------ */
  chiSiamo: {
    occhiello: "Chi ti risponde",
    nome: "Lorenzo Rossi",
    ruolo: "FR Studio · Scandiano (RE)",
    // ⚠️ BOZZA: riscrivila con parole tue. È il pezzo di testo che, in un paese,
    //    fa più differenza di qualunque altra cosa scritta in questa pagina.
    testo:
      "Non c'è un centralino: al telefono e su WhatsApp rispondo io, e sono la stessa persona " +
      "che viene a trovarti in negozio e che poi ti aggiorna il sito. Se ti serve una modifica " +
      "scrivi a me, non a un modulo di assistenza.",
    // ⚠️ Metti una foto in assets/img/ (quadrata, minimo 400×400) e scrivi qui il
    //    percorso. Finché è vuoto compaiono le iniziali dentro un riquadro.
    foto: "",
    fotoAlt: ""
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
        settore: "ristoranti",
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
        settore: "negozi",
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
        settore: "artigiani",
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
     DOMANDE FREQUENTI
     Alimentano anche i dati strutturati FAQPage letti da Google.
     ------------------------------------------------------------------------ */
  faq: {
    titolo: "Domande che ci fanno sempre",
    sommario: "Le risposte che di solito diamo al telefono, scritte qui una volta per tutte.",
    voci: [
      {
        domanda: "Il dominio è mio o vostro?",
        risposta:
          "Tuo. Lo registriamo intestato alla tua attività, con la tua email di contatto. " +
          "Se un giorno vuoi cambiare fornitore te lo porti via, senza chiedere il permesso a nessuno."
      },
      {
        domanda: "Se dopo la demo non mi piace, quanto pago?",
        risposta:
          "Zero. L'analisi e la demo sono gratuite: se non ti convince cancelliamo tutto e " +
          "non ti arriva nessuna fattura. È il motivo per cui lavoriamo così."
      },
      {
        domanda: "I testi e le foto li devo preparare io?",
        risposta:
          "I testi li scriviamo noi e poi li correggi. Per le foto bastano cinque o sei scatti " +
          "fatti col telefono in una giornata di luce: se servono meglio, veniamo noi a farle."
      },
      {
        domanda: "Quanto ci vuole prima di essere online?",
        risposta:
          "Due giorni per l'analisi, cinque per la demo. Dal momento in cui dici di sì, " +
          "il sito è online con il tuo dominio in genere entro 48 ore."
      },
      {
        domanda: "Cosa succede dopo il primo anno?",
        risposta:
          "Continua il canone mensile, che copre dominio, hosting, certificato di sicurezza, " +
          "backup e le modifiche di orari, listini e foto. Nessun aumento a sorpresa e nessun " +
          "vincolo di durata: si disdice quando vuoi."
      },
      {
        domanda: "Devo imparare a usare qualcosa?",
        risposta:
          "No. Non ci sono pannelli da imparare né password da ricordare: quando cambia un orario " +
          "o un prezzo ci mandi un messaggio su WhatsApp e lo cambiamo noi, in giornata."
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
      { voce: "Telefono",           chiave: "telefono" },
      { voce: "WhatsApp",           chiave: "whatsapp" },
      { voce: "Email",              chiave: "email" },
      { voce: "Quando rispondiamo", chiave: "orari" }
    ]
  },

  /* --------------------------------------------------------------------------
     FORM — configurazione Web3Forms e messaggi
     Il markup del modulo è dentro index.template.html (funziona anche senza JS).
     ------------------------------------------------------------------------ */
  form: {
    // ⚠️ SOSTITUIRE con la chiave ricevuta via email da https://web3forms.com
    // (la chiave è pubblica per progetto: è pensata per stare nel codice sorgente)
    accessKey: "102c74b9-fb37-4548-a08c-77ca567e8451",

    // Pagina di conferma per chi invia senza JavaScript: generata da build.js
    redirect: "grazie.html",

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
     PRIVACY POLICY — informativa ex art. 13 Reg. UE 2016/679
     Sorgente unico: alimenta sia la modale sia la pagina privacy.html.

     Nei testi puoi usare  **grassetto**  e questi segnaposto, che si compilano
     da soli con i dati di `agenzia` — così un documento legale non può restare
     indietro rispetto al resto del sito:

        {titolare}   nome, fondatori, sede e P.IVA, saltando ciò che manca
        {nome}  {indirizzo}  {piva}
        {email}  {emailPrivacy}   diventano link cliccabili

     ⚠️ Far verificare l'informativa da un consulente prima di pubblicare.
     ------------------------------------------------------------------------ */
  privacy: {
    titoloPagina: "Privacy Policy — FR Studio",
    titolo: "Privacy Policy — informativa ex art. 13 Regolamento UE 2016/679",
    aggiornamento: "Ultimo aggiornamento: agosto 2026",   // ⚠️ da aggiornare a ogni revisione
    intro:
      "Questo è un sito statico: **non utilizza cookie di tracciamento o di profilazione**, " +
      "non installa strumenti di analisi del comportamento e non condivide dati con circuiti " +
      "pubblicitari. I dati che ci lasci nel modulo di contatto servono soltanto a ricontattarti.",
    blocchi: [
      {
        titolo: "Titolare del trattamento",
        testo: "{titolare}. Email: {emailPrivacy}"
      },
      {
        titolo: "Quali dati raccogliamo",
        testo:
          "Solo quelli che scrivi nel modulo: nome dell'attività, nome del referente, telefono, " +
          "email (facoltativa) e il messaggio. Nessun dato viene raccolto automaticamente " +
          "durante la navigazione."
      },
      {
        titolo: "Finalità e base giuridica",
        testo:
          "I dati servono a rispondere alla richiesta di appuntamento o di demo e alla trattativa " +
          "precontrattuale (art. 6.1.b) e, con il tuo consenso, a ricontattarti (art. 6.1.a). " +
          "Non facciamo marketing automatizzato né newsletter."
      },
      {
        titolo: "Cookie e strumenti di terze parti",
        testo:
          "Il sito non rilascia cookie propri di profilazione. I caratteri tipografici sono " +
          "ospitati sui nostri stessi server: **nessun dato viene inviato a Google Fonts** " +
          "o ad altri fornitori durante la semplice navigazione."
      },
      {
        titolo: "Conservazione e destinatari",
        testo:
          "Conserviamo i dati per 24 mesi dall'ultimo contatto. Vi accedono soltanto i fornitori " +
          "di invio modulo (Web3Forms), hosting e posta elettronica, nominati responsabili " +
          "ai sensi dell'art. 28."
      },
      {
        titolo: "I tuoi diritti",
        testo:
          "Puoi chiedere accesso, rettifica, cancellazione, limitazione, portabilità e opposizione " +
          "(artt. 15-22) scrivendo a {emailPrivacy}, oppure presentare reclamo al Garante per la " +
          "protezione dei dati personali. I campi contrassegnati con * sono necessari per gestire " +
          "la richiesta."
      }
    ],
    // ⚠️ RIMUOVERE questa nota quando l'informativa sarà stata verificata
    nota:
      "⚠️ Informativa non ancora verificata da un consulente: fallo prima di raccogliere " +
      "richieste dal modulo di contatto.",
    chiudi: "Chiudi",
    ritorno: "Torna al sito"
  },

  /* --------------------------------------------------------------------------
     PAGINA DI RINGRAZIAMENTO — mostrata dopo un invio senza JavaScript
     ------------------------------------------------------------------------ */
  grazie: {
    titoloPagina: "Richiesta inviata — FR Studio",
    occhiello: "Richiesta registrata",
    titolo: "Grazie, abbiamo ricevuto la tua richiesta.",
    testo:
      "Ti ricontattiamo entro un giorno lavorativo, negli orari in cui hai meno gente. " +
      "Se ti serve prima, chiamaci pure o scrivici su WhatsApp.",
    dopoOcchiello: "Nel frattempo",
    dopoTesto:
      "Metti da parte cinque o sei foto della tua attività e gli orari aggiornati: " +
      "con quelli in mano la demo è pronta in cinque giorni.",
    ritorno: "Torna al sito"
  },

  /* --------------------------------------------------------------------------
     PAGINA 404
     ------------------------------------------------------------------------ */
  errore404: {
    titoloPagina: "Pagina non trovata — FR Studio",
    occhiello: "Errore 404",
    titolo: "Questa pagina non c'è.",
    testo:
      "Forse l'indirizzo è stato scritto male, o la pagina è stata spostata. " +
      "Dalla home trovi tutto: metodo, servizi, prezzi e contatti.",
    ritorno: "Torna alla home"
  },

  /* --------------------------------------------------------------------------
     PAGINE PER CATEGORIA
     Una pagina per settore: intercettano le ricerche che portano clienti
     ("sito web per ristorante Scandiano"), che la sola home non può coprire.
     `progetti` contiene gli indici di progetti.elenco da mostrare.
     ------------------------------------------------------------------------ */
  pagine: [
    {
      slug: "siti-web-ristoranti-scandiano",
      settore: "ristoranti",
      titoloPagina: "Siti web per ristoranti e trattorie a Scandiano — FR Studio",
      descrizione:
        "Sito web per ristoranti, trattorie e pizzerie di Scandiano e Reggio Emilia. " +
        "Menu sempre aggiornato e prenotazioni senza commissioni sui coperti. Demo gratuita.",
      occhiello: "Ristoranti e trattorie · Scandiano",
      titolo: "Il sito del tuo ristorante, con il menu sempre giusto.",
      sottotitolo:
        "Chi ti cerca la sera vuole tre cose: il menu di oggi, gli orari veri e un numero da " +
        "chiamare. Te le mettiamo davanti in tre secondi, senza commissioni sui coperti.",
      punti: [
        "Menu del giorno che cambiamo noi, anche la mattina stessa",
        "Prenotazioni al telefono o su WhatsApp: nessuna commissione a coperto",
        "Foto dei piatti impaginate come si deve",
        "Scheda Google e orari festivi sempre allineati"
      ],
      progetti: [0]
    },
    {
      slug: "siti-web-negozi-scandiano",
      settore: "negozi",
      titoloPagina: "Siti web per negozi e botteghe a Scandiano — FR Studio",
      descrizione:
        "Sito web per negozi e botteghe di Scandiano e Reggio Emilia: novità in vetrina, " +
        "prenotazione dei capi su WhatsApp, ritiro in negozio. Demo gratuita, zero anticipo.",
      occhiello: "Negozi e botteghe · Scandiano",
      titolo: "La tua vetrina, anche per chi passa dal telefono.",
      sottotitolo:
        "Le novità della settimana viste da chi è a casa sul divano, e il messaggio che ti " +
        "arriva su WhatsApp per tenere da parte il capo fino a domani.",
      punti: [
        "Novità e collezioni aggiornate ogni settimana",
        "\"Tienimelo da parte\" via WhatsApp, con ritiro in negozio",
        "Orari, festivi e chiusure sempre corretti su Google",
        "Nessun catalogo da compilare: le foto le impaginiamo noi"
      ],
      progetti: [1]
    },
    {
      slug: "siti-web-artigiani-scandiano",
      settore: "artigiani",
      titoloPagina: "Siti web per artigiani e officine a Scandiano — FR Studio",
      descrizione:
        "Sito web per artigiani, officine e imprese edili di Scandiano e Reggio Emilia: " +
        "richieste di preventivo e appuntamenti in tre campi. Demo gratuita, zero anticipo.",
      occhiello: "Artigiani e officine · Scandiano",
      titolo: "Preventivi e appuntamenti, senza rispondere al telefono mentre lavori.",
      sottotitolo:
        "Un modulo di tre campi che ti manda la richiesta su WhatsApp: la leggi quando " +
        "hai le mani pulite, e intanto il cliente sa già che l'hai ricevuta.",
      punti: [
        "Richiesta di appuntamento in tre campi, non uno di più",
        "Le richieste arrivano su WhatsApp mentre sei in officina",
        "Lavori finiti in evidenza, con foto prima e dopo",
        "Zona servita ben chiara, per chi cerca \"vicino a me\""
      ],
      progetti: [2]
    }
  ],

  /* --------------------------------------------------------------------------
     FOOTER
     ------------------------------------------------------------------------ */
  footer: {
    descrizione: "Siti web per ristoranti, negozi e artigiani di Scandiano, Casalgrande, Albinea e Reggio Emilia.",
    colonneTitoli: { sede: "Sede", contatti: "Contatti", pagine: "Pagine" },
    privacyLabel: "Privacy Policy",
    // Link aggiuntivi verso le pagine generate
    pagineExtra: [
      { label: "Siti per ristoranti", href: "siti-web-ristoranti-scandiano.html" },
      { label: "Siti per negozi",     href: "siti-web-negozi-scandiano.html" },
      { label: "Siti per artigiani",  href: "siti-web-artigiani-scandiano.html" }
    ]
  }
};
