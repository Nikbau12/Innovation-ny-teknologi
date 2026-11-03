import { useEffect, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { ref, onValue } from "firebase/database";
import { rtdb } from "../../database/firebase";
import ButtonComponent from "../../components/ButtonComponent";
import InputComponent from "../../components/InputComponent";
import ValgGruppeComponent from "../../components/ValgGruppeComponent";
import SkifterComponent from "../../components/SkifterComponent";
import KortComponent from "../../components/KortComponent";
import TilbageHeaderComponent from "../../components/TilbageHeaderComponent";
import {
    AFSTANDE,
    BRUGERTYPER,
    KATEGORI_IKONER,
    KATEGORIER,
    LEVERING,
    MATERIALE_DETALJER,
    SORTERING,
    STAND,
    STANDARD_FILTER,
} from "../../data/const";
import { filtrerOpslag, findAdresse, hentMinPosition, regionForRadius } from "../../data/funktioner";
import { FARVER, GlobalStyle } from "../../styles/GlobalStyle";

export default function FilterScreen({ navigation, route }) {
    const [filter, setFilter] = useState({ ...STANDARD_FILTER, ...route.params?.filter });
    const [opslag, setOpslag] = useState([]);
    const [stedSoegning, setStedSoegning] = useState("");
    const [stedFejl, setStedFejl] = useState("");
    const [finderSted, setFinderSted] = useState(false);

    useEffect(() => {
        const unsubscribe = onValue(ref(rtdb, "Opslag"), (snap) => {
            const data = snap.val();
            setOpslag(data ? Object.keys(data).map((id) => ({ id: id, ...data[id] })) : []);
        });
        return unsubscribe;
    }, []);

    const aendr = (aendringer) => setFilter((prev) => ({ ...prev, ...aendringer }));
    const detaljer = MATERIALE_DETALJER[filter.kategori];
    const antal = filtrerOpslag(opslag, filter).length;

    const vaelgKategori = (kategori) => {
        aendr({ kategori: kategori || "Alle", underkategorier: [], egenskaber: {} });
    };

    const vaelgEgenskab = (noegle, valgte) => {
        aendr({ egenskaber: { ...filter.egenskaber, [noegle]: valgte } });
    };

    const brugMinPosition = async () => {
        setFinderSted(true);
        setStedFejl("");
        try {
            const punkt = await hentMinPosition();
            aendr({ center: { ...punkt, navn: "din placering" } });
        } catch (e) {
            setStedFejl(e.message);
        } finally {
            setFinderSted(false);
        }
    };

    const soegSted = async () => {
        if (stedSoegning.trim() === "") return;
        setFinderSted(true);
        setStedFejl("");
        try {
            const fund = await findAdresse(stedSoegning);
            if (fund) {
                const navn = [fund.postnummer, fund.sted].filter(Boolean).join(" ") || stedSoegning.trim();
                aendr({ center: { latitude: fund.latitude, longitude: fund.longitude, navn: navn } });
                setStedSoegning("");
            } else {
                setStedFejl("Vi kunne ikke finde stedet. Prøv med et postnummer.");
            }
        } catch (e) {
            setStedFejl(e.message);
        } finally {
            setFinderSted(false);
        }
    };

    const vaelgSortering = (sortering) => {
        aendr({ sortering: sortering });
        if (sortering === "Nærmest" && !filter.center) brugMinPosition();
    };

    const visResultater = () => {
        navigation.popTo("OversigtListe", { filter: filter }, { merge: true });
    };

    return (
        <View style={GlobalStyle.skaerm}>
            <TilbageHeaderComponent
                titel="Filtre"
                onTilbage={() => navigation.goBack()}
                hoejre={
                    <Pressable onPress={() => setFilter(STANDARD_FILTER)} hitSlop={8}>
                        <Text style={GlobalStyle.nulstilLink}>Nulstil</Text>
                    </Pressable>
                }
            />

            <ScrollView contentContainerStyle={GlobalStyle.formIndhold} keyboardShouldPersistTaps="handled">
                <View style={GlobalStyle.formKort}>
                    <Text style={GlobalStyle.formKortTitel}>Sortering</Text>
                    <ValgGruppeComponent valg={SORTERING} valgt={filter.sortering} onVaelg={vaelgSortering} paakraevet />
                </View>

                <View style={GlobalStyle.formKort}>
                    <Text style={GlobalStyle.formKortTitel}>Afstand</Text>
                    {filter.center ? (
                        <View style={GlobalStyle.lokationValgt}>
                            <Ionicons name="location" size={18} color={FARVER.primaer} />
                            <Text style={GlobalStyle.lokationValgtTekst}>Nær {filter.center.navn}</Text>
                            <Pressable onPress={() => aendr({ center: null })} hitSlop={8}>
                                <Ionicons name="close-circle" size={20} color={FARVER.tekstSvag} />
                            </Pressable>
                        </View>
                    ) : (
                        <Text style={GlobalStyle.hjaelpetekst}>Vis kun opslag inden for en bestemt afstand.</Text>
                    )}
                    <View style={GlobalStyle.lokationSoeg}>
                        <View style={GlobalStyle.flex1}>
                            <InputComponent value={stedSoegning} onChangeText={setStedSoegning} placeholder="Postnummer eller by" />
                        </View>
                        <View style={GlobalStyle.lokationSoegKnap}>
                            <ButtonComponent titel="Søg" type="primary" onPress={soegSted} loading={finderSted} />
                        </View>
                    </View>
                    <ButtonComponent titel="Brug min placering" type="secondary" ikon="navigate-outline" onPress={brugMinPosition} />
                    {stedFejl !== "" ? <Text style={GlobalStyle.fejl}>{stedFejl}</Text> : null}

                    {filter.center ? (
                        <View>
                            <ValgGruppeComponent
                                label="Radius"
                                valg={AFSTANDE.map((a) => a + " km")}
                                valgt={filter.radius + " km"}
                                onVaelg={(v) => aendr({ radius: parseInt(v, 10) })}
                                paakraevet
                            />
                            <KortComponent
                                style={GlobalStyle.kortLille}
                                region={regionForRadius(filter.center, filter.radius)}
                                cirkel={{ ...filter.center, radiusKm: filter.radius }}
                                markoerer={[{ id: "center", latitude: filter.center.latitude, longitude: filter.center.longitude, titel: filter.center.navn }]}
                            />
                        </View>
                    ) : null}
                </View>

                <View style={GlobalStyle.formKort}>
                    <Text style={GlobalStyle.formKortTitel}>Materiale</Text>
                    <ValgGruppeComponent
                        label="Kategori"
                        valg={KATEGORIER}
                        valgt={filter.kategori === "Alle" ? "" : filter.kategori}
                        onVaelg={vaelgKategori}
                        ikoner={KATEGORI_IKONER}
                    />
                    {detaljer ? (
                        <View>
                            <ValgGruppeComponent
                                label="Type"
                                valg={detaljer.underkategorier}
                                valgt={filter.underkategorier}
                                onVaelg={(v) => aendr({ underkategorier: v })}
                                flereValg
                            />
                            {detaljer.egenskaber.map((egenskab) => (
                                <ValgGruppeComponent
                                    key={egenskab.noegle}
                                    label={egenskab.label}
                                    valg={egenskab.valg}
                                    valgt={filter.egenskaber[egenskab.noegle] || []}
                                    onVaelg={(v) => vaelgEgenskab(egenskab.noegle, v)}
                                    flereValg
                                />
                            ))}
                        </View>
                    ) : (
                        <Text style={GlobalStyle.hjaelpetekst}>
                            Vælg en kategori for at filtrere på fx træsort, styrkeklasse, pladetype eller tykkelse.
                        </Text>
                    )}
                    <ValgGruppeComponent label="Stand" valg={STAND} valgt={filter.stand} onVaelg={(v) => aendr({ stand: v })} flereValg />
                </View>

                <View style={GlobalStyle.formKort}>
                    <Text style={GlobalStyle.formKortTitel}>Pris</Text>
                    <View style={GlobalStyle.inputRaekke}>
                        <View style={GlobalStyle.flex1}>
                            <InputComponent label="Fra" value={filter.prisMin} onChangeText={(v) => aendr({ prisMin: v })} placeholder="0" keyboardType="number-pad" enhed="kr." />
                        </View>
                        <View style={GlobalStyle.flex1}>
                            <InputComponent label="Til" value={filter.prisMax} onChangeText={(v) => aendr({ prisMax: v })} placeholder="Ingen grænse" keyboardType="number-pad" enhed="kr." />
                        </View>
                    </View>
                    <SkifterComponent label="Kun gratis" vaerdi={filter.kunGratis} onSkift={(v) => aendr({ kunGratis: v })} />
                </View>

                <View style={GlobalStyle.formKort}>
                    <Text style={GlobalStyle.formKortTitel}>Mål og mængde</Text>
                    <Text style={GlobalStyle.hjaelpetekst}>Vis kun materialer der er mindst så store.</Text>
                    <View style={GlobalStyle.inputRaekke}>
                        <View style={GlobalStyle.flex1}>
                            <InputComponent label="Længde" value={filter.laengdeMin} onChangeText={(v) => aendr({ laengdeMin: v })} placeholder="Min." keyboardType="number-pad" enhed="mm" />
                        </View>
                        <View style={GlobalStyle.flex1}>
                            <InputComponent label="Bredde" value={filter.breddeMin} onChangeText={(v) => aendr({ breddeMin: v })} placeholder="Min." keyboardType="number-pad" enhed="mm" />
                        </View>
                    </View>
                    <View style={GlobalStyle.inputRaekke}>
                        <View style={GlobalStyle.flex1}>
                            <InputComponent label="Tykkelse" value={filter.hoejdeMin} onChangeText={(v) => aendr({ hoejdeMin: v })} placeholder="Min." keyboardType="number-pad" enhed="mm" />
                        </View>
                        <View style={GlobalStyle.flex1}>
                            <InputComponent label="Mængde" value={filter.maengdeMin} onChangeText={(v) => aendr({ maengdeMin: v })} placeholder="Min." keyboardType="number-pad" />
                        </View>
                    </View>
                </View>

                <View style={GlobalStyle.formKort}>
                    <Text style={GlobalStyle.formKortTitel}>Levering og sælger</Text>
                    <ValgGruppeComponent label="Levering" valg={LEVERING} valgt={filter.levering} onVaelg={(v) => aendr({ levering: v })} flereValg />
                    <ValgGruppeComponent label="Sælges af" valg={BRUGERTYPER} valgt={filter.saelgerType} onVaelg={(v) => aendr({ saelgerType: v })} flereValg />
                    <SkifterComponent label="Kun opslag med billede" vaerdi={filter.kunMedBillede} onSkift={(v) => aendr({ kunMedBillede: v })} />
                    <SkifterComponent label="Vis solgte opslag" vaerdi={filter.visSolgte} onSkift={(v) => aendr({ visSolgte: v })} />
                </View>
            </ScrollView>

            <View style={GlobalStyle.bundBjaelke}>
                <ButtonComponent titel={"Vis " + antal + " opslag"} type="primary" onPress={visResultater} />
            </View>
        </View>
    );
}
