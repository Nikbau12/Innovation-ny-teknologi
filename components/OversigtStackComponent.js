import { createStackNavigator } from "@react-navigation/stack";
import OversigtScreen from "../screens/OversigtScreen";
import OpslagDetaljeScreen from "../screens/StackScreens/OpslagDetaljeScreen";
import RedigerOpslagScreen from "../screens/StackScreens/RedigerOpslagScreen";
import KameraScreen from "../screens/StackScreens/KameraScreen";
import FilterScreen from "../screens/StackScreens/FilterScreen";
import ChatScreen from "../screens/StackScreens/ChatScreen";

const Stack = createStackNavigator();

export default function OversigtStackComponent() {
    return (
        <Stack.Navigator initialRouteName="OversigtListe" screenOptions={{ headerShown: false }}>
            <Stack.Screen name="OversigtListe" component={OversigtScreen} />
            <Stack.Screen name="Filter" component={FilterScreen} />
            <Stack.Screen name="OpslagDetalje" component={OpslagDetaljeScreen} />
            <Stack.Screen name="Rediger" component={RedigerOpslagScreen} />
            <Stack.Screen name="Kamera" component={KameraScreen} />
            <Stack.Screen name="Chat" component={ChatScreen} />
        </Stack.Navigator>
    );
}
