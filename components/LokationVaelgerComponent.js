import { useState } from "react";
import { Text, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import InputComponent from "./InputComponent";
import ButtonComponent from "./ButtonComponent";
import KortComponent from "./KortComponent";
import { beregnRegion, findAdresse, findStedNavn, hentMinPosition } from "../data/funktioner";
import { FARVER, GlobalStyle } from "../styles/GlobalStyle";

export default function LokationVaelgerComponent({ lokation, sted, postnummer, onAendr }) {
    const [soegning, setSoegning] = useState("");
    const [besked, setBesked] = useState("");
    const [loading, setLoading] = useState(false);

    const soeg = async () => {
        if (soegning.trim() === "") {
            setBesked("Skriv en adresse, et postnummer eller en by.");
            return;
        }
        setLoading(true);
        setBesked("");
        try {
            const fund = await findAdresse(soegning);
            if (!fund) {
                setBesked("Vi kunne ikke finde stedet. Prøv med et postnummer.");
            } else {
                onAendr({
                    lokation: { latitude: fund.latitude, longitude: fund.longitude },
                    sted: fund.sted,
                    postnummer: fund.postnummer,
                });
            }
        } catch (e) {
            setBesked(e.message);
        } finally {
            setLoading(false);
        }
    };

    const saetPunkt = async (punkt) => {
        onAendr({ lokation: punkt, sted: sted, postnummer: postnummer });
        const navn = await findStedNavn(punkt.latitude, punkt.longitude);
        onAendr({ lokation: punkt, sted: navn.sted || sted, postnummer: navn.postnummer || postnummer });
    };

    const brugMinPosition = async () => {
        setLoading(true);
        setBesked("");
        try {
            const punkt = await hentMinPosition();
            await saetPunkt(punkt);
        } catch (e) {
            setBesked(e.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View>
            <View style={GlobalStyle.lokationSoeg}>
                <View style={GlobalStyle.flex1}>
                    <InputComponent
                        value={soegning}
                        onChangeText={setSoegning}
                        placeholder="Vej, postnummer eller by"
                    />
                </View>
                <View style={GlobalStyle.lokationSoegKnap}>
                    <ButtonComponent titel="Søg" type="primary" onPress={soeg} loading={loading} />
                </View>
            </View>
            <ButtonComponent titel="Brug min nuværende placering" type="secondary" ikon="navigate-outline" onPress={brugMinPosition} />

            {besked !== "" ? <Text style={GlobalStyle.fejl}>{besked}</Text> : null}

            {lokation ? (
                <View style={GlobalStyle.lokationValgt}>
                    <Ionicons name="location" size={18} color={FARVER.primaer} />
                    <Text style={GlobalStyle.lokationValgtTekst}>
                        {[postnummer, sted].filter(Boolean).join(" ") || "Placering valgt på kortet"}
                    </Text>
                </View>
            ) : null}

            <KortComponent
                style={GlobalStyle.kortLille}
                region={lokation ? beregnRegion([lokation]) : undefined}
                markoerer={lokation ? [{ id: "valgt", ...lokation, titel: "Her står materialerne" }] : []}
                onKortTryk={saetPunkt}
            />
            <Text style={GlobalStyle.hjaelpetekst}>
                Tryk på kortet for at flytte nålen. Du behøver ikke angive husnummer - vej eller postnummer er nok.
            </Text>
        </View>
    );
}
