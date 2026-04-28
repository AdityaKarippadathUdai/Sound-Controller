import React, { useState } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";

interface TimePickerProps {
  value: string; // "HH:MM"
  onChange: (value: string) => void;
  label: string;
}

export default function TimePicker({
  value,
  onChange,
  label,
}: TimePickerProps) {
  const { colors } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [hours, minutes] = value.split(":").map(Number);

  const updateTime = (h: number, m: number) => {
    const hh = Math.max(0, Math.min(23, h))
      .toString()
      .padStart(2, "0");
    const mm = Math.max(0, Math.min(59, m))
      .toString()
      .padStart(2, "0");
    onChange(`${hh}:${mm}`);
  };

  const adjustHours = (delta: number) => {
    let next = hours + delta;
    if (next > 23) next = 0;
    if (next < 0) next = 23;
    updateTime(next, minutes);
  };

  const adjustMinutes = (delta: number) => {
    let next = Math.floor(minutes / 5) * 5 + delta * 5;
    if (next > 55) next = 0;
    if (next < 0) next = 55;
    updateTime(hours, next);
  };

  return (
    <>
      {/* Trigger Button */}
      <Pressable
        onPress={() => setIsOpen(true)}
        style={({ pressed }) => [
          styles.trigger,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
            shadowColor: colors.textPrimary,
          },
          pressed && { transform: [{ scale: 0.97 }] },
        ]}
      >
        <View>
          <Text
            style={[
              styles.label,
              { color: colors.textSecondary },
            ]}
          >
            {label}
          </Text>
          <Text
            style={[
              styles.time,
              { color: colors.textPrimary },
            ]}
          >
            {value}
          </Text>
        </View>

        <Ionicons
          name="time-outline"
          size={20}
          color={colors.textSecondary}
        />
      </Pressable>

      {/* Modal */}
      <Modal visible={isOpen} transparent animationType="fade">
        {/* Backdrop */}
        <Pressable
          style={[
            styles.backdrop,
            { backgroundColor: colors.textPrimary },
          ]}
          onPress={() => setIsOpen(false)}
        />

        {/* Bottom Sheet */}
        <View
          style={[
            styles.sheet,
            {
              backgroundColor: colors.background,
              borderColor: colors.border,
            },
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
              Select Time
            </Text>

            <Pressable onPress={() => setIsOpen(false)}>
              <Ionicons
                name="close"
                size={24}
                color={colors.textPrimary}
              />
            </Pressable>
          </View>

          {/* Time Controls */}
          <View style={styles.timeRow}>
            {/* Hours */}
            <View style={styles.column}>
              <Pressable onPress={() => adjustHours(1)}>
                <Ionicons
                  name="chevron-up"
                  size={28}
                  color={colors.textSecondary}
                />
              </Pressable>

              <View
                style={[
                  styles.valueBox,
                  {
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.valueText,
                    { color: colors.textPrimary },
                  ]}
                >
                  {hours.toString().padStart(2, "0")}
                </Text>
              </View>

              <Pressable onPress={() => adjustHours(-1)}>
                <Ionicons
                  name="chevron-down"
                  size={28}
                  color={colors.textSecondary}
                />
              </Pressable>
            </View>

            <Text
              style={[
                styles.colon,
                { color: colors.textSecondary },
              ]}
            >
              :
            </Text>

            {/* Minutes */}
            <View style={styles.column}>
              <Pressable onPress={() => adjustMinutes(1)}>
                <Ionicons
                  name="chevron-up"
                  size={28}
                  color={colors.textSecondary}
                />
              </Pressable>

              <View
                style={[
                  styles.valueBox,
                  {
                    backgroundColor: colors.surface,
                    borderColor: colors.border,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.valueText,
                    { color: colors.textPrimary },
                  ]}
                >
                  {minutes.toString().padStart(2, "0")}
                </Text>
              </View>

              <Pressable onPress={() => adjustMinutes(-1)}>
                <Ionicons
                  name="chevron-down"
                  size={28}
                  color={colors.textSecondary}
                />
              </Pressable>
            </View>
          </View>

          {/* Confirm Button */}
          <Pressable
            onPress={() => setIsOpen(false)}
            style={({ pressed }) => [
              styles.confirmBtn,
              {
                backgroundColor: pressed
                  ? colors.primaryDark
                  : colors.primary,
              },
            ]}
          >
            <Text
              style={[
                styles.confirmText,
                { color: colors.textOnPrimary },
              ]}
            >
              Set Time
            </Text>
          </Pressable>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  trigger: {
    width: "50%",
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  label: {
    fontSize: 10,
    textTransform: "uppercase",
    fontWeight: "700",
  },
  time: {
    fontSize: 22,
    fontWeight: "700",
  },
  backdrop: {
    flex: 1,
    opacity: 0.5,
  },
  sheet: {
    padding: 20,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderTopWidth: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
  },
  timeRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 20,
    marginBottom: 20,
  },
  column: {
    alignItems: "center",
  },
  valueBox: {
    width: 80,
    height: 80,
    borderRadius: 16,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
  },
  valueText: {
    fontSize: 32,
    fontWeight: "700",
  },
  colon: {
    fontSize: 28,
    fontWeight: "700",
  },
  confirmBtn: {
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
    minHeight: 52,
    justifyContent: "center",
  },
  confirmText: {
    fontWeight: "700",
    fontSize: 16,
  },
});
