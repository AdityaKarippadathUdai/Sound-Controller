import * as SQLite from "expo-sqlite";
import { Day, PhoneMode, Schedule } from "../types";

const db = SQLite.openDatabaseSync("schedules.db");

db.execSync(`
  CREATE TABLE IF NOT EXISTS schedules (
    id TEXT PRIMARY KEY,
    startTime TEXT,
    endTime TEXT,
    days TEXT,
    mode TEXT,
    isEnabled INTEGER
  );
`);

type ScheduleRow = {
  id: string;
  startTime: string;
  endTime: string;
  days: string;
  mode: PhoneMode;
  isEnabled: number;
};

const rowToSchedule = (row: ScheduleRow): Schedule => ({
  id: row.id,
  startTime: row.startTime,
  endTime: row.endTime,
  days: row.days ? (row.days.split(",") as Day[]) : [],
  mode: row.mode,
  isEnabled: row.isEnabled === 1,
});

const serializeDays = (days: Day[]) => days.join(",");

export const addSchedule = async (schedule: Schedule) => {
  await db.runAsync(
    `INSERT INTO schedules
      (id, startTime, endTime, days, mode, isEnabled)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [
      schedule.id,
      schedule.startTime,
      schedule.endTime,
      serializeDays(schedule.days),
      schedule.mode,
      schedule.isEnabled ? 1 : 0,
    ]
  );
};

export const getSchedules = async (): Promise<Schedule[]> => {
  const rows = await db.getAllAsync<ScheduleRow>(
    "SELECT * FROM schedules ORDER BY startTime ASC"
  );
  return rows.map(rowToSchedule);
};

export const updateSchedule = async (schedule: Schedule) => {
  await db.runAsync(
    `UPDATE schedules
     SET startTime = ?, endTime = ?, days = ?, mode = ?, isEnabled = ?
     WHERE id = ?`,
    [
      schedule.startTime,
      schedule.endTime,
      serializeDays(schedule.days),
      schedule.mode,
      schedule.isEnabled ? 1 : 0,
      schedule.id,
    ]
  );
};

export const deleteSchedule = async (id: string) => {
  await db.runAsync("DELETE FROM schedules WHERE id = ?", [id]);
};

export const toggleSchedule = async (
  id: string,
  isEnabled: boolean
) => {
  await db.runAsync(
    "UPDATE schedules SET isEnabled = ? WHERE id = ?",
    [isEnabled ? 1 : 0, id]
  );
};
