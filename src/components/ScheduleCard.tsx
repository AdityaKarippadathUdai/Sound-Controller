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
import { useTheme } from "../context/ThemeContext";

interface ScheduleCardProps {
  schedule: Schedule;
  onToggle: (id: string) => void;
  onClick: (id: string) => void;
}

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
  const { colors } = useTheme();

  return (
    <Pressable
      onPress={() => onClick(schedule.id)}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: schedule.isEnabled
            ? colors.surface
            : colors.card,
          borderColor: schedule.isEnabled
            ? colors.primary
            : colors.border,
          shadowColor: colors.textPrimary,
        },
        !schedule.isEnabled && styles.disabled,
        pressed && { transform: [{ scale: 0.98 }] },
      ]}
    >
      {/* Top Section */}
      <View style={styles.topRow}>
        <View>
          <View style={styles.modeRow}>
            <Ionicons
              name={getIcon(schedule.mode)}
              size={14}
              color={
                schedule.isEnabled
                  ? colors.primary
                  : colors.textSecondary
              }
            />
            <Text
              style={[
                styles.modeText,
                { color: colors.textSecondary },
              ]}
            >
              {schedule.mode}
            </Text>
          </View>

          <Text
            style={[
              styles.timeText,
              { color: colors.textPrimary },
            ]}
          >
            {schedule.startTime} – {schedule.endTime}
          </Text>
        </View>

        {/* Toggle Switch */}
        <Switch
          value={schedule.isEnabled}
          onValueChange={() => onToggle(schedule.id)}
          trackColor={{
            false: colors.border,
            true: colors.accent,
          }}
          thumbColor={
            schedule.isEnabled ? colors.primary : colors.card
          }
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
                    {
                      backgroundColor: isActive
                        ? colors.accent
                        : colors.card,
                      borderColor: isActive
                        ? colors.primary
                        : colors.border,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.dayText,
                      {
                        color: isActive
                          ? colors.primary
                          : colors.textSecondary,
                      },
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
          color={colors.textSecondary}
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
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 2,
  },
  disabled: {
    opacity: 0.6,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  modeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 4,
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
    borderWidth: 1,
  },
  dayText: {
    fontSize: 10,
    fontWeight: "500",
  },
});
