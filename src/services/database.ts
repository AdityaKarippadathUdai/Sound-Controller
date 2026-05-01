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
    isEnabled INTEGER,
    createdAt INTEGER DEFAULT 0
  );
`);

try {
  db.execSync(
    "ALTER TABLE schedules ADD COLUMN createdAt INTEGER DEFAULT 0;"
  );
} catch {
  // Existing databases already have the column.
}

type ScheduleRow = {
  id: string;
  startTime: string;
  endTime: string;
  days: string;
  mode: PhoneMode;
  isEnabled: number;
  createdAt: number | null;
};

const normalizeMode = (mode: string): PhoneMode => {
  const value = mode.toLowerCase();
  if (value.includes("silent")) return PhoneMode.SILENT;
  if (value.includes("vibrate")) return PhoneMode.VIBRATE;
  return PhoneMode.NORMAL;
};

const rowToSchedule = (row: ScheduleRow): Schedule => ({
  id: row.id,
  startTime: row.startTime,
  endTime: row.endTime,
  days: row.days ? (row.days.split(",") as Day[]) : [],
  mode: normalizeMode(row.mode),
  isEnabled: row.isEnabled === 1,
  createdAt: row.createdAt ?? 0,
});

const serializeDays = (days: Day[]) => days.join(",");

export const addSchedule = async (schedule: Schedule) => {
  await db.runAsync(
    `INSERT INTO schedules
      (id, startTime, endTime, days, mode, isEnabled, createdAt)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      schedule.id,
      schedule.startTime,
      schedule.endTime,
      serializeDays(schedule.days),
      schedule.mode,
      schedule.isEnabled ? 1 : 0,
      schedule.createdAt ?? Date.now(),
    ]
  );
};

export const getSchedules = async (): Promise<Schedule[]> => {
  const rows = await db.getAllAsync<ScheduleRow>(
    "SELECT * FROM schedules ORDER BY startTime ASC"
  );
  const schedules = rows.map(rowToSchedule);
  return schedules;
};

export const updateSchedule = async (schedule: Schedule) => {
  await db.runAsync(
    `UPDATE schedules
     SET startTime = ?, endTime = ?, days = ?, mode = ?, isEnabled = ?, createdAt = ?
     WHERE id = ?`,
    [
      schedule.startTime,
      schedule.endTime,
      serializeDays(schedule.days),
      schedule.mode,
      schedule.isEnabled ? 1 : 0,
      schedule.createdAt ?? Date.now(),
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
