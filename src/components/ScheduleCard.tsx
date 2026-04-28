import React from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Switch,
} from "react-native";
import { Schedule, PhoneMode } from "../types";
import { Ionicons } from "@expo/vector-icons";

interface ScheduleCardProps {
  schedule: Schedule;
  onToggle: (id: string) => void;
  onClick: (id: string) => void;
}

const getModeColor = (mode: PhoneMode) => {
  switch (mode) {
    case PhoneMode.SILENT:
      return "#60A5FA"; // blue
    case PhoneMode.VIBRATE:
      return "#F59E0B"; // orange
    case PhoneMode.NORMAL:
      return "#22C55E"; // green
    default:
      return "#fff";
  }
};

const getIcon = (mode: PhoneMode) => {
  switch (mode) {
    case PhoneMode.SILENT:
      return "notifications-off";
    case PhoneMode.VIBRATE:
      return "phone-portrait";
    case PhoneMode.NORMAL:
      return "notifications";
    default:
      return "notifications";
  }
};

export default function ScheduleCard({
  schedule,
  onToggle,
  onClick,
}: ScheduleCardProps) {
  const modeColor = getModeColor(schedule.mode);

  return (
    <Pressable
      onPress={() => onClick(schedule.id)}
      style={({ pressed }) => [
        styles.card,
        schedule.isEnabled ? styles.enabled : styles.disabled,
        pressed && { transform: [{ scale: 0.98 }] },
      ]}
    >
      {/* Top Section */}
      <View style={styles.topRow}>
        <View>
          <Text style={[styles.modeText, { color: modeColor }]}>
            {schedule.mode}
          </Text>

          <Text style={styles.timeText}>
            {schedule.startTime} – {schedule.endTime}
          </Text>
        </View>

        {/* Toggle Switch */}
        <Switch
          value={schedule.isEnabled}
          onValueChange={() => onToggle(schedule.id)}
        />
      </View>

      {/* Bottom Section */}
      <View style={styles.bottomRow}>
        {/* Days */}
        <View style={styles.daysContainer}>
          {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
            (day, index) => {
              const short = day.charAt(0);
              const isActive = schedule.days.includes(day as any);

              return (
                <View
                  key={index}
                  style={[
                    styles.dayCircle,
                    isActive
                      ? styles.activeDay
                      : styles.inactiveDay,
                  ]}
                >
                  <Text
                    style={[
                      styles.dayText,
                      isActive
                        ? styles.activeDayText
                        : styles.inactiveDayText,
                    ]}
                  >
                    {short}
                  </Text>
                </View>
              );
            }
          )}
        </View>

        {/* Arrow */}
        <Ionicons
          name="chevron-forward"
          size={16}
          color="#64748B"
        />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
  },
  enabled: {
    backgroundColor: "#111827",
    borderColor: "#1E3A8A",
  },
  disabled: {
    backgroundColor: "transparent",
    borderColor: "#1F2937",
    opacity: 0.6,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  modeText: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  timeText: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  daysContainer: {
    flexDirection: "row",
    gap: 4,
  },
  dayCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  activeDay: {
    backgroundColor: "#1E90FF20",
  },
  inactiveDay: {
    backgroundColor: "#1F2937",
  },
  dayText: {
    fontSize: 10,
    fontWeight: "500",
  },
  activeDayText: {
    color: "#1E90FF",
  },
  inactiveDayText: {
    color: "#94A3B8",
  },
});