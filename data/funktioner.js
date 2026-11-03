import { Platform } from "react-native";
import * as Location from "expo-location";
import { DANMARK_REGION } from "./const";


export function tilTal(vaerdi) {
    if (vaerdi === null || vaerdi === undefined || vaerdi === "") return null;
    if (typeof vaerdi === "number") return vaerdi;
    const renset = String(vaerdi).replace(/\s/g, "").replace(/\.(?=\d{3})/g, "").replace(",", ".");
    const tal = parseFloat(renset);
    return isNaN(tal) ? null : tal;
}

export function hentPrisTal(opslag) {
    if (opslag.prisType === "Gratis") return 0;
    if (typeof opslag.pris === "number") return opslag.pris;
    if (typeof opslag.pris === "string" && /gratis/i.test(opslag.pris)) return 0;
    const tal = String(opslag.pris || "").match(/\d[\d.\s]*(,\d+)?/);
    return tal ? tilTal(tal[0]) : null;
}

export function formaterTal(tal) {
    return Number(tal).toLocaleString("da-DK");
}

export function formaterPris(opslag) {
    const pris = hentPrisTal(opslag);
    if (pris === 0) return "Gratis";
    if (pris === null) return opslag.pris || "Pris ikke angivet";
    if (typeof opslag.pris === "string") return opslag.pris;
    const perEnhed = opslag.prisPer === "Pr. enhed" && opslag.enhed ? " / " + opslag.enhed.replace(".", "") : "";
    return formaterTal(pris) + " kr." + perEnhed;
}

export function formaterMaal(opslag) {
    const maal = [opslag.laengde, opslag.bredde, opslag.hoejde].filter((m) => m !== "" && m !== undefined && m !== null);
    return maal.length ? maal.map((m) => formaterTal(m)).join(" x ") + " mm" : "";
}

export function formaterTidSiden(opslag) {
    if (!opslag.oprettet) return opslag.dato || "";
    const minutter = Math.floor((Date.now() - opslag.oprettet) / 60000);
    if (minutter < 1) return "Lige nu";
    if (minutter < 60) return minutter + " min. siden";
    const timer = Math.floor(minutter / 60);
    if (timer < 24) return timer + " t. siden";
    const dage = Math.floor(timer / 24);
    if (dage === 1) return "I går";
    if (dage < 30) return dage + " dage siden";
    return opslag.dato || new Date(opslag.oprettet).toLocaleDateString("da-DK");
}

export function formaterKlokkeslaet(tidspunkt) {
    if (!tidspunkt) return "";
    const dato = new Date(tidspunkt);
    const iDag = new Date();
    const tid = String(dato.getHours()).padStart(2, "0") + ":" + String(dato.getMinutes()).padStart(2, "0");
    if (dato.toDateString() === iDag.toDateString()) return tid;
    return dato.getDate() + "/" + (dato.getMonth() + 1) + " " + tid;
}

export function initialer(navn) {
    if (!navn) return "?";
    const dele = navn.trim().split(/[\s@.]+/).filter(Boolean);
    return ((dele[0]?.[0] || "") + (dele[1]?.[0] || "")).toUpperCase() || "?";
}

export function beregnAfstand(a, b) {
    if (!a || !b) return null;
    const rad = (grader) => (grader * Math.PI) / 180;
    const dLat = rad(b.latitude - a.latitude);
    const dLon = rad(b.longitude - a.longitude);
    const h =
        Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.latitude)) * Math.cos(rad(b.latitude)) * Math.sin(dLon / 2) ** 2;
    return 6371 * 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}

export function formaterAfstand(km) {
    if (km === null || km === undefined) return "";
    if (km < 1) return "Under 1 km";
    return (km < 10 ? km.toFixed(1).replace(".", ",") : Math.round(km)) + " km";
}

export function beregnRegion(punkter) {
    const gyldige = punkter.filter((p) => p && typeof p.latitude === "number");
    if (gyldige.length === 0) return DANMARK_REGION;
    if (gyldige.length === 1) {
        return { latitude: gyldige[0].latitude, longitude: gyldige[0].longitude, latitudeDelta: 0.06, longitudeDelta: 0.06 };
    }
    const lats = gyldige.map((p) => p.latitude);
    const lons = gyldige.map((p) => p.longitude);
    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const minLon = Math.min(...lons);
    const maxLon = Math.max(...lons);
    return {
        latitude: (minLat + maxLat) / 2,
        longitude: (minLon + maxLon) / 2,
        latitudeDelta: Math.max((maxLat - minLat) * 1.4, 0.06),
        longitudeDelta: Math.max((maxLon - minLon) * 1.4, 0.06),
    };
}

export function regionForRadius(center, radiusKm) {
    const delta = (radiusKm / 111) * 2.4;
    return {
        latitude: center.latitude,
        longitude: center.longitude,
        latitudeDelta: delta,
        longitudeDelta: delta / Math.cos((center.latitude * Math.PI) / 180),
    };
}

function erMindst(vaerdi, min) {
    const minTal = tilTal(min);
    if (minTal === null) return true;
    const tal = tilTal(vaerdi);
    return tal !== null && tal >= minTal;
}

export function filtrerOpslag(liste, filter) {
    const soegeord = filter.soegning.trim().toLowerCase().split(/\s+/).filter(Boolean);

    return liste.filter((o) => {
        const status = o.status || "Til salg";
        if (!filter.visSolgte && status === "Solgt") return false;

        if (soegeord.length) {
            const tekst = [
                o.titel,
                o.materiale,
                o.kategori,
                o.underkategori,
                o.maerke,
                o.sted,
                o.postnummer,
                ...Object.values(o.egenskaber || {}),
            ]
                .join(" ")
                .toLowerCase();
            if (!soegeord.every((ord) => tekst.includes(ord))) return false;
        }

        if (filter.kategori !== "Alle" && o.kategori !== filter.kategori) return false;
        if (filter.underkategorier.length && !filter.underkategorier.includes(o.underkategori)) return false;
        for (const noegle of Object.keys(filter.egenskaber)) {
            const valgte = filter.egenskaber[noegle];
            if (valgte.length && !valgte.includes((o.egenskaber || {})[noegle])) return false;
        }

        if (filter.stand.length && !filter.stand.includes(o.stand)) return false;
        if (filter.levering.length && !filter.levering.includes(o.levering)) return false;
        if (filter.saelgerType.length && !filter.saelgerType.includes(o.saelgerType)) return false;

        const pris = hentPrisTal(o);
        if (filter.kunGratis && pris !== 0) return false;
        if (filter.prisMin !== "" && !erMindst(pris, filter.prisMin)) return false;
        if (filter.prisMax !== "" && (pris === null || pris > tilTal(filter.prisMax))) return false;

        if (!erMindst(o.laengde, filter.laengdeMin)) return false;
        if (!erMindst(o.bredde, filter.breddeMin)) return false;
        if (!erMindst(o.hoejde, filter.hoejdeMin)) return false;
        if (!erMindst(o.maengde, filter.maengdeMin)) return false;

        if (filter.kunMedBillede && !o.billede) return false;

        if (filter.center) {
            const afstand = beregnAfstand(filter.center, o.lokation);
            if (afstand === null || afstand > filter.radius) return false;
        }

        return true;
    });
}

export function sorterOpslag(liste, sortering, center) {
    const kopi = [...liste];
    if (sortering === "Ældste") return kopi.sort((a, b) => (a.id < b.id ? -1 : 1));
    if (sortering === "Pris: lav til høj" || sortering === "Pris: høj til lav") {
        const retning = sortering === "Pris: lav til høj" ? 1 : -1;
        return kopi.sort((a, b) => {
            const pa = hentPrisTal(a);
            const pb = hentPrisTal(b);
            if (pa === null) return 1;
            if (pb === null) return -1;
            return (pa - pb) * retning;
        });
    }
    if (sortering === "Nærmest" && center) {
        const afstand = (o) => beregnAfstand(center, o.lokation) ?? Infinity;
        return kopi.sort((a, b) => afstand(a) - afstand(b));
    }
    return kopi.sort((a, b) => (a.id < b.id ? 1 : -1));
}

export function antalAktiveFiltre(filter) {
    let antal = 0;
    if (filter.kategori !== "Alle") antal++;
    antal += filter.underkategorier.length;
    Object.values(filter.egenskaber).forEach((valgte) => (antal += valgte.length));
    antal += filter.stand.length + filter.levering.length + filter.saelgerType.length;
    ["prisMin", "prisMax", "laengdeMin", "breddeMin", "hoejdeMin", "maengdeMin"].forEach((felt) => {
        if (filter[felt] !== "") antal++;
    });
    if (filter.kunGratis) antal++;
    if (filter.kunMedBillede) antal++;
    if (filter.visSolgte) antal++;
    if (filter.center) antal++;
    return antal;
}

export function validerOpslag(data) {
    if (data.titel.trim() === "") return "Giv dit opslag en titel.";
    if (data.kategori === "") return "Vælg en kategori.";
    if (data.stand === "") return "Vælg materialernes stand.";
    if (data.prisType !== "Gratis" && tilTal(data.pris) === null) return "Skriv en pris, eller vælg Gratis.";
    if (!data.lokation) return "Vælg hvor materialerne kan hentes.";
    return "";
}

export function klargoerOpslag(data) {
    return {
        titel: data.titel.trim(),
        materiale: data.materiale.trim(),
        kategori: data.kategori,
        underkategori: data.underkategori,
        egenskaber: data.egenskaber,
        stand: data.stand,
        maengde: tilTal(data.maengde) ?? "",
        enhed: data.enhed,
        laengde: tilTal(data.laengde) ?? "",
        bredde: tilTal(data.bredde) ?? "",
        hoejde: tilTal(data.hoejde) ?? "",
        maerke: data.maerke.trim(),
        prisType: data.prisType,
        pris: data.prisType === "Gratis" ? 0 : tilTal(data.pris),
        prisPer: data.prisPer,
        levering: data.levering,
        status: data.status,
        sted: data.sted,
        postnummer: data.postnummer,
        lokation: data.lokation,
        billede: data.billede,
    };
}

export function opslagTilFormular(opslag, tomt) {
    const tekst = (v) => (v === null || v === undefined ? "" : String(v));
    return {
        ...tomt,
        ...opslag,
        egenskaber: opslag.egenskaber || {},
        stand: opslag.stand || "",
        underkategori: opslag.underkategori || "",
        maengde: tekst(opslag.maengde),
        laengde: tekst(opslag.laengde),
        bredde: tekst(opslag.bredde),
        hoejde: tekst(opslag.hoejde),
        maerke: opslag.maerke || "",
        pris: typeof opslag.pris === "number" ? (opslag.pris === 0 ? "" : String(opslag.pris)) : tekst(hentPrisTal(opslag)),
        prisType: opslag.prisType || (hentPrisTal(opslag) === 0 ? "Gratis" : tomt.prisType),
        lokation: opslag.lokation || null,
        sted: opslag.sted || "",
        postnummer: opslag.postnummer || "",
        billede: opslag.billede || "",
        materiale: opslag.materiale || "",
    };
}

export function lavSamtaleId(opslagId, koeberId) {
    return opslagId + "_" + koeberId;
}


const NOMINATIM = "https://nominatim.openstreetmap.org";

function nominatimHeaders() {
    return Platform.OS === "web" ? {} : { "User-Agent": "ReStock/1.0 (studieprojekt)" };
}

function stedFraAdresse(adresse) {
    return adresse.city || adresse.town || adresse.village || adresse.suburb || adresse.municipality || "";
}

export async function findAdresse(soegning) {
    const tekst = soegning.trim();
    const erPostnummer = /^\d{4}$/.test(tekst);
    const parameter = erPostnummer
        ? "postalcode=" + tekst + "&country=dk"
        : "q=" + encodeURIComponent(tekst) + "&countrycodes=dk";

    const svar = await fetch(
        NOMINATIM + "/search?format=jsonv2&addressdetails=1&limit=1&accept-language=da&" + parameter,
        { headers: nominatimHeaders() }
    );
    if (!svar.ok) throw new Error("Kunne ikke slå adressen op lige nu. Prøv igen om lidt.");
    const resultater = await svar.json();
    if (!resultater.length) return null;

    const fund = resultater[0];
    const adresse = fund.address || {};
    return {
        latitude: parseFloat(fund.lat),
        longitude: parseFloat(fund.lon),
        sted: stedFraAdresse(adresse) || (fund.display_name || "").split(",")[1]?.trim() || "",
        postnummer: adresse.postcode || (erPostnummer ? tekst : ""),
    };
}

export async function findStedNavn(latitude, longitude) {
    try {
        const svar = await fetch(
            NOMINATIM + "/reverse?format=jsonv2&zoom=14&accept-language=da&lat=" + latitude + "&lon=" + longitude,
            { headers: nominatimHeaders() }
        );
        const fund = await svar.json();
        const adresse = fund.address || {};
        return { sted: stedFraAdresse(adresse), postnummer: adresse.postcode || "" };
    } catch (e) {
        return { sted: "", postnummer: "" };
    }
}

export async function hentMinPosition() {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
        throw new Error("Giv ReStock adgang til din placering for at bruge denne funktion.");
    }
    const position = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
    return { latitude: position.coords.latitude, longitude: position.coords.longitude };
}
