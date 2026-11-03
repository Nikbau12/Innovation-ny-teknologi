import { useEffect, useState } from "react";
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, View } from "react-native";
import * as ImagePicker from "expo-image-picker";
import Ionicons from "@expo/vector-icons/Ionicons";
import { updateProfile } from "firebase/auth";
import { ref, get, update } from "firebase/database";
import { auth, rtdb } from "../../database/firebase";
import AvatarComponent from "../../components/AvatarComponent";
import ButtonComponent from "../../components/ButtonComponent";
import InputComponent from "../../components/InputComponent";
import ValgGruppeComponent from "../../components/ValgGruppeComponent";
import TilbageHeaderComponent from "../../components/TilbageHeaderComponent";
import { BRUGERTYPER } from "../../data/const";
import { FARVER, GlobalStyle } from "../../styles/GlobalStyle";

export default function RedigerProfilScreen({ navigation }) {
    const bruger = auth.currentUser;
    const [navn, setNavn] = useState(bruger.displayName || "");
    const [telefon, setTelefon] = useState("");
    const [postnummer, setPostnummer] = useState("");
    const [by, setBy] = useState("");
    const [brugertype, setBrugertype] = useState(BRUGERTYPER[0]);
    const [firmanavn, setFirmanavn] = useState("");
    const [cvr, setCvr] = useState("");
    const [bio, setBio] = useState("");
    const [profilbillede, setProfilbillede] = useState("");
    const [harProfil, setHarProfil] = useState(false);
    const [fejl, setFejl] = useState("");
    const [gemmer, setGemmer] = useState(false);

    useEffect(() => {
        get(ref(rtdb, "/Brugere/" + bruger.uid)).then((snap) => {
            const p = snap.val();
            if (!p) return;
            setHarProfil(true);
            setNavn(p.navn || "");
            setTelefon(p.telefon || "");
            setPostnummer(p.postnummer || "");
            setBy(p.by || "");
            setBrugertype(p.brugertype || BRUGERTYPER[0]);
            setFirmanavn(p.firmanavn || "");
            setCvr(p.cvr || "");
            setBio(p.bio || "");
            setProfilbillede(p.profilbillede || "");
        });
    }, []);

    const vaelgBillede = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ["images"],
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.15,
            base64: true,
        });

        if (!result.canceled) {
            setProfilbillede("data:image/jpeg;base64," + result.assets[0].base64);
        }
    };

    const gem = async () => {
        if (navn.trim() === "") {
            setFejl("Dit navn skal udfyldes.");
            return;
        }
        if (postnummer !== "" && !/^\d{4}$/.test(postnummer)) {
            setFejl("Postnummeret skal være 4 cifre.");
            return;
        }
        if (cvr !== "" && !/^\d{8}$/.test(cvr)) {
            setFejl("Et CVR-nummer er 8 cifre.");
            return;
        }

        const erPrivat = brugertype === "Privat";
        const profil = {
            navn: navn.trim(),
            telefon: telefon.trim(),
            postnummer: postnummer,
            by: by.trim(),
            brugertype: brugertype,
            firmanavn: erPrivat ? "" : firmanavn.trim(),
            cvr: erPrivat ? "" : cvr,
            bio: bio.trim(),
            profilbillede: profilbillede,
        };
        if (!harProfil) {
            profil.email = bruger.email;
            profil.oprettet = Date.now();
            profil.visTelefon = false;
        }

        setGemmer(true);
        setFejl("");
        try {
            await update(ref(rtdb, "/Brugere/" + bruger.uid), profil);
            await updateProfile(bruger, { displayName: navn.trim() });

            const snap = await get(ref(rtdb, "Opslag"));
            const alle = snap.val() || {};
            const opdateringer = {};
            Object.keys(alle).forEach((id) => {
                const o = alle[id];
                if (o.saelgerId === bruger.uid || (!o.saelgerId && o.saelger === bruger.email)) {
                    opdateringer["/Opslag/" + id + "/saelgerId"] = bruger.uid;
                    opdateringer["/Opslag/" + id + "/saelgerNavn"] = profil.navn;
                    opdateringer["/Opslag/" + id + "/saelgerType"] = brugertype;
                }
            });
            if (Object.keys(opdateringer).length > 0) {
                await update(ref(rtdb), opdateringer);
            }
        } catch (e) {
            setFejl(e?.message || "Kunne ikke gemme profilen.");
            setGemmer(false);
            return;
        }

        navigation.goBack();
    };

    return (
        <KeyboardAvoidingView style={GlobalStyle.skaerm} behavior={Platform.OS === "ios" ? "padding" : undefined} keyboardVerticalOffset={100}>
            <TilbageHeaderComponent titel="Rediger profil" onTilbage={() => navigation.goBack()} />
            <ScrollView contentContainerStyle={GlobalStyle.formIndhold} keyboardShouldPersistTaps="handled">
                <View style={GlobalStyle.profilBilledeVaelger}>
                    <Pressable onPress={vaelgBillede}>
                        <AvatarComponent navn={navn || bruger.email} billede={profilbillede} stoerrelse={96} />
                        <View style={GlobalStyle.kameraBadge}>
                            <Ionicons name="camera" size={16} color={FARVER.hvid} />
                        </View>
                    </Pressable>
                    {profilbillede !== "" ? (
                        <Pressable onPress={() => setProfilbillede("")}>
                            <Text style={GlobalStyle.fjernLink}>Fjern billede</Text>
                        </Pressable>
                    ) : (
                        <Text style={GlobalStyle.hjaelpetekst}>Tryk for at vælge et profilbillede</Text>
                    )}
                </View>

                <View style={GlobalStyle.formKort}>
                    <Text style={GlobalStyle.formKortTitel}>Om dig</Text>
                    <InputComponent label="Fulde navn *" value={navn} onChangeText={setNavn} placeholder="F.eks. Mads Hansen" autoCapitalize="words" />
                    <ValgGruppeComponent label="Jeg er" valg={BRUGERTYPER} valgt={brugertype} onVaelg={setBrugertype} paakraevet />
                    {brugertype !== "Privat" ? (
                        <View>
                            <InputComponent label="Firmanavn" value={firmanavn} onChangeText={setFirmanavn} placeholder="F.eks. Hansens Tømrerfirma ApS" />
                            <InputComponent label="CVR-nummer" value={cvr} onChangeText={setCvr} placeholder="12345678" keyboardType="number-pad" maxLength={8} />
                        </View>
                    ) : null}
                    <InputComponent
                        label="Kort om dig"
                        value={bio}
                        onChangeText={setBio}
                        placeholder="F.eks. Tømrer i Aarhus - sælger ofte overskydende træ fra byggepladser."
                        multiline
                        maxLength={300}
                    />
                </View>

                <View style={GlobalStyle.formKort}>
                    <Text style={GlobalStyle.formKortTitel}>Kontakt og placering</Text>
                    <InputComponent
                        label="Telefon"
                        value={telefon}
                        onChangeText={setTelefon}
                        placeholder="12 34 56 78"
                        keyboardType="phone-pad"
                        hjaelpetekst="Vises kun, hvis du slår det til under Indstillinger."
                    />
                    <View style={GlobalStyle.inputRaekke}>
                        <View style={GlobalStyle.postnummerFelt}>
                            <InputComponent label="Postnr." value={postnummer} onChangeText={setPostnummer} placeholder="2000" keyboardType="number-pad" maxLength={4} />
                        </View>
                        <View style={GlobalStyle.flex1}>
                            <InputComponent label="By" value={by} onChangeText={setBy} placeholder="Frederiksberg" autoCapitalize="words" />
                        </View>
                    </View>
                </View>

                {fejl !== "" && <Text style={GlobalStyle.fejl}>{fejl}</Text>}

                <View style={GlobalStyle.knapContainer}>
                    <ButtonComponent titel="Gem profil" type="primary" onPress={gem} loading={gemmer} />
                    <ButtonComponent titel="Fortryd" type="secondary" onPress={() => navigation.goBack()} />
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
