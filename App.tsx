import React, { useEffect, useState } from "react";
import {
  NativeModules,
  Platform,
  StyleSheet,
  View,
} from "react-native";

import { ThemeProvider } from "./src/context/ThemeContext";
import useSchedules from "./src/hooks/useSchedules";
import BackgroundService from "./src/native/BackgroundService";
import { startScheduler } from "./src/services/scheduler";
import { Schedule } from "./src/types";

import EditScheduleScreen from "./src/screens/EditScheduleScreen";
import HomeScreen from "./src/screens/HomeScreen";
import SettingsScreen from "./src/screens/SettingsScreen";

type AppScreen = "home" | "edit" | "settings";
const ENABLE_SOUND_MANAGER_STARTUP_TEST = true;

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
    console.log("Modules:", NativeModules);

    if (
      Platform.OS === "android" &&
      !NativeModules.SoundManager?.setMode
    ) {
      console.error(
        "SoundManager native module is not linked or setMode is missing"
      );
    }

    BackgroundService.startService();
    BackgroundService.requestIgnoreBatteryOptimizations();
    startScheduler();

    if (
      Platform.OS === "android" &&
      ENABLE_SOUND_MANAGER_STARTUP_TEST
    ) {
      setTimeout(() => {
        NativeModules.SoundManager.setMode("silent");
      }, 3000);
    }
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
          existingSchedules={schedules}
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
