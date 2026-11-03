import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "@expo/vector-icons/Ionicons";
import { onAuthStateChanged } from "firebase/auth";
import { ref, onValue } from "firebase/database";
import { auth, rtdb } from "./database/firebase";
import ForsideScreen from "./screens/ForsideScreen";
import OversigtStackComponent from "./components/OversigtStackComponent";
import AuthScreen from "./screens/AuthScreen";
import StackComponent from "./components/StackComponent";
import BeskederStackComponent from "./components/BeskederStackComponent";
import ProfilStackComponent from "./components/ProfilStackComponent";
import LogoComponent from "./components/LogoComponent";
import { TAB_LABELS } from "./data/const";
import { FARVER, GlobalStyle } from "./styles/GlobalStyle";

const Tab = createBottomTabNavigator();

export default function App() {
  const [bruger, setBruger] = useState(null);
  const [klar, setKlar] = useState(false);
  const [ulaeste, setUlaeste] = useState(0);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setBruger(currentUser);
      setKlar(true);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!bruger) {
      setUlaeste(0);
      return;
    }
    const unsubscribe = onValue(ref(rtdb, "/BrugerSamtaler/" + bruger.uid), (snap) => {
      const data = snap.val() || {};
      const antal = Object.values(data).reduce((sum, samtale) => sum + (samtale.ulaest || 0), 0);
      setUlaeste(antal);
    });
    return unsubscribe;
  }, [bruger]);

  if (!klar) {
    return (
      <View style={GlobalStyle.centreret}>
        <ActivityIndicator size="large" color={FARVER.primaer} />
      </View>
    );
  }

  if (!bruger) {
    return (
      <>
        <StatusBar style="dark" />
        <AuthScreen />
      </>
    );
  }

  return (
    <NavigationContainer>
      <StatusBar style="dark" />
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerTitle: () => <LogoComponent />,
          headerTitleAlign: "left",
          headerStyle: GlobalStyle.header,
          headerTitleStyle: GlobalStyle.headerTitel,
          headerTintColor: FARVER.tekst,
          headerShadowVisible: false,
          tabBarStyle: GlobalStyle.tabBar,
          tabBarLabelStyle: GlobalStyle.tabBarLabel,
          tabBarActiveTintColor: FARVER.primaer,
          tabBarInactiveTintColor: FARVER.tekstSvag,
          tabBarLabel: TAB_LABELS[route.name],
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            if (route.name === "Forside") {
              iconName = focused ? "home" : "home-outline";
            } else if (route.name === "Oversigt") {
              iconName = focused ? "search" : "search-outline";
            } else if (route.name === "Opret opslag") {
              return <Ionicons name="add-circle" size={size + 8} color={FARVER.accent} />;
            } else if (route.name === "Beskeder") {
              iconName = focused ? "chatbubbles" : "chatbubbles-outline";
            } else if (route.name === "Profil") {
              iconName = focused ? "person" : "person-outline";
            }
            return <Ionicons name={iconName} size={size} color={color} />;
          },
        })}
      >
        <Tab.Screen name="Forside" component={ForsideScreen} />
        <Tab.Screen name="Oversigt" component={OversigtStackComponent} />
        <Tab.Screen name="Opret opslag" component={StackComponent} />
        <Tab.Screen
          name="Beskeder"
          component={BeskederStackComponent}
          options={{ tabBarBadge: ulaeste > 0 ? ulaeste : undefined, tabBarBadgeStyle: GlobalStyle.tabBadge }}
        />
        <Tab.Screen name="Profil" component={ProfilStackComponent} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
