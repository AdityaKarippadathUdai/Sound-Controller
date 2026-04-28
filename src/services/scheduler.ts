import SoundManager from "../native/SoundManager";
import { Day, Schedule } from "../types";
import { getSchedules } from "./database";

let intervalId: ReturnType<typeof setInterval> | null = null;
let lastAppliedScheduleId: string | null = null;

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const getCurrentTime = () => {
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, "0");
  const minutes = now.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
};

const getCurrentDay = () => DAYS[new Date().getDay()];

const isTimeInRange = (
  currentTime: string,
  startTime: string,
  endTime: string
) => {
  if (startTime > endTime) {
    return currentTime >= startTime || currentTime <= endTime;
  }

  return currentTime >= startTime && currentTime <= endTime;
};

const getActiveSchedule = (
  schedules: Schedule[],
  currentDay: string,
  currentTime: string
) =>
  schedules.find(
    (schedule) =>
      schedule.isEnabled &&
      schedule.days.includes(currentDay as Day) &&
      isTimeInRange(
        currentTime,
        schedule.startTime,
        schedule.endTime
      )
  ) ?? null;

export const runSchedulerOnce = async () => {
  const schedules = await getSchedules();
  const activeSchedule = getActiveSchedule(
    schedules,
    getCurrentDay(),
    getCurrentTime()
  );

  if (!activeSchedule) {
    lastAppliedScheduleId = null;
    return;
  }

  if (activeSchedule.id === lastAppliedScheduleId) {
    return;
  }

  await SoundManager.setMode(activeSchedule.mode);
  lastAppliedScheduleId = activeSchedule.id;
};

export const startScheduler = () => {
  if (intervalId) {
    return intervalId;
  }

  runSchedulerOnce();
  intervalId = setInterval(runSchedulerOnce, 30000);
  return intervalId;
};

export const stopScheduler = () => {
  if (!intervalId) return;

  clearInterval(intervalId);
  intervalId = null;
};
