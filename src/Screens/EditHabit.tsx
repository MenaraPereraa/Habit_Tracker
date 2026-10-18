import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import {
  ALERT_TYPE,
  Toast,
  AlertNotificationRoot,
} from "react-native-alert-notification";
import Header from "../components/header";

const PUBLIC_URL = "https://908cf9abf462.ngrok-free.app";

interface Habit {
  id: string;
  habitName: string;
  frequency: "daily" | "weekly" | "monthly";
  details: string;
  colorId: number;
  userId: string;
}

interface Props {
  route: { params?: { habitId?: string } };
  navigation: any;
}

const colorMap: string[] = [
  "#FFD7D7",
  "#FFF3BA",
  "#D0F4DE",
  "#B3E5FC",
  "#E2CFEA",
  "#FFE0B2",
];

export default function EditHabit({ route, navigation }: Props) {
  const habitId = route.params?.habitId;
  const [habitData, setHabitData] = useState<Habit | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedColor, setSelectedColor] = useState<number>(1);

  useEffect(() => {
    if (!habitId) {
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: "Error",
        textBody: "No habit ID provided",
      });
      navigation.goBack();
      return;
    }
    fetchHabit();
  }, []);

  const fetchHabit = async () => {
    const userId = await AsyncStorage.getItem("userId");

    try {
      const response = await fetch(`${PUBLIC_URL}/HabitTracker/EditHabit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ habitId, userId }),
      });

      const data = await response.json();

      if (data.status && data.habit) {
        setHabitData({
          id: data.habit.id,
          habitName: data.habit.habitName,
          frequency: data.habit.frequency.toLowerCase(),
          details: data.habit.details || "",
          colorId: parseInt(data.habit.colorId || "1"),
          userId: data.habit.userId,
        });
        setSelectedColor(parseInt(data.habit.colorId || "1"));
      } else {
        throw new Error(data.message || "Habit not found");
      }
    } catch (error: any) {
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: "Error",
        textBody: `Failed to load habit data: ${error.message}`,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!habitData) return;

    if (!habitData.habitName.trim()) {
      Toast.show({
        type: ALERT_TYPE.WARNING,
        title: "Warning",
        textBody: "Habit name cannot be empty",
      });
      return;
    }

    const userId = await AsyncStorage.getItem("userId");

    let frequencyId = 1;
    if (habitData.frequency === "daily") frequencyId = 1;
    else if (habitData.frequency === "weekly") frequencyId = 2;
    else if (habitData.frequency === "monthly") frequencyId = 3;

    try {
      const response = await fetch(`${PUBLIC_URL}/HabitTracker/EditHabit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          habitId,
          userId,
          habitData: {
            habitName: habitData.habitName,
            details: habitData.details,
            frequencyId,
            colorId: selectedColor,
            userId,
          },
        }),
      });

      const data = await response.json();

      if (data.status) {
        Toast.show({
          type: ALERT_TYPE.SUCCESS,
          title: "Success",
          textBody: "Habit updated successfully",
        });
        navigation.goBack();
      } else {
        throw new Error(data.message);
      }
    } catch (error: any) {
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: "Error",
        textBody: `Failed to update habit: ${error.message}`,
      });
    }
  };

  if (loading)
    return (
      <View style={styles.container}>
        <Text>Loading habit...</Text>
      </View>
    );

  if (!habitData)
    return (
      <View style={styles.container}>
        <Text>Habit data not found.</Text>
      </View>
    );

  return (
    <AlertNotificationRoot>
      <View style={{ flex: 1 }}>
        <Header navigation={navigation} />
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Text style={styles.title}>Edit Habit</Text>
          <View style={[styles.card, { backgroundColor: "#FFFFFF" }]}>
            <Text style={styles.label}>Habit Name</Text>
            <TextInput
              style={styles.input}
              value={habitData.habitName}
              onChangeText={(text) =>
                setHabitData({ ...habitData, habitName: text })
              }
            />

            <Text style={styles.label}>Frequency</Text>
            <View style={styles.buttonGroup}>
              {["daily", "weekly", "monthly"].map((freq) => (
                <TouchableOpacity
                  key={freq}
                  style={[
                    styles.freqButton,
                    habitData.frequency === freq && styles.activeFreqButton,
                  ]}
                  onPress={() =>
                    setHabitData({ ...habitData, frequency: freq as any })
                  }
                >
                  <Text
                    style={[
                      styles.freqText,
                      habitData.frequency === freq && styles.activeFreqText,
                    ]}
                  >
                    {freq.charAt(0).toUpperCase() + freq.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.label}>Color</Text>
            <View style={{ flexDirection: "row", marginVertical: 10 }}>
              {colorMap.map((c, i) => (
                <TouchableOpacity
                  key={c}
                  style={[
                    styles.colorCircle,
                    {
                      backgroundColor: c,
                      borderWidth: selectedColor === i + 1 ? 3 : 0,
                      borderColor: "#000",
                    },
                  ]}
                  onPress={() => setSelectedColor(i + 1)}
                />
              ))}
            </View>

            <Text style={styles.label}>Details</Text>
            <TextInput
              style={[styles.input, { height: 100 }]}
              value={habitData.details}
              multiline
              onChangeText={(text) =>
                setHabitData({ ...habitData, details: text })
              }
            />

            <TouchableOpacity
              style={[
                styles.saveButton,
                { backgroundColor: colorMap[selectedColor - 1] },
              ]}
              onPress={handleUpdate}
            >
              <Text style={styles.saveButtonText}>Update Habit</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </AlertNotificationRoot>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: "#F5F5F5", flex: 1 },
  scrollContainer: { padding: 20, backgroundColor: "#f3f4f6" },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1f2937",
    textAlign: "center",
    marginBottom: 20,
  },
  card: {
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 15,
    color: "#374151",
  },
  input: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    padding: 12,
    marginTop: 5,
    backgroundColor: "#f9fafb",
    color: "#111827",
  },
  buttonGroup: {
    flexDirection: "row",
    marginBottom: 15,
    justifyContent: "space-between",
  },
  freqButton: {
    flex: 1,
    paddingVertical: 10,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 8,
    alignItems: "center",
  },
  activeFreqButton: { backgroundColor: "#6B4E9A", borderColor: "#6B4E9A" },
  freqText: { color: "#111827", fontWeight: "600" },
  activeFreqText: { color: "#FFF" },
  saveButton: {
    padding: 15,
    borderRadius: 16,
    marginTop: 20,
    alignItems: "center",
  },
  saveButtonText: { color: "#000000", fontWeight: "700", fontSize: 16 },
  colorCircle: { width: 40, height: 40, borderRadius: 20, marginRight: 10 },
});
