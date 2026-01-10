# ApexGPS_Web

ApexGPS_Web è il frontend web del progetto **ApexGPS**, un servizio per la creazione
e visualizzazione di itinerari turistici panoramici.

L’applicazione consente all’utente di ricercare e personalizzare percorsi,
privilegiando strade panoramiche e sinuose rispetto alla sola velocità.
Il frontend comunica con un backend Django tramite API REST per la gestione
dei dati e dell’autenticazione.

## Tecnologie utilizzate
- React
- Vite
- JavaScript (JSX)
- HTML5
- CSS3

[![My Skills](https://skillicons.dev/icons?i=react,vite,js,html,css)](https://skillicons.dev)

## Struttura del progetto
Il progetto è organizzato secondo una struttura modulare:

- `src/components/` – componenti riutilizzabili (es. Navbar)
- `src/pages/` – pagine principali dell’applicazione (Home, Planner, Login, ecc.)
- `src/layout/` – layout principali dell’interfaccia
- `src/assets/` – risorse statiche
- `public/` – file pubblici

## Prerequisiti
Per eseguire il progetto è necessario avere installato:
- Node.js (versione LTS consigliata)
- npm

[![My Skills](https://skillicons.dev/icons?i=nodejs,npm)](https://skillicons.dev)


## Esegure il Progetto

Per eseguire il progetto in modalità sviluppo utilizza la configurazione di avvio
nel tuo IDE oppure avvia l'applicazione direttamente da terminale utilizzando uno
dei seguenti comandi:

- **Modalità Sviluppo** (con hot-reload):
    ```shell
        npm run dev
    ```
- **Modalità Produzione**:
    ```shell
        npm run build
    ```
- **Anteprima della Build  di Produzione**
    ```shell
        npm run preview
    ```

Dopo aver eseguito `npm run build`, potrai avviare un server locale per visualizzare
l'applicazione ottimizzata per la produzione con il comando `npm run preview`.

### Controllo del codice con ESLint
Questo comando esegue ESLint per analizzare il codice sorgente e identificare
potenziali problemi, errori di sintassi, violazioni delle convenzioni di stile e
pratiche di codice non ottimali. Aiuta a mantenere il codice pulito, consistente e
di qualità.
- **Controllo del codice**
    ```shell
        npm run lint
    ```

### Formattazione del codice con Prettier
Questo comando esegue Prettier per formattare automaticamente ilc odice secondo regole
predefinite. Prettier riscrive il codice sorgente in un formato standardizzato,
assicurando consistenza nello stile di formattazione (indentazioni, lunghezza delle righe,
virgolette, etc.) in tutto il progetto, eliminando le discussioni sullo stile durante le
revisioni del codice.
- **Uinificazione dello Stile**
    ```shell
        npm run format
    ```