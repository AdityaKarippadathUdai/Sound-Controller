import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Keyboard,
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
  const [manualInput, setManualInput] = useState(value);
  
  const timeParts = manualInput.split(":");
  const hours = isNaN(parseInt(timeParts[0])) ? 0 : parseInt(timeParts[0]);
  const minutes = timeParts.length > 1 && !isNaN(parseInt(timeParts[1])) ? parseInt(timeParts[1]) : 0;

  const [kbHeight, setKbHeight] = useState(0);

  useEffect(() => {
    setManualInput(value);
  }, [value]);

  useEffect(() => {
    const showEvent = Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const hideEvent = Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";

    const showSub = Keyboard.addListener(showEvent, (e) => setKbHeight(e.endCoordinates.height));
    const hideSub = Keyboard.addListener(hideEvent, () => setKbHeight(0));

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  const isValidTime = (input: string) =>
    /^([01]\d|2[0-3]):([0-5]\d)$/.test(input);

  const handleManualInput = (input: string) => {
    // If backspacing, just allow it
    if (input.length < manualInput.length) {
      setManualInput(input);
      return;
    }

    const digits = input.replace(/\D/g, "").slice(0, 4);
    if (digits.length === 0) {
      setManualInput("");
      return;
    }

    let formatted = digits;
    if (digits.length === 1 && parseInt(digits) >= 3) {
      formatted = `0${digits}:`;
    } else if (digits.length === 2) {
      if (parseInt(digits) >= 24) {
        formatted = `0${digits[0]}:${digits[1]}`;
      } else {
        formatted = `${digits}:`;
      }
    } else if (digits.length === 3) {
      formatted = `${digits.slice(0, 2)}:${digits[2]}`;
    } else if (digits.length === 4) {
      formatted = `${digits.slice(0, 2)}:${digits.slice(2, 4)}`;
    }

    setManualInput(formatted);

    // If valid time is formed, we don't automatically confirm, but we could highlight as valid
  };

  const updateTime = (h: number, m: number) => {
    const hh = Math.max(0, Math.min(23, h))
      .toString()
      .padStart(2, "0");
    const mm = Math.max(0, Math.min(59, m))
      .toString()
      .padStart(2, "0");
    const nextValue = `${hh}:${mm}`;
    setManualInput(nextValue);
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

  const openPicker = () => {
    setManualInput(value);
    setIsOpen(true);
  };

  const confirmTime = () => {
    if (!isValidTime(manualInput)) return;

    onChange(manualInput);
    setIsOpen(false);
  };

  return (
    <>
      {/* Trigger Button */}
      <Pressable
        onPress={openPicker}
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
        <Pressable
          style={[
            styles.backdrop,
            { backgroundColor: colors.textPrimary },
          ]}
          onPress={() => setIsOpen(false)}
        />
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={[styles.modalRoot, { paddingBottom: Platform.OS === "android" ? kbHeight : 0 }]}
        >
          <Pressable
            onPress={Keyboard.dismiss}
            style={styles.dismissArea}
          >
            <ScrollView
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={styles.scrollContent}
            >
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

                  <TextInput
                    value={manualInput}
                    onChangeText={handleManualInput}
                    keyboardType="numeric"
                    placeholder="HH:MM"
                    placeholderTextColor={colors.textSecondary}
                    maxLength={5}
                    returnKeyType="done"
                    onSubmitEditing={Keyboard.dismiss}
                  style={[
                    styles.manualInput,
                    {
                      backgroundColor: colors.surface,
                      borderColor: isValidTime(manualInput)
                        ? colors.border
                        : colors.danger,
                      color: colors.textPrimary,
                    },
                  ]}
                />

                {/* Confirm Button */}
                <Pressable
                  onPress={confirmTime}
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
            </ScrollView>
          </Pressable>
        </KeyboardAvoidingView>
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
  modalRoot: {
    flex: 1,
    justifyContent: "flex-end",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.5,
  },
  dismissArea: {
    flex: 1,
    justifyContent: "flex-end",
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "flex-end",
    paddingBottom: 40,
  },
  sheet: {
    padding: 20,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderTopWidth: 1,
    width: "100%",
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
  manualInput: {
    borderWidth: 1,
    padding: 12,
    borderRadius: 10,
    marginTop: 10,
    marginBottom: 20,
    fontSize: 18,
    textAlign: "center",
  },
});
