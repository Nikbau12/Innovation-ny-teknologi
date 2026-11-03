import { Pressable, Text, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import BilledeComponent from "./BilledeComponent";
import { KATEGORI_IKONER } from "../data/const";
import { FARVER, GlobalStyle } from "../styles/GlobalStyle";

export default function OpslagCard({ titel, pris, sted, afstand, kategori, billede, dato, status, stand, style, onPress }) {
    const erGratis = pris === "Gratis";

    return (
        <Pressable
            onPress={onPress}
            style={({ pressed }) => [GlobalStyle.kort, style, pressed && onPress ? GlobalStyle.kortTrykket : null]}
        >
            <View>
                {billede ? (
                    <BilledeComponent url={{ uri: billede }} style={GlobalStyle.kortBillede} />
                ) : (
                    <View style={[GlobalStyle.kortBillede, GlobalStyle.kortPladsholder]}>
                        <MaterialCommunityIcons
                            name={KATEGORI_IKONER[kategori] || "package-variant"}
                            size={40}
                            color={FARVER.primaerMellem}
                        />
                    </View>
                )}
                {status && status !== "Til salg" ? (
                    <View style={[GlobalStyle.kortBadge, status === "Solgt" ? GlobalStyle.badgeSolgt : GlobalStyle.badgeReserveret]}>
                        <Text style={GlobalStyle.kortBadgeTekst}>{status}</Text>
                    </View>
                ) : erGratis ? (
                    <View style={[GlobalStyle.kortBadge, GlobalStyle.badgeGratis]}>
                        <Text style={GlobalStyle.kortBadgeTekst}>Gratis</Text>
                    </View>
                ) : null}
            </View>

            <View style={GlobalStyle.kortTekst}>
                <Text style={GlobalStyle.kortPris} numberOfLines={1}>
                    {pris}
                </Text>
                <Text style={GlobalStyle.kortTitel} numberOfLines={2}>
                    {titel}
                </Text>
                {stand ? (
                    <Text style={GlobalStyle.kortMateriale} numberOfLines={1}>
                        {stand}
                    </Text>
                ) : null}
                <View style={GlobalStyle.kortBund}>
                    <Ionicons name="location-outline" size={13} color={FARVER.tekstSvag} />
                    <Text style={GlobalStyle.kortSted} numberOfLines={1}>
                        {afstand ? afstand + " · " : ""}
                        {sted || "Ukendt sted"}
                    </Text>
                </View>
                {dato ? <Text style={GlobalStyle.kortSaelger}>{dato}</Text> : null}
            </View>
        </Pressable>
    );
}
