import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { PhoneMode } from "../types";

// Replace lucide-react with react-native-vector-icons or expo icons
import { Ionicons } from "@expo/vector-icons";

interface ModeSelectorProps {
  value: PhoneMode;
  onChange: (mode: PhoneMode) => void;
}

export default function ModeSelector({
  value,
  onChange,
}: ModeSelectorProps) {
  const modes = [
    {
      id: PhoneMode.SILENT,
      label: "Silent",
      icon: "notifications-off",
    },
    {
      id: PhoneMode.VIBRATE,
      label: "Vibrate",
      icon: "phone-portrait",
    },
    {
      id: PhoneMode.NORMAL,
      label: "Normal",
      icon: "notifications",
    },
  ];

  return (
    <View style={styles.container}>
      {modes.map((mode) => {
        const isActive = value === mode.id;

        return (
          <Pressable
            key={mode.id}
            onPress={() => onChange(mode.id)}
            style={[
              styles.button,
              isActive ? styles.activeButton : styles.inactiveButton,
            ]}
          >
            <Ionicons
              name={mode.icon as any}
              size={16}
              color={isActive ? "#fff" : "#94A3B8"}
              style={{ marginBottom: 4 }}
            />

            <Text
              style={[
                styles.text,
                isActive ? styles.activeText : styles.inactiveText,
              ]}
            >
              {mode.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "#111827", // dark surface
    padding: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#1F2937",
  },
  button: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  activeButton: {
    backgroundColor: "#1E90FF", // primary blue
  },
  inactiveButton: {
    backgroundColor: "transparent",
  },
  text: {
    fontSize: 12,
    fontWeight: "600",
  },
  activeText: {
    color: "#FFFFFF",
  },
  inactiveText: {
    color: "#94A3B8",
  },
});