import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity, SafeAreaView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootParamList } from "../../App";
import {
  ALERT_TYPE,
  Dialog,
  AlertNotificationRoot,
  Toast,
} from "react-native-alert-notification";

interface HeaderProps {
  navigation: NativeStackNavigationProp<RootParamList>;
}

export default function Header({ navigation }: HeaderProps) {
  const [username, setUsername] = useState("Menara");

  useEffect(() => {
    const loadUser = async () => {
      const storedName = await AsyncStorage.getItem("username");
      if (storedName) setUsername(storedName);
    };
    loadUser();
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 18) return "Good Afternoon";
    return "Good Evening";
  };

  const handleLogout = async () => {
    Dialog.show({
      type: ALERT_TYPE.WARNING,
      title: "Logout",
      textBody: "Fileto is logout. Are you sure?",
      button: "Yes",
      onPressButton: async () => {
        try {
          await AsyncStorage.clear();
          Toast.show({
            type: ALERT_TYPE.SUCCESS,
            title: "Success",
            textBody: "Logged out successfully!",
          });
          navigation.replace("Signin");
        } catch (error) {
          Toast.show({
            type: ALERT_TYPE.DANGER,
            title: "Error",
            textBody: "Failed to logout. Please try again.",
          });
        }
      },
    });
  };

  return (
    <AlertNotificationRoot>
      <View style={styles.headerContainer}>
        {/* Left side: Avatar + Greeting */}
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Image
            source={require("../../assets/hfav.jpg")}
            style={styles.avatar}
          />
          <View style={{ marginLeft: 10 }}>
            <Text style={styles.greeting}>{getGreeting()}</Text>
            <Text style={styles.username}>{username}</Text>
          </View>
        </View>

        {/* Right side: Logout button */}
        <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
          <MaterialCommunityIcons name="logout" size={28} color="#000" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </AlertNotificationRoot>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#e5e7eb",
  },
  greeting: { fontSize: 18, fontWeight: "600", color: "#6b7280" },
  username: { fontSize: 22, fontWeight: "700", color: "#1f2937" },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#a855f7",
  },
  logoutButton: { flexDirection: "row", alignItems: "center" },
  logoutText: { fontSize: 16, fontWeight: "600", marginLeft: 5 },
});
