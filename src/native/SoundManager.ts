import { NativeModules, Platform } from "react-native";
import { PhoneMode } from "../types";

const { SoundManager } = NativeModules;

if (!SoundManager && Platform.OS === "android") {
  console.warn("SoundManager native module not linked!");
}

const setMode = async (mode: PhoneMode) => {
  if (Platform.OS !== "android") {
    console.warn("Sound control only works on Android");
    return;
  }

  try {
    switch (mode) {
      case PhoneMode.SILENT:
        await SoundManager.setSilent();
        break;
      case PhoneMode.VIBRATE:
        await SoundManager.setVibrate();
        break;
      case PhoneMode.NORMAL:
        await SoundManager.setNormal();
        break;
      default:
        console.warn("Unknown mode:", mode);
    }
  } catch (error) {
    console.log("Error setting sound mode:", error);
  }
};

export default {
  setMode,
};