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
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  const [automationEnabled, setAutomationEnabled] =
    useState(true);

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: isDark ? "#0B0F1A" : "#FFFFFF" },
      ]}
    >
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={onBack}>
          <Ionicons name="chevron-back" size={26} color="#fff" />
        </Pressable>

        <Text
          style={[
            styles.title,
            { color: isDark ? "#fff" : "#111827" },
          ]}
        >
          Settings
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Automation */}
        <View style={styles.section}>
          <View style={styles.row}>
            <View>
              <Text style={styles.mainText}>
                Background Automation
              </Text>
              <Text style={styles.subText}>
                Run scheduler in background
              </Text>
            </View>

            <Switch
              value={automationEnabled}
              onValueChange={setAutomationEnabled}
            />
          </View>

          <View style={styles.permissionCard}>
            <View style={styles.permissionIcon}>
              <Text style={{ color: "#22C55E" }}>✓</Text>
            </View>

            <View>
              <Text style={styles.mainText}>DND Permission</Text>
              <Text style={styles.subText}>
                System permission granted
              </Text>
            </View>
          </View>
        </View>

        {/* Appearance */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Appearance</Text>

          <Pressable
            onPress={toggleTheme}
            style={({ pressed }) => [
              styles.row,
              pressed && { opacity: 0.6 },
            ]}
          >
            <View style={styles.row}>
              <View style={styles.iconBox}>
                <Ionicons
                  name={
                    isDark ? "moon-outline" : "sunny-outline"
                  }
                  size={20}
                  color="#94A3B8"
                />
              </View>

              <Text style={styles.mainText}>
                {isDark ? "Dark Mode" : "Light Mode"}
              </Text>
            </View>

            <Switch value={isDark} onValueChange={toggleTheme} />
          </Pressable>
        </View>

        {/* Info */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Information</Text>

          <View style={styles.infoRow}>
            <Text style={styles.subText}>App Version</Text>
            <Text style={styles.mainText}>v2.4.0</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.subText}>Build Date</Text>
            <Text style={styles.mainText}>April 2026</Text>
          </View>
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
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
    color: "#94A3B8",
    textTransform: "uppercase",
    fontWeight: "700",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  mainText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#fff",
  },
  subText: {
    fontSize: 12,
    color: "#94A3B8",
  },
  permissionCard: {
    flexDirection: "row",
    gap: 10,
    padding: 12,
    borderRadius: 16,
    backgroundColor: "#111827",
    alignItems: "center",
  },
  permissionIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#22C55E20",
    alignItems: "center",
    justifyContent: "center",
  },
  iconBox: {
    padding: 10,
    borderRadius: 10,
    backgroundColor: "#1F2937",
    marginRight: 10,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  footer: {
    padding: 20,
    alignItems: "center",
  },
  footerText: {
    fontSize: 10,
    color: "#64748B",
    textTransform: "uppercase",
  },
});