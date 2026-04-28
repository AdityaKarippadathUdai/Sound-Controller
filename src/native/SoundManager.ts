import { NativeModules, Platform } from "react-native";
import { PhoneMode } from "../types";

type SoundMode = "silent" | "vibrate" | "normal";

type NativeSoundManager = {
  setMode: (mode: SoundMode) => Promise<void>;
  setSilent?: () => Promise<void>;
  setVibrate?: () => Promise<void>;
  setNormal?: () => Promise<void>;
};

const nativeSoundManager =
  NativeModules.SoundManager as NativeSoundManager | undefined;

if (!nativeSoundManager && Platform.OS === "android") {
  console.warn("SoundManager native module not linked!");
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

const setMode = async (mode: PhoneMode | SoundMode) => {
  if (Platform.OS !== "android") {
    console.warn("Sound control only works on Android");
    return;
  }

  if (!nativeSoundManager) {
    console.warn("SoundManager native module is unavailable");
    return;
  }

  try {
    await nativeSoundManager.setMode(normalizeMode(mode));
  } catch (error) {
    console.log("Error setting sound mode:", error);
  }
};

export default {
  setMode,
};
