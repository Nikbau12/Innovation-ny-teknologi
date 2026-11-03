import { useEffect, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { signOut } from "firebase/auth";
import { ref, onValue } from "firebase/database";
import { auth, rtdb } from "../database/firebase";
import AvatarComponent from "../components/AvatarComponent";
import ButtonComponent from "../components/ButtonComponent";
import OpslagCard from "../components/OpslagCard";
import ChipComponent from "../components/ChipComponent";
import { formaterPris, formaterTidSiden } from "../data/funktioner";
import { FARVER, GlobalStyle } from "../styles/GlobalStyle";

export default function ProfilScreen({ navigation }) {
    const [profil, setProfil] = useState(null);
    const [mineOpslag, setMineOpslag] = useState([]);
    const [visning, setVisning] = useState("Aktive");
    const bruger = auth.currentUser;

    useEffect(() => {
        const unsubscribe = onValue(ref(rtdb, "/Brugere/" + bruger.uid), (snap) => {
            setProfil(snap.val());
        });
        return unsubscribe;
    }, []);

    useEffect(() => {
        const unsubscribe = onValue(ref(rtdb, "Opslag"), (snap) => {
            const data = snap.val() || {};
            const liste = Object.keys(data)
                .map((id) => ({ id: id, ...data[id] }))
                .filter((o) => o.saelgerId === bruger.uid || (!o.saelgerId && o.saelger === bruger.email));
            setMineOpslag(liste.reverse());
        });
        return unsubscribe;
    }, []);

    const handleLogout = async () => {
        try {
            await signOut(auth);
        } catch (error) {
            console.error("Logout fejlede:", error.message);
        }
    };

    const status = (o) => o.status || "Til salg";
    const aktive = mineOpslag.filter((o) => status(o) !== "Solgt");
    const solgte = mineOpslag.filter((o) => status(o) === "Solgt");
    const viste = visning === "Aktive" ? aktive : solgte;
    const navn = profil?.navn || bruger.displayName || bruger.email;

    return (
        <ScrollView style={GlobalStyle.skaerm} contentContainerStyle={GlobalStyle.profilIndhold}>
            <View style={GlobalStyle.profilKort}>
                <AvatarComponent navn={navn} billede={profil?.profilbillede} stoerrelse={84} />
                <Text style={GlobalStyle.profilNavn}>{profil?.firmanavn || navn}</Text>
                {profil?.firmanavn ? <Text style={GlobalStyle.detaljeLabel}>{navn}</Text> : null}
                <View style={GlobalStyle.profilMeta}>
                    {profil?.brugertype ? (
                        <View style={GlobalStyle.typeBadge}>
                            <Text style={GlobalStyle.typeBadgeTekst}>{profil.brugertype}</Text>
                        </View>
                    ) : null}
                    {profil?.by ? (
                        <Text style={GlobalStyle.detaljeLabel}>
                            <Ionicons name="location-outline" size={13} /> {[profil.postnummer, profil.by].filter(Boolean).join(" ")}
                        </Text>
                    ) : null}
                </View>
                <Text style={GlobalStyle.detaljeLabel}>{bruger.email}</Text>
                {profil?.bio ? <Text style={GlobalStyle.profilBio}>{profil.bio}</Text> : null}

                <View style={GlobalStyle.profilStats}>
                    <View style={GlobalStyle.stat}>
                        <Text style={GlobalStyle.statTal}>{aktive.length}</Text>
                        <Text style={GlobalStyle.statLabel}>aktive</Text>
                    </View>
                    <View style={GlobalStyle.statSkille} />
                    <View style={GlobalStyle.stat}>
                        <Text style={GlobalStyle.statTal}>{mineOpslag.filter((o) => status(o) === "Reserveret").length}</Text>
                        <Text style={GlobalStyle.statLabel}>reserveret</Text>
                    </View>
                    <View style={GlobalStyle.statSkille} />
                    <View style={GlobalStyle.stat}>
                        <Text style={GlobalStyle.statTal}>{solgte.length}</Text>
                        <Text style={GlobalStyle.statLabel}>solgt</Text>
                    </View>
                </View>
            </View>

            {!profil ? (
                <Pressable style={GlobalStyle.advarselBoks} onPress={() => navigation.navigate("RedigerProfil")}>
                    <Ionicons name="alert-circle-outline" size={22} color={FARVER.advarsel} />
                    <Text style={GlobalStyle.advarselTekst}>Udfyld din profil, så købere kan se, hvem de handler med.</Text>
                    <Ionicons name="chevron-forward" size={20} color={FARVER.advarsel} />
                </Pressable>
            ) : null}

            <View style={GlobalStyle.menu}>
                <Pressable style={GlobalStyle.menuPunkt} onPress={() => navigation.navigate("RedigerProfil")}>
                    <Ionicons name="person-outline" size={22} color={FARVER.primaer} />
                    <Text style={GlobalStyle.menuTekst}>Rediger profil</Text>
                    <Ionicons name="chevron-forward" size={20} color={FARVER.tekstSvag} />
                </Pressable>
                <Pressable style={GlobalStyle.menuPunkt} onPress={() => navigation.navigate("Indstillinger")}>
                    <Ionicons name="settings-outline" size={22} color={FARVER.primaer} />
                    <Text style={GlobalStyle.menuTekst}>Indstillinger og sikkerhed</Text>
                    <Ionicons name="chevron-forward" size={20} color={FARVER.tekstSvag} />
                </Pressable>
                <Pressable style={GlobalStyle.menuPunkt} onPress={() => navigation.navigate("Beskeder")}>
                    <Ionicons name="chatbubbles-outline" size={22} color={FARVER.primaer} />
                    <Text style={GlobalStyle.menuTekst}>Mine beskeder</Text>
                    <Ionicons name="chevron-forward" size={20} color={FARVER.tekstSvag} />
                </Pressable>
                <Pressable style={[GlobalStyle.menuPunkt, GlobalStyle.menuPunktSidste]} onPress={handleLogout}>
                    <Ionicons name="log-out-outline" size={22} color={FARVER.fare} />
                    <Text style={[GlobalStyle.menuTekst, GlobalStyle.fareTitel]}>Log ud</Text>
                </Pressable>
            </View>

            <View style={GlobalStyle.sektionTopIndre}>
                <Text style={GlobalStyle.sektionTitel}>Mine opslag</Text>
                <View style={GlobalStyle.chipRaekke}>
                    <ChipComponent titel={"Aktive (" + aktive.length + ")"} valgt={visning === "Aktive"} onPress={() => setVisning("Aktive")} />
                    <ChipComponent titel={"Solgte (" + solgte.length + ")"} valgt={visning === "Solgte"} onPress={() => setVisning("Solgte")} />
                </View>
            </View>

            {viste.length > 0 ? (
                <View style={GlobalStyle.gitter}>
                    {viste.map((item) => (
                        <OpslagCard
                            key={item.id}
                            style={GlobalStyle.kortGitter}
                            onPress={() => navigation.navigate("OpslagDetalje", { id: item.id, opslag: item })}
                            titel={item.titel}
                            pris={formaterPris(item)}
                            sted={item.sted}
                            kategori={item.kategori}
                            billede={item.billede}
                            status={item.status}
                            dato={formaterTidSiden(item)}
                        />
                    ))}
                </View>
            ) : (
                <View style={GlobalStyle.tomBoks}>
                    <Ionicons name="cube-outline" size={44} color={FARVER.primaerMellem} />
                    <Text style={GlobalStyle.tomTekst}>
                        {visning === "Aktive" ? "Du har ingen aktive opslag." : "Du har ikke markeret noget som solgt endnu."}
                    </Text>
                    {visning === "Aktive" ? (
                        <ButtonComponent titel="Opret dit første opslag" type="primary" onPress={() => navigation.navigate("Opret opslag")} />
                    ) : null}
                </View>
            )}
        </ScrollView>
    );
}
