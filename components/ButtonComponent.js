import { ActivityIndicator, Pressable, Text } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { GlobalStyle } from "../styles/GlobalStyle";

export default function ButtonComponent({ titel, onPress, type, ikon, deaktiveret, loading }) {
    const boks =
        type === "primary"
            ? GlobalStyle.primaryBtn
            : type === "fare"
              ? GlobalStyle.fareBtn
              : type === "accent"
                ? GlobalStyle.accentBtn
                : GlobalStyle.secondaryBtn;
    const tekst =
        type === "primary"
            ? GlobalStyle.primaryBtnText
            : type === "fare"
              ? GlobalStyle.fareBtnText
              : type === "accent"
                ? GlobalStyle.accentBtnText
                : GlobalStyle.secondaryBtnText;

    return (
        <Pressable
            disabled={deaktiveret || loading}
            style={({ pressed }) => [
                { backgroundColor: pressed ? boks.pressedColor : boks.defaultColor },
                boks,
                deaktiveret ? GlobalStyle.knapDeaktiveret : null,
            ]}
            onPress={onPress}
        >
            {loading ? (
                <ActivityIndicator color={tekst.color} />
            ) : (
                <>
                    {ikon ? <Ionicons name={ikon} size={18} color={tekst.color} style={GlobalStyle.knapIkon} /> : null}
                    <Text style={tekst}>{titel}</Text>
                </>
            )}
        </Pressable>
    );
}
