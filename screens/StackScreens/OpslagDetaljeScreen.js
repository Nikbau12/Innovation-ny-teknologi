import { useEffect, useRef, useState } from "react";
import { ActivityIndicator, Alert, Linking, Platform, Pressable, ScrollView, Text, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { ref, onValue, remove, update } from "firebase/database";
import { auth, rtdb } from "../../database/firebase";
import BilledeComponent from "../../components/BilledeComponent";
import ButtonComponent from "../../components/ButtonComponent";
import AvatarComponent from "../../components/AvatarComponent";
import KortComponent from "../../components/KortComponent";
import ValgGruppeComponent from "../../components/ValgGruppeComponent";
import TilbageHeaderComponent from "../../components/TilbageHeaderComponent";
import { KATEGORI_IKONER, MATERIALE_DETALJER, STATUS } from "../../data/const";
import { beregnRegion, formaterMaal, formaterPris, formaterTal, formaterTidSiden, lavSamtaleId } from "../../data/funktioner";
import { FARVER, GlobalStyle } from "../../styles/GlobalStyle";

export default function OpslagDetaljeScreen({ navigation, route }) {
    const id = route.params.id;
    const [opslag, setOpslag] = useState(route.params.opslag || null);
    const [saelger, setSaelger] = useState(null);
    const [fejl, setFejl] = useState("");
    const sletter = useRef(false);

    useEffect(() => {
        const opslagRef = ref(rtdb, "/Opslag/" + id);
        const unsubscribe = onValue(opslagRef, (snap) => {
            const data = snap.val();
            if (data) {
                setOpslag({ id: id, ...data });
            } else if (!sletter.current) {
                navigation.goBack();
            }
        });
        return unsubscribe;
    }, [id]);

    const saelgerId = opslag?.saelgerId;
    useEffect(() => {
        if (!saelgerId) return;
        const unsubscribe = onValue(ref(rtdb, "/Brugere/" + saelgerId), (snap) => {
            setSaelger(snap.val());
        });
        return unsubscribe;
    }, [saelgerId]);

    if (!opslag) {
        return (
            <View style={GlobalStyle.centreret}>
                <ActivityIndicator color={FARVER.primaer} size="large" />
            </View>
        );
    }

    const erMitOpslag = opslag.saelgerId
        ? opslag.saelgerId === auth.currentUser?.uid
        : opslag.saelger === auth.currentUser?.email;
    const saelgerNavn = saelger?.navn || opslag.saelgerNavn || opslag.saelger;
    const status = opslag.status || "Til salg";
    const egenskaber = opslag.egenskaber || {};
    const detaljer = MATERIALE_DETALJER[opslag.kategori];

    const specifikationer = [
        { label: "Kategori", vaerdi: opslag.kategori },
        { label: "Type", vaerdi: opslag.underkategori },
        ...(detaljer ? detaljer.egenskaber.map((e) => ({ label: e.label, vaerdi: egenskaber[e.noegle] })) : []),
        { label: "Stand", vaerdi: opslag.stand },
        { label: "Mængde", vaerdi: opslag.maengde !== "" && opslag.maengde !== undefined ? formaterTal(opslag.maengde) + " " + (opslag.enhed || "") : "" },
        { label: "Mål pr. stk.", vaerdi: formaterMaal(opslag) },
        { label: "Mærke", vaerdi: opslag.maerke },
        { label: "Pris", vaerdi: opslag.prisType },
        { label: "Levering", vaerdi: opslag.levering },
    ].filter((s) => s.vaerdi);

    const slet = async () => {
        sletter.current = true;
        try {
            await remove(ref(rtdb, "/Opslag/" + id));
            navigation.goBack();
        } catch (e) {
            sletter.current = false;
            setFejl(e?.message || "Kunne ikke slette opslaget.");
        }
    };

    const bekraeftSlet = () => {
        if (Platform.OS === "web") {
            if (window.confirm("Slet opslaget? Det kan ikke fortrydes.")) slet();
            return;
        }
        Alert.alert("Slet opslag", "Er du sikker? Det kan ikke fortrydes.", [
            { text: "Fortryd", style: "cancel" },
            { text: "Slet", style: "destructive", onPress: slet },
        ]);
    };

    const skiftStatus = async (nyStatus) => {
        try {
            await update(ref(rtdb, "/Opslag/" + id), { status: nyStatus });
        } catch (e) {
            setFejl(e?.message || "Kunne ikke ændre status.");
        }
    };

    const skrivTilSaelger = () => {
        navigation.navigate("Chat", {
            samtaleId: lavSamtaleId(id, auth.currentUser.uid),
            modpartId: opslag.saelgerId,
            modpartNavn: saelgerNavn,
            opslagId: id,
            opslagTitel: opslag.titel,
            fraOpslag: true,
        });
    };

    const aabnIKort = () => {
        const { latitude, longitude } = opslag.lokation;
        Linking.openURL("https://www.google.com/maps/search/?api=1&query=" + latitude + "," + longitude);
    };

    return (
        <View style={GlobalStyle.skaerm}>
            <TilbageHeaderComponent titel={opslag.kategori || "Opslag"} onTilbage={() => navigation.goBack()} />
            <ScrollView contentContainerStyle={GlobalStyle.detaljeIndhold}>
                <View>
                    {opslag.billede ? (
                        <BilledeComponent url={{ uri: opslag.billede }} style={GlobalStyle.detaljeBillede} />
                    ) : (
                        <View style={[GlobalStyle.detaljeBillede, GlobalStyle.kortPladsholder]}>
                            <MaterialCommunityIcons name={KATEGORI_IKONER[opslag.kategori] || "package-variant"} size={70} color={FARVER.primaerMellem} />
                            <Text style={GlobalStyle.billedTekst}>Der er ikke lagt et billede op til dette opslag.</Text>
                        </View>
                    )}
                    {status !== "Til salg" ? (
                        <View style={[GlobalStyle.kortBadge, status === "Solgt" ? GlobalStyle.badgeSolgt : GlobalStyle.badgeReserveret]}>
                            <Text style={GlobalStyle.kortBadgeTekst}>{status}</Text>
                        </View>
                    ) : null}
                </View>

                <View style={GlobalStyle.detaljeKort}>
                    <Text style={GlobalStyle.detaljePris}>{formaterPris(opslag)}</Text>
                    <Text style={GlobalStyle.detaljeTitel}>{opslag.titel}</Text>
                    <View style={GlobalStyle.detaljeMeta}>
                        <Ionicons name="location-outline" size={15} color={FARVER.tekstSekundaer} />
                        <Text style={GlobalStyle.detaljeLabel}>{[opslag.postnummer, opslag.sted].filter(Boolean).join(" ") || "Ukendt sted"}</Text>
                        <Ionicons name="time-outline" size={15} color={FARVER.tekstSekundaer} style={GlobalStyle.metaIkon} />
                        <Text style={GlobalStyle.detaljeLabel}>{formaterTidSiden(opslag)}</Text>
                    </View>
                </View>

                {specifikationer.length > 0 ? (
                    <View style={GlobalStyle.detaljeKort}>
                        <Text style={GlobalStyle.formKortTitel}>Specifikationer</Text>
                        {specifikationer.map((s, key) => (
                            <View key={key} style={[GlobalStyle.specRaekke, key % 2 === 0 ? GlobalStyle.specRaekkeLige : null]}>
                                <Text style={GlobalStyle.specLabel}>{s.label}</Text>
                                <Text style={GlobalStyle.specVaerdi}>{s.vaerdi}</Text>
                            </View>
                        ))}
                    </View>
                ) : null}

                {opslag.materiale ? (
                    <View style={GlobalStyle.detaljeKort}>
                        <Text style={GlobalStyle.formKortTitel}>Beskrivelse</Text>
                        <Text style={GlobalStyle.detaljeTekst}>{opslag.materiale}</Text>
                    </View>
                ) : null}

                {opslag.lokation ? (
                    <View style={GlobalStyle.detaljeKort}>
                        <View style={GlobalStyle.sektionTopIndre}>
                            <Text style={GlobalStyle.formKortTitel}>Placering</Text>
                            <Pressable onPress={aabnIKort}>
                                <Text style={GlobalStyle.sektionLink}>Åbn i kort</Text>
                            </Pressable>
                        </View>
                        <KortComponent
                            style={GlobalStyle.kortLille}
                            region={beregnRegion([opslag.lokation])}
                            markoerer={[{ id: id, ...opslag.lokation, titel: opslag.titel, beskrivelse: opslag.sted }]}
                        />
                        <Text style={GlobalStyle.hjaelpetekst}>Den præcise adresse aftaler du med sælgeren.</Text>
                    </View>
                ) : null}

                <View style={GlobalStyle.detaljeKort}>
                    <Text style={GlobalStyle.formKortTitel}>Sælger</Text>
                    <View style={GlobalStyle.saelgerRaekke}>
                        <AvatarComponent navn={saelgerNavn} billede={saelger?.profilbillede} stoerrelse={52} />
                        <View style={GlobalStyle.flex1}>
                            <Text style={GlobalStyle.saelgerNavn}>{saelger?.firmanavn || saelgerNavn}</Text>
                            <Text style={GlobalStyle.detaljeLabel}>
                                {[saelger?.brugertype || opslag.saelgerType, saelger?.by].filter(Boolean).join(" · ")}
                            </Text>
                            {saelger?.cvr ? <Text style={GlobalStyle.detaljeLabel}>CVR {saelger.cvr}</Text> : null}
                            {saelger?.oprettet ? (
                                <Text style={GlobalStyle.detaljeLabel}>
                                    Medlem siden {new Date(saelger.oprettet).toLocaleDateString("da-DK", { month: "long", year: "numeric" })}
                                </Text>
                            ) : null}
                        </View>
                    </View>
                    {saelger?.bio ? <Text style={GlobalStyle.detaljeTekst}>{saelger.bio}</Text> : null}
                </View>

                {fejl !== "" && <Text style={GlobalStyle.fejl}>{fejl}</Text>}

                {erMitOpslag ? (
                    <View style={GlobalStyle.detaljeKort}>
                        <Text style={GlobalStyle.formKortTitel}>Dit opslag</Text>
                        <ValgGruppeComponent label="Status" valg={STATUS} valgt={status} onVaelg={skiftStatus} paakraevet />
                        <ButtonComponent
                            titel="Rediger opslag"
                            type="primary"
                            ikon="create-outline"
                            onPress={() => navigation.navigate("Rediger", { id: id, opslag: opslag })}
                        />
                        <ButtonComponent titel="Slet opslag" type="fare" ikon="trash-outline" onPress={bekraeftSlet} />
                    </View>
                ) : null}
            </ScrollView>

            {!erMitOpslag ? (
                <View style={GlobalStyle.bundBjaelke}>
                    {opslag.saelgerId ? (
                        <View style={GlobalStyle.inputRaekke}>
                            <View style={GlobalStyle.flex1}>
                                <ButtonComponent
                                    titel={status === "Solgt" ? "Solgt" : "Skriv til sælger"}
                                    type="primary"
                                    ikon="chatbubble-ellipses-outline"
                                    onPress={skrivTilSaelger}
                                    deaktiveret={status === "Solgt"}
                                />
                            </View>
                            {saelger?.visTelefon && saelger?.telefon ? (
                                <View style={GlobalStyle.ringKnap}>
                                    <ButtonComponent titel="Ring" type="secondary" ikon="call-outline" onPress={() => Linking.openURL("tel:" + saelger.telefon)} />
                                </View>
                            ) : null}
                        </View>
                    ) : (
                        <ButtonComponent
                            titel="Send e-mail til sælger"
                            type="primary"
                            ikon="mail-outline"
                            onPress={() => Linking.openURL("mailto:" + opslag.saelger + "?subject=" + encodeURIComponent("ReStock: " + opslag.titel))}
                        />
                    )}
                </View>
            ) : null}
        </View>
    );
}
