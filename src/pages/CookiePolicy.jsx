const lexend = { fontFamily: "'Lexend', sans-serif" };

const sections = [
    {
        number: '01',
        title: 'Cosa sono i cookie',
        content: (
            <p>
                I cookie sono piccoli file di testo che un sito web salva sul tuo dispositivo quando
                lo visiti. Vengono usati per far funzionare il sito correttamente o per fornire
                informazioni al gestore del sito.
            </p>
        ),
    },
    {
        number: '02',
        title: 'Quali cookie usa ApexGPS',
        content: (
            <>
                <p className="mb-4">
                    ApexGPS utilizza esclusivamente cookie tecnici, strettamente necessari al
                    funzionamento del servizio. Non utilizziamo cookie di profilazione, cookie
                    pubblicitari o strumenti di tracciamento di terze parti.
                </p>
                <div className="bg-white rounded-xl border border-[#E8E4DC] overflow-hidden">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-[#E8E4DC]">
                                <th
                                    className="text-left px-4 py-3 text-[11px] font-semibold text-[#9A9590] uppercase tracking-[0.08em]"
                                    style={lexend}
                                >
                                    Nome
                                </th>
                                <th
                                    className="text-left px-4 py-3 text-[11px] font-semibold text-[#9A9590] uppercase tracking-[0.08em]"
                                    style={lexend}
                                >
                                    Tipo
                                </th>
                                <th
                                    className="text-left px-4 py-3 text-[11px] font-semibold text-[#9A9590] uppercase tracking-[0.08em]"
                                    style={lexend}
                                >
                                    Finalità
                                </th>
                                <th
                                    className="text-left px-4 py-3 text-[11px] font-semibold text-[#9A9590] uppercase tracking-[0.08em]"
                                    style={lexend}
                                >
                                    Scadenza
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {[
                                {
                                    name: 'access_token',
                                    type: 'Sessione',
                                    purpose: 'Mantiene attiva la sessione di autenticazione',
                                    expiry: 'Fine sessione',
                                },
                                {
                                    name: 'apexgps_cookies_accepted',
                                    type: 'Persistente',
                                    purpose: 'Ricorda che hai preso visione di questa informativa',
                                    expiry: '1 anno',
                                },
                            ].map((row, i) => (
                                <tr
                                    key={row.name}
                                    className={i > 0 ? 'border-t border-[#E8E4DC]' : ''}
                                >
                                    <td className="px-4 py-3 font-mono text-[12px] text-[#1C1A18]">
                                        {row.name}
                                    </td>
                                    <td
                                        className="px-4 py-3 text-[13px] text-[#6B6760]"
                                        style={lexend}
                                    >
                                        {row.type}
                                    </td>
                                    <td
                                        className="px-4 py-3 text-[13px] text-[#6B6760]"
                                        style={lexend}
                                    >
                                        {row.purpose}
                                    </td>
                                    <td
                                        className="px-4 py-3 text-[13px] text-[#6B6760]"
                                        style={lexend}
                                    >
                                        {row.expiry}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </>
        ),
    },
    {
        number: '03',
        title: 'Cookie di terze parti',
        content: (
            <p>
                Se accedi tramite Google (OAuth), Google potrebbe impostare propri cookie sul tuo
                dispositivo secondo la sua{' '}
                <a
                    href="https://policies.google.com/privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-orange-500 hover:underline"
                >
                    Privacy Policy
                </a>
                . ApexGPS non ha controllo su questi cookie.
            </p>
        ),
    },
    {
        number: '04',
        title: 'Come disabilitare i cookie',
        content: (
            <>
                <p className="mb-4">
                    Puoi configurare il tuo browser per rifiutare tutti i cookie o per ricevere un
                    avviso prima che vengano salvati. Tieni presente che disabilitare i cookie
                    tecnici potrebbe compromettere il funzionamento del sito — in particolare il
                    mantenimento della sessione di accesso.
                </p>
                <ul className="space-y-2">
                    {[
                        {
                            browser: 'Chrome',
                            url: 'https://support.google.com/chrome/answer/95647',
                        },
                        {
                            browser: 'Firefox',
                            url: 'https://support.mozilla.org/it/kb/Attivare%20e%20disattivare%20i%20cookie',
                        },
                        {
                            browser: 'Safari',
                            url: 'https://support.apple.com/it-it/guide/safari/sfri11471/mac',
                        },
                        {
                            browser: 'Edge',
                            url: 'https://support.microsoft.com/it-it/microsoft-edge/eliminare-i-cookie-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09',
                        },
                    ].map(item => (
                        <li key={item.browser} className="flex gap-3 items-center">
                            <span className="w-1.5 h-1.5 rounded-full bg-orange-500 flex-shrink-0" />
                            <a
                                href={item.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-orange-500 hover:underline"
                                style={lexend}
                            >
                                Istruzioni per {item.browser}
                            </a>
                        </li>
                    ))}
                </ul>
            </>
        ),
    },
    {
        number: '05',
        title: 'Modifiche a questa policy',
        content: (
            <p>
                Questa pagina può essere aggiornata in caso di modifiche al servizio. La data di
                ultimo aggiornamento è sempre indicata in cima alla pagina. Per domande scrivi a{' '}
                <a href="mailto:privacy@apexgps.it" className="text-orange-500 hover:underline">
                    privacy@apexgps.it
                </a>
                .
            </p>
        ),
    },
];

export default function CookiePolicy() {
    const lastUpdate = new Date().toLocaleDateString('it-IT', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });

    return (
        <div className="bg-[#F5F3EC] min-h-screen">
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
                        Cookie{' '}
                        <span className="text-orange-500 font-light tracking-[-0.01em]">
                            Policy
                        </span>
                    </h1>
                    <p className="text-sm text-[#9A9590] font-light" style={lexend}>
                        Ultimo aggiornamento: {lastUpdate}
                    </p>
                </div>
            </div>

            <div className="px-6 sm:px-10 md:px-16 xl:px-24 pb-10 pt-12">
                <div className="mx-auto max-w-3xl">
                    <p className="text-base sm:text-lg text-[#3A3830] leading-relaxed">
                        Questa pagina spiega in modo trasparente quali cookie utilizza ApexGPS e
                        come puoi gestirli.{' '}
                        <strong className="text-[#1C1A18] font-semibold">
                            Usiamo solo cookie tecnici. Niente tracciamento, niente pubblicità.
                        </strong>
                    </p>
                </div>
            </div>

            <div className="px-6 sm:px-10 md:px-16 xl:px-24 py-8">
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

            <div className="px-6 sm:px-10 md:px-16 xl:px-24 pb-16 pt-4">
                <div className="mx-auto max-w-3xl border-t border-[#E0DDD6] pt-8">
                    <p className="text-xs text-[#B0ABA4] leading-relaxed">
                        Questo documento è redatto in conformità al Regolamento UE 2016/679 (GDPR),
                        alla Direttiva ePrivacy 2002/58/CE e al Provvedimento del Garante Privacy
                        dell'8 maggio 2014 sull'uso dei cookie.
                    </p>
                </div>
            </div>
        </div>
    );
}
