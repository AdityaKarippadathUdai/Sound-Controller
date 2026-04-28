import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { useTheme } from "../context/ThemeContext";

export type Day = "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun";

const DAYS: Day[] = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

interface DaySelectorProps {
  selectedDays: Day[];
  onChange: (days: Day[]) => void;
}

export default function DaySelector({
  selectedDays,
  onChange,
}: DaySelectorProps) {
  const { colors } = useTheme();

  const toggleDay = (day: Day) => {
    if (selectedDays.includes(day)) {
      onChange(selectedDays.filter((d) => d !== day));
    } else {
      onChange([...selectedDays, day]);
    }
  };

  return (
    <View style={styles.container}>
      {DAYS.map((day) => {
        const isSelected = selectedDays.includes(day);

        return (
          <Pressable
            key={day}
            onPress={() => toggleDay(day)}
            style={[
              styles.button,
              {
                backgroundColor: isSelected
                  ? colors.primary
                  : colors.card,
                borderColor: isSelected
                  ? colors.primary
                  : colors.border,
              },
              isSelected && styles.selected,
            ]}
          >
            <Text
              style={[
                styles.text,
                {
                  color: isSelected
                    ? colors.textOnPrimary
                    : colors.textSecondary,
                },
              ]}
            >
              {day.charAt(0)}
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
    justifyContent: "space-between",
    gap: 8, // works in newer RN, else use margin
  },
  button: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
  },
  selected: {
    transform: [{ scale: 1.05 }],
  },
  text: {
    fontSize: 12,
    fontWeight: "600",
  },
});
