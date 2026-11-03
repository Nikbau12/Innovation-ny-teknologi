import { useEffect, useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, Text, View } from "react-native";
import { ref, push, onValue } from "firebase/database";
import { auth, rtdb } from "../database/firebase";
import ButtonComponent from "../components/ButtonComponent";
import OpslagFormComponent from "../components/OpslagFormComponent";
import { TOMT_OPSLAG } from "../data/const";
import { klargoerOpslag, validerOpslag } from "../data/funktioner";
import { GlobalStyle } from "../styles/GlobalStyle";

export default function OpretOpslagScreen({ navigation, route }) {
    const [data, setData] = useState(TOMT_OPSLAG);
    const [profil, setProfil] = useState(null);
    const [fejl, setFejl] = useState("");
    const [gemmer, setGemmer] = useState(false);

    useEffect(() => {
        if (route.params?.billede) {
            setData((prev) => ({ ...prev, billede: route.params.billede }));
        }
    }, [route.params?.billede]);

    useEffect(() => {
        const unsubscribe = onValue(ref(rtdb, "/Brugere/" + auth.currentUser.uid), (snap) => {
            setProfil(snap.val());
        });
        return unsubscribe;
    }, []);

    const aendr = (aendringer) => setData((prev) => ({ ...prev, ...aendringer }));

    const opretOpslag = async () => {
        const valideringsFejl = validerOpslag(data);
        if (valideringsFejl !== "") {
            setFejl(valideringsFejl);
            return;
        }

        const idag = new Date();

        const nytOpslag = {
            ...klargoerOpslag(data),
            saelger: auth.currentUser?.email,
            saelgerId: auth.currentUser.uid,
            saelgerNavn: profil?.navn || auth.currentUser?.displayName || auth.currentUser?.email,
            saelgerType: profil?.brugertype || "Privat",
            dato: idag.getDate() + "." + (idag.getMonth() + 1) + "." + idag.getFullYear(),
            oprettet: Date.now(),
        };

        setGemmer(true);
        try {
            await push(ref(rtdb, "/Opslag/"), nytOpslag);
        } catch (e) {
            setFejl(e?.message || "Noget gik galt.");
            setGemmer(false);
            return;
        }

        setData(TOMT_OPSLAG);
        setFejl("");
        setGemmer(false);
        navigation.setParams({ billede: undefined });

        navigation.navigate("Oversigt", { screen: "OversigtListe", pop: true });
    };

    return (
        <KeyboardAvoidingView style={GlobalStyle.skaerm} behavior={Platform.OS === "ios" ? "padding" : undefined} keyboardVerticalOffset={100}>
            <ScrollView contentContainerStyle={GlobalStyle.formIndhold} keyboardShouldPersistTaps="handled">
                <Text style={GlobalStyle.overskrift}>Sælg materialer</Text>
                <Text style={GlobalStyle.underOverskrift}>
                    Jo flere detaljer du udfylder, jo lettere er det for købere at finde dit opslag. Felter med * skal udfyldes.
                </Text>

                <OpslagFormComponent data={data} onAendr={aendr} onTagBillede={() => navigation.navigate("Kamera")} />

                {fejl !== "" && <Text style={GlobalStyle.fejl}>{fejl}</Text>}

                <View style={GlobalStyle.knapContainer}>
                    <ButtonComponent titel="Opret opslag" type="primary" ikon="checkmark-circle-outline" onPress={opretOpslag} loading={gemmer} />
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
