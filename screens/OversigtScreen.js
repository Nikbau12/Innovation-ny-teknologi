import { useEffect, useState } from "react";
import { FlatList, Pressable, ScrollView, Text, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { ref, onValue } from "firebase/database";
import { rtdb } from "../database/firebase";
import OpslagCard from "../components/OpslagCard";
import ChipComponent from "../components/ChipComponent";
import SoegefeltComponent from "../components/SoegefeltComponent";
import KortComponent from "../components/KortComponent";
import { KATEGORI_IKONER, KATEGORIER, STANDARD_FILTER } from "../data/const";
import {
    antalAktiveFiltre,
    beregnAfstand,
    beregnRegion,
    filtrerOpslag,
    formaterAfstand,
    formaterPris,
    formaterTidSiden,
    regionForRadius,
    sorterOpslag,
} from "../data/funktioner";
import { FARVER, GlobalStyle } from "../styles/GlobalStyle";

export default function OversigtScreen({ navigation, route }) {
    const [opslag, setOpslag] = useState([]);
    const [filter, setFilter] = useState(STANDARD_FILTER);
    const [visKort, setVisKort] = useState(false);

    useEffect(() => {
        const opslagRef = ref(rtdb, "Opslag");
        const unsubscribe = onValue(opslagRef, (snap) => {
            const data = snap.val();
            if (data) {
                const liste = Object.keys(data).map((id) => ({ id: id, ...data[id] }));
                setOpslag(liste.reverse());
            } else {
                setOpslag([]);
            }
        });
        return unsubscribe;
    }, []);

    useEffect(() => {
        if (route.params?.filter) {
            setFilter({ ...STANDARD_FILTER, ...route.params.filter });
        }
    }, [route.params?.filter]);

    const aendrFilter = (aendringer) => setFilter((prev) => ({ ...prev, ...aendringer }));

    const vaelgKategori = (kategori) => aendrFilter({ kategori: kategori, underkategorier: [], egenskaber: {} });

    const filtreret = sorterOpslag(filtrerOpslag(opslag, filter), filter.sortering, filter.center);
    const antalFiltre = antalAktiveFiltre(filter);
    const filtre = ["Alle", ...KATEGORIER];

    const visOpslag = (item) => navigation.navigate("OpslagDetalje", { id: item.id, opslag: item });

    const markoerer = filtreret
        .filter((o) => o.lokation)
        .map((o) => ({
            id: o.id,
            latitude: o.lokation.latitude,
            longitude: o.lokation.longitude,
            titel: o.titel,
            beskrivelse: formaterPris(o) + " · " + (o.sted || ""),
        }));

    return (
        <View style={GlobalStyle.skaerm}>
            <View style={GlobalStyle.oversigtTop}>
                <View style={GlobalStyle.soegRaekke}>
                    <View style={GlobalStyle.flex1}>
                        <SoegefeltComponent
                            value={filter.soegning}
                            onChangeText={(v) => aendrFilter({ soegning: v })}
                            placeholder="Søg i materialer"
                        />
                    </View>
                    <Pressable
                        accessibilityLabel="Filtre"
                        style={[GlobalStyle.filterKnap, antalFiltre > 0 ? GlobalStyle.filterKnapAktiv : null]}
                        onPress={() => navigation.navigate("Filter", { filter: filter })}
                    >
                        <Ionicons name="options-outline" size={22} color={antalFiltre > 0 ? FARVER.hvid : FARVER.primaer} />
                        {antalFiltre > 0 ? (
                            <View style={GlobalStyle.filterTaeller}>
                                <Text style={GlobalStyle.filterTaellerTekst}>{antalFiltre}</Text>
                            </View>
                        ) : null}
                    </Pressable>
                </View>

                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={GlobalStyle.filterRaekke}>
                    {filtre.map((navn, key) => (
                        <ChipComponent
                            key={key}
                            titel={navn}
                            ikon={KATEGORI_IKONER[navn]}
                            valgt={filter.kategori === navn}
                            onPress={() => vaelgKategori(navn)}
                        />
                    ))}
                </ScrollView>

                <View style={GlobalStyle.resultatRaekke}>
                    <View style={GlobalStyle.flex1}>
                        <Text style={GlobalStyle.resultatTekst}>
                            {filtreret.length} opslag
                            {filter.center ? " inden for " + filter.radius + " km af " + filter.center.navn : ""}
                        </Text>
                        <Text style={GlobalStyle.sorteringTekst}>Sorteret efter: {filter.sortering}</Text>
                    </View>
                    {antalFiltre > 0 ? (
                        <Pressable onPress={() => setFilter(STANDARD_FILTER)} hitSlop={8}>
                            <Text style={GlobalStyle.nulstilLink}>Nulstil</Text>
                        </Pressable>
                    ) : null}
                    <View style={GlobalStyle.visningSkift}>
                        <Pressable accessibilityLabel="Vis som liste" style={[GlobalStyle.visningKnap, !visKort ? GlobalStyle.visningKnapValgt : null]} onPress={() => setVisKort(false)}>
                            <Ionicons name="grid-outline" size={18} color={!visKort ? FARVER.hvid : FARVER.primaer} />
                        </Pressable>
                        <Pressable accessibilityLabel="Vis på kort" style={[GlobalStyle.visningKnap, visKort ? GlobalStyle.visningKnapValgt : null]} onPress={() => setVisKort(true)}>
                            <Ionicons name="map-outline" size={18} color={visKort ? FARVER.hvid : FARVER.primaer} />
                        </Pressable>
                    </View>
                </View>
            </View>

            {visKort ? (
                <View style={GlobalStyle.kortFuld}>
                    <KortComponent
                        style={GlobalStyle.flex1}
                        markoerer={markoerer}
                        region={filter.center ? regionForRadius(filter.center, filter.radius) : beregnRegion(markoerer)}
                        cirkel={filter.center ? { ...filter.center, radiusKm: filter.radius } : null}
                        onMarkoerTryk={(id) => visOpslag(filtreret.find((o) => o.id === id))}
                    />
                    <View style={GlobalStyle.kortInfo}>
                        <Ionicons name="information-circle-outline" size={16} color={FARVER.tekstSekundaer} />
                        <Text style={GlobalStyle.kortInfoTekst}>
                            {markoerer.length} af {filtreret.length} opslag har en placering. Tryk på en nål for at se opslaget.
                        </Text>
                    </View>
                </View>
            ) : (
                <FlatList
                    style={GlobalStyle.listeContainer}
                    contentContainerStyle={GlobalStyle.gitterIndhold}
                    columnWrapperStyle={GlobalStyle.gitterRaekke}
                    data={filtreret}
                    numColumns={2}
                    keyExtractor={(item) => item.id}
                    ListEmptyComponent={
                        <View style={GlobalStyle.tomBoks}>
                            <Ionicons name="search-outline" size={44} color={FARVER.primaerMellem} />
                            <Text style={GlobalStyle.tomTitel}>Ingen opslag matcher</Text>
                            <Text style={GlobalStyle.tomTekst}>Prøv at fjerne nogle filtre eller søge efter noget andet.</Text>
                        </View>
                    }
                    renderItem={({ item }) => (
                        <OpslagCard
                            style={GlobalStyle.kortGitter}
                            onPress={() => visOpslag(item)}
                            titel={item.titel}
                            pris={formaterPris(item)}
                            sted={item.sted}
                            afstand={filter.center ? formaterAfstand(beregnAfstand(filter.center, item.lokation)) : ""}
                            kategori={item.kategori}
                            billede={item.billede}
                            status={item.status}
                            stand={item.stand}
                            dato={formaterTidSiden(item)}
                        />
                    )}
                />
            )}
        </View>
    );
}
