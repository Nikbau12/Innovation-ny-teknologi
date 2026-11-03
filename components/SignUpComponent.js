import { useState } from "react";
import { Text, View } from "react-native";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { ref, set } from "firebase/database";
import { auth, rtdb } from "../database/firebase";
import ButtonComponent from "./ButtonComponent";
import InputComponent from "./InputComponent";
import ValgGruppeComponent from "./ValgGruppeComponent";
import { BRUGERTYPER } from "../data/const";
import { GlobalStyle } from "../styles/GlobalStyle";

export default function Signup() {
    const [navn, setNavn] = useState("");
    const [email, setEmail] = useState("");
    const [telefon, setTelefon] = useState("");
    const [postnummer, setPostnummer] = useState("");
    const [by, setBy] = useState("");
    const [brugertype, setBrugertype] = useState(BRUGERTYPER[0]);
    const [password, setPassword] = useState("");
    const [gentagPassword, setGentagPassword] = useState("");
    const [fejl, setFejl] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSignup = async () => {
        if (navn.trim() === "") {
            setFejl("Skriv dit navn, så købere og sælgere ved, hvem de skriver med.");
            return;
        }
        if (postnummer !== "" && !/^\d{4}$/.test(postnummer)) {
            setFejl("Postnummeret skal være 4 cifre.");
            return;
        }
        if (password.length < 6) {
            setFejl("Kodeordet skal være mindst 6 tegn.");
            return;
        }
        if (password !== gentagPassword) {
            setFejl("De to kodeord er ikke ens.");
            return;
        }

        setFejl("");
        setLoading(true);
        try {
            const { user } = await createUserWithEmailAndPassword(auth, email.trim(), password);
            await updateProfile(user, { displayName: navn.trim() });
            await set(ref(rtdb, "/Brugere/" + user.uid), {
                navn: navn.trim(),
                email: email.trim(),
                telefon: telefon.trim(),
                postnummer: postnummer,
                by: by.trim(),
                brugertype: brugertype,
                firmanavn: "",
                cvr: "",
                bio: "",
                profilbillede: "",
                visTelefon: false,
                oprettet: Date.now(),
            });
        } catch (error) {
            setLoading(false);
            if (error.code === "auth/email-already-in-use") {
                setFejl("Der findes allerede en bruger med den e-mail.");
            } else if (error.code === "auth/invalid-email") {
                setFejl("E-mailen er ikke gyldig.");
            } else {
                setFejl("Kunne ikke oprette bruger. Prøv igen.");
            }
        }
    };

    return (
        <View style={GlobalStyle.authBoks}>
            <Text style={GlobalStyle.overskrift}>Opret konto</Text>
            <Text style={GlobalStyle.underOverskrift}>Det er gratis og tager under et minut.</Text>
            <InputComponent label="Fulde navn" value={navn} onChangeText={setNavn} placeholder="F.eks. Mads Hansen" autoCapitalize="words" />
            <InputComponent
                label="E-mail"
                value={email}
                onChangeText={setEmail}
                placeholder="din@mail.dk"
                autoCapitalize="none"
                keyboardType="email-address"
            />
            <InputComponent
                label="Telefon (valgfri)"
                value={telefon}
                onChangeText={setTelefon}
                placeholder="12 34 56 78"
                keyboardType="phone-pad"
            />
            <View style={GlobalStyle.inputRaekke}>
                <View style={GlobalStyle.postnummerFelt}>
                    <InputComponent
                        label="Postnr."
                        value={postnummer}
                        onChangeText={setPostnummer}
                        placeholder="2000"
                        keyboardType="number-pad"
                        maxLength={4}
                    />
                </View>
                <View style={GlobalStyle.flex1}>
                    <InputComponent label="By" value={by} onChangeText={setBy} placeholder="Frederiksberg" autoCapitalize="words" />
                </View>
            </View>
            <ValgGruppeComponent label="Jeg er" valg={BRUGERTYPER} valgt={brugertype} onVaelg={setBrugertype} paakraevet />
            <InputComponent
                label="Kodeord"
                value={password}
                onChangeText={setPassword}
                placeholder="Mindst 6 tegn"
                secureTextEntry
            />
            <InputComponent
                label="Gentag kodeord"
                value={gentagPassword}
                onChangeText={setGentagPassword}
                placeholder="Samme kodeord igen"
                secureTextEntry
            />

            {fejl !== "" && <Text style={GlobalStyle.fejl}>{fejl}</Text>}

            <ButtonComponent titel="Opret konto" type="primary" onPress={handleSignup} loading={loading} />
            <Text style={GlobalStyle.vilkaarTekst}>
                Ved at oprette en konto accepterer du, at dit navn og din by vises på dine opslag.
            </Text>
        </View>
    );
}
