import { Switch, Text, View } from "react-native";
import { FARVER, GlobalStyle } from "../styles/GlobalStyle";

export default function SkifterComponent({ label, beskrivelse, vaerdi, onSkift }) {
    return (
        <View style={GlobalStyle.skifter}>
            <View style={GlobalStyle.flex1}>
                <Text style={GlobalStyle.skifterLabel}>{label}</Text>
                {beskrivelse ? <Text style={GlobalStyle.hjaelpetekst}>{beskrivelse}</Text> : null}
            </View>
            <Switch
                value={vaerdi}
                onValueChange={onSkift}
                trackColor={{ false: FARVER.kant, true: FARVER.primaerMellem }}
                thumbColor={vaerdi ? FARVER.primaer : FARVER.hvid}
                activeThumbColor={FARVER.primaer}
            />
        </View>
    );
}
