import React, { useEffect, useState } from "react";
import { Platform, StyleSheet, View, Alert, AppState } from "react-native";

import { ThemeProvider } from "./src/context/ThemeContext";
import useSchedules from "./src/hooks/useSchedules";
import BackgroundService from "./src/native/BackgroundService";
import SoundManager from "./src/native/SoundManager";
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

  const [currentScreen, setCurrentScreen] = useState<AppScreen>("home");
  const [editingSchedule, setEditingSchedule] = useState<Schedule | null>(null);

  useEffect(() => {
    let appStateSubscription: any;

    const checkAndPromptDndAccess = async () => {
      if (Platform.OS === "android") {
        const hasAccess = await SoundManager.hasDndAccess();
        if (!hasAccess) {
          Alert.alert(
            "Permission Required",
            "This app needs Do Not Disturb access to change your phone's sound mode to Silent. Please enable it in Settings.",
            [
              { text: "Cancel", style: "cancel" },
              {
                text: "Open Settings",
                onPress: () => SoundManager.requestDndAccess(),
              },
            ]
          );
        }
      }
    };

    if (Platform.OS === "android") {
      // Check permission on mount
      checkAndPromptDndAccess();

      // Listen for app returning to foreground to re-check
      appStateSubscription = AppState.addEventListener("change", (nextAppState) => {
        if (nextAppState === "active") {
          checkAndPromptDndAccess();
        }
      });

      // Start the foreground scheduler service (survives app close)
      BackgroundService.startService();
      // Prompt user to disable battery optimization for reliable background execution
      BackgroundService.requestIgnoreBatteryOptimizations();
    }

    return () => {
      if (appStateSubscription) {
        appStateSubscription.remove();
      }
    };
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
          onNavigateToSettings={() => setCurrentScreen("settings")}
        />
      )}

      {currentScreen === "settings" && (
        <SettingsScreen onBack={() => setCurrentScreen("home")} />
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
