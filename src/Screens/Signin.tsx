import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootParamList } from "../../App";
import {
  ALERT_TYPE,
  Toast,
  Dialog,
  AlertNotificationRoot,
} from "react-native-alert-notification";

const PUBLIC_URL = " https://481651ab003c.ngrok-free.app";

type SignInNavigationProp = NativeStackNavigationProp<RootParamList, "Signin">;

export default function SignInScreen({
  navigation,
}: {
  navigation: SignInNavigationProp;
}) {
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSignIn = async () => {
    if (!formData.username || !formData.password) {
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: "Warning",
        textBody: "Username and password are required!",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${PUBLIC_URL}/HabitTracker/SignIn`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const rawText = await response.text();
      let json: any;
      try {
        json = JSON.parse(rawText);
      } catch {
        throw new Error("Server did not return valid JSON.");
      }

      setIsLoading(false);

      if (response.ok && json.status) {
        await AsyncStorage.clear();
        await AsyncStorage.setItem("username", json.user || "User");
        await AsyncStorage.setItem("userId", json.userId || "");
        console.log(json);

        Toast.show({
          type: ALERT_TYPE.SUCCESS,
          title: "Success",
          textBody: "Login successful! 🎉",
        });

        setTimeout(() => {
          navigation.reset({ index: 0, routes: [{ name: "Home" }] });
        }, 1200);
      } else {
        Toast.show({
          type: ALERT_TYPE.DANGER,
          title: "Login Failed",
          textBody: json.message || "Invalid credentials!",
        });

        if (json.message === "User not found. Please sign up.") {
          setTimeout(() => navigation.navigate("Signup"), 1000);
        }
      }
    } catch (error: any) {
      setIsLoading(false);
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: "Network Error",
        textBody: error.message,
      });
    }
  };

  return (
    <AlertNotificationRoot>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>
            Sign in to continue tracking your habits
          </Text>

          <TextInput
            placeholder="Username"
            style={styles.input}
            value={formData.username}
            onChangeText={(text) => handleChange("username", text)}
            editable={!isLoading}
          />

          <TextInput
            placeholder="Password"
            style={styles.input}
            value={formData.password}
            onChangeText={(text) => handleChange("password", text)}
            secureTextEntry
            editable={!isLoading}
          />

          <TouchableOpacity
            style={[
              styles.signInButton,
              isLoading && styles.signInButtonDisabled,
            ]}
            onPress={handleSignIn}
            disabled={isLoading}
          >
            <Text style={styles.signInButtonText}>
              {isLoading ? "Signing In..." : "Sign In"}
            </Text>
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account? </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate("Signup")}
              disabled={isLoading}
            >
              <Text style={styles.signUpText}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </AlertNotificationRoot>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F3F4F6" },
  scrollContainer: { flexGrow: 1, justifyContent: "center", padding: 20 },
  title: {
    fontSize: 28,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 8,
    color: "#1F2937",
  },
  subtitle: {
    fontSize: 15,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 24,
  },
  input: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 14,
    padding: 14,
    marginBottom: 16,
    backgroundColor: "#FFFFFF",
    fontSize: 16,
    color: "#111827",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
    elevation: 1,
  },
  signInButton: {
    backgroundColor: "#6B4E9A",
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    marginBottom: 16,
    shadowColor: "#6B4E9A",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 5,
    elevation: 3,
  },
  signInButtonDisabled: { backgroundColor: "#A78BFA", opacity: 0.7 },
  signInButtonText: { color: "#FFFFFF", fontSize: 16, fontWeight: "600" },
  footer: { flexDirection: "row", justifyContent: "center", marginTop: 10 },
  footerText: { fontSize: 14, color: "#6B7280" },
  // signUpText: { fontSize: 14, fontWeight: "700", color: "#6B4E9A" },
});
