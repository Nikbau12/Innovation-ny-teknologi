import { Text, View } from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { FARVER, GlobalStyle } from "../styles/GlobalStyle";

export default function LogoComponent({ lys, stor }) {
    return (
        <View style={GlobalStyle.logo}>
            <View style={[GlobalStyle.logoIkon, lys ? GlobalStyle.logoIkonLys : null, stor ? GlobalStyle.logoIkonStor : null]}>
                <MaterialCommunityIcons name="recycle" size={stor ? 26 : 18} color={lys ? FARVER.primaer : FARVER.hvid} />
            </View>
            <Text style={[GlobalStyle.logoTekst, lys ? GlobalStyle.logoTekstLys : null, stor ? GlobalStyle.logoTekstStor : null]}>
                Re<Text style={GlobalStyle.logoAccent}>Stock</Text>
            </Text>
        </View>
    );
}
