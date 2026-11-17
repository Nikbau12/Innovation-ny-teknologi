import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import {
    getDatabase,
    ref,
    get,
    set,
    update,
    onValue,
    increment,
    serverTimestamp,
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-database.js";
import { FIREBASE_CONFIG, EMAILJS, LANCERING, VIS_ANTAL_FRA } from "./config.js";

const app = initializeApp(FIREBASE_CONFIG);
const db = getDatabase(app);

const $ = (sel) => document.querySelector(sel);

/* ---------- Nedtælling til lancering ---------- */

function opdaterNedtaelling() {
    const ms = new Date(LANCERING.dato).getTime() - Date.now();
    const dage = Math.max(0, Math.ceil(ms / 86400000));
    document.querySelectorAll("[data-dage]").forEach((el) => (el.textContent = dage));
}
opdaterNedtaelling();
setInterval(opdaterNedtaelling, 60 * 60 * 1000);

/* ---------- Antal på ventelisten (social proof) ---------- */

onValue(
    ref(db, "VentelisteStatistik/antal"),
    (snap) => {
        const antal = snap.val() || 0;
        const boks = $("#antalTilmeldte");
        if (antal >= VIS_ANTAL_FRA) {
            boks.querySelector("strong").textContent = antal.toLocaleString("da-DK");
            boks.hidden = false;
        } else {
            boks.hidden = true;
        }
    },
    () => {}
);

/* ---------- Hjælpefunktioner ---------- */

// Firebase-nøgler må ikke indeholde . # $ [ ] /
const emailTilNoegle = (email) => email.replace(/\./g, ",").replace(/[#$\[\]\/]/g, "_");

function lavBoostKode() {
    const tegn = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // uden 0/O og 1/I
    const tal = crypto.getRandomValues(new Uint32Array(6));
    return "BOOST-" + Array.from(tal, (t) => tegn[t % tegn.length]).join("");
}

function hentKilde() {
    const p = new URLSearchParams(location.search);
    return p.get("kilde") || p.get("utm_source") || (document.referrer ? new URL(document.referrer).hostname : "direkte");
}

const emailOk = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);

async function sendBekraeftelse({ email, navn, kode, brugertype }) {
    if (!EMAILJS.publicKey || !EMAILJS.serviceId || !EMAILJS.templateId || !window.emailjs) {
        console.warn("EmailJS er ikke sat op i landing/config.js - der sendes ingen mail.");
        return false;
    }
    try {
        await window.emailjs.send(
            EMAILJS.serviceId,
            EMAILJS.templateId,
            {
                to_email: email,
                navn: navn || "der",
                kode: kode,
                brugertype: brugertype,
                lancering: LANCERING.tekst,
                antal_annoncer: LANCERING.antalBoostedeAnnoncer,
            },
            { publicKey: EMAILJS.publicKey }
        );
        return true;
    } catch (fejl) {
        console.error("Kunne ikke sende mail:", fejl);
        return false;
    }
}

/* ---------- Tilmelding ---------- */

const form = $("#tilmeldForm");
const fejlTekst = $("#formFejl");
const knap = $("#tilmeldKnap");

function visFejl(tekst) {
    fejlTekst.textContent = tekst;
    fejlTekst.hidden = !tekst;
}

function visSucces({ email, kode, mailSendt, alleredeTilmeldt }) {
    form.hidden = true;
    const s = $("#succes");
    s.hidden = false;
    $("#succesEmail").textContent = email;

    if (alleredeTilmeldt) {
        $("#succesTitel").textContent = "Du står allerede på listen";
        $("#succesTekst").innerHTML =
            "Vi har allerede <strong></strong> på ventelisten, og dit boost er reserveret. Du hører fra os, når ReStock åbner.";
        $("#succesTekst strong").textContent = email;
        $("#kodeBoks").hidden = true;
        return;
    }

    $("#succesKode").textContent = kode;
    $("#succesMail").textContent = mailSendt
        ? "Vi har sendt en bekræftelse med din kode til " + email + ". Tjek evt. spam-mappen."
        : "Gem koden - du skal bruge den, når appen åbner.";
}

form.addEventListener("submit", async (e) => {
    e.preventDefault();
    visFejl("");

    const data = new FormData(form);
    if (data.get("firma")) return; // honeypot - udfyldes kun af spam-bots

    const email = String(data.get("email") || "").trim().toLowerCase();
    const navn = String(data.get("navn") || "").trim();
    const brugertype = String(data.get("brugertype") || "privat");
    const postnummer = String(data.get("postnummer") || "").trim();

    if (!emailOk(email)) return visFejl("Skriv en gyldig e-mailadresse.");
    if (postnummer && !/^\d{4}$/.test(postnummer)) return visFejl("Postnummeret skal være 4 cifre.");
    if (!data.get("samtykke")) return visFejl("Sæt flueben for at vi må skrive til dig.");

    knap.disabled = true;
    knap.textContent = "Skriver dig op ...";

    const noegle = emailTilNoegle(email);
    const tilmeldingRef = ref(db, "Venteliste/" + noegle);

    try {
        // Findes e-mailen allerede? (Fejler læsning pga. sikkerhedsregler, prøver vi bare at skrive.)
        let findes = false;
        try {
            findes = (await get(tilmeldingRef)).exists();
        } catch (_) {}
        if (findes) return visSucces({ email, alleredeTilmeldt: true });

        const kode = lavBoostKode();
        try {
            await set(tilmeldingRef, {
                email,
                navn,
                brugertype,
                postnummer,
                boostKode: kode,
                boostAnnoncer: LANCERING.antalBoostedeAnnoncer,
                kilde: hentKilde(),
                samtykke: true,
                mailSendt: false,
                oprettet: serverTimestamp(),
            });
        } catch (fejl) {
            // Med sikkerhedsreglerne fra README afvises en overskrivning = allerede tilmeldt
            if (String(fejl?.code || fejl).toLowerCase().includes("permission")) {
                return visSucces({ email, alleredeTilmeldt: true });
            }
            throw fejl;
        }

        update(ref(db, "VentelisteStatistik"), {
            antal: increment(1),
            ["brugertype/" + brugertype]: increment(1),
        }).catch(() => {});

        const mailSendt = await sendBekraeftelse({ email, navn, kode, brugertype });
        if (mailSendt) update(tilmeldingRef, { mailSendt: true }).catch(() => {});

        visSucces({ email, kode, mailSendt });
    } catch (fejl) {
        console.error(fejl);
        visFejl("Noget gik galt. Prøv igen om lidt.");
    } finally {
        knap.disabled = false;
        knap.textContent = "Skriv mig op";
    }
});

$("#kopierKode")?.addEventListener("click", async () => {
    try {
        await navigator.clipboard.writeText($("#succesKode").textContent);
        $("#kopierKode").textContent = "Kopieret";
        setTimeout(() => ($("#kopierKode").textContent = "Kopiér"), 1800);
    } catch (_) {}
});
