import { Text, TextInput, View } from "react-native";
import { FARVER, GlobalStyle } from "../styles/GlobalStyle";

export default function InputComponent({
    label,
    value,
    onChangeText,
    placeholder,
    secureTextEntry,
    autoCapitalize,
    keyboardType,
    multiline,
    enhed,
    hjaelpetekst,
    maxLength,
}) {
    return (
        <View style={GlobalStyle.inputGruppe}>
            {label ? <Text style={GlobalStyle.inpLabel}>{label}</Text> : null}
            <View style={[GlobalStyle.inputRamme, multiline ? GlobalStyle.inputRammeHoej : null]}>
                <TextInput
                    style={[GlobalStyle.textInput, multiline ? GlobalStyle.textInputHoej : null]}
                    value={value}
                    onChangeText={onChangeText}
                    placeholder={placeholder}
                    placeholderTextColor={FARVER.tekstSvag}
                    secureTextEntry={secureTextEntry}
                    autoCapitalize={autoCapitalize}
                    keyboardType={keyboardType}
                    multiline={multiline}
                    maxLength={maxLength}
                    textAlignVertical={multiline ? "top" : "center"}
                />
                {enhed ? <Text style={GlobalStyle.inputEnhed}>{enhed}</Text> : null}
            </View>
            {hjaelpetekst ? <Text style={GlobalStyle.hjaelpetekst}>{hjaelpetekst}</Text> : null}
        </View>
    );
}
