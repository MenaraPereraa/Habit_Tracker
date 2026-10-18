import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootParamList } from "../../App";

type SplashNavProp = NativeStackNavigationProp<RootParamList, "Splash">;

export default function SplashScreen() {
  const navigation = useNavigation<SplashNavProp>();
  const [isLoading, setIsLoading] = useState(false);

  // Check user in AsyncStorage when component mounts
  useEffect(() => {
    const checkUser = async () => {
      try {
        const user = await AsyncStorage.getItem("username"); // or "userId"
        if (user) {
          navigation.replace("Home"); // User exists, go to Home
        } else {
          navigation.replace("Signin"); // No user, go to Login
        }
      } catch (error) {
        console.error("Error checking user in AsyncStorage:", error);
        navigation.replace("Signin");
      }
    };

    checkUser();
  }, []);

  const handleContinueAsGuest = () => {
    navigation.replace("Home");
  };

  return (
    <ImageBackground
      source={require("../../assets/habit-bg.jpg")}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay} />

      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>Welcome to Habit Tracker</Text>
            <Text style={styles.subtitle}>
              Build better habits and stay consistent every day!
            </Text>
          </View>

          {/* Create Account Button */}
          <TouchableOpacity
            onPress={() => navigation.navigate("Signup")}
            style={[
              styles.signUpButton,
              isLoading && styles.signUpButtonDisabled,
            ]}
            disabled={isLoading}
          >
            <Text style={styles.signUpButtonText}>
              {isLoading ? "Creating..." : "Create an account"}
            </Text>
          </TouchableOpacity>

          {/* Guest Button */}
          <TouchableOpacity
            onPress={handleContinueAsGuest}
            style={styles.guestButton}
          >
            <Text style={styles.guestButtonText}>Continue as Guest</Text>
          </TouchableOpacity>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate("Signin")}>
              <Text style={styles.signInText}>Log in</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1, justifyContent: "center", alignItems: "center" },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.45)",
  },
  container: { flex: 1, width: "100%" },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "flex-end",
    paddingHorizontal: 20,
    paddingBottom: 50,
  },
  header: { alignItems: "center", marginBottom: 40 },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#FFFFFF",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 15,
    color: "#E5E7EB",
    marginTop: 8,
    textAlign: "center",
  },
  signUpButton: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
    marginBottom: 16,
  },
  signUpButtonDisabled: { backgroundColor: "#9CA3AF" },
  signUpButtonText: { color: "#111827", fontSize: 16, fontWeight: "600" },
  guestButton: {
    backgroundColor: "transparent",
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#FFFFFF",
  },
  guestButtonText: { color: "#FFFFFF", fontSize: 16, fontWeight: "600" },
  footer: { flexDirection: "row", justifyContent: "center", marginTop: 10 },
  footerText: { fontSize: 14, color: "#E5E7EB" },
  signInText: { fontSize: 14, fontWeight: "600", color: "#FFFFFF" },
});
