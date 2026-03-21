const lexend = { fontFamily: "'Lexend', sans-serif" };

const sections = [
    {
        number: '01',
        title: 'Chi siamo',
        content: (
            <p>
                ApexGPS è un progetto personale, non commerciale, dedicato a chi guida per piacere.
                Il titolare del trattamento dei dati è una persona fisica residente in Italia. Per
                qualsiasi domanda sulla privacy puoi scrivere a{' '}
                <a href="mailto:apexgps@gmail.com" className="text-orange-500 hover:underline">
                    apexgps@gmail.com
                </a>
                .
            </p>
        ),
    },
    {
        number: '02',
        title: 'Cosa raccogliamo e perché',
        content: (
            <>
                <p className="mb-6">
                    Raccogliamo solo i dati strettamente necessari al funzionamento del servizio.
                    Niente marketing, niente profilazione, niente pubblicità.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                        {
                            icon: '✉',
                            title: 'Email e password',
                            body: 'Raccolti in caso di registrazione tradizionale. La password è memorizzata in forma cifrata e non è mai leggibile da noi. Usati esclusivamente per autenticare il tuo accesso.',
                        },
                        {
                            icon: 'G',
                            title: 'Login con Google',
                            body: 'Se accedi con Google, riceviamo nome, email e immagine del profilo nei limiti delle autorizzazioni che concedi. Non accediamo a nessun altro dato del tuo account Google.',
                        },
                        {
                            icon: '◎',
                            title: 'Geolocalizzazione',
                            body: 'Usata per mostrare percorsi vicini e impostare il punto di partenza nel Planner. Viene elaborata nel browser o inviata ai nostri server solo per calcolare il percorso. Non è memorizzata in modo permanente senza tua azione esplicita.',
                        },
                        {
                            icon: '↗',
                            title: 'Percorsi salvati',
                            body: 'I percorsi che scegli di salvare — con punti di partenza, arrivo e waypoint — vengono memorizzati sul server associati al tuo account, per permetterti di ritrovarli e condividerli.',
                        },
                    ].map(card => (
                        <div
                            key={card.title}
                            className="bg-white rounded-xl p-5 border border-[#E8E4DC]"
                        >
                            <div className="flex items-center gap-3 mb-3">
                                <span
                                    className="w-8 h-8 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center text-sm font-semibold flex-shrink-0"
                                    style={lexend}
                                >
                                    {card.icon}
                                </span>
                                <span
                                    className="text-sm font-semibold text-[#1C1A18]"
                                    style={lexend}
                                >
                                    {card.title}
                                </span>
                            </div>
                            <p className="text-sm text-[#6B6760] leading-relaxed">{card.body}</p>
                        </div>
                    ))}
                </div>
            </>
        ),
    },
    {
        number: '03',
        title: 'Base giuridica del trattamento',
        content: (
            <p>
                Il trattamento dei dati si basa sul consenso dell'utente, espresso al momento della
                registrazione, e sull'esecuzione del contratto (fornitura del servizio richiesto).
                La geolocalizzazione viene trattata solo previo consenso esplicito del browser, che
                puoi revocare in qualsiasi momento dalle impostazioni del dispositivo.
            </p>
        ),
    },
    {
        number: '04',
        title: 'Conservazione dei dati',
        content: (
            <>
                <p className="mb-4">
                    I dati vengono conservati per tutto il tempo in cui il tuo account è attivo. In
                    caso di cancellazione dell'account, i dati personali associati vengono eliminati
                    entro 30 giorni, salvo obblighi di legge.
                </p>
                <p>
                    I log tecnici del server (indirizzi IP, orari di accesso) vengono conservati per
                    un massimo di 12 mesi per finalità di sicurezza e risoluzione di problemi,
                    dopodiché vengono eliminati o anonimizzati.
                </p>
            </>
        ),
    },
    {
        number: '05',
        title: 'Con chi condividiamo i dati',
        content: (
            <>
                <p className="mb-4">
                    I tuoi dati non vengono venduti né ceduti a terzi per scopi commerciali. Possono
                    essere condivisi esclusivamente con:
                </p>
                <ul className="space-y-3">
                    {[
                        {
                            label: 'Google',
                            desc: "Per l'autenticazione OAuth, nei limiti descritti al punto 02. Il trattamento da parte di Google è regolato dalla sua Privacy Policy.",
                        },
                        {
                            label: 'Fornitori di infrastruttura',
                            desc: "Servizi di hosting e database strettamente necessari all'erogazione del servizio, vincolati da accordi di riservatezza.",
                        },
                        {
                            label: 'Autorità competenti',
                            desc: "Solo se espressamente richiesto dalla legge o da un'autorità giudiziaria, nei limiti strettamente necessari.",
                        },
                    ].map(item => (
                        <li key={item.label} className="flex gap-3">
                            <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-orange-500 flex-shrink-0" />
                            <span className="text-[#3A3830] text-sm leading-relaxed">
                                <strong className="text-[#1C1A18] font-semibold">
                                    {item.label}
                                </strong>
                                {' — '}
                                {item.desc}
                            </span>
                        </li>
                    ))}
                </ul>
            </>
        ),
    },
    {
        number: '06',
        title: 'Cookie',
        content: (
            <>
                <p className="mb-4">
                    ApexGPS utilizza esclusivamente cookie tecnici necessari al funzionamento del
                    sito, come il cookie di sessione che mantiene attivo il tuo accesso.
                </p>
                <p>
                    Non utilizziamo cookie di profilazione, cookie pubblicitari o strumenti di
                    tracciamento di terze parti. Non è presente alcun sistema di analytics esterno.
                </p>
            </>
        ),
    },
    {
        number: '07',
        title: 'Sicurezza',
        content: (
            <p>
                Adottiamo misure tecniche ragionevoli per proteggere i tuoi dati — tra cui cifratura
                delle password, connessioni HTTPS e accesso limitato ai server. Nessun sistema di
                trasmissione su Internet è tuttavia sicuro al 100%: non possiamo garantire la
                sicurezza assoluta dei dati trasmessi verso il nostro servizio.
            </p>
        ),
    },
    {
        number: '08',
        title: 'Minori',
        content: (
            <p>
                ApexGPS non è destinato a persone di età inferiore ai 16 anni e non raccoglie
                consapevolmente dati personali di minori. Se vieni a conoscenza che un minore ha
                creato un account, ti chiediamo di contattarci a{' '}
                <a href="mailto:apexgps@gmail.com" className="text-orange-500 hover:underline">
                    apexgps@gmail.com
                </a>{' '}
                così da poter procedere con la cancellazione.
            </p>
        ),
    },
    {
        number: '09',
        title: 'Link a siti esterni',
        content: (
            <p>
                Il sito può contenere link a siti di terze parti. ApexGPS non ha controllo su questi
                siti e non è responsabile delle loro pratiche in materia di privacy. Ti consigliamo
                di consultare la privacy policy di ogni sito che visiti.
            </p>
        ),
    },
    {
        number: '10',
        title: 'I tuoi diritti',
        content: (
            <>
                <p className="mb-4">
                    In conformità al Regolamento UE 2016/679 (GDPR), hai il diritto di:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
                    {[
                        'Accedere ai tuoi dati personali',
                        'Richiederne la rettifica o la cancellazione',
                        'Opporti al trattamento o limitarlo',
                        'Richiedere la portabilità dei dati',
                        'Revocare il consenso in qualsiasi momento',
                        'Proporre reclamo al Garante Privacy',
                    ].map(right => (
                        <div
                            key={right}
                            className="flex items-center gap-2.5 bg-white rounded-lg px-4 py-3 border border-[#E8E4DC]"
                        >
                            <span className="w-1.5 h-1.5 rounded-full bg-orange-500 flex-shrink-0" />
                            <span className="text-sm text-[#3A3830]">{right}</span>
                        </div>
                    ))}
                </div>
                <p className="text-sm text-[#6B6760]">
                    Per esercitare questi diritti scrivi a{' '}
                    <a href="mailto:apexgps@gmail.com" className="text-orange-500 hover:underline">
                        apexgps@gmail.com
                    </a>
                    . Puoi inoltre rivolgerti al{' '}
                    <a
                        href="https://www.garanteprivacy.it"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-orange-500 hover:underline"
                    >
                        Garante per la Protezione dei Dati Personali
                    </a>
                    .
                </p>
            </>
        ),
    },
    {
        number: '11',
        title: 'Modifiche a questa policy',
        content: (
            <p>
                Questa pagina può essere aggiornata in caso di modifiche al servizio o alla
                normativa applicabile. In caso di modifiche sostanziali, ti informeremo tramite
                email o avviso visibile sul sito. La data di ultimo aggiornamento è sempre indicata
                in cima alla pagina.
            </p>
        ),
    },
];

export default function PrivacyPolicy() {
    const lastUpdate = new Date().toLocaleDateString('it-IT', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });

    return (
        <div className="bg-[#F5F3EC] min-h-screen">
            {/* Hero */}
            <div className="bg-[#F5F3EC] px-6 sm:px-10 md:px-16 xl:px-24 pt-20 sm:pt-28 pb-12 border-b border-[#E0DDD6]">
                <div className="mx-auto max-w-3xl">
                    <span className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.1em] uppercase text-orange-500 mb-6">
                        <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                        Documento legale
                    </span>
                    <h1
                        className="text-4xl sm:text-5xl font-extrabold tracking-[-0.03em] leading-[1.05] text-[#1C1A18] mb-4"
                        style={lexend}
                    >
                        Privacy{' '}
                        <span className="text-orange-500 font-light tracking-[-0.01em]">
                            Policy
                        </span>
                    </h1>
                    <p className="text-sm text-[#9A9590] font-light" style={lexend}>
                        Ultimo aggiornamento: {lastUpdate}
                    </p>
                </div>
            </div>

            {/* Intro */}
            <div className="px-6 sm:px-10 md:px-16 xl:px-24 pb-10">
                <div className="mx-auto max-w-3xl">
                    <p className="text-base sm:text-lg text-[#3A3830] leading-relaxed">
                        ApexGPS è un progetto personale dedicato a chi guida per piacere. Questa
                        pagina spiega in modo trasparente quali dati raccogliamo, perché lo facciamo
                        e come li proteggiamo.{' '}
                        <strong className="text-[#1C1A18] font-semibold">
                            Non vendiamo dati. Non facciamo profilazione. Non usiamo pubblicità.
                        </strong>
                    </p>
                </div>
            </div>

            {/* Sezioni */}
            <div className="px-6 sm:px-10 md:px-16 xl:px-24 py-16">
                <div className="mx-auto max-w-3xl space-y-12">
                    {sections.map(section => (
                        <div key={section.number} className="flex gap-6 sm:gap-10">
                            <div className="flex-shrink-0 pt-0.5">
                                <span
                                    className="text-[11px] font-semibold tracking-[0.1em] text-orange-500/60"
                                    style={lexend}
                                >
                                    {section.number}
                                </span>
                            </div>
                            <div className="flex-1 border-t border-[#E0DDD6] pt-4">
                                <h2
                                    className="text-lg font-extrabold tracking-[-0.02em] text-[#1C1A18] mb-4"
                                    style={lexend}
                                >
                                    {section.title}
                                </h2>
                                <div className="text-[#3A3830] text-sm sm:text-base leading-relaxed">
                                    {section.content}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Footer pagina */}
            <div className="px-6 sm:px-10 md:px-16 xl:px-24 pb-16">
                <div className="mx-auto max-w-3xl border-t border-[#E0DDD6] pt-8">
                    <p className="text-xs text-[#B0ABA4] leading-relaxed">
                        Questo documento è redatto in conformità al Regolamento UE 2016/679 (GDPR) e
                        al D.Lgs. 196/2003 come modificato dal D.Lgs. 101/2018. Per domande scrivi a{' '}
                        <a
                            href="mailto:apexgps@gmail.com"
                            className="text-orange-500 hover:underline"
                        >
                            apexgps@gmail.com
                        </a>
                        .
                    </p>
                </div>
            </div>
        </div>
    );
}
