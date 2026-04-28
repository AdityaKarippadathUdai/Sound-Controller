import React, { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { ThemeProvider } from "./src/context/ThemeContext";
import { Schedule, PhoneMode } from "./src/types";

import HomeScreen from "./src/screens/HomeScreen";
import EditScheduleScreen from "./src/screens/EditScheduleScreen";
import SettingsScreen from "./src/screens/SettingsScreen";

const INITIAL_SCHEDULES: Schedule[] = [
  {
    id: "1",
    startTime: "22:00",
    endTime: "07:00",
    days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    mode: PhoneMode.SILENT,
    isEnabled: true,
  },
  {
    id: "2",
    startTime: "09:00",
    endTime: "17:00",
    days: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    mode: PhoneMode.VIBRATE,
    isEnabled: false,
  },
];

type AppScreen = "home" | "edit" | "settings";

function AppContent() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [currentScreen, setCurrentScreen] =
    useState<AppScreen>("home");
  const [editingSchedule, setEditingSchedule] =
    useState<Schedule | null>(null);

  // Load schedules
  useEffect(() => {
    const load = async () => {
      const saved = await AsyncStorage.getItem("schedules");
      if (saved) {
        setSchedules(JSON.parse(saved));
      } else {
        setSchedules(INITIAL_SCHEDULES);
      }
    };
    load();
  }, []);

  // Save schedules
  useEffect(() => {
    AsyncStorage.setItem(
      "schedules",
      JSON.stringify(schedules)
    );
  }, [schedules]);

  const handleToggle = (id: string) => {
    setSchedules((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, isEnabled: !s.isEnabled } : s
      )
    );
  };

  const handleEdit = (id: string) => {
    const schedule = schedules.find((s) => s.id === id);
    if (schedule) {
      setEditingSchedule(schedule);
      setCurrentScreen("edit");
    }
  };

  const handleAdd = () => {
    setEditingSchedule(null);
    setCurrentScreen("edit");
  };

  const handleSave = (newSchedule: Partial<Schedule>) => {
    if (editingSchedule) {
      setSchedules((prev) =>
        prev.map((s) =>
          s.id === editingSchedule.id
            ? ({ ...s, ...newSchedule } as Schedule)
            : s
        )
      );
    } else {
      setSchedules((prev) => [
        ...prev,
        newSchedule as Schedule,
      ]);
    }

    setCurrentScreen("home");
    setEditingSchedule(null);
  };

  const handleDelete = (id: string) => {
    setSchedules((prev) =>
      prev.filter((s) => s.id !== id)
    );
    setCurrentScreen("home");
    setEditingSchedule(null);
  };

  return (
    <View style={styles.container}>
      {currentScreen === "home" && (
        <HomeScreen
          schedules={schedules}
          onToggle={handleToggle}
          onEdit={handleEdit}
          onAdd={handleAdd}
          onNavigateToSettings={() =>
            setCurrentScreen("settings")
          }
        />
      )}

      {currentScreen === "settings" && (
        <SettingsScreen
          onBack={() => setCurrentScreen("home")}
        />
      )}

      {currentScreen === "edit" && (
        <EditScheduleScreen
          schedule={editingSchedule}
          onSave={handleSave}
          onDelete={handleDelete}
          onCancel={() => {
            setCurrentScreen("home");
            setEditingSchedule(null);
          }}
        />
      )}
    </View>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});