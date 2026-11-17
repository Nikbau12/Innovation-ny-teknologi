# ReStock landing page (venteliste)

En statisk side, der fortæller, at ReStock lancerer i marts 2027. Folk kan skrive sig op med deres
e-mail og få **boost på deres 5 første annoncer**. De får en personlig boost-kode på siden og på mail.

Tilmeldingerne gemmes i samme Firebase Realtime Database som appen, så efterspørgslen kan dokumenteres.

## Filer

```
index.html            Selve siden
style.css             Design (samme farver som appen)
app.js                Tilmelding, nedtælling, Firebase og mail
config.js             Firebase-config, EmailJS-nøgler, lanceringsdato
email-skabelon.html   HTML til bekræftelsesmailen (kopieres ind i EmailJS)
```

## Kør siden lokalt

Landing pagen er en selvstændig app og startes uafhængigt af Expo-appen:

```bash
cd landing
npm start
```

Åbn derefter http://localhost:3000. Stop med `Ctrl + C`.

Siden bruger JavaScript-moduler, så den skal køre via en webserver som ovenfor. Dobbeltklik på
`index.html` virker ikke.

## Opsætning af bekræftelsesmailen (EmailJS, gratis)

1. Opret en gratis konto på https://www.emailjs.com (200 mails/md. gratis)
2. **Email Services** -> Add New Service -> vælg fx Gmail og log ind med den mail, der skal sende
3. **Email Templates** -> Create New Template
   - **Subject:** `Du er på ventelisten til ReStock - her er din boost-kode`
   - **Content:** skift til kode-visning og indsæt indholdet af `email-skabelon.html`
   - **To Email:** `{{to_email}}`
   - **From Name:** `ReStock`
4. Kopiér **Service ID**, **Template ID** og **Public Key** (Account -> General) ind i `config.js`
5. Under Account -> Security kan du begrænse, hvilke domæner der må sende fra din nøgle

Står felterne tomme, virker tilmeldingen stadig, og koden vises på siden, men der sendes ingen mail.

## Data i databasen

```
Venteliste/{email}            email, navn, brugertype, postnummer, boostKode, boostAnnoncer,
                              kilde, samtykke, mailSendt, oprettet
VentelisteStatistik/antal     Samlet antal tilmeldte (vises på siden fra 10 og op)
VentelisteStatistik/brugertype/{privat|haandvaerker|virksomhed}
```

Nøglen er e-mailen med `.` skiftet ud med `,`, så den samme mail kun kan skrive sig op én gang.

**Se og eksportér tilmeldinger:** Firebase-konsollen -> Realtime Database -> `Venteliste` -> de tre prikker
-> *Export JSON*. JSON-filen kan åbnes i Excel (Data -> Hent data -> Fra JSON).

### Spor hvor tilmeldingerne kommer fra

Del linket med `?kilde=...`, fx `.../?kilde=instagram` eller `.../?kilde=flyer-bauhaus`. Kilden gemmes ved
hver tilmelding, så I kan se, hvilke kanaler der virker. Uden parameter gemmes den side, folk kom fra,
eller `direkte`.

## Sikkerhedsregler

Databasen kører i test mode, så alle kan læse alt - også ventelisten med e-mails. Før siden deles
offentligt, bør disse regler lægges ind ved siden af appens regler (Realtime Database -> Rules):

```json
"Venteliste": {
  ".read": false,
  "$email": {
    ".write": "!data.exists()",
    ".validate": "newData.hasChildren(['email', 'boostKode', 'oprettet'])"
  }
},
"VentelisteStatistik": {
  ".read": true,
  ".write": true
}
```

Så kan ingen udefra læse e-mails eller overskrive en tilmelding. Siden håndterer selv begge tilfælde.

## Læg siden online

**Firebase Hosting** (samme projekt):

```bash
npm install -g firebase-tools
firebase login
firebase init hosting      # public directory: landing, single-page app: No
firebase deploy --only hosting
```

Siden kommer så til at ligge på `https://innt-7578d.web.app`.

Alternativt kan mappen `landing` trækkes direkte ind på https://app.netlify.com/drop.
