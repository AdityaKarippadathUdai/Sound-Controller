import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";

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
              isSelected ? styles.selected : styles.unselected,
            ]}
          >
            <Text
              style={[
                styles.text,
                isSelected ? styles.selectedText : styles.unselectedText,
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
    backgroundColor: "#1E90FF", // primary (blue for dark theme)
    borderColor: "#1E90FF",
    transform: [{ scale: 1.05 }],
  },
  unselected: {
    backgroundColor: "transparent",
    borderColor: "#334155", // slate-700
  },
  text: {
    fontSize: 12,
    fontWeight: "600",
  },
  selectedText: {
    color: "#FFFFFF",
  },
  unselectedText: {
    color: "#94A3B8", // slate-400
  },
});