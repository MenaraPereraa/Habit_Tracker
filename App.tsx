import React, { useEffect, useState } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import SignUpScreen from "./src/Screens/Signup";
import SignInScreen from "./src/Screens/Signin";
import SplashScreen from "./src/Screens/Splash";
import HomeScreen from "./src/Screens/Home";
import AddEditHabitScreen from "./src/Screens/AddHabit";
import HabitDetails from "./src/Screens/HabitDetails";
import Header from "./src/components/header";
import EditHabit from "./src/Screens/EditHabit";


export type RootParamList = {
  Splash: undefined;
  Signup: undefined;
  Signin: undefined;
  Home: undefined;
  AddHabit: undefined;
  HabitDetails: { habitId: string; habitName: string };
  Header: undefined;
  EditHabit:undefined;
};

const Stack = createNativeStackNavigator<RootParamList>();

export default function App() {
  const [initialRoute, setInitialRoute] = useState<keyof RootParamList | null>(null);

  useEffect(() => {
    const checkLoginStatus = async () => {
      const token = await AsyncStorage.getItem("userToken");
      setInitialRoute(token ? "Home" : "Splash");
    };
    checkLoginStatus();
  }, []);

  if (!initialRoute) return null;

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={initialRoute} screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Signup" component={SignUpScreen} />
        <Stack.Screen name="Signin" component={SignInScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="AddHabit" component={AddEditHabitScreen} />
        <Stack.Screen name="HabitDetails" component={HabitDetails} />
        <Stack.Screen name="Header" component={Header} />
        <Stack.Screen name="EditHabit" component={EditHabit} />

        

      </Stack.Navigator>
    </NavigationContainer>
  );
}
