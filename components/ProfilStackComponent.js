import { createStackNavigator } from "@react-navigation/stack";
import ProfilScreen from "../screens/ProfilScreen";
import RedigerProfilScreen from "../screens/StackScreens/RedigerProfilScreen";
import IndstillingerScreen from "../screens/StackScreens/IndstillingerScreen";
import OpslagDetaljeScreen from "../screens/StackScreens/OpslagDetaljeScreen";
import RedigerOpslagScreen from "../screens/StackScreens/RedigerOpslagScreen";
import KameraScreen from "../screens/StackScreens/KameraScreen";
import ChatScreen from "../screens/StackScreens/ChatScreen";

const Stack = createStackNavigator();

export default function ProfilStackComponent() {
    return (
        <Stack.Navigator initialRouteName="ProfilOversigt" screenOptions={{ headerShown: false }}>
            <Stack.Screen name="ProfilOversigt" component={ProfilScreen} />
            <Stack.Screen name="RedigerProfil" component={RedigerProfilScreen} />
            <Stack.Screen name="Indstillinger" component={IndstillingerScreen} />
            <Stack.Screen name="OpslagDetalje" component={OpslagDetaljeScreen} />
            <Stack.Screen name="Rediger" component={RedigerOpslagScreen} />
            <Stack.Screen name="Kamera" component={KameraScreen} />
            <Stack.Screen name="Chat" component={ChatScreen} />
        </Stack.Navigator>
    );
}
