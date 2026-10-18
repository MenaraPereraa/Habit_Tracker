import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import {
  ALERT_TYPE,
  Dialog,
  Toast,
  AlertNotificationRoot,
} from "react-native-alert-notification";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Header from "../components/header";

const PUBLIC_URL = "https://908cf9abf462.ngrok-free.app";

export default function AddEditHabitScreen({ navigation, route }: any) {
  const habitId = route?.params?.habitId || null;

  const [habitData, setHabitData] = useState({
    habitName: "",
    details: "",
    frequency: "",
  });
  const [selectedColor, setSelectedColor] = useState<number>(1);
  const [frequencies, setFrequencies] = useState<any[]>([]);

  const colorMap: string[] = [
    "#FFD7D7",
    "#FFF3BA",
    "#D0F4DE",
    "#B3E5FC",
    "#E2CFEA",
    "#FFE0B2",
  ];

  useEffect(() => {
    fetchFrequencies();
    if (habitId) fetchHabitDetails(habitId);
  }, []);

  const fetchFrequencies = async () => {
    try {
      const response = await fetch(
        `${PUBLIC_URL}/HabitTracker/LoadDataFrequency`
      );
      const data = await response.json();
      setFrequencies(data);
      if (!habitData.frequency && data.length > 0) {
        setHabitData((prev) => ({ ...prev, frequency: data[0].id }));
      }
    } catch (error) {
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: "Error",
        textBody: "Failed to load frequencies",
      });
    }
  };

  const fetchHabitDetails = async (id: string) => {
    try {
      const res = await fetch(`${PUBLIC_URL}/HabitTracker/GetHabitDetails`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ habitId: id }),
      });
      const data = await res.json();
      if (data.status && data.habit) {
        setHabitData({
          habitName: data.habit.habitName,
          details: data.habit.details || "",
          frequency: data.habit.frequencyId,
        });
        setSelectedColor(data.habit.colorId || 1);
      }
    } catch (error) {
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: "Error",
        textBody: "Failed to load habit details",
      });
    }
  };

  const handleSave = async () => {
    const userId = await AsyncStorage.getItem("userId");
    if (!userId) {
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: "Error",
        textBody: "User not found. Please log in again.",
      });
      return;
    }
  
    if (!habitData.habitName.trim() || !habitData.frequency) {
      Toast.show({
        type: ALERT_TYPE.WARNING,
        title: "Warning",
        textBody: "Please fill all fields",
      });
      return;
    }
  
    const habitDataForm = new FormData();
    if (habitId) habitDataForm.append("habitId", habitId);
    habitDataForm.append("habitName", habitData.habitName.trim());
    habitDataForm.append("details", habitData.details.trim());
    habitDataForm.append("frequencyId", habitData.frequency.toString());
    habitDataForm.append("colorId", selectedColor.toString());
    habitDataForm.append("color", colorMap[selectedColor - 1]);
    habitDataForm.append("userId", userId.toString());
  
    try {
      const res = await fetch(`${PUBLIC_URL}/HabitTracker/SaveHabit`, {
        method: "POST",
        body: habitDataForm,
      });
      const text = await res.text();
      const result = JSON.parse(text);
  
      if (result.status) {
        Toast.show({
          type: ALERT_TYPE.SUCCESS,
          title: "Success",
          textBody: "Habit saved successfully!",
        });
  
        setTimeout(() => {
          navigation.reset({ index: 0, routes: [{ name: "Home" }] });
        }, 1200);
      } else {
        throw new Error(result.message || "Failed to save habit");
      }
    } catch (error: any) {
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: "Error",
        textBody: error.message || "Failed to save habit",
      });
    }
  };
  

  const handleDelete = async () => {
    if (!habitId) {
      Toast.show({
        type: ALERT_TYPE.WARNING,
        title: "Warning",
        textBody: "Cannot delete a habit that hasn't been saved yet.",
      });
      return;
    }

    Dialog.show({
      type: ALERT_TYPE.DANGER,
      title: "Confirm Delete",
      textBody: "Are you sure you want to delete this habit?",
      button: "Delete",
      onPressButton: async () => {
        try {
          const res = await fetch(`${PUBLIC_URL}/HabitTracker/DeleteHabit`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ habitId }),
          });
          const result = await res.json();

          if (result.status) {
            Toast.show({
              type: ALERT_TYPE.SUCCESS,
              title: "Deleted",
              textBody: "Habit deleted successfully",
            });
            navigation.reset({ index: 0, routes: [{ name: "Home" }] });
          } else {
            Toast.show({
              type: ALERT_TYPE.DANGER,
              title: "Error",
              textBody: result.message || "Failed to delete habit",
            });
          }
        } catch (error: any) {
          Toast.show({
            type: ALERT_TYPE.DANGER,
            title: "Error",
            textBody: error.message || "Failed to delete habit",
          });
        }
      },
    });
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <AlertNotificationRoot>
        <View style={{ flex: 1 }}>
          <Header navigation={navigation} />
          <View style={{ display: "flex", flexDirection: "column", height: "90%" }}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
              <Text style={styles.title}>
                {habitId ? "Edit Habit" : "Add Habit"}
              </Text>
              <View style={[styles.card, { backgroundColor: "#FFFFFF" }]}>
                <TextInput
                  style={styles.input}
                  value={habitData.habitName}
                  onChangeText={(text) =>
                    setHabitData({ ...habitData, habitName: text })
                  }
                  placeholder="Enter habit name"
                  placeholderTextColor="#999"
                />

                <Text style={styles.label}>Frequency</Text>
                <View style={styles.pickerWrapper}>
                  <Picker
                    selectedValue={habitData.frequency}
                    onValueChange={(v) =>
                      setHabitData((prev) => ({ ...prev, frequency: v }))
                    }
                  >
                    {frequencies.map((f: any) => (
                      <Picker.Item
                        key={f.id}
                        label={f.frequency_name}
                        value={f.id}
                      />
                    ))}
                  </Picker>
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
                  placeholder="Optional details..."
                  placeholderTextColor="#999"
                  onChangeText={(text) =>
                    setHabitData({ ...habitData, details: text })
                  }
                />

                <TouchableOpacity
                  style={[
                    styles.saveButton,
                    { backgroundColor: colorMap[selectedColor - 1] },
                  ]}
                  onPress={handleSave}
                >
                  <Text style={styles.saveButtonText}>Save Habit</Text>
                </TouchableOpacity>

                {habitId && (
                  <TouchableOpacity
                    style={[styles.saveButton, { backgroundColor: "#FF6B6B" }]}
                    onPress={handleDelete}
                  >
                    <Text style={[styles.saveButtonText, { color: "#fff" }]}>
                      Delete Habit
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            </ScrollView>
          </View>
        </View>
      </AlertNotificationRoot>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: { padding: 20, backgroundColor: "#f3f4f6" },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1f2937",
    textAlign: "center",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  label: { fontSize: 16, fontWeight: "600", marginTop: 15, color: "#374151" },
  input: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    padding: 12,
    marginTop: 5,
    backgroundColor: "#f9fafb",
    color: "#111827",
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    marginTop: 5,
    overflow: "hidden",
  },
  saveButton: {
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 15,
    shadowColor: "#16a34a",
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
  },
  saveButtonText: { color: "#000", fontWeight: "700", fontSize: 16 },
  colorCircle: { width: 40, height: 40, borderRadius: 20, marginRight: 10 },
});
