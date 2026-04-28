import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";

import { ThemeProvider } from "./src/context/ThemeContext";
import useSchedules from "./src/hooks/useSchedules";
import { startScheduler, stopScheduler } from "./src/services/scheduler";
import { Schedule } from "./src/types";

import EditScheduleScreen from "./src/screens/EditScheduleScreen";
import HomeScreen from "./src/screens/HomeScreen";
import SettingsScreen from "./src/screens/SettingsScreen";

type AppScreen = "home" | "edit" | "settings";

function AppContent() {
  const {
    schedules,
    addSchedule,
    updateSchedule,
    deleteSchedule,
    toggleSchedule,
  } = useSchedules();
  const [currentScreen, setCurrentScreen] =
    useState<AppScreen>("home");
  const [editingSchedule, setEditingSchedule] =
    useState<Schedule | null>(null);

  useEffect(() => {
    startScheduler();
    return () => stopScheduler();
  }, []);

  const handleEdit = (id: string) => {
    const schedule = schedules.find((item) => item.id === id);
    if (!schedule) return;

    setEditingSchedule(schedule);
    setCurrentScreen("edit");
  };

  const handleAdd = () => {
    setEditingSchedule(null);
    setCurrentScreen("edit");
  };

  const handleSave = async (schedule: Schedule) => {
    if (editingSchedule) {
      await updateSchedule(schedule);
    } else {
      await addSchedule(schedule);
    }

    setCurrentScreen("home");
    setEditingSchedule(null);
  };

  const handleDelete = async (id: string) => {
    await deleteSchedule(id);
    setCurrentScreen("home");
    setEditingSchedule(null);
  };

  return (
    <View style={styles.container}>
      {currentScreen === "home" && (
        <HomeScreen
          schedules={schedules}
          onToggle={toggleSchedule}
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
