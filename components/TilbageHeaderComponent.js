import { Pressable, Text, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { FARVER, GlobalStyle } from "../styles/GlobalStyle";

export default function TilbageHeaderComponent({ titel, onTilbage, hoejre }) {
    return (
        <View style={GlobalStyle.tilbageHeader}>
            <Pressable accessibilityLabel="Tilbage" onPress={onTilbage} style={GlobalStyle.tilbageKnap} hitSlop={10}>
                <Ionicons name="chevron-back" size={24} color={FARVER.tekst} />
            </Pressable>
            <Text style={GlobalStyle.tilbageTitel} numberOfLines={1}>
                {titel}
            </Text>
            <View style={GlobalStyle.tilbageHoejre}>{hoejre}</View>
        </View>
    );
}
