import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { FAB } from "react-native-paper";
import {
  ALERT_TYPE,
  Toast,
  Dialog,
  AlertNotificationRoot,
} from "react-native-alert-notification";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { useFocusEffect } from "@react-navigation/native";
import Header from "../components/header";
import { red100 } from "react-native-paper/lib/typescript/styles/themes/v2/colors";

const PUBLIC_URL = " https://481651ab003c.ngrok-free.app";

const colorMap = [
  "#FFD7D7",
  "#FFF3BA",
  "#D0F4DE",
  "#B3E5FC",
  "#E2CFEA",
  "#FFE0B2",
];

interface Habit {
  id: string;
  habitName: string;
  frequency: "daily" | "weekly" | "monthly";
  createdAt: string;
  daysOfWeek?: string[];
  color_id: string;
}

export default function HomeScreen({ navigation }: { navigation: any }) {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [filteredHabits, setFilteredHabits] = useState<Habit[]>([]);
  const [activeTab, setActiveTab] = useState<"daily" | "weekly" | "monthly">(
    "daily"
  );
  const [username, setUsername] = useState("User");

  useEffect(() => {
    const loadUser = async () => {
      const storedName = await AsyncStorage.getItem("username");
      if (storedName) setUsername(storedName);
    };
    loadUser();
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchHabits();
    }, [activeTab])
  );

  useEffect(() => {
    filterHabits();
  }, [habits]);

  const fetchHabits = async () => {
    const userId = await AsyncStorage.getItem("userId");
    try {
      const response = await fetch(`${PUBLIC_URL}/HabitTracker/GetHabits`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, frequency: activeTab }),
      });

      if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
      const text = await response.text();
      const data = JSON.parse(text);
      console.log(data);
      if (data.status && Array.isArray(data.habits)) {
        const formattedHabits = data.habits.map((habit: any) => ({
          id: habit.id.toString(),
          habitName: habit.habitName,
          frequency: habit.frequency || activeTab,
          createdAt: habit.createdAt || new Date().toISOString(),
          daysOfWeek: habit.daysOfWeek || [],
          color_id: habit.color,
        }));
        setHabits(formattedHabits);
      } else throw new Error(data.message || "Failed to load habits");
    } catch (error: any) {
      console.error("Error fetching habits:", error);
      Toast.show({
        type: ALERT_TYPE.DANGER,
        title: "Error",
        textBody: error.message || "Failed to load habits",
      });
    }
  };

  const filterHabits = () => {
    const filtered = habits.filter((h) => h.frequency === activeTab);
    setFilteredHabits(filtered);
  };

  const handleDelete = (item: Habit) => {
    Dialog.show({
      type: ALERT_TYPE.WARNING,
      title: "Delete Habit",
      textBody: `Are you sure you want to delete "${item.habitName}"?`,
      button: "Delete",
      onPressButton: async () => {
        try {
          const response = await fetch(
            `${PUBLIC_URL}/HabitTracker/DeleteHabit`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ habitId: item.id }),
            }
          );

          const data = await response.json();
          if (data.status) {
            setHabits((prev) => prev.filter((h) => h.id !== item.id));

            Toast.show({
              type: ALERT_TYPE.SUCCESS,
              title: "Deleted",
              textBody: `"${item.habitName}" has been deleted.`,
            });
          } else throw new Error(data.message);
        } catch (error: any) {
          Toast.show({
            type: ALERT_TYPE.DANGER,
            title: "Error",
            textBody: `Failed to delete "${item.habitName}": ${error.message}`,
          });
        } finally {
          Dialog.hide();
        }
      },
    });
  };

  const renderHabitCard = ({ item }: { item: Habit }) => (
    <View
      style={[
        styles.taskCard,
        {
          backgroundColor: colorMap[parseInt(item.color_id) -1 % colorMap.length],
        },
      ]}
    >
      <View style={styles.cardIcons}>
        <TouchableOpacity
          onPress={() => handleDelete(item)}
          style={{ marginRight: 10 }}
        >
          <MaterialCommunityIcons name="delete" size={22} color="black" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate("EditHabit", { habitId: item.id })}
        >
          <MaterialIcons name="edit" size={22} color="black" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        onPress={() =>
          navigation.navigate("HabitDetails", {
            habitId: item.id,
            habitName: item.habitName,
          })
        }
        style={{ paddingTop: 5 }}
      >
        <Text style={styles.taskTitle}>{item.habitName}</Text>
        <Text style={styles.taskDate}>
          {new Date(item.createdAt).toLocaleDateString()}
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <AlertNotificationRoot>
        <View style={{ flex: 1 }}>
          <Header navigation={navigation} />
          <View style={{ display: "flex", flexDirection: "column", height: "90%" }}>
            <View style={styles.tabContainer}>
              {["daily", "weekly", "monthly"].map((tab) => (
                <TouchableOpacity
                  key={tab}
                  style={[
                    styles.tabButton,
                    activeTab === tab && styles.activeTabButton,
                  ]}
                  onPress={() => setActiveTab(tab as any)}
                >
                  <Text
                    style={[
                      styles.tabText,
                      activeTab === tab && styles.activeTabText,
                    ]}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <FlatList
              data={filteredHabits}
              keyExtractor={(item) => item.id}
              renderItem={renderHabitCard}
              ListEmptyComponent={
                <Text style={styles.emptyText}>
                  No {activeTab} habits found. ✨
                </Text>
              }
              contentContainerStyle={{ paddingBottom: 100 }}
            />

            <FAB
              style={styles.addButton}
              icon="plus"
              onPress={() => navigation.navigate("AddHabit")}
              color="#FFFFFF"
            />
          </View>
        </View>
      </AlertNotificationRoot>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  taskCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
    position: "relative",
    marginHorizontal: 10,
  },
  cardIcons: {
    position: "absolute",
    top: 16,
    right: 12,
    flexDirection: "row",
    zIndex: 10,
  },
  taskTitle: { fontSize: 18, fontWeight: "600", color: "#1F2937" },
  taskDate: { fontSize: 12, color: "#374151" },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 15,
    paddingTop: 15,
  },
  tabButton: {
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 20,
    backgroundColor: "#E5E7EB",
  },
  activeTabButton: { backgroundColor: "#6B4E9A" },
  tabText: { color: "#1F2937", fontSize: 14, fontWeight: "500" },
  activeTabText: { color: "#FFF" },
  emptyText: {
    textAlign: "center",
    marginTop: 30,
    fontSize: 14,
    color: "#6B7280",
  },
  addButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "#6B4E9A",
    borderRadius: 50,
  },
});
