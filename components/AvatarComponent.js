import { Image, Text, View } from "react-native";
import { initialer } from "../data/funktioner";
import { GlobalStyle } from "../styles/GlobalStyle";

export default function AvatarComponent({ navn, billede, stoerrelse }) {
    const str = stoerrelse || 44;
    const form = { width: str, height: str, borderRadius: str / 2 };

    if (billede) {
        return <Image source={{ uri: billede }} style={[GlobalStyle.avatar, form]} />;
    }
    return (
        <View style={[GlobalStyle.avatar, form]}>
            <Text style={[GlobalStyle.avatarTekst, { fontSize: str * 0.38 }]}>{initialer(navn)}</Text>
        </View>
    );
}
