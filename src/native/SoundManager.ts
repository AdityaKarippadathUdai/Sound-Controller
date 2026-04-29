import { requireNativeModule } from "expo-modules-core";
import { Platform } from "react-native";
import { PhoneMode } from "../types";

type SoundMode = "silent" | "vibrate" | "normal";

// requireNativeModule throws if the module is not found —
// catch it so the JS bundle still loads on non-Android or simulator.
let _native: { setMode: (mode: string) => void } | null = null;

if (Platform.OS === "android") {
  try {
    _native = requireNativeModule("SoundManager");
  } catch (e) {
    console.warn("[SoundManager] Native module not available:", e);
  }
}

const normalizeMode = (mode: PhoneMode | SoundMode): SoundMode => {
  switch (mode) {
    case PhoneMode.SILENT:
    case "silent":
      return "silent";
    case PhoneMode.VIBRATE:
    case "vibrate":
      return "vibrate";
    case PhoneMode.NORMAL:
    case "normal":
      return "normal";
    default:
      return "normal";
  }
};

const setMode = async (mode: PhoneMode | SoundMode): Promise<void> => {
  if (Platform.OS !== "android") {
    console.warn("[SoundManager] Sound control only works on Android");
    return;
  }

  if (!_native) {
    console.warn("[SoundManager] Native module unavailable");
    return;
  }

  try {
    _native.setMode(normalizeMode(mode));
  } catch (error) {
    console.error("[SoundManager] setMode error:", error);
  }
};

export default { setMode };
