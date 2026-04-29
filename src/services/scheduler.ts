import SoundManager from "../native/SoundManager";
import { Day, Schedule } from "../types";
import { getSchedules } from "./database";

let intervalId: ReturnType<typeof setInterval> | null = null;
let forceTestIntervalId: ReturnType<typeof setInterval> | null = null;
let lastAppliedScheduleId: string | null = null;

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const ENABLE_FORCE_SILENT_TEST = typeof __DEV__ !== "undefined" && __DEV__;

const getCurrentTime = () => {
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, "0");
  const minutes = now.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
};

const getCurrentDay = () => DAYS[new Date().getDay()];

const toMinutes = (time: string) => {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
};

const isTimeInRange = (
  currentMinutes: number,
  startTime: string,
  endTime: string
) => {
  const startMinutes = toMinutes(startTime);
  const endMinutes = toMinutes(endTime);

  if (startMinutes > endMinutes) {
    return (
      currentMinutes >= startMinutes ||
      currentMinutes <= endMinutes
    );
  }

  return (
    currentMinutes >= startMinutes &&
    currentMinutes <= endMinutes
  );
};

const getActiveSchedule = (
  schedules: Schedule[],
  currentDay: string,
  currentMinutes: number
) =>
  schedules.find(
    (schedule) =>
      schedule.isEnabled &&
      schedule.days.includes(currentDay as Day) &&
      isTimeInRange(
        currentMinutes,
        schedule.startTime,
        schedule.endTime
      )
  ) ?? null;

export const runSchedulerOnce = async () => {
  try {
    const now = new Date();
    const currentTime = getCurrentTime();
    const currentDay = getCurrentDay();
    const currentMinutes =
      now.getHours() * 60 + now.getMinutes();
    const schedules = await getSchedules();

    console.log("Scheduler tick");
    console.log("Current time:", currentTime);
    console.log("Current day:", currentDay);
    console.log("Current minutes:", currentMinutes);
    console.log("Schedules:", schedules);

    const activeSchedule = getActiveSchedule(
      schedules,
      currentDay,
      currentMinutes
    );

    console.log("Active schedule:", activeSchedule);

    if (!activeSchedule) {
      lastAppliedScheduleId = null;
      return;
    }

    if (activeSchedule.id === lastAppliedScheduleId) {
      console.log(
        "Schedule already applied:",
        activeSchedule.id
      );
      return;
    }

    console.log(
      "Calling SoundManager.setMode:",
      activeSchedule.mode
    );
    await SoundManager.setMode(activeSchedule.mode);
    lastAppliedScheduleId = activeSchedule.id;
  } catch (error) {
    console.log("Scheduler error:", error);
  }
};

export const startScheduler = () => {
  if (intervalId) {
    console.log("Scheduler already started");
    return intervalId;
  }

  console.log("Scheduler started");
  runSchedulerOnce();
  intervalId = setInterval(runSchedulerOnce, 30000);

  if (ENABLE_FORCE_SILENT_TEST && !forceTestIntervalId) {
    forceTestIntervalId = setInterval(() => {
      console.log("TEST: forcing silent mode");
      SoundManager.setMode("silent");
    }, 10000);
  }

  return intervalId;
};

export const stopScheduler = () => {
  if (!intervalId) return;

  clearInterval(intervalId);
  intervalId = null;

  if (forceTestIntervalId) {
    clearInterval(forceTestIntervalId);
    forceTestIntervalId = null;
  }
};
