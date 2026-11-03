import { useEffect, useState } from "react";
import { FlatList, Pressable, ScrollView, Text, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { ref, onValue } from "firebase/database";
import { auth, rtdb } from "../database/firebase";
import ButtonComponent from "../components/ButtonComponent";
import OpslagCard from "../components/OpslagCard";
import KategoriComponent from "../components/KategoriComponent";
import SoegefeltComponent from "../components/SoegefeltComponent";
import { KATEGORI_IKONER, KATEGORIER, TRIN } from "../data/const";
import { formaterPris, formaterTidSiden, hentPrisTal } from "../data/funktioner";
import { FARVER, GlobalStyle } from "../styles/GlobalStyle";

export default function ForsideScreen({ navigation }) {
    const [opslag, setOpslag] = useState([]);
    const [profil, setProfil] = useState(null);
    const [soegning, setSoegning] = useState("");

    useEffect(() => {
        const unsubscribe = onValue(ref(rtdb, "Opslag"), (snap) => {
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
        const unsubscribe = onValue(ref(rtdb, "/Brugere/" + auth.currentUser.uid), (snap) => {
            setProfil(snap.val());
        });
        return unsubscribe;
    }, []);

    const aktive = opslag.filter((o) => (o.status || "Til salg") !== "Solgt");
    const nyeste = aktive.slice(0, 10);
    const gratis = aktive.filter((o) => hentPrisTal(o) === 0).slice(0, 10);
    const antalIKategori = (kategori) => aktive.filter((o) => o.kategori === kategori).length;
    const fornavn = (profil?.navn || auth.currentUser?.displayName || "").split(" ")[0];

    const visOversigt = (filter) => {
        navigation.navigate("Oversigt", { screen: "OversigtListe", params: { filter: filter }, pop: true });
    };

    const visOpslag = (item) => {
        navigation.navigate("Oversigt", { screen: "OpslagDetalje", params: { id: item.id, opslag: item }, initial: false });
    };

    const soeg = () => {
        visOversigt({ soegning: soegning.trim() });
        setSoegning("");
    };

    const renderOpslag = ({ item }) => (
        <OpslagCard
            style={GlobalStyle.kortKarrusel}
            onPress={() => visOpslag(item)}
            titel={item.titel}
            pris={formaterPris(item)}
            sted={item.sted}
            kategori={item.kategori}
            billede={item.billede}
            status={item.status}
            dato={formaterTidSiden(item)}
        />
    );

    return (
        <ScrollView style={GlobalStyle.skaerm} contentContainerStyle={GlobalStyle.forsideIndhold} keyboardShouldPersistTaps="handled">
            <View style={GlobalStyle.hero}>
                <View style={GlobalStyle.heroCirkelStor} />
                <View style={GlobalStyle.heroCirkelLille} />
                <Text style={GlobalStyle.heroHilsen}>{fornavn ? "Hej " + fornavn + " 👋" : "Velkommen 👋"}</Text>
                <Text style={GlobalStyle.heroTitel}>Byggematerialer med et nyt liv</Text>
                <Text style={GlobalStyle.heroTekst}>
                    Find billigt træ, fliser, isolering og meget mere fra håndværkere og private i nærheden.
                </Text>
                <SoegefeltComponent
                    value={soegning}
                    onChangeText={setSoegning}
                    onSubmit={soeg}
                    placeholder="Søg fx 'C24 45x95' eller 'gipsplader'"
                />
                <View style={GlobalStyle.heroKnapper}>
                    <View style={GlobalStyle.flex1}>
                        <ButtonComponent titel="Køb" type="accent" ikon="search" onPress={() => visOversigt({})} />
                    </View>
                    <View style={GlobalStyle.flex1}>
                        <ButtonComponent
                            titel="Sælg"
                            type="secondary"
                            ikon="add-circle-outline"
                            onPress={() => navigation.navigate("Opret opslag")}
                        />
                    </View>
                </View>
            </View>

            <View style={GlobalStyle.statRaekke}>
                <View style={GlobalStyle.stat}>
                    <Text style={GlobalStyle.statTal}>{aktive.length}</Text>
                    <Text style={GlobalStyle.statLabel}>aktive opslag</Text>
                </View>
                <View style={GlobalStyle.statSkille} />
                <View style={GlobalStyle.stat}>
                    <Text style={GlobalStyle.statTal}>{aktive.filter((o) => hentPrisTal(o) === 0).length}</Text>
                    <Text style={GlobalStyle.statLabel}>gratis lige nu</Text>
                </View>
                <View style={GlobalStyle.statSkille} />
                <View style={GlobalStyle.stat}>
                    <Text style={GlobalStyle.statTal}>{KATEGORIER.length}</Text>
                    <Text style={GlobalStyle.statLabel}>kategorier</Text>
                </View>
            </View>

            <View style={GlobalStyle.sektionTop}>
                <Text style={GlobalStyle.sektionTitel}>Kategorier</Text>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={GlobalStyle.vandretListe}>
                {KATEGORIER.map((k) => (
                    <KategoriComponent
                        key={k}
                        navn={k}
                        ikon={KATEGORI_IKONER[k]}
                        antal={antalIKategori(k)}
                        onPress={() => visOversigt({ kategori: k })}
                    />
                ))}
            </ScrollView>

            <View style={GlobalStyle.sektionTop}>
                <Text style={GlobalStyle.sektionTitel}>Nyeste opslag</Text>
                <Pressable onPress={() => visOversigt({})}>
                    <Text style={GlobalStyle.sektionLink}>Se alle</Text>
                </Pressable>
            </View>
            {nyeste.length > 0 ? (
                <FlatList
                    data={nyeste}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={GlobalStyle.vandretListe}
                    keyExtractor={(item) => item.id}
                    renderItem={renderOpslag}
                />
            ) : (
                <Text style={GlobalStyle.tomTekst}>Der er ingen opslag endnu - bliv den første!</Text>
            )}

            {gratis.length > 0 ? (
                <View>
                    <View style={GlobalStyle.sektionTop}>
                        <Text style={GlobalStyle.sektionTitel}>Gratis at hente</Text>
                        <Pressable onPress={() => visOversigt({ kunGratis: true })}>
                            <Text style={GlobalStyle.sektionLink}>Se alle</Text>
                        </Pressable>
                    </View>
                    <FlatList
                        data={gratis}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={GlobalStyle.vandretListe}
                        keyExtractor={(item) => item.id}
                        renderItem={renderOpslag}
                    />
                </View>
            ) : null}

            <View style={GlobalStyle.sektionTop}>
                <Text style={GlobalStyle.sektionTitel}>Sådan virker ReStock</Text>
            </View>
            <View style={GlobalStyle.sideMargin}>
                {TRIN.map((t, key) => (
                    <View key={key} style={GlobalStyle.trin}>
                        <View style={GlobalStyle.trinIkon}>
                            <Ionicons name={t.ikon} size={22} color={FARVER.primaer} />
                        </View>
                        <View style={GlobalStyle.flex1}>
                            <Text style={GlobalStyle.trinTitel}>
                                {key + 1}. {t.titel}
                            </Text>
                            <Text style={GlobalStyle.trinTekst}>{t.tekst}</Text>
                        </View>
                    </View>
                ))}
            </View>

            <View style={GlobalStyle.banner}>
                <Ionicons name="cube-outline" size={30} color={FARVER.accent} />
                <Text style={GlobalStyle.bannerTitel}>Har du materialer til overs?</Text>
                <Text style={GlobalStyle.bannerTekst}>
                    Det tager to minutter at lægge et opslag op. Sæt en pris, eller giv det væk gratis.
                </Text>
                <ButtonComponent titel="Opret opslag" type="accent" onPress={() => navigation.navigate("Opret opslag")} />
            </View>
        </ScrollView>
    );
}
