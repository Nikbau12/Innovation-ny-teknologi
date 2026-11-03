import { Pressable, Text, View } from "react-native";
import * as ImagePicker from "expo-image-picker";
import Ionicons from "@expo/vector-icons/Ionicons";
import InputComponent from "./InputComponent";
import ButtonComponent from "./ButtonComponent";
import BilledeComponent from "./BilledeComponent";
import ValgGruppeComponent from "./ValgGruppeComponent";
import LokationVaelgerComponent from "./LokationVaelgerComponent";
import {
    ENHEDER,
    KATEGORI_IKONER,
    KATEGORIER,
    LEVERING,
    MATERIALE_DETALJER,
    PRIS_PER,
    PRIS_TYPER,
    STAND,
    STATUS,
} from "../data/const";
import { FARVER, GlobalStyle } from "../styles/GlobalStyle";

export default function OpslagFormComponent({ data, onAendr, onTagBillede, visStatus }) {
    const detaljer = MATERIALE_DETALJER[data.kategori];

    const vaelgBillede = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ["images"],
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.2,
            base64: true,
        });

        if (!result.canceled) {
            const valgt = result.assets[0];
            onAendr({ billede: "data:image/jpeg;base64," + valgt.base64 });
        }
    };

    const vaelgKategori = (kategori) => {
        onAendr({ kategori: kategori, underkategori: "", egenskaber: {} });
    };

    const vaelgEgenskab = (noegle, vaerdi) => {
        const nye = { ...data.egenskaber };
        if (vaerdi === "") {
            delete nye[noegle];
        } else {
            nye[noegle] = vaerdi;
        }
        onAendr({ egenskaber: nye });
    };

    return (
        <View>
            <View style={GlobalStyle.formKort}>
                <Text style={GlobalStyle.formKortTitel}>Billede</Text>
                {data.billede !== "" ? (
                    <View>
                        <BilledeComponent url={{ uri: data.billede }} style={GlobalStyle.forhaandsvisning} />
                        <Pressable style={GlobalStyle.fjernBillede} onPress={() => onAendr({ billede: "" })}>
                            <Ionicons name="close" size={18} color={FARVER.hvid} />
                        </Pressable>
                    </View>
                ) : (
                    <View style={GlobalStyle.billedPladsholder}>
                        <Ionicons name="camera-outline" size={36} color={FARVER.primaerMellem} />
                        <Text style={GlobalStyle.billedTekst}>Opslag med billede bliver set langt oftere</Text>
                    </View>
                )}
                <View style={GlobalStyle.billedKnapper}>
                    <View style={GlobalStyle.billedKnap}>
                        <ButtonComponent titel="Tag billede" type="secondary" ikon="camera-outline" onPress={onTagBillede} />
                    </View>
                    <View style={GlobalStyle.billedKnap}>
                        <ButtonComponent titel="Galleri" type="secondary" ikon="images-outline" onPress={vaelgBillede} />
                    </View>
                </View>
            </View>

            <View style={GlobalStyle.formKort}>
                <Text style={GlobalStyle.formKortTitel}>Om materialerne</Text>
                <InputComponent
                    label="Titel *"
                    value={data.titel}
                    onChangeText={(v) => onAendr({ titel: v })}
                    placeholder="F.eks. Konstruktionstræ C24, 45x95 mm"
                    maxLength={80}
                />
                <InputComponent
                    label="Beskrivelse"
                    value={data.materiale}
                    onChangeText={(v) => onAendr({ materiale: v })}
                    placeholder="Fortæl om mængde, stand, hvor længe det har ligget, og hvordan det er opbevaret"
                    multiline
                />
                <InputComponent
                    label="Mærke / producent"
                    value={data.maerke}
                    onChangeText={(v) => onAendr({ maerke: v })}
                    placeholder="F.eks. Gyproc, Rockwool, Velux"
                />
            </View>

            <View style={GlobalStyle.formKort}>
                <Text style={GlobalStyle.formKortTitel}>Kategori og specifikationer</Text>
                <ValgGruppeComponent
                    label="Kategori *"
                    valg={KATEGORIER}
                    valgt={data.kategori}
                    onVaelg={vaelgKategori}
                    ikoner={KATEGORI_IKONER}
                />
                {detaljer ? (
                    <View>
                        <ValgGruppeComponent
                            label="Type"
                            valg={detaljer.underkategorier}
                            valgt={data.underkategori}
                            onVaelg={(v) => onAendr({ underkategori: v })}
                        />
                        {detaljer.egenskaber.map((egenskab) => (
                            <ValgGruppeComponent
                                key={egenskab.noegle}
                                label={egenskab.label}
                                valg={egenskab.valg}
                                valgt={data.egenskaber[egenskab.noegle] || ""}
                                onVaelg={(v) => vaelgEgenskab(egenskab.noegle, v)}
                            />
                        ))}
                    </View>
                ) : (
                    <Text style={GlobalStyle.hjaelpetekst}>Vælg en kategori for at se de specifikationer, der passer til materialet.</Text>
                )}
                <ValgGruppeComponent label="Stand *" valg={STAND} valgt={data.stand} onVaelg={(v) => onAendr({ stand: v })} />
            </View>

            <View style={GlobalStyle.formKort}>
                <Text style={GlobalStyle.formKortTitel}>Mængde og mål</Text>
                <InputComponent
                    label="Mængde"
                    value={data.maengde}
                    onChangeText={(v) => onAendr({ maengde: v })}
                    placeholder="F.eks. 24"
                    keyboardType="decimal-pad"
                    enhed={data.enhed}
                />
                <ValgGruppeComponent
                    label="Enhed"
                    valg={ENHEDER}
                    valgt={data.enhed}
                    onVaelg={(v) => onAendr({ enhed: v })}
                    paakraevet
                />
                <Text style={GlobalStyle.hjaelpetekst}>Mål pr. stk. i millimeter</Text>
                <View style={GlobalStyle.inputRaekke}>
                    <View style={GlobalStyle.flex1}>
                        <InputComponent label="Længde" value={data.laengde} onChangeText={(v) => onAendr({ laengde: v })} placeholder="0" keyboardType="number-pad" enhed="mm" />
                    </View>
                    <View style={GlobalStyle.flex1}>
                        <InputComponent label="Bredde" value={data.bredde} onChangeText={(v) => onAendr({ bredde: v })} placeholder="0" keyboardType="number-pad" enhed="mm" />
                    </View>
                    <View style={GlobalStyle.flex1}>
                        <InputComponent label="Tykkelse" value={data.hoejde} onChangeText={(v) => onAendr({ hoejde: v })} placeholder="0" keyboardType="number-pad" enhed="mm" />
                    </View>
                </View>
            </View>

            <View style={GlobalStyle.formKort}>
                <Text style={GlobalStyle.formKortTitel}>Pris og levering</Text>
                <ValgGruppeComponent
                    label="Pris *"
                    valg={PRIS_TYPER}
                    valgt={data.prisType}
                    onVaelg={(v) => onAendr({ prisType: v })}
                    paakraevet
                />
                {data.prisType !== "Gratis" ? (
                    <View>
                        <InputComponent
                            value={data.pris}
                            onChangeText={(v) => onAendr({ pris: v })}
                            placeholder="F.eks. 450"
                            keyboardType="decimal-pad"
                            enhed="kr."
                        />
                        <ValgGruppeComponent
                            valg={PRIS_PER}
                            valgt={data.prisPer}
                            onVaelg={(v) => onAendr({ prisPer: v })}
                            paakraevet
                        />
                    </View>
                ) : null}
                <ValgGruppeComponent
                    label="Levering"
                    valg={LEVERING}
                    valgt={data.levering}
                    onVaelg={(v) => onAendr({ levering: v })}
                    paakraevet
                />
                {visStatus ? (
                    <ValgGruppeComponent
                        label="Status"
                        valg={STATUS}
                        valgt={data.status}
                        onVaelg={(v) => onAendr({ status: v })}
                        paakraevet
                    />
                ) : null}
            </View>

            <View style={GlobalStyle.formKort}>
                <Text style={GlobalStyle.formKortTitel}>Hvor kan materialerne hentes? *</Text>
                <LokationVaelgerComponent
                    lokation={data.lokation}
                    sted={data.sted}
                    postnummer={data.postnummer}
                    onAendr={onAendr}
                />
            </View>
        </View>
    );
}
