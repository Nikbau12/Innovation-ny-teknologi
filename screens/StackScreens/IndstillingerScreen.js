import { useEffect, useState } from "react";
import { Alert, KeyboardAvoidingView, Platform, ScrollView, Text, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import {
    EmailAuthProvider,
    deleteUser,
    reauthenticateWithCredential,
    signOut,
    updatePassword,
} from "firebase/auth";
import { ref, get, onValue, update } from "firebase/database";
import { auth, rtdb } from "../../database/firebase";
import ButtonComponent from "../../components/ButtonComponent";
import InputComponent from "../../components/InputComponent";
import SkifterComponent from "../../components/SkifterComponent";
import TilbageHeaderComponent from "../../components/TilbageHeaderComponent";
import { FARVER, GlobalStyle } from "../../styles/GlobalStyle";

export default function IndstillingerScreen({ navigation }) {
    const bruger = auth.currentUser;
    const [profil, setProfil] = useState(null);
    const [gammeltKodeord, setGammeltKodeord] = useState("");
    const [nytKodeord, setNytKodeord] = useState("");
    const [gentagKodeord, setGentagKodeord] = useState("");
    const [kodeordFejl, setKodeordFejl] = useState("");
    const [kodeordBesked, setKodeordBesked] = useState("");
    const [sletKodeord, setSletKodeord] = useState("");
    const [sletFejl, setSletFejl] = useState("");
    const [arbejder, setArbejder] = useState(false);

    useEffect(() => {
        const unsubscribe = onValue(ref(rtdb, "/Brugere/" + bruger.uid), (snap) => {
            setProfil(snap.val());
        });
        return unsubscribe;
    }, []);

    const bekraeftKodeord = async (kodeord) => {
        const credential = EmailAuthProvider.credential(bruger.email, kodeord);
        await reauthenticateWithCredential(bruger, credential);
    };

    const bekraeft = (titel, tekst, knap, handling) => {
        if (Platform.OS === "web") {
            if (window.confirm(titel + "\n\n" + tekst)) handling();
            return;
        }
        Alert.alert(titel, tekst, [
            { text: "Fortryd", style: "cancel" },
            { text: knap, style: "destructive", onPress: handling },
        ]);
    };

    const skiftVisTelefon = async (vaerdi) => {
        await update(ref(rtdb, "/Brugere/" + bruger.uid), { visTelefon: vaerdi });
    };

    const skiftKodeord = async () => {
        setKodeordFejl("");
        setKodeordBesked("");
        if (nytKodeord.length < 6) {
            setKodeordFejl("Det nye kodeord skal være mindst 6 tegn.");
            return;
        }
        if (nytKodeord !== gentagKodeord) {
            setKodeordFejl("De to nye kodeord er ikke ens.");
            return;
        }
        setArbejder(true);
        try {
            await bekraeftKodeord(gammeltKodeord);
            await updatePassword(bruger, nytKodeord);
            setGammeltKodeord("");
            setNytKodeord("");
            setGentagKodeord("");
            setKodeordBesked("Dit kodeord er skiftet.");
        } catch (e) {
            setKodeordFejl(
                e.code === "auth/invalid-credential" || e.code === "auth/wrong-password"
                    ? "Det nuværende kodeord er forkert."
                    : "Kunne ikke skifte kodeord. Prøv igen."
            );
        } finally {
            setArbejder(false);
        }
    };

    const logUd = async () => {
        try {
            await signOut(auth);
        } catch (error) {
            console.error("Logout fejlede:", error.message);
        }
    };

    const sletKonto = async () => {
        setSletFejl("");
        setArbejder(true);
        try {
            await bekraeftKodeord(sletKodeord);

            const snap = await get(ref(rtdb, "Opslag"));
            const alle = snap.val() || {};
            const sletninger = {
                ["/Brugere/" + bruger.uid]: null,
                ["/BrugerSamtaler/" + bruger.uid]: null,
            };
            Object.keys(alle).forEach((id) => {
                const o = alle[id];
                if (o.saelgerId === bruger.uid || (!o.saelgerId && o.saelger === bruger.email)) {
                    sletninger["/Opslag/" + id] = null;
                }
            });
            await update(ref(rtdb), sletninger);
            await deleteUser(bruger);
        } catch (e) {
            setArbejder(false);
            setSletFejl(
                e.code === "auth/invalid-credential" || e.code === "auth/wrong-password"
                    ? "Kodeordet er forkert."
                    : "Kunne ikke slette kontoen. Prøv igen."
            );
        }
    };

    return (
        <KeyboardAvoidingView style={GlobalStyle.skaerm} behavior={Platform.OS === "ios" ? "padding" : undefined} keyboardVerticalOffset={100}>
            <TilbageHeaderComponent titel="Indstillinger" onTilbage={() => navigation.goBack()} />
            <ScrollView contentContainerStyle={GlobalStyle.formIndhold} keyboardShouldPersistTaps="handled">
                <View style={GlobalStyle.formKort}>
                    <Text style={GlobalStyle.formKortTitel}>Konto</Text>
                    <View style={GlobalStyle.infoRaekke}>
                        <Ionicons name="mail-outline" size={20} color={FARVER.primaer} />
                        <View style={GlobalStyle.flex1}>
                            <Text style={GlobalStyle.specLabel}>E-mail</Text>
                            <Text style={GlobalStyle.specVaerdiVenstre}>{bruger.email}</Text>
                        </View>
                    </View>
                    {profil?.oprettet ? (
                        <View style={GlobalStyle.infoRaekke}>
                            <Ionicons name="calendar-outline" size={20} color={FARVER.primaer} />
                            <View style={GlobalStyle.flex1}>
                                <Text style={GlobalStyle.specLabel}>Medlem siden</Text>
                                <Text style={GlobalStyle.specVaerdiVenstre}>{new Date(profil.oprettet).toLocaleDateString("da-DK")}</Text>
                            </View>
                        </View>
                    ) : null}
                </View>

                <View style={GlobalStyle.formKort}>
                    <Text style={GlobalStyle.formKortTitel}>Privatliv</Text>
                    <SkifterComponent
                        label="Vis mit telefonnummer"
                        beskrivelse={
                            profil?.telefon
                                ? "Købere kan ringe til dig direkte fra dine opslag."
                                : "Tilføj et telefonnummer under Rediger profil for at bruge denne."
                        }
                        vaerdi={!!profil?.visTelefon && !!profil?.telefon}
                        onSkift={profil?.telefon ? skiftVisTelefon : () => navigation.navigate("RedigerProfil")}
                    />
                </View>

                <View style={GlobalStyle.formKort}>
                    <Text style={GlobalStyle.formKortTitel}>Skift kodeord</Text>
                    <InputComponent label="Nuværende kodeord" value={gammeltKodeord} onChangeText={setGammeltKodeord} secureTextEntry />
                    <InputComponent label="Nyt kodeord" value={nytKodeord} onChangeText={setNytKodeord} placeholder="Mindst 6 tegn" secureTextEntry />
                    <InputComponent label="Gentag nyt kodeord" value={gentagKodeord} onChangeText={setGentagKodeord} secureTextEntry />
                    {kodeordFejl !== "" && <Text style={GlobalStyle.fejl}>{kodeordFejl}</Text>}
                    {kodeordBesked !== "" && <Text style={GlobalStyle.succes}>{kodeordBesked}</Text>}
                    <ButtonComponent titel="Skift kodeord" type="primary" onPress={skiftKodeord} loading={arbejder} />
                </View>

                <View style={GlobalStyle.formKort}>
                    <ButtonComponent titel="Log ud" type="secondary" ikon="log-out-outline" onPress={logUd} />
                </View>

                <View style={[GlobalStyle.formKort, GlobalStyle.fareKort]}>
                    <Text style={[GlobalStyle.formKortTitel, GlobalStyle.fareTitel]}>Slet konto</Text>
                    <Text style={GlobalStyle.hjaelpetekst}>
                        Din profil og alle dine opslag bliver slettet permanent. Det kan ikke fortrydes.
                    </Text>
                    <InputComponent label="Bekræft med dit kodeord" value={sletKodeord} onChangeText={setSletKodeord} secureTextEntry />
                    {sletFejl !== "" && <Text style={GlobalStyle.fejl}>{sletFejl}</Text>}
                    <ButtonComponent
                        titel="Slet min konto"
                        type="fare"
                        ikon="trash-outline"
                        deaktiveret={sletKodeord === "" || arbejder}
                        onPress={() => bekraeft("Slet konto", "Er du sikker? Alt bliver slettet.", "Slet", sletKonto)}
                    />
                </View>

                <Text style={GlobalStyle.versionTekst}>ReStock version 2.0</Text>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
