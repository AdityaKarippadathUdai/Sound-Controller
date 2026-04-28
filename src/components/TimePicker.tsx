import React, { useState } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

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
          pressed && { transform: [{ scale: 0.97 }] },
        ]}
      >
        <View>
          <Text style={styles.label}>{label}</Text>
          <Text style={styles.time}>{value}</Text>
        </View>

        <Ionicons name="time-outline" size={20} color="#94A3B8" />
      </Pressable>

      {/* Modal */}
      <Modal visible={isOpen} transparent animationType="fade">
        {/* Backdrop */}
        <Pressable
          style={styles.backdrop}
          onPress={() => setIsOpen(false)}
        />

        {/* Bottom Sheet */}
        <View style={styles.sheet}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>Select Time</Text>

            <Pressable onPress={() => setIsOpen(false)}>
              <Ionicons name="close" size={24} color="#fff" />
            </Pressable>
          </View>

          {/* Time Controls */}
          <View style={styles.timeRow}>
            {/* Hours */}
            <View style={styles.column}>
              <Pressable onPress={() => adjustHours(1)}>
                <Ionicons name="chevron-up" size={28} color="#94A3B8" />
              </Pressable>

              <View style={styles.valueBox}>
                <Text style={styles.valueText}>
                  {hours.toString().padStart(2, "0")}
                </Text>
              </View>

              <Pressable onPress={() => adjustHours(-1)}>
                <Ionicons name="chevron-down" size={28} color="#94A3B8" />
              </Pressable>
            </View>

            <Text style={styles.colon}>:</Text>

            {/* Minutes */}
            <View style={styles.column}>
              <Pressable onPress={() => adjustMinutes(1)}>
                <Ionicons name="chevron-up" size={28} color="#94A3B8" />
              </Pressable>

              <View style={styles.valueBox}>
                <Text style={styles.valueText}>
                  {minutes.toString().padStart(2, "0")}
                </Text>
              </View>

              <Pressable onPress={() => adjustMinutes(-1)}>
                <Ionicons name="chevron-down" size={28} color="#94A3B8" />
              </Pressable>
            </View>
          </View>

          {/* Confirm Button */}
          <Pressable
            onPress={() => setIsOpen(false)}
            style={({ pressed }) => [
              styles.confirmBtn,
              pressed && { opacity: 0.8 },
            ]}
          >
            <Text style={styles.confirmText}>Set Time</Text>
          </Pressable>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  trigger: {
    width: "100%",
    padding: 16,
    borderRadius: 16,
    backgroundColor: "#111827",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  label: {
    fontSize: 10,
    color: "#94A3B8",
    textTransform: "uppercase",
    fontWeight: "700",
  },
  time: {
    fontSize: 22,
    color: "#fff",
    fontWeight: "700",
  },
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  sheet: {
    backgroundColor: "#0B0F1A",
    padding: 20,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    color: "#fff",
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
    backgroundColor: "#111827",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 10,
  },
  valueText: {
    fontSize: 32,
    fontWeight: "700",
    color: "#fff",
  },
  colon: {
    fontSize: 28,
    color: "#94A3B8",
    fontWeight: "700",
  },
  confirmBtn: {
    backgroundColor: "#1E90FF",
    padding: 16,
    borderRadius: 16,
    alignItems: "center",
  },
  confirmText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
});