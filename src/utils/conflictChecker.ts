import { Day, Schedule } from "../types";

type ConflictResult = {
  hasConflict: boolean;
  conflictingScheduleIds: string[];
};

const timeToMinutes = (time: string) => {
  const [hours, minutes] = time.split(":").map(Number);
  return hours * 60 + minutes;
};

const getRanges = (startTime: string, endTime: string) => {
  const start = timeToMinutes(startTime);
  const end = timeToMinutes(endTime);

  if (start === end) {
    return [{ start: 0, end: 24 * 60 - 1 }];
  }

  if (start < end) {
    return [{ start, end }];
  }

  return [
    { start, end: 24 * 60 - 1 },
    { start: 0, end },
  ];
};

const overlaps = (
  first: { start: number; end: number },
  second: { start: number; end: number }
) => first.start <= second.end && second.start <= first.end;

const hasSharedDay = (first: Day[], second: Day[]) =>
  first.some((day) => second.includes(day));

export const checkScheduleConflict = (
  newSchedule: Schedule,
  existingSchedules: Schedule[]
): ConflictResult => {
  const newRanges = getRanges(
    newSchedule.startTime,
    newSchedule.endTime
  );

  const conflictingScheduleIds = existingSchedules
    .filter((schedule) => schedule.id !== newSchedule.id)
    .filter((schedule) => hasSharedDay(newSchedule.days, schedule.days))
    .filter((schedule) => {
      const existingRanges = getRanges(
        schedule.startTime,
        schedule.endTime
      );

      return newRanges.some((newRange) =>
        existingRanges.some((existingRange) =>
          overlaps(newRange, existingRange)
        )
      );
    })
    .map((schedule) => schedule.id);

  return {
    hasConflict: conflictingScheduleIds.length > 0,
    conflictingScheduleIds,
  };
};
