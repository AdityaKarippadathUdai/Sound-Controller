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
  const { colors } = useTheme();

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.background },
      ]}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text
          style={[
            styles.title,
            { color: colors.textPrimary },
          ]}
        >
          My Sound Setting
        </Text>

        <Pressable
          onPress={onNavigateToSettings}
          style={({ pressed }) => [
            styles.settingsBtn,
            {
              backgroundColor: colors.surface,
              borderColor: colors.border,
            },
            pressed && { opacity: 0.7 },
          ]}
        >
          <Ionicons
            name="settings-outline"
            size={18}
            color={colors.textSecondary}
          />
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
              color={colors.textSecondary}
            />
            <Text
              style={[
                styles.emptyText,
                { color: colors.textSecondary },
              ]}
            >
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
          {
            backgroundColor: pressed
              ? colors.primaryDark
              : colors.primary,
            shadowColor: colors.textPrimary,
          },
          pressed && { transform: [{ scale: 0.9 }] },
        ]}
      >
        <Ionicons
          name="add"
          size={28}
          color={colors.textOnPrimary}
        />
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
    borderRadius: 16,
    borderWidth: 1,
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
    textAlign: "center",
  },
  fab: {
    position: "absolute",
    bottom: 30,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.16,
    shadowRadius: 12,
  },
});
