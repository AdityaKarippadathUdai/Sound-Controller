import AsyncStorage from "@react-native-async-storage/async-storage";
import { Schedule } from "../types";

const SCHEDULES_KEY = "schedules";

/**
 * Save schedules to storage
 */
export const saveSchedules = async (schedules: Schedule[]) => {
  try {
    await AsyncStorage.setItem(
      SCHEDULES_KEY,
      JSON.stringify(schedules)
    );
  } catch (error) {
    console.log("Error saving schedules:", error);
  }
};

/**
 * Load schedules from storage
 */
export const loadSchedules = async (): Promise<Schedule[]> => {
  try {
    const data = await AsyncStorage.getItem(SCHEDULES_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.log("Error loading schedules:", error);
    return [];
  }
};

/**
 * Clear all schedules
 */
export const clearSchedules = async () => {
  try {
    await AsyncStorage.removeItem(SCHEDULES_KEY);
  } catch (error) {
    console.log("Error clearing schedules:", error);
  }
};