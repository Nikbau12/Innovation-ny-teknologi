import { Text, View } from "react-native";
import { formaterKlokkeslaet } from "../data/funktioner";
import { GlobalStyle } from "../styles/GlobalStyle";

export default function BeskedBobleComponent({ tekst, tidspunkt, erMin }) {
    return (
        <View style={[GlobalStyle.boble, erMin ? GlobalStyle.bobleMin : GlobalStyle.bobleAnden]}>
            <Text style={[GlobalStyle.bobleTekst, erMin ? GlobalStyle.bobleTekstMin : null]}>{tekst}</Text>
            <Text style={[GlobalStyle.bobleTid, erMin ? GlobalStyle.bobleTidMin : null]}>
                {formaterKlokkeslaet(tidspunkt)}
            </Text>
        </View>
    );
}
