import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import Header from "../components/header";
import { AlertNotificationRoot } from "react-native-alert-notification";

const PUBLIC_URL = "https://908cf9abf462.ngrok-free.app";

const frequencyMap: Record<number, string> = {
  1: "Daily",
  2: "Weekly",
  3: "Monthly",
};

export default function HabitDetails({ route, navigation }: any) {
  const { habitId, habitName } = route.params;
  const [habitData, setHabitData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHabitDetails = async () => {
      try {
        const response = await fetch(
          `${PUBLIC_URL}/HabitTracker/ViewHabit?habitId=${habitId}`,
          { method: "GET" }
        );

        const data = await response.json();
        if (data.status && data.habit) {
          setHabitData(data.habit);
        }
      } catch (error) {
        console.log("Error fetching habit details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHabitDetails();
  }, [habitId]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#6B4E9A" />
      </View>
    );
  }

  if (!habitData) {
    return (
      <SafeAreaView style={styles.center}>
        <Text style={{ textAlign: "center" }}>Habit not found.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <AlertNotificationRoot>
        <View style={{ flex: 1 }}>
          <Header navigation={navigation} />
          <View style={{ display: "flex", flexDirection: "column", height: "90%" }}>
            <ScrollView style={styles.container}>
              {/* Habit Name */}
              <Text style={styles.title}>{habitData.habitName || habitName}</Text>

              {/* Details */}
              <View style={styles.section}>
                <Text style={styles.label}>Details:</Text>
                <Text style={styles.value}>
                  {habitData.details || "No details provided"}
                </Text>
              </View>

              {/* Frequency */}
              <View style={styles.section}>
                <Text style={styles.label}>Frequency:</Text>
                <Text style={styles.value}>
                  {habitData.frequencyId
                    ? frequencyMap[habitData.frequencyId] || "Unknown"
                    : "Not set"}
                </Text>
              </View>

              {/* Color */}
              <View style={styles.section}>
                <Text style={styles.label}>Color:</Text>
                <Text style={styles.value}>{habitData.color || "Default"}</Text>
              </View>

              {/* Created At */}
              <View style={styles.section}>
                <Text style={styles.label}>Created At:</Text>
                <Text style={styles.value}>
                  {habitData.createdAt
                    ? new Date(habitData.createdAt).toLocaleDateString()
                    : "Unknown"}
                </Text>
              </View>
            </ScrollView>
          </View>
        </View>
      </AlertNotificationRoot>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  title: {
    marginTop: 50,
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#000",
    textAlign: "center",
  },
  section: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
  },
  label: { fontWeight: "600", color: "#6B4E9A", marginBottom: 5 },
  value: { fontSize: 16, color: "#333" },
});
