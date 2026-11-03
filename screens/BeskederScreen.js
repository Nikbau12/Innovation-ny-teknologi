import { useEffect, useState } from "react";
import { FlatList, Text, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { ref, onValue } from "firebase/database";
import { auth, rtdb } from "../database/firebase";
import SamtaleCard from "../components/SamtaleCard";
import ButtonComponent from "../components/ButtonComponent";
import { FARVER, GlobalStyle } from "../styles/GlobalStyle";

export default function BeskederScreen({ navigation }) {
    const [samtaler, setSamtaler] = useState([]);

    useEffect(() => {
        const unsubscribe = onValue(ref(rtdb, "/BrugerSamtaler/" + auth.currentUser.uid), (snap) => {
            const data = snap.val();
            if (data) {
                const liste = Object.keys(data)
                    .map((id) => ({ id: id, ...data[id] }))
                    .filter((s) => s.modpartId)
                    .sort((a, b) => (b.sidsteTidspunkt || 0) - (a.sidsteTidspunkt || 0));
                setSamtaler(liste);
            } else {
                setSamtaler([]);
            }
        });
        return unsubscribe;
    }, []);

    return (
        <View style={GlobalStyle.skaerm}>
            <View style={GlobalStyle.sideTop}>
                <Text style={GlobalStyle.overskrift}>Beskeder</Text>
                <Text style={GlobalStyle.underOverskrift}>Dine samtaler med købere og sælgere</Text>
            </View>
            <FlatList
                data={samtaler}
                keyExtractor={(item) => item.id}
                contentContainerStyle={GlobalStyle.samtaleListe}
                renderItem={({ item }) => (
                    <SamtaleCard
                        navn={item.modpartNavn}
                        opslagTitel={item.opslagTitel}
                        sidsteBesked={item.sidsteBesked}
                        tidspunkt={item.sidsteTidspunkt}
                        ulaest={item.ulaest}
                        onPress={() =>
                            navigation.navigate("Chat", {
                                samtaleId: item.id,
                                modpartId: item.modpartId,
                                modpartNavn: item.modpartNavn,
                                opslagId: item.opslagId,
                                opslagTitel: item.opslagTitel,
                            })
                        }
                    />
                )}
                ListEmptyComponent={
                    <View style={GlobalStyle.tomBoks}>
                        <Ionicons name="chatbubbles-outline" size={50} color={FARVER.primaerMellem} />
                        <Text style={GlobalStyle.tomTitel}>Ingen beskeder endnu</Text>
                        <Text style={GlobalStyle.tomTekst}>
                            Find et opslag og tryk på "Skriv til sælger". Når nogen skriver til dig om dine opslag, dukker samtalen også op her.
                        </Text>
                        <ButtonComponent
                            titel="Find materialer"
                            type="primary"
                            onPress={() => navigation.navigate("Oversigt", { screen: "OversigtListe", pop: true })}
                        />
                    </View>
                }
            />
        </View>
    );
}
