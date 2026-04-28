import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { PhoneMode } from "../types";
import { useTheme } from "../context/ThemeContext";

import { Ionicons } from "@expo/vector-icons";

interface ModeSelectorProps {
  value: PhoneMode;
  onChange: (mode: PhoneMode) => void;
}

export default function ModeSelector({
  value,
  onChange,
}: ModeSelectorProps) {
  const { colors } = useTheme();

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
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          shadowColor: colors.textPrimary,
        },
      ]}
    >
      {modes.map((mode) => {
        const isActive = value === mode.id;

        return (
          <Pressable
            key={mode.id}
            onPress={() => onChange(mode.id)}
            style={[
              styles.button,
              isActive && { backgroundColor: colors.primary },
            ]}
          >
            <Ionicons
              name={mode.icon as any}
              size={16}
              color={
                isActive
                  ? colors.textOnPrimary
                  : colors.textSecondary
              }
              style={{ marginBottom: 4 }}
            />

            <Text
              style={[
                styles.text,
                {
                  color: isActive
                    ? colors.textOnPrimary
                    : colors.textSecondary,
                },
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
    padding: 4,
    borderRadius: 12,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  button: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontSize: 12,
    fontWeight: "600",
  },
});
