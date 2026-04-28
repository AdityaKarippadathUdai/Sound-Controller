import React from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { Schedule } from "../types";
import ScheduleCard from "../components/ScheduleCard";
import { useTheme } from "../context/ThemeContext";

interface HomeScreenProps {
  schedules: Schedule[];
  onToggle: (id: string) => void;
  onEdit: (id: string) => void;
  onAdd: () => void;
  onNavigateToSettings: () => void;
}

export default function HomeScreen({
  schedules,
  onToggle,
  onEdit,
  onAdd,
  onNavigateToSettings,
}: HomeScreenProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: isDark ? "#0B0F1A" : "#FFFFFF" },
      ]}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text
          style={[
            styles.title,
            { color: isDark ? "#fff" : "#111827" },
          ]}
        >
          My Sound Setting
        </Text>

        <Pressable
          onPress={onNavigateToSettings}
          style={({ pressed }) => [
            styles.settingsBtn,
            pressed && { opacity: 0.7 },
          ]}
        >
          <Ionicons name="settings-outline" size={18} color="#94A3B8" />
        </Pressable>
      </View>

      {/* List */}
      <ScrollView
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      >
        {schedules.length === 0 ? (
          <View style={styles.empty}>
            <Ionicons
              name="notifications-off"
              size={48}
              color="#64748B"
            />
            <Text style={styles.emptyText}>
              No schedules yet.{"\n"}Tap + to create one.
            </Text>
          </View>
        ) : (
          schedules.map((schedule) => (
            <ScheduleCard
              key={schedule.id}
              schedule={schedule}
              onToggle={onToggle}
              onClick={onEdit}
            />
          ))
        )}
      </ScrollView>

      {/* FAB */}
      <Pressable
        onPress={onAdd}
        style={({ pressed }) => [
          styles.fab,
          pressed && { transform: [{ scale: 0.9 }] },
        ]}
      >
        <Ionicons name="add" size={28} color="#fff" />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 50,
    paddingHorizontal: 16,
    paddingBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
  },
  settingsBtn: {
    padding: 10,
    borderRadius: 20,
    backgroundColor: "#111827",
  },
  list: {
    padding: 16,
    paddingBottom: 100,
    gap: 12,
  },
  empty: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 80,
  },
  emptyText: {
    marginTop: 10,
    color: "#64748B",
    textAlign: "center",
  },
  fab: {
    position: "absolute",
    bottom: 30,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: "#1E90FF",
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
  },
});