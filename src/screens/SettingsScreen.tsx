import React, { useState } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
  Switch,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";

interface SettingsScreenProps {
  onBack: () => void;
}

export default function SettingsScreen({
  onBack,
}: SettingsScreenProps) {
  const { theme, colors, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  const [automationEnabled, setAutomationEnabled] =
    useState(true);

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.background },
      ]}
    >
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={onBack}>
          <Ionicons
            name="chevron-back"
            size={26}
            color={colors.textPrimary}
          />
        </Pressable>

        <Text
          style={[
            styles.title,
            { color: colors.textPrimary },
          ]}
        >
          Settings
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Automation */}
        <View style={styles.section}>
          <View
            style={[
              styles.row,
              styles.cardRow,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
                shadowColor: colors.textPrimary,
              },
            ]}
          >
            <View>
              <Text
                style={[
                  styles.mainText,
                  { color: colors.textPrimary },
                ]}
              >
                Background Automation
              </Text>
              <Text
                style={[
                  styles.subText,
                  { color: colors.textSecondary },
                ]}
              >
                Run scheduler in background
              </Text>
            </View>

            <Switch
              value={automationEnabled}
              onValueChange={setAutomationEnabled}
              trackColor={{
                false: colors.border,
                true: colors.accent,
              }}
              thumbColor={
                automationEnabled ? colors.primary : colors.card
              }
            />
          </View>

          <View
            style={[
              styles.permissionCard,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
                shadowColor: colors.textPrimary,
              },
            ]}
          >
            <View
              style={[
                styles.permissionIcon,
                { backgroundColor: colors.accent },
              ]}
            >
              <Text style={{ color: colors.primary }}>✓</Text>
            </View>

            <View>
              <Text
                style={[
                  styles.mainText,
                  { color: colors.textPrimary },
                ]}
              >
                DND Permission
              </Text>
              <Text
                style={[
                  styles.subText,
                  { color: colors.textSecondary },
                ]}
              >
                System permission granted
              </Text>
            </View>
          </View>
        </View>

        {/* Appearance */}
        <View style={styles.section}>
          <Text
            style={[
              styles.sectionLabel,
              { color: colors.textSecondary },
            ]}
          >
            Appearance
          </Text>

          <Pressable
            onPress={toggleTheme}
            style={({ pressed }) => [
              styles.row,
              styles.cardRow,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
                shadowColor: colors.textPrimary,
              },
              pressed && { opacity: 0.6 },
            ]}
          >
            <View style={styles.rowContent}>
              <View
                style={[
                  styles.iconBox,
                  { backgroundColor: colors.card },
                ]}
              >
                <Ionicons
                  name={
                    isDark ? "moon-outline" : "sunny-outline"
                  }
                  size={20}
                  color={colors.textSecondary}
                />
              </View>

              <Text
                style={[
                  styles.mainText,
                  { color: colors.textPrimary },
                ]}
              >
                {isDark ? "Dark Mode" : "Light Mode"}
              </Text>
            </View>

            <Switch
              value={isDark}
              onValueChange={toggleTheme}
              trackColor={{
                false: colors.border,
                true: colors.accent,
              }}
              thumbColor={isDark ? colors.primary : colors.card}
            />
          </Pressable>
        </View>

        {/* Info */}
        <View style={styles.section}>
          <Text
            style={[
              styles.sectionLabel,
              { color: colors.textSecondary },
            ]}
          >
            Information
          </Text>

          <View
            style={[
              styles.infoRow,
              {
                borderColor: colors.border,
              },
            ]}
          >
            <Text
              style={[
                styles.subText,
                { color: colors.textSecondary },
              ]}
            >
              App Version
            </Text>
            <Text
              style={[
                styles.mainText,
                { color: colors.textPrimary },
              ]}
            >
              v2.4.0
            </Text>
          </View>

          <View
            style={[
              styles.infoRow,
              {
                borderColor: colors.border,
              },
            ]}
          >
            <Text
              style={[
                styles.subText,
                { color: colors.textSecondary },
              ]}
            >
              Build Date
            </Text>
            <Text
              style={[
                styles.mainText,
                { color: colors.textPrimary },
              ]}
            >
              April 2026
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <Text
          style={[
            styles.footerText,
            { color: colors.textSecondary },
          ]}
        >
          SilentMode Scheduler Project
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 50,
    paddingHorizontal: 16,
    gap: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
  },
  content: {
    padding: 16,
    gap: 24,
  },
  section: {
    gap: 16,
  },
  sectionLabel: {
    fontSize: 10,
    textTransform: "uppercase",
    fontWeight: "700",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  rowContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  cardRow: {
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  mainText: {
    fontSize: 14,
    fontWeight: "600",
  },
  subText: {
    fontSize: 12,
  },
  permissionCard: {
    flexDirection: "row",
    gap: 10,
    padding: 12,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: "center",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  permissionIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  iconBox: {
    padding: 10,
    borderRadius: 10,
    marginRight: 10,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  footer: {
    padding: 20,
    alignItems: "center",
  },
  footerText: {
    fontSize: 10,
    textTransform: "uppercase",
  },
});
