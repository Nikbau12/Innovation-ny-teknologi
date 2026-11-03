import { Text, View } from "react-native";
import ChipComponent from "./ChipComponent";
import { GlobalStyle } from "../styles/GlobalStyle";

export default function ValgGruppeComponent({ label, valg, valgt, onVaelg, flereValg, paakraevet, ikoner }) {
    const erValgt = (v) => (flereValg ? valgt.includes(v) : valgt === v);

    const tryk = (v) => {
        if (flereValg) {
            onVaelg(erValgt(v) ? valgt.filter((x) => x !== v) : [...valgt, v]);
        } else if (erValgt(v)) {
            if (!paakraevet) onVaelg("");
        } else {
            onVaelg(v);
        }
    };

    return (
        <View style={GlobalStyle.valgGruppe}>
            {label ? <Text style={GlobalStyle.inpLabel}>{label}</Text> : null}
            <View style={GlobalStyle.chipRaekke}>
                {valg.map((v, key) => (
                    <ChipComponent
                        key={key}
                        titel={v}
                        valgt={erValgt(v)}
                        onPress={() => tryk(v)}
                        ikon={ikoner ? ikoner[v] : undefined}
                    />
                ))}
            </View>
        </View>
    );
}
