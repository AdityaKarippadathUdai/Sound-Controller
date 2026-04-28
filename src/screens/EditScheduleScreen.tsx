import React, { useState } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { Schedule, PhoneMode, Day } from "../types";
import DaySelector from "../components/DaySelector";
import ModeSelector from "../components/ModeSelector";
import TimePicker from "../components/TimePicker";
import { useTheme } from "../context/ThemeContext";

interface EditScheduleScreenProps {
  schedule?: Schedule | null;
  onSave: (schedule: Schedule) => void;
  onDelete?: (id: string) => void;
  onCancel: () => void;
}

export default function EditScheduleScreen({
  schedule,
  onSave,
  onDelete,
  onCancel,
}: EditScheduleScreenProps) {
  const { colors } = useTheme();
  const [startTime, setStartTime] = useState(
    schedule?.startTime || "22:00"
  );
  const [endTime, setEndTime] = useState(
    schedule?.endTime || "07:00"
  );
  const [days, setDays] = useState<Day[]>(
    schedule?.days || []
  );
  const [mode, setMode] = useState<PhoneMode>(
    schedule?.mode || PhoneMode.SILENT
  );
  const [showDeleteConfirm, setShowDeleteConfirm] =
    useState(false);

  const handleSave = () => {
    onSave({
      id:
        schedule?.id ||
        Math.random().toString(36).substring(2, 9),
      startTime,
      endTime,
      days,
      mode,
      isEnabled: true,
    });
  };

  const handleDelete = () => {
    if (schedule && onDelete) {
      onDelete(schedule.id);
    }
    setShowDeleteConfirm(false);
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.background },
      ]}
    >
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={onCancel}>
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
          {schedule ? "Edit Rule" : "Add Rule"}
        </Text>

        {schedule ? (
          <Pressable onPress={() => setShowDeleteConfirm(true)}>
            <Ionicons
              name="trash"
              size={20}
              color={colors.danger}
            />
          </Pressable>
        ) : (
          <View style={styles.headerSpacer} />
        )}
      </View>

      {/* Content */}
      <ScrollView contentContainerStyle={styles.content}>
        {/* Time Pickers */}
        <View style={styles.row}>
          <TimePicker
            label="Starts"
            value={startTime}
            onChange={setStartTime}
          />
          <TimePicker
            label="Ends"
            value={endTime}
            onChange={setEndTime}
          />
        </View>

        {/* Days */}
        <View>
          <Text
            style={[
              styles.label,
              { color: colors.textSecondary },
            ]}
          >
            Repeat On
          </Text>
          <DaySelector selectedDays={days} onChange={setDays} />
        </View>

        {/* Mode */}
        <View>
          <Text
            style={[
              styles.label,
              { color: colors.textSecondary },
            ]}
          >
            Device Mode
          </Text>
          <ModeSelector value={mode} onChange={setMode} />
        </View>
      </ScrollView>

      {/* Save Button */}
      <Pressable
        onPress={handleSave}
        style={({ pressed }) => [
          styles.saveBtn,
          {
            backgroundColor: pressed
              ? colors.primaryDark
              : colors.primary,
          },
        ]}
      >
        <Ionicons
          name="checkmark"
          size={18}
          color={colors.textOnPrimary}
        />
        <Text
          style={[
            styles.saveText,
            { color: colors.textOnPrimary },
          ]}
        >
          Save Schedule
        </Text>
      </Pressable>

      {/* Delete Modal */}
      <Modal visible={showDeleteConfirm} transparent animationType="fade">
        <View
          style={[
            styles.modalOverlay,
            { backgroundColor: colors.background },
          ]}
        >
          <View
            style={[
              styles.modal,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
                shadowColor: colors.textPrimary,
              },
            ]}
          >
            <Ionicons
              name="warning-outline"
              size={32}
              color={colors.danger}
            />

            <Text
              style={[
                styles.modalTitle,
                { color: colors.textPrimary },
              ]}
            >
              Delete Rule?
            </Text>
            <Text
              style={[
                styles.modalText,
                { color: colors.textSecondary },
              ]}
            >
              This action cannot be undone.
            </Text>

            <Pressable
              onPress={handleDelete}
              style={({ pressed }) => [
                styles.deleteBtn,
                { backgroundColor: colors.danger },
                pressed && { opacity: 0.8 },
              ]}
            >
              <Text
                style={[
                  styles.deleteText,
                  { color: colors.textOnPrimary },
                ]}
              >
                Delete
              </Text>
            </Pressable>

            <Pressable
              onPress={() => setShowDeleteConfirm(false)}
              style={styles.cancelBtn}
            >
              <Text
                style={[
                  styles.cancelText,
                  { color: colors.textSecondary },
                ]}
              >
                Cancel
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>
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
    justifyContent: "space-between",
    padding: 16,
    paddingTop: 50,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
  },
  headerSpacer: {
    width: 24,
  },
  content: {
    padding: 16,
    gap: 20,
  },
  row: {
    flexDirection: "row",
    gap: 10,
  },
  label: {
    fontSize: 10,
    textTransform: "uppercase",
    marginBottom: 8,
    fontWeight: "700",
  },
  saveBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
    borderRadius: 16,
    margin: 16,
    gap: 6,
    minHeight: 52,
  },
  saveText: {
    fontWeight: "700",
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    width: "85%",
    padding: 20,
    borderRadius: 20,
    borderWidth: 1,
    alignItems: "center",
    gap: 10,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.16,
    shadowRadius: 16,
    elevation: 4,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
  },
  modalText: {
    textAlign: "center",
  },
  deleteBtn: {
    padding: 12,
    borderRadius: 12,
    width: "100%",
    alignItems: "center",
    marginTop: 10,
  },
  deleteText: {
    fontWeight: "700",
  },
  cancelBtn: {
    padding: 12,
    width: "100%",
    alignItems: "center",
  },
  cancelText: {
    fontWeight: "600",
  },
});
