import { Pressable, TextInput, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { FARVER, GlobalStyle } from "../styles/GlobalStyle";

export default function SoegefeltComponent({ value, onChangeText, onSubmit, placeholder }) {
    return (
        <View style={GlobalStyle.soegefelt}>
            <Ionicons name="search" size={20} color={FARVER.tekstSvag} />
            <TextInput
                style={GlobalStyle.soegefeltInput}
                value={value}
                onChangeText={onChangeText}
                onSubmitEditing={onSubmit}
                placeholder={placeholder}
                placeholderTextColor={FARVER.tekstSvag}
                returnKeyType="search"
            />
            {value !== "" ? (
                <Pressable onPress={() => onChangeText("")} hitSlop={10}>
                    <Ionicons name="close-circle" size={20} color={FARVER.tekstSvag} />
                </Pressable>
            ) : null}
        </View>
    );
}
