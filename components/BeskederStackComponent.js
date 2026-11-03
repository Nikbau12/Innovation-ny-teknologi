import { createStackNavigator } from "@react-navigation/stack";
import BeskederScreen from "../screens/BeskederScreen";
import ChatScreen from "../screens/StackScreens/ChatScreen";

const Stack = createStackNavigator();

export default function BeskederStackComponent() {
    return (
        <Stack.Navigator initialRouteName="BeskederListe" screenOptions={{ headerShown: false }}>
            <Stack.Screen name="BeskederListe" component={BeskederScreen} />
            <Stack.Screen name="Chat" component={ChatScreen} />
        </Stack.Navigator>
    );
}
