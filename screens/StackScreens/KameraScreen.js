import { useRef, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import Ionicons from "@expo/vector-icons/Ionicons";
import ButtonComponent from "../../components/ButtonComponent";
import { GlobalStyle } from "../../styles/GlobalStyle";

export default function KameraScreen({ navigation, route }) {
    const retur = route.params?.retur || "Opret";
    const [facing, setFacing] = useState("back");
    const [permission, requestPermission] = useCameraPermissions();
    const [loading, setLoading] = useState(false);

    const cameraRef = useRef(null);

    if (!permission) return <View />;

    if (!permission.granted) {
        return (
            <View style={GlobalStyle.forsideContainer}>
                <Text style={GlobalStyle.forsideTekst}>
                    Vi skal bruge din tilladelse for at vise kameraet
                </Text>
                <View style={GlobalStyle.forsideKnapper}>
                    <ButtonComponent titel="Giv tilladelse" type="primary" onPress={requestPermission} />
                    <ButtonComponent titel="Tilbage" type="secondary" onPress={() => navigation.goBack()} />
                </View>
            </View>
        );
    }

    async function snap() {
        if (!cameraRef.current) return;
        try {
            setLoading(true);
            const result = await cameraRef.current.takePictureAsync({ quality: 0.2, base64: true });
            const billede = result.base64.startsWith("data:")
                ? result.base64
                : "data:image/jpeg;base64," + result.base64;
            navigation.popTo(retur, { billede: billede }, { merge: true });
        } catch (err) {
            console.log("Snap error:", err);
        } finally {
            setLoading(false);
        }
    }

    function toggleFacing() {
        setFacing((prev) => (prev === "back" ? "front" : "back"));
    }

    return (
        <View style={GlobalStyle.kameraContainer}>
            <CameraView ref={cameraRef} style={GlobalStyle.kamera} facing={facing} />
            <View style={GlobalStyle.kameraKnapper}>
                <TouchableOpacity style={GlobalStyle.kameraKnap} onPress={() => navigation.goBack()}>
                    <Ionicons name="close-outline" size={32} color="#fff" />
                </TouchableOpacity>

                <TouchableOpacity style={GlobalStyle.snapKnap} onPress={snap}>
                    <Text style={GlobalStyle.snapTekst}>{loading ? "..." : ""}</Text>
                </TouchableOpacity>

                <TouchableOpacity style={GlobalStyle.kameraKnap} onPress={toggleFacing}>
                    <Ionicons name="camera-reverse-outline" size={32} color="#fff" />
                </TouchableOpacity>
            </View>
        </View>
    );
}
