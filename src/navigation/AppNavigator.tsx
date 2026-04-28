import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import HomeScreen from "../screens/HomeScreen";
import EditScheduleScreen from "../screens/EditScheduleScreen";
import SettingsScreen from "../screens/SettingsScreen";
import { Schedule } from "../types";

export type RootStackParamList = {
  Home: undefined;
  Edit: { schedule?: Schedule | null };
  Settings: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false, // you already built custom headers
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Edit" component={EditScreenWrapper} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

---

# 🧠 Wrapper for Edit Screen (IMPORTANT)

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