import { useEffect, useState } from "react";
import { FlatList, KeyboardAvoidingView, Platform, Pressable, Text, TextInput, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useIsFocused } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ref, onValue, push, update, increment } from "firebase/database";
import { auth, rtdb } from "../../database/firebase";
import BeskedBobleComponent from "../../components/BeskedBobleComponent";
import BilledeComponent from "../../components/BilledeComponent";
import TilbageHeaderComponent from "../../components/TilbageHeaderComponent";
import { HURTIGE_SVAR } from "../../data/const";
import { formaterPris } from "../../data/funktioner";
import { FARVER, GlobalStyle } from "../../styles/GlobalStyle";

export default function ChatScreen({ navigation, route }) {
    const { samtaleId, modpartId, modpartNavn, opslagId, opslagTitel, fraOpslag } = route.params;
    const mitId = auth.currentUser.uid;

    const [beskeder, setBeskeder] = useState([]);
    const [tekst, setTekst] = useState("");
    const [fejl, setFejl] = useState("");
    const [mitNavn, setMitNavn] = useState(auth.currentUser.displayName || auth.currentUser.email);
    const [minSamtale, setMinSamtale] = useState(null);
    const [opslag, setOpslag] = useState(null);
    const erFokuseret = useIsFocused();
    const insets = useSafeAreaInsets();

    useEffect(() => {
        const unsubscribe = onValue(ref(rtdb, "/Beskeder/" + samtaleId), (snap) => {
            const data = snap.val();
            if (data) {
                const liste = Object.keys(data).map((id) => ({ id: id, ...data[id] }));
                setBeskeder(liste.reverse());
            } else {
                setBeskeder([]);
            }
        });
        return unsubscribe;
    }, [samtaleId]);

    useEffect(() => {
        const unsubscribe = onValue(ref(rtdb, "/BrugerSamtaler/" + mitId + "/" + samtaleId), (snap) => {
            setMinSamtale(snap.val());
        });
        return unsubscribe;
    }, [samtaleId]);

    useEffect(() => {
        if (erFokuseret && minSamtale && minSamtale.ulaest > 0) {
            update(ref(rtdb, "/BrugerSamtaler/" + mitId + "/" + samtaleId), { ulaest: 0 });
        }
    }, [erFokuseret, minSamtale?.ulaest]);

    useEffect(() => {
        const unsubscribe = onValue(ref(rtdb, "/Brugere/" + mitId + "/navn"), (snap) => {
            if (snap.val()) setMitNavn(snap.val());
        });
        return unsubscribe;
    }, []);

    useEffect(() => {
        const unsubscribe = onValue(ref(rtdb, "/Opslag/" + opslagId), (snap) => {
            setOpslag(snap.val());
        });
        return unsubscribe;
    }, [opslagId]);

    const send = async (beskedTekst) => {
        const besked = beskedTekst.trim();
        if (besked === "") return;
        setTekst("");
        setFejl("");

        const tidspunkt = Date.now();
        const beskedId = push(ref(rtdb, "/Beskeder/" + samtaleId)).key;
        const mig = "/BrugerSamtaler/" + mitId + "/" + samtaleId + "/";
        const modpart = "/BrugerSamtaler/" + modpartId + "/" + samtaleId + "/";

        const opdateringer = {
            ["/Beskeder/" + samtaleId + "/" + beskedId]: { afsenderId: mitId, tekst: besked, tidspunkt: tidspunkt },
            [mig + "opslagId"]: opslagId,
            [mig + "opslagTitel"]: opslagTitel,
            [mig + "modpartId"]: modpartId,
            [mig + "modpartNavn"]: modpartNavn,
            [mig + "sidsteBesked"]: besked,
            [mig + "sidsteTidspunkt"]: tidspunkt,
            [mig + "ulaest"]: 0,
            [modpart + "opslagId"]: opslagId,
            [modpart + "opslagTitel"]: opslagTitel,
            [modpart + "modpartId"]: mitId,
            [modpart + "modpartNavn"]: mitNavn,
            [modpart + "sidsteBesked"]: besked,
            [modpart + "sidsteTidspunkt"]: tidspunkt,
            [modpart + "ulaest"]: increment(1),
        };

        try {
            await update(ref(rtdb), opdateringer);
        } catch (e) {
            setFejl("Beskeden blev ikke sendt. Prøv igen.");
            setTekst(besked);
        }
    };

    const visOpslag = () => {
        if (fraOpslag) {
            navigation.goBack();
        } else if (opslag) {
            navigation.navigate("Oversigt", { screen: "OpslagDetalje", params: { id: opslagId }, initial: false });
        }
    };

    return (
        <KeyboardAvoidingView
            style={GlobalStyle.skaerm}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
            keyboardVerticalOffset={insets.top + 44}
        >
            <TilbageHeaderComponent titel={modpartNavn} onTilbage={() => navigation.goBack()} />

            <Pressable style={GlobalStyle.chatOpslag} onPress={visOpslag}>
                {opslag?.billede ? (
                    <BilledeComponent url={{ uri: opslag.billede }} style={GlobalStyle.chatOpslagBillede} />
                ) : (
                    <View style={[GlobalStyle.chatOpslagBillede, GlobalStyle.kortPladsholder]}>
                        <Ionicons name="cube-outline" size={22} color={FARVER.primaerMellem} />
                    </View>
                )}
                <View style={GlobalStyle.flex1}>
                    <Text style={GlobalStyle.chatOpslagTitel} numberOfLines={1}>
                        {opslagTitel}
                    </Text>
                    <Text style={GlobalStyle.chatOpslagPris}>
                        {opslag ? formaterPris(opslag) + (opslag.status && opslag.status !== "Til salg" ? " · " + opslag.status : "") : "Opslaget er slettet"}
                    </Text>
                </View>
                {opslag ? <Ionicons name="chevron-forward" size={20} color={FARVER.tekstSvag} /> : null}
            </Pressable>

            <FlatList
                style={GlobalStyle.flex1}
                contentContainerStyle={GlobalStyle.chatListe}
                data={beskeder}
                inverted={beskeder.length > 0}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <BeskedBobleComponent tekst={item.tekst} tidspunkt={item.tidspunkt} erMin={item.afsenderId === mitId} />
                )}
                ListEmptyComponent={
                    <View style={GlobalStyle.tomBoks}>
                        <Ionicons name="chatbubbles-outline" size={44} color={FARVER.primaerMellem} />
                        <Text style={GlobalStyle.tomTitel}>Start samtalen</Text>
                        <Text style={GlobalStyle.tomTekst}>Skriv til {modpartNavn} om opslaget. I kan aftale pris og afhentning her.</Text>
                        <View style={GlobalStyle.hurtigeSvar}>
                            {HURTIGE_SVAR.map((svar, key) => (
                                <Pressable key={key} style={GlobalStyle.hurtigtSvar} onPress={() => send(svar)}>
                                    <Text style={GlobalStyle.hurtigtSvarTekst}>{svar}</Text>
                                </Pressable>
                            ))}
                        </View>
                    </View>
                }
            />

            {fejl !== "" ? <Text style={[GlobalStyle.fejl, GlobalStyle.sideMargin]}>{fejl}</Text> : null}

            <View style={GlobalStyle.chatInputRaekke}>
                <TextInput
                    style={GlobalStyle.chatInput}
                    value={tekst}
                    onChangeText={setTekst}
                    placeholder="Skriv en besked..."
                    placeholderTextColor={FARVER.tekstSvag}
                    multiline
                />
                <Pressable
                    accessibilityLabel="Send"
                    style={[GlobalStyle.sendKnap, tekst.trim() === "" ? GlobalStyle.knapDeaktiveret : null]}
                    onPress={() => send(tekst)}
                    disabled={tekst.trim() === ""}
                >
                    <Ionicons name="send" size={20} color={FARVER.hvid} />
                </Pressable>
            </View>
        </KeyboardAvoidingView>
    );
}
