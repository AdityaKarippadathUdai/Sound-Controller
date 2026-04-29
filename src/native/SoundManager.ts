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
    console.log("[SoundManager] Module loaded explicitly. Available keys:", _native ? Object.keys(_native) : "null");
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

const hasDndAccess = async (): Promise<boolean> => {
  if (Platform.OS !== "android" || !_native) return true;
  try {
    return _native.hasDndAccess();
  } catch (e) {
    return true; // Assume true on old versions or errors
  }
};

const requestDndAccess = async (): Promise<void> => {
  if (Platform.OS !== "android" || !_native) return;
  try {
    _native.requestDndAccess();
  } catch (e) {
    console.error("[SoundManager] requestDndAccess error:", e);
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

export default { setMode, hasDndAccess, requestDndAccess };
