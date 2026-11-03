import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { sendPasswordResetEmail, signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../database/firebase";
import ButtonComponent from "./ButtonComponent";
import InputComponent from "./InputComponent";
import { GlobalStyle } from "../styles/GlobalStyle";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [fejl, setFejl] = useState("");
    const [besked, setBesked] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        setFejl("");
        setBesked("");
        setLoading(true);
        try {
            await signInWithEmailAndPassword(auth, email.trim(), password);
        } catch (error) {
            setFejl("Login fejlede. Tjek e-mail og kodeord.");
            setLoading(false);
        }
    };

    const glemtKodeord = async () => {
        setFejl("");
        setBesked("");
        if (email.trim() === "") {
            setFejl("Skriv din e-mail i feltet ovenfor, så sender vi et link.");
            return;
        }
        try {
            await sendPasswordResetEmail(auth, email.trim());
            setBesked("Vi har sendt et link til at nulstille dit kodeord til " + email.trim() + ".");
        } catch (error) {
            setFejl("Kunne ikke sende mail. Tjek at e-mailen er rigtig.");
        }
    };

    return (
        <View style={GlobalStyle.authBoks}>
            <Text style={GlobalStyle.overskrift}>Velkommen tilbage</Text>
            <Text style={GlobalStyle.underOverskrift}>Log ind for at købe, sælge og skrive med andre.</Text>
            <InputComponent
                label="E-mail"
                value={email}
                onChangeText={setEmail}
                placeholder="din@mail.dk"
                autoCapitalize="none"
                keyboardType="email-address"
            />
            <InputComponent
                label="Kodeord"
                value={password}
                onChangeText={setPassword}
                placeholder="Kodeord"
                secureTextEntry
            />

            <Pressable onPress={glemtKodeord}>
                <Text style={GlobalStyle.glemtLink}>Glemt kodeord?</Text>
            </Pressable>

            {fejl !== "" && <Text style={GlobalStyle.fejl}>{fejl}</Text>}
            {besked !== "" && <Text style={GlobalStyle.succes}>{besked}</Text>}

            <ButtonComponent titel="Log ind" type="primary" onPress={handleLogin} loading={loading} />
        </View>
    );
}
