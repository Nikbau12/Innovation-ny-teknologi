import { Pressable, Text, View } from "react-native";
import AvatarComponent from "./AvatarComponent";
import { formaterKlokkeslaet } from "../data/funktioner";
import { GlobalStyle } from "../styles/GlobalStyle";

export default function SamtaleCard({ navn, opslagTitel, sidsteBesked, tidspunkt, ulaest, onPress }) {
    return (
        <Pressable
            onPress={onPress}
            style={({ pressed }) => [GlobalStyle.samtale, pressed ? GlobalStyle.kortTrykket : null]}
        >
            <AvatarComponent navn={navn} stoerrelse={50} />
            <View style={GlobalStyle.samtaleTekst}>
                <View style={GlobalStyle.samtaleTop}>
                    <Text style={GlobalStyle.samtaleNavn} numberOfLines={1}>
                        {navn}
                    </Text>
                    <Text style={GlobalStyle.samtaleTid}>{formaterKlokkeslaet(tidspunkt)}</Text>
                </View>
                <Text style={GlobalStyle.samtaleOpslag} numberOfLines={1}>
                    {opslagTitel}
                </Text>
                <View style={GlobalStyle.samtaleTop}>
                    <Text style={[GlobalStyle.samtaleBesked, ulaest ? GlobalStyle.samtaleBeskedUlaest : null]} numberOfLines={1}>
                        {sidsteBesked}
                    </Text>
                    {ulaest ? (
                        <View style={GlobalStyle.ulaestPrik}>
                            <Text style={GlobalStyle.ulaestTekst}>{ulaest}</Text>
                        </View>
                    ) : null}
                </View>
            </View>
        </Pressable>
    );
}
