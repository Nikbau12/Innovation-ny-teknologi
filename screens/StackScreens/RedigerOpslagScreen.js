import { useEffect, useState } from "react";
import { KeyboardAvoidingView, Platform, ScrollView, Text, View } from "react-native";
import { ref, update } from "firebase/database";
import { rtdb } from "../../database/firebase";
import ButtonComponent from "../../components/ButtonComponent";
import OpslagFormComponent from "../../components/OpslagFormComponent";
import TilbageHeaderComponent from "../../components/TilbageHeaderComponent";
import { TOMT_OPSLAG } from "../../data/const";
import { klargoerOpslag, opslagTilFormular, validerOpslag } from "../../data/funktioner";
import { GlobalStyle } from "../../styles/GlobalStyle";

export default function RedigerOpslagScreen({ navigation, route }) {
    const id = route.params.id;
    const original = route.params.opslag;

    const [data, setData] = useState(opslagTilFormular(original, TOMT_OPSLAG));
    const [fejl, setFejl] = useState("");
    const [gemmer, setGemmer] = useState(false);

    useEffect(() => {
        if (route.params?.billede) {
            setData((prev) => ({ ...prev, billede: route.params.billede }));
        }
    }, [route.params?.billede]);

    const aendr = (aendringer) => setData((prev) => ({ ...prev, ...aendringer }));

    const gemAendringer = async () => {
        const valideringsFejl = validerOpslag(data);
        if (valideringsFejl !== "") {
            setFejl(valideringsFejl);
            return;
        }

        setGemmer(true);
        try {
            await update(ref(rtdb, "/Opslag/" + id), { ...klargoerOpslag(data), opdateret: Date.now() });
        } catch (e) {
            setFejl(e?.message || "Noget gik galt.");
            setGemmer(false);
            return;
        }

        navigation.goBack();
    };

    return (
        <KeyboardAvoidingView style={GlobalStyle.skaerm} behavior={Platform.OS === "ios" ? "padding" : undefined} keyboardVerticalOffset={100}>
            <TilbageHeaderComponent titel="Rediger opslag" onTilbage={() => navigation.goBack()} />
            <ScrollView contentContainerStyle={GlobalStyle.formIndhold} keyboardShouldPersistTaps="handled">
                <Text style={GlobalStyle.underOverskrift}>Ret felterne og gem, så opdateres opslaget i oversigten.</Text>

                <OpslagFormComponent
                    data={data}
                    onAendr={aendr}
                    onTagBillede={() => navigation.navigate("Kamera", { retur: "Rediger" })}
                    visStatus
                />

                {fejl !== "" && <Text style={GlobalStyle.fejl}>{fejl}</Text>}

                <View style={GlobalStyle.knapContainer}>
                    <ButtonComponent titel="Gem ændringer" type="primary" onPress={gemAendringer} loading={gemmer} />
                    <ButtonComponent titel="Fortryd" type="secondary" onPress={() => navigation.goBack()} />
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
