import { Pressable, Text, View } from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { FARVER, GlobalStyle } from "../styles/GlobalStyle";

export default function KategoriComponent({ navn, ikon, antal, onPress }) {
    return (
        <Pressable onPress={onPress} style={({ pressed }) => [GlobalStyle.kategoriFlise, pressed ? GlobalStyle.kortTrykket : null]}>
            <View style={GlobalStyle.kategoriIkon}>
                <MaterialCommunityIcons name={ikon} size={26} color={FARVER.primaer} />
            </View>
            <Text style={GlobalStyle.kategoriNavn} numberOfLines={2}>
                {navn}
            </Text>
            <Text style={GlobalStyle.kategoriAntal}>{antal} opslag</Text>
        </Pressable>
    );
}
