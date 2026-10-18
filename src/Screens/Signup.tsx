import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Pressable,
} from "react-native";
import {
  ALERT_TYPE,
  Toast,
  AlertNotificationRoot,
} from "react-native-alert-notification";
import { RootParamList } from "../../App";

const PUBLIC_URL = "https://908cf9abf462.ngrok-free.app";

type SignUpNavigationProp = NativeStackNavigationProp<
  RootParamList,
  "Signup"
>;

export default function SignUpScreen() {
  const navigation = useNavigation<SignUpNavigationProp>();

  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSignUp = async () => {
    if (!fullName || !username || !email || !password || !confirmPassword) {
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: "WARNING",
        textBody: "Please fill all required fields",
      });
      return;
    }

    if (password !== confirmPassword) {
      Toast.show({
        type: ALERT_TYPE.WARNING,
        title: "Mismatch",
        textBody: "Passwords do not match!",
      });
      return;
    }

    const formData = new FormData();
    formData.append("fullName", fullName);
    formData.append("username", username);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("confirmPassword", confirmPassword);

    try {
      setIsLoading(true);

      const response = await fetch(PUBLIC_URL + "/HabitTracker/NewAccount", {
        method: "POST",
        body: formData,
      });

      const rawText = await response.text();
      let json;
      try {
        json = JSON.parse(rawText);
      } catch {
        throw new Error("Server did not return JSON: " + rawText);
      }

      setIsLoading(false);

      if (response.ok && json.status) {
        Toast.show({
          type: ALERT_TYPE.SUCCESS,
          title: "Success",
          textBody: "Account created successfully 🎉",
        });

        // Reset form
        setFullName("");
        setUsername("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");

        setTimeout(() => {
          navigation.navigate("Signin");
        }, 1500);
      } else {
        Toast.show({
          type: ALERT_TYPE.DANGER,
          title: "Failed",
          textBody: json.message || "Account creation failed!",
        });
      }
    } catch (error: any) {
      setIsLoading(false);
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: "Error",
        textBody: "Network or server error: " + error.message,
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
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>
            Join us and begin building your daily habits ✨
          </Text>

          <TextInput
            placeholder="Full Name"
            style={styles.input}
            value={fullName}
            onChangeText={setFullName}
          />

          <TextInput
            placeholder="Username"
            style={styles.input}
            value={username}
            onChangeText={setUsername}
          />

          <TextInput
            placeholder="Email Address"
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
          />

          <TextInput
            placeholder="Password"
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <TextInput
            placeholder="Confirm Password"
            style={styles.input}
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />

          <View style={styles.buttonContainer}>
            <Pressable
              style={styles.backButton}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.backButtonText}>Go Back</Text>
            </Pressable>

            <Pressable
              style={styles.signUpButton}
              onPress={handleSignUp}
              disabled={isLoading}
            >
              <Text style={styles.signUpButtonText}>
                {isLoading ? "Creating..." : "Create Account"}
              </Text>
            </Pressable>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <Pressable onPress={() => navigation.navigate("Signin")}>
              <Text style={styles.signInText}>Sign In</Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </AlertNotificationRoot>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F3F4F6" },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 30,
    fontWeight: "800",
    textAlign: "center",
    marginBottom: 8,
    color: "#1F2937",
  },
  subtitle: {
    fontSize: 15,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 28,
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
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    marginBottom: 12,
  },
  backButton: {
    width: "40%",
    backgroundColor: "#FFFFFF",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#9CA3AF",
  },
  backButtonText: { color: "#374151", fontSize: 16, fontWeight: "600" },
  signUpButton: {
    width: "55%",
    backgroundColor: "#6B4E9A",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    shadowColor: "#6B4E9A",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 4,
    elevation: 3,
  },
  signUpButtonText: { color: "#FFFFFF", fontSize: 16, fontWeight: "700" },
  footer: { flexDirection: "row", justifyContent: "center", marginTop: 18 },
  footerText: { fontSize: 14, color: "#6B7280" },
  signInText: { fontSize: 14, fontWeight: "700", color: "#6B4E9A" },
});
