import { useEffect, useMemo, useRef } from "react";
import { View } from "react-native";
import { DANMARK_REGION } from "../data/const";
import { FARVER, GlobalStyle } from "../styles/GlobalStyle";

export default function KortComponent({ markoerer, region, cirkel, onMarkoerTryk, onKortTryk, style }) {
    const kortId = useRef("kort-" + Math.random().toString(36).slice(2)).current;

    useEffect(() => {
        const modtag = (event) => {
            const data = event.data;
            if (!data || data.kortId !== kortId) return;
            if (data.type === "markoer" && onMarkoerTryk) onMarkoerTryk(data.id);
            if (data.type === "tryk" && onKortTryk) onKortTryk({ latitude: data.latitude, longitude: data.longitude });
        };
        window.addEventListener("message", modtag);
        return () => window.removeEventListener("message", modtag);
    }, [onMarkoerTryk, onKortTryk]);

    const lavKortHtml = (dataJson) => {
        return `<!DOCTYPE html>
<html><head>
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css">
<script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
<style>
html, body, #kort { height: 100%; margin: 0; font-family: -apple-system, Segoe UI, Roboto, sans-serif; }
.titel { font-weight: 700; font-size: 14px; margin-bottom: 2px; }
.beskrivelse { color: #5B6660; font-size: 12px; }
.knap { margin-top: 8px; background: #1F6B45; color: #fff; border: 0; border-radius: 8px; padding: 6px 10px; font-weight: 700; cursor: pointer; }
</style>
</head><body><div id="kort"></div>
<script>
var data = ${dataJson};
var kort = L.map("kort", { zoomControl: true });
L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: "&copy; OpenStreetMap"
}).addTo(kort);

function send(besked) {
    besked.kortId = data.kortId;
    parent.postMessage(besked, "*");
}

var punkter = [];
data.markoerer.forEach(function (m) {
    var markoer = L.circleMarker([m.latitude, m.longitude], {
        radius: 9, color: "#fff", weight: 3, fillColor: data.farve, fillOpacity: 1
    }).addTo(kort);
    var boks = document.createElement("div");
    var titel = document.createElement("div");
    titel.className = "titel";
    titel.textContent = m.titel || "";
    boks.appendChild(titel);
    if (m.beskrivelse) {
        var beskrivelse = document.createElement("div");
        beskrivelse.className = "beskrivelse";
        beskrivelse.textContent = m.beskrivelse;
        boks.appendChild(beskrivelse);
    }
    if (data.kanAabne) {
        var knap = document.createElement("button");
        knap.className = "knap";
        knap.textContent = "Se opslag";
        knap.onclick = function () { send({ type: "markoer", id: m.id }); };
        boks.appendChild(knap);
    }
    markoer.bindPopup(boks);
    punkter.push([m.latitude, m.longitude]);
});

if (data.cirkel) {
    var cirkel = L.circle([data.cirkel.latitude, data.cirkel.longitude], {
        radius: data.cirkel.radiusKm * 1000, color: data.farve, weight: 2, fillOpacity: 0.12
    }).addTo(kort);
    kort.fitBounds(cirkel.getBounds());
} else if (punkter.length > 1) {
    kort.fitBounds(punkter, { padding: [30, 30] });
} else {
    var r = data.region;
    var zoom = Math.max(5, Math.min(16, Math.round(Math.log2(360 / r.longitudeDelta))));
    kort.setView([r.latitude, r.longitude], zoom);
}

if (data.kanTrykke) {
    kort.on("click", function (e) {
        send({ type: "tryk", latitude: e.latlng.lat, longitude: e.latlng.lng });
    });
}
</script></body></html>`;
    };

    const indhold = useMemo(() => {
        const data = {
            kortId: kortId,
            markoerer: markoerer || [],
            region: region || DANMARK_REGION,
            cirkel: cirkel || null,
            farve: FARVER.primaer,
            kanTrykke: !!onKortTryk,
            kanAabne: !!onMarkoerTryk,
        };
        return lavKortHtml(JSON.stringify(data).replace(/</g, "\\u003c"));
    }, [JSON.stringify(markoerer), JSON.stringify(region), JSON.stringify(cirkel), !!onKortTryk, !!onMarkoerTryk]);

    return (
        <View style={style || GlobalStyle.kortVisning}>
            <iframe
                title="Kort"
                srcDoc={indhold}
                sandbox="allow-scripts"
                style={{ border: 0, width: "100%", height: "100%", borderRadius: "inherit" }}
            />
        </View>
    );
}
