import { useState } from "react";
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, View } from "react-native";
import Login from "../components/LogInComponent";
import Signup from "../components/SignUpComponent";
import LogoComponent from "../components/LogoComponent";
import { GlobalStyle } from "../styles/GlobalStyle";

export default function AuthScreen() {
    const [isLogin, setIsLogin] = useState(true);

    return (
        <KeyboardAvoidingView style={GlobalStyle.skaerm} behavior={Platform.OS === "ios" ? "padding" : undefined}>
            <ScrollView contentContainerStyle={GlobalStyle.authIndhold} keyboardShouldPersistTaps="handled">
                <View style={GlobalStyle.authLogo}>
                    <LogoComponent stor />
                </View>

                <View style={GlobalStyle.authKort}>
                    <View style={GlobalStyle.segment}>
                        <Pressable style={[GlobalStyle.segmentKnap, isLogin ? GlobalStyle.segmentValgt : null]} onPress={() => setIsLogin(true)}>
                            <Text style={[GlobalStyle.segmentTekst, isLogin ? GlobalStyle.segmentTekstValgt : null]}>Log ind</Text>
                        </Pressable>
                        <Pressable style={[GlobalStyle.segmentKnap, !isLogin ? GlobalStyle.segmentValgt : null]} onPress={() => setIsLogin(false)}>
                            <Text style={[GlobalStyle.segmentTekst, !isLogin ? GlobalStyle.segmentTekstValgt : null]}>Opret konto</Text>
                        </Pressable>
                    </View>

                    {isLogin ? <Login /> : <Signup />}

                    <Pressable onPress={() => setIsLogin((prev) => !prev)}>
                        <Text style={GlobalStyle.skiftLink}>
                            {isLogin ? "Har du ikke en konto? Opret en" : "Har du en konto? Log ind"}
                        </Text>
                    </Pressable>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
