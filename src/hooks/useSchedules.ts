import { useCallback, useEffect, useState } from "react";
import { Schedule } from "../types";
import {
  addSchedule as insertSchedule,
  deleteSchedule as removeSchedule,
  getSchedules,
  toggleSchedule as setScheduleEnabled,
  updateSchedule as saveSchedule,
} from "../services/database";
import BackgroundService from "../native/BackgroundService";

export default function useSchedules() {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshSchedules = useCallback(async () => {
    const savedSchedules = await getSchedules();
    setSchedules(savedSchedules);
  }, []);

  useEffect(() => {
    const loadSchedules = async () => {
      try {
        await refreshSchedules();
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };

    loadSchedules();
  }, [refreshSchedules]);

  const addSchedule = async (schedule: Schedule) => {
    await insertSchedule(schedule);
    await refreshSchedules();
    BackgroundService.startService();
  };

  const updateSchedule = async (schedule: Schedule) => {
    await saveSchedule(schedule);
    await refreshSchedules();
    BackgroundService.startService();
  };

  const deleteSchedule = async (id: string) => {
    await removeSchedule(id);
    await refreshSchedules();
    BackgroundService.startService();
  };

  const toggleSchedule = async (id: string) => {
    const schedule = schedules.find((item) => item.id === id);
    if (!schedule) return;

    await setScheduleEnabled(id, !schedule.isEnabled);
    await refreshSchedules();
    BackgroundService.startService();
  };

  return {
    schedules,
    loading,
    addSchedule,
    updateSchedule,
    deleteSchedule,
    toggleSchedule,
    refreshSchedules,
  };
}
