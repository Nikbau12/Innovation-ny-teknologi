import { Pressable, Text } from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { FARVER, GlobalStyle } from "../styles/GlobalStyle";

export default function ChipComponent({ titel, valgt, onPress, ikon }) {
    return (
        <Pressable
            onPress={onPress}
            style={({ pressed }) => [
                GlobalStyle.chip,
                valgt ? GlobalStyle.chipValgt : null,
                pressed ? GlobalStyle.chipTrykket : null,
            ]}
        >
            {ikon ? (
                <MaterialCommunityIcons
                    name={ikon}
                    size={16}
                    color={valgt ? FARVER.hvid : FARVER.primaer}
                    style={GlobalStyle.chipIkon}
                />
            ) : null}
            <Text style={[GlobalStyle.chipTekst, valgt ? GlobalStyle.chipTekstValgt : null]}>{titel}</Text>
        </Pressable>
    );
}
