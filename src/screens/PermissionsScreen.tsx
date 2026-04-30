import React from "react";
import { View, Text, Pressable, StyleSheet, SafeAreaView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../context/ThemeContext";

interface PermissionsScreenProps {
  hasDndAccess: boolean;
  hasBatteryExemption: boolean;
  onRequestDnd: () => void;
  onRequestBattery: () => void;
  onContinue: () => void;
}

export default function PermissionsScreen({
  hasDndAccess,
  hasBatteryExemption,
  onRequestDnd,
  onRequestBattery,
  onContinue,
}: PermissionsScreenProps) {
  const { colors } = useTheme();

  const allGranted = hasDndAccess && hasBatteryExemption;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <View style={styles.header}>
          <Ionicons name="shield-checkmark" size={64} color={colors.primary} />
          <Text style={[styles.title, { color: colors.textPrimary }]}>
            Permissions Required
          </Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
            SilentMode needs a few system permissions to automatically control your sound settings in the background.
          </Text>
        </View>

        <View style={styles.cardContainer}>
          {/* DND Permission Card */}
          <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={styles.cardInfo}>
              <View style={[styles.iconBox, { backgroundColor: hasDndAccess ? colors.accent : colors.card }]}>
                <Ionicons
                  name={hasDndAccess ? "checkmark" : "notifications-off"}
                  size={24}
                  color={hasDndAccess ? colors.primary : colors.textSecondary}
                />
              </View>
              <View style={styles.textContainer}>
                <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>
                  Do Not Disturb Access
                </Text>
                <Text style={[styles.cardDescription, { color: colors.textSecondary }]}>
                  Required to actually change your phone's ringer mode to silent.
                </Text>
              </View>
            </View>
            <Pressable
              style={[
                styles.button,
                { backgroundColor: hasDndAccess ? colors.surface : colors.primary },
                hasDndAccess && { borderColor: colors.border, borderWidth: 1 }
              ]}
              onPress={onRequestDnd}
              disabled={hasDndAccess}
            >
              <Text style={[styles.buttonText, { color: hasDndAccess ? colors.textSecondary : colors.textOnPrimary }]}>
                {hasDndAccess ? "Granted" : "Grant"}
              </Text>
            </Pressable>
          </View>

          {/* Battery Exemption Card */}
          <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={styles.cardInfo}>
              <View style={[styles.iconBox, { backgroundColor: hasBatteryExemption ? colors.accent : colors.card }]}>
                <Ionicons
                  name={hasBatteryExemption ? "checkmark" : "battery-charging"}
                  size={24}
                  color={hasBatteryExemption ? colors.primary : colors.textSecondary}
                />
              </View>
              <View style={styles.textContainer}>
                <Text style={[styles.cardTitle, { color: colors.textPrimary }]}>
                  Run in Background
                </Text>
                <Text style={[styles.cardDescription, { color: colors.textSecondary }]}>
                  Required to prevent Android from killing the scheduler when you close the app.
                </Text>
              </View>
            </View>
            <Pressable
              style={[
                styles.button,
                { backgroundColor: hasBatteryExemption ? colors.surface : colors.primary },
                hasBatteryExemption && { borderColor: colors.border, borderWidth: 1 }
              ]}
              onPress={onRequestBattery}
              disabled={hasBatteryExemption}
            >
              <Text style={[styles.buttonText, { color: hasBatteryExemption ? colors.textSecondary : colors.textOnPrimary }]}>
                {hasBatteryExemption ? "Granted" : "Grant"}
              </Text>
            </Pressable>
          </View>
        </View>

        {allGranted && (
          <Pressable
            style={({ pressed }) => [
              styles.continueButton,
              { backgroundColor: colors.primary },
              pressed && { opacity: 0.8 }
            ]}
            onPress={onContinue}
          >
            <Text style={[styles.continueButtonText, { color: colors.textOnPrimary }]}>
              Continue to App
            </Text>
            <Ionicons name="arrow-forward" size={20} color={colors.textOnPrimary} />
          </Pressable>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },
  cardContainer: {
    gap: 16,
    marginBottom: 40,
  },
  card: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    gap: 16,
  },
  cardInfo: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  textContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 12,
    lineHeight: 18,
  },
  button: {
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    fontWeight: "600",
    fontSize: 14,
  },
  continueButton: {
    flexDirection: "row",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
});
