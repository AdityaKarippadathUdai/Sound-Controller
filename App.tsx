import React, { useEffect, useState } from "react";
import { Platform, StyleSheet, View, Alert, AppState } from "react-native";

import { ThemeProvider } from "./src/context/ThemeContext";
import useSchedules from "./src/hooks/useSchedules";
import BackgroundService from "./src/native/BackgroundService";
import SoundManager from "./src/native/SoundManager";
import { Schedule } from "./src/types";

import EditScheduleScreen from "./src/screens/EditScheduleScreen";
import HomeScreen from "./src/screens/HomeScreen";
import PermissionsScreen from "./src/screens/PermissionsScreen";
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

  const [permissionsGranted, setPermissionsGranted] = useState<boolean | null>(null);
  const [hasDndAccess, setHasDndAccess] = useState(false);
  const [hasBatteryExemption, setHasBatteryExemption] = useState(false);

  useEffect(() => {
    let appStateSubscription: any;

    const checkPermissions = async () => {
      if (Platform.OS === "android") {
        const dnd = await SoundManager.hasDndAccess();
        const battery = await BackgroundService.isIgnoringBatteryOptimizations();

        setHasDndAccess(dnd);
        setHasBatteryExemption(battery);

        if (dnd && battery) {
          setPermissionsGranted(true);
          // Only start service if permissions are fully granted
          BackgroundService.startService();
        } else {
          setPermissionsGranted(false);
        }
      } else {
        // iOS or web bypass
        setPermissionsGranted(true);
      }
    };

    // Check permission on mount
    checkPermissions();

    // Listen for app returning to foreground to re-check
    appStateSubscription = AppState.addEventListener("change", (nextAppState) => {
      if (nextAppState === "active") {
        checkPermissions();
      }
    });

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

  if (permissionsGranted === null) {
    return <View style={[styles.container, { backgroundColor: "#fff" }]} />;
  }

  if (!permissionsGranted) {
    return (
      <PermissionsScreen
        hasDndAccess={hasDndAccess}
        hasBatteryExemption={hasBatteryExemption}
        onRequestDnd={() => SoundManager.requestDndAccess()}
        onRequestBattery={() => BackgroundService.requestIgnoreBatteryOptimizations()}
        onContinue={() => {
          setPermissionsGranted(true);
          BackgroundService.startService();
        }}
      />
    );
  }

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
