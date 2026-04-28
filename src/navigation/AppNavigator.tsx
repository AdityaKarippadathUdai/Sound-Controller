import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import HomeScreen from "../screens/HomeScreen";
import EditScheduleScreen from "../screens/EditScheduleScreen";
import SettingsScreen from "../screens/SettingsScreen";
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
        <Stack.Screen name="Home" component={HomeScreenWrapper} />
        <Stack.Screen name="Edit" component={EditScreenWrapper} />
        <Stack.Screen
          name="Settings"
          component={SettingsScreenWrapper}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function HomeScreenWrapper({ navigation }: any) {
  return (
    <HomeScreen
      schedules={[]}
      onToggle={() => undefined}
      onEdit={() => undefined}
      onAdd={() => navigation.navigate("Edit")}
      onNavigateToSettings={() => navigation.navigate("Settings")}
    />
  );
}

function EditScreenWrapper({ route, navigation }: any) {
  const { schedule } = route.params || {};

  return (
    <EditScheduleScreen
      schedule={schedule}
      onSave={(data) => {
        // You’ll connect this with useSchedules later
        navigation.goBack();
      }}
      onDelete={() => {
        navigation.goBack();
      }}
      onCancel={() => navigation.goBack()}
    />
  );
}

function SettingsScreenWrapper({ navigation }: any) {
  return <SettingsScreen onBack={() => navigation.goBack()} />;
}
