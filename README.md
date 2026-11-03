# ReStock

Mobilapp til køb og salg af overskydende byggematerialer. Håndværkere og private kan
sælge eller forære materialer væk, som ellers ville ende i containeren, og andre kan
finde billige materialer i nærheden.

## Links

- **GitHub:** https://github.com/Nikbau12/Innovation-ny-teknologi 
- **Demovideo:** https://youtu.be/ljNQOf-DfD4 

## Sådan kører du appen

```bash
npm install
npx expo start
```

Scan derefter QR-koden med Expo Go-appen på din telefon.
Husk at udfylde `database/firebase.js` med din egen Firebase-config først (se nedenfor).

## Hvad appen kan

- **Konto** - opret konto med navn, e-mail, telefon, postnummer/by og brugertype (privat, håndværker
  eller virksomhed). Glemt kodeord sender et link på mail
- **Forside** - søgefelt, tal for aktive og gratis opslag, kategorier, nyeste opslag, gratis opslag
  og en kort guide til, hvordan appen virker
- **Søg (oversigt)** - opslag vist i et gitter eller på et kort. Fritekstsøgning og hurtigvalg af kategori
- **Filtre** - sortering (nyeste, ældste, pris, nærmest), afstand fra din placering eller et postnummer
  (5-200 km), kategori, type og materialespecifikke egenskaber (fx træsort, styrkeklasse og behandling
  for træ, eller pladetype, tykkelse og kant for gips), stand, pris fra/til, kun gratis, mindste
  længde/bredde/tykkelse/mængde, levering, sælgertype, kun med billede og vis solgte
- **Opret opslag** - billede (kamera eller galleri), titel, beskrivelse, mærke, kategori med type og
  specifikationer, stand, mængde og enhed, mål i mm, pris (fast, til forhandling eller gratis, samlet
  eller pr. enhed), levering og placering på et kort
- **Opslag** - billede, pris, specifikationstabel, beskrivelse, kort over hvor materialerne står,
  sælgerens profil og knapper til at skrive (eller ringe, hvis sælgeren har slået det til).
  Er det dit eget opslag, kan du skifte status (til salg, reserveret, solgt), redigere eller slette det
- **Beskeder** - chat mellem køber og sælger om et opslag. Fanen viser antal ulæste beskeder
- **Profil** - din profil, dine opslag (aktive og solgte), rediger profil (billede, navn, firmanavn,
  CVR, bio, telefon, by) og indstillinger (vis telefonnummer, skift kodeord, log ud, slet konto)

Alt gemmes i Firebase Realtime Database, så det er der stadig, når appen genstartes.
Billederne gemmes som tekst (base64) sammen med opslaget.

## Placering og kort

- På telefonen bruges `react-native-maps`, i browseren et OpenStreetMap-kort (Leaflet).
  Metro vælger selv `KortComponent.web.js` i browseren
- "Brug min placering" bruger `expo-location`
- Adresser og postnumre slås op med OpenStreetMap Nominatim (gratis, ingen API-nøgle)

## Database

```
Opslag/{id}                         Opslagene (inkl. saelgerId, lokation, egenskaber, status)
Brugere/{uid}                       Profiler (navn, by, brugertype, telefon, visTelefon ...)
Beskeder/{samtaleId}/{id}           Beskederne i en samtale
BrugerSamtaler/{uid}/{samtaleId}    Hver brugers liste over samtaler med sidste besked og ulæste
```

En samtale har id'et `{opslagId}_{køberId}`, så samme køber altid får samme samtale om et opslag.
Ældre opslag fra før denne version virker stadig (pris som tekst, ingen placering).

## Opsætning af Firebase

1. Gå til https://console.firebase.google.com og åbn projektet
2. **Authentication** -> Get started -> Sign-in method -> slå **Email/Password** til
3. **Realtime Database** -> Create database -> Belgium -> Test mode
4. Projektindstillinger (tandhjulet) -> Your apps -> `</>` for at registrere en web-app
5. Kopiér `firebaseConfig` ind i `database/firebase.js`, og sæt databasens URL ind i `getDatabase`

Databasen kører i test mode. Husk at Firebase lukker test mode efter 30 dage, så reglerne skal
forlænges eller skrives om, før det sker.

## Filstruktur

```
components/             Genbrugelige komponenter (knap, tekstfelt, chips, kort/landkort, opslagskort,
                        samtalekort, login, opret bruger, formularen til opslag) og stack-navigationerne
screens/                Forside, Oversigt, Opret opslag, Beskeder, Profil og AuthScreen (login)
screens/StackScreens/   Filter, OpslagDetalje, RedigerOpslag, Chat, RedigerProfil, Indstillinger og Kamera
database/               firebase.js - al Firebase-opsætning samlet ét sted
data/                   const.js - kategorier, materialer og deres egenskaber, filtre
                        funktioner.js - filtrering, sortering, priser, afstand og adresseopslag
styles/                 GlobalStyle.js - al styling og farverne (FARVER) samlet ét sted
assets/                 Billeder
App.js                  Login-tjek og tab-navigationen sættes op her
```

## Teknik

React Native med Expo. Navigation med React Navigation (bottom tabs og stack).
Firebase til login og database. Kort med `react-native-maps` og `expo-location`.
Ikoner fra `@expo/vector-icons`.
