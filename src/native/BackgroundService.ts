import { NativeModules, Platform } from "react-native";

type NativeBackgroundService = {
  startService: () => Promise<void>;
  stopService: () => Promise<void>;
  requestIgnoreBatteryOptimizations: () => Promise<void>;
  isIgnoringBatteryOptimizations: () => Promise<boolean>;
};

const nativeBackgroundService =
  NativeModules.BackgroundService as
    | NativeBackgroundService
    | undefined;

const unavailable = async () => {
  if (Platform.OS === "android") {
    console.warn("BackgroundService native module not linked!");
  }
};

export default {
  startService: () =>
    nativeBackgroundService?.startService() ?? unavailable(),
  stopService: () =>
    nativeBackgroundService?.stopService() ?? unavailable(),
  requestIgnoreBatteryOptimizations: () =>
    nativeBackgroundService?.requestIgnoreBatteryOptimizations() ??
    unavailable(),
  isIgnoringBatteryOptimizations: async () => {
    if (nativeBackgroundService?.isIgnoringBatteryOptimizations) {
      return await nativeBackgroundService.isIgnoringBatteryOptimizations();
    }
    return false;
  },
};
