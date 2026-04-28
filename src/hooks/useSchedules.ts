import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Schedule } from "../types";

const STORAGE_KEY = "schedules";

export default function useSchedules() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);

  // 🔹 Load schedules
  useEffect(() => {
    const loadSchedules = async () => {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        if (saved) {
          setSchedules(JSON.parse(saved));
        }
      } catch (error) {
        console.log("Error loading schedules:", error);
      } finally {
        setLoading(false);
      }
    };

    loadSchedules();
  }, []);

  // 🔹 Save schedules whenever changed
  useEffect(() => {
    if (!loading) {
      AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(schedules));
    }
  }, [schedules, loading]);

  // 🔹 Toggle enable/disable
  const toggleSchedule = (id: string) => {
    setSchedules((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, isEnabled: !s.isEnabled } : s
      )
    );
  };

  // 🔹 Add new schedule
  const addSchedule = (schedule: Schedule) => {
    setSchedules((prev) => [...prev, schedule]);
  };

  // 🔹 Update existing schedule
  const updateSchedule = (updated: Schedule) => {
    setSchedules((prev) =>
      prev.map((s) => (s.id === updated.id ? updated : s))
    );
  };

  // 🔹 Delete schedule
  const deleteSchedule = (id: string) => {
    setSchedules((prev) =>
      prev.filter((s) => s.id !== id)
    );
  };

  return {
    schedules,
    loading,
    setSchedules,
    toggleSchedule,
    addSchedule,
    updateSchedule,
    deleteSchedule,
  };
}