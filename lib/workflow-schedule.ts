const TIME_12H_REGEX = /^(\d{1,2}):(\d{2})(AM|PM)$/i;
const TIME_24H_REGEX = /^(\d{2}):(\d{2})$/;

export type WorkflowScheduleConfig = {
  times: string[];
  reminderMinutes: number;
};

export const DEFAULT_WORKFLOW_TIME = "9:00AM";

export function normalizeWorkflowTime(value: string): string {
  const trimmed = value.trim().toUpperCase();
  const match12 = trimmed.match(TIME_12H_REGEX);
  if (match12) {
    const hour = Number.parseInt(match12[1], 10);
    const minutes = match12[2];
    const suffix = match12[3];
    if (hour >= 1 && hour <= 12) {
      return `${hour}:${minutes}${suffix}`;
    }
  }

  const match24 = trimmed.match(TIME_24H_REGEX);
  if (match24) {
    const hour = Number.parseInt(match24[1], 10);
    const minutes = match24[2];
    if (hour >= 0 && hour <= 23) {
      const suffix = hour >= 12 ? "PM" : "AM";
      const hour12 = hour % 12 || 12;
      return `${hour12}:${minutes}${suffix}`;
    }
  }

  return DEFAULT_WORKFLOW_TIME;
}

export function to24HourWorkflowTime(value: string): string {
  const normalized = normalizeWorkflowTime(value);
  const match = normalized.match(TIME_12H_REGEX);
  if (!match) {
    return "09:00";
  }

  let hour = Number.parseInt(match[1], 10);
  const minutes = match[2];
  const suffix = match[3].toUpperCase();

  if (suffix === "PM" && hour !== 12) {
    hour += 12;
  }
  if (suffix === "AM" && hour === 12) {
    hour = 0;
  }

  return `${hour.toString().padStart(2, "0")}:${minutes}`;
}

export function from24HourWorkflowTime(value: string): string {
  return normalizeWorkflowTime(value);
}

export function parseWorkflowScheduleConfig(
  rawValue?: string | null,
): WorkflowScheduleConfig {
  if (!rawValue) {
    return { times: [DEFAULT_WORKFLOW_TIME], reminderMinutes: 0 };
  }

  try {
    const parsed = JSON.parse(rawValue) as {
      times?: unknown;
      reminder_minutes?: unknown;
      reminderMinutes?: unknown;
    };
    const rawTimes = Array.isArray(parsed.times) ? parsed.times : [];
    const times = rawTimes
      .map((value) =>
        typeof value === "string" ? normalizeWorkflowTime(value) : null,
      )
      .filter((value): value is string => Boolean(value));
    const reminderCandidate =
      typeof parsed.reminder_minutes === "number"
        ? parsed.reminder_minutes
        : typeof parsed.reminderMinutes === "number"
          ? parsed.reminderMinutes
          : 0;

    return {
      times: times.length > 0 ? Array.from(new Set(times)) : [DEFAULT_WORKFLOW_TIME],
      reminderMinutes:
        Number.isFinite(reminderCandidate) && reminderCandidate > 0
          ? Math.floor(reminderCandidate)
          : 0,
    };
  } catch {
    return {
      times: [normalizeWorkflowTime(rawValue)],
      reminderMinutes: 0,
    };
  }
}

export function serializeWorkflowScheduleConfig(
  times: string[],
  reminderMinutes: number,
): string {
  const normalizedTimes = Array.from(
    new Set(
      times
        .map((value) => normalizeWorkflowTime(value))
        .filter(Boolean),
    ),
  );

  const payload: WorkflowScheduleConfig = {
    times: normalizedTimes.length > 0 ? normalizedTimes : [DEFAULT_WORKFLOW_TIME],
    reminderMinutes:
      Number.isFinite(reminderMinutes) && reminderMinutes > 0
        ? Math.floor(reminderMinutes)
        : 0,
  };

  return JSON.stringify({
    times: payload.times,
    reminder_minutes: payload.reminderMinutes,
  });
}

export function formatWorkflowTimeList(times: string[]): string {
  return times.map((time) => normalizeWorkflowTime(time).replace(/([AP]M)$/, " $1")).join(", ");
}

export function formatReminderText(reminderMinutes: number): string {
  if (!reminderMinutes || reminderMinutes <= 0) {
    return "No reminder";
  }
  if (reminderMinutes < 60) {
    return `${reminderMinutes} min before`;
  }
  const hours = Math.floor(reminderMinutes / 60);
  const minutes = reminderMinutes % 60;
  if (minutes === 0) {
    return `${hours} hr${hours === 1 ? "" : "s"} before`;
  }
  return `${hours} hr ${minutes} min before`;
}

export function reminderMinutesToLeadTime(reminderMinutes: number): string {
  if (!reminderMinutes || reminderMinutes <= 0) {
    return "00:00";
  }

  const hours = Math.floor(reminderMinutes / 60);
  const minutes = reminderMinutes % 60;
  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}`;
}

export function leadTimeToReminderMinutes(value: string): number {
  const match = value.match(/^(\d{2}):(\d{2})$/);
  if (!match) {
    return 0;
  }

  const hours = Number.parseInt(match[1], 10);
  const minutes = Number.parseInt(match[2], 10);

  if (!Number.isFinite(hours) || !Number.isFinite(minutes)) {
    return 0;
  }

  return hours * 60 + minutes;
}
