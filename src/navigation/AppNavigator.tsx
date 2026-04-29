import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import {
  createNativeStackNavigator,
  NativeStackScreenProps,
} from "@react-navigation/native-stack";

import HomeScreen from "../screens/HomeScreen";
import EditScheduleScreen from "../screens/EditScheduleScreen";
import SettingsScreen from "../screens/SettingsScreen";
import useSchedules from "../hooks/useSchedules";
import { Schedule } from "../types";
import { useTheme } from "../context/ThemeContext";

export type RootStackParamList = {
  Home: undefined;
  Edit: { schedule?: Schedule | null };
  Settings: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  const { theme, colors } = useTheme();
  const {
    schedules,
    addSchedule,
    updateSchedule,
    deleteSchedule,
    toggleSchedule,
  } = useSchedules();

  return (
    <NavigationContainer
      theme={{
        dark: theme === "dark",
        colors: {
          primary: colors.primary,
          background: colors.background,
          card: colors.surface,
          text: colors.textPrimary,
          border: colors.border,
          notification: colors.primary,
        },
      }}
    >
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          contentStyle: {
            backgroundColor: colors.background,
          },
        }}
      >
        <Stack.Screen name="Home">
          {({ navigation }) => (
            <HomeScreen
              schedules={schedules}
              onToggle={toggleSchedule}
              onEdit={(id) => {
                const schedule = schedules.find(
                  (item) => item.id === id
                );
                navigation.navigate("Edit", { schedule });
              }}
              onAdd={() =>
                navigation.navigate("Edit", { schedule: null })
              }
              onNavigateToSettings={() =>
                navigation.navigate("Settings")
              }
            />
          )}
        </Stack.Screen>

        <Stack.Screen name="Edit">
          {({
            route,
            navigation,
          }: NativeStackScreenProps<
            RootStackParamList,
            "Edit"
          >) => {
            const schedule = route.params?.schedule ?? null;

            return (
              <EditScheduleScreen
                schedule={schedule}
                existingSchedules={schedules}
                onSave={async (nextSchedule) => {
                  if (schedule) {
                    await updateSchedule(nextSchedule);
                  } else {
                    await addSchedule(nextSchedule);
                  }
                  navigation.goBack();
                }}
                onDelete={async (id) => {
                  await deleteSchedule(id);
                  navigation.goBack();
                }}
                onCancel={() => navigation.goBack()}
              />
            );
          }}
        </Stack.Screen>

        <Stack.Screen name="Settings">
          {({ navigation }) => (
            <SettingsScreen onBack={() => navigation.goBack()} />
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
