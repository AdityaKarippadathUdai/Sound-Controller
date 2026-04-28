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

interface EditScheduleScreenProps {
  schedule?: Schedule | null;
  onSave: (schedule: Partial<Schedule>) => void;
  onDelete?: (id: string) => void;
  onCancel: () => void;
}

export default function EditScheduleScreen({
  schedule,
  onSave,
  onDelete,
  onCancel,
}: EditScheduleScreenProps) {
  const [startTime, setStartTime] = useState(
    schedule?.startTime || "22:00"
  );
  const [endTime, setEndTime] = useState(
    schedule?.endTime || "07:00"
  );
  const [days, setDays] = useState<Day[]>(
    schedule?.days || ["Mon", "Tue", "Wed", "Thu", "Fri"]
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
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={onCancel}>
          <Ionicons name="chevron-back" size={26} color="#fff" />
        </Pressable>

        <Text style={styles.title}>
          {schedule ? "Edit Rule" : "Add Rule"}
        </Text>

        {schedule ? (
          <Pressable onPress={() => setShowDeleteConfirm(true)}>
            <Ionicons name="trash" size={20} color="#ef4444" />
          </Pressable>
        ) : (
          <View style={{ width: 24 }} />
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
          <Text style={styles.label}>Repeat On</Text>
          <DaySelector selectedDays={days} onChange={setDays} />
        </View>

        {/* Mode */}
        <View>
          <Text style={styles.label}>Device Mode</Text>
          <ModeSelector value={mode} onChange={setMode} />
        </View>
      </ScrollView>

      {/* Save Button */}
      <Pressable
        onPress={handleSave}
        style={({ pressed }) => [
          styles.saveBtn,
          pressed && { opacity: 0.8 },
        ]}
      >
        <Ionicons name="checkmark" size={18} color="#fff" />
        <Text style={styles.saveText}>Save Schedule</Text>
      </Pressable>

      {/* Delete Modal */}
      <Modal visible={showDeleteConfirm} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            <Ionicons
              name="warning-outline"
              size={32}
              color="#ef4444"
            />

            <Text style={styles.modalTitle}>Delete Rule?</Text>
            <Text style={styles.modalText}>
              This action cannot be undone.
            </Text>

            <Pressable
              onPress={handleDelete}
              style={styles.deleteBtn}
            >
              <Text style={styles.deleteText}>Delete</Text>
            </Pressable>

            <Pressable
              onPress={() => setShowDeleteConfirm(false)}
              style={styles.cancelBtn}
            >
              <Text style={styles.cancelText}>Cancel</Text>
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
    backgroundColor: "#0B0F1A",
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
    color: "#fff",
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
    color: "#94A3B8",
    textTransform: "uppercase",
    marginBottom: 8,
    fontWeight: "700",
  },
  saveBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#1E90FF",
    padding: 16,
    borderRadius: 16,
    margin: 16,
    gap: 6,
  },
  saveText: {
    color: "#fff",
    fontWeight: "700",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    width: "85%",
    backgroundColor: "#111827",
    padding: 20,
    borderRadius: 20,
    alignItems: "center",
    gap: 10,
  },
  modalTitle: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "700",
  },
  modalText: {
    color: "#94A3B8",
    textAlign: "center",
  },
  deleteBtn: {
    backgroundColor: "#ef4444",
    padding: 12,
    borderRadius: 12,
    width: "100%",
    alignItems: "center",
    marginTop: 10,
  },
  deleteText: {
    color: "#fff",
    fontWeight: "700",
  },
  cancelBtn: {
    padding: 12,
    width: "100%",
    alignItems: "center",
  },
  cancelText: {
    color: "#94A3B8",
  },
});