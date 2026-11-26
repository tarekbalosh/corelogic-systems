import { addDays } from "date-fns";
import { formatInTimeZone, fromZonedTime } from "date-fns-tz";
import prisma from "@/lib/db";

export const DEFAULT_BUSINESS_TIMEZONE = "Asia/Kuala_Lumpur";
export const GERMAN_VISITOR_TIMEZONE = "Europe/Berlin";
export const DEFAULT_MEETING_DURATION_MINUTES = 30;
export const DEFAULT_BOOKING_WINDOW_DAYS = 14;
export const MIN_ADVANCE_NOTICE_MS = 2 * 60 * 60 * 1000; // 2 hours

const EN_WEEKDAYS = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
] as const;

const EN_SHORT_MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
] as const;

const DE_WEEKDAYS = [
  "Sonntag",
  "Montag",
  "Dienstag",
  "Mittwoch",
  "Donnerstag",
  "Freitag",
  "Samstag",
] as const;

const AR_WEEKDAYS = [
  "الأحد",
  "الاثنين",
  "الثلاثاء",
  "الأربعاء",
  "الخميس",
  "الجمعة",
  "السبت",
] as const;

const AR_MONTHS = [
  "يناير",
  "فبراير",
  "مارس",
  "أبريل",
  "مايو",
  "يونيو",
  "يوليو",
  "أغسطس",
  "سبتمبر",
  "أكتوبر",
  "نوفمبر",
  "ديسمبر",
] as const;

export interface AvailableSlot {
  startsAt: string;
  endsAt: string;
  label_en: string;
  label_ar: string;
  label_de?: string;
  dayKey: string;
  dayKey_de?: string;
  dayLabel_en: string;
  dayLabel_ar: string;
  dayLabel_de?: string;
  timeRange_en: string;
  timeRange_ar: string;
  timeRange_de?: string;
  timezone_de?: string;
}

export interface GetAvailableSlotsOptions {
  fromDate?: Date;
  days?: number;
  now?: Date;
  maxPerDay?: number;
  maxDays?: number;
  timeZone?: string;
  durationMinutes?: number;
  windowDays?: number;
}

export interface GetAvailableSlotsResult {
  slots: AvailableSlot[];
  moreAvailable: boolean;
  timezone: string;
}

export interface AvailabilityRuleRecord {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  active: boolean;
}

export interface BlockedDateRecord {
  date: Date;
}

export interface ActiveBookingWindow {
  startsAt: Date;
  endsAt: Date;
}

export interface AvailabilityDbClient {
  availabilityRule: {
    findMany(args: {
      where: { active: boolean };
      orderBy?: Array<Record<string, "asc" | "desc">>;
    }): Promise<AvailabilityRuleRecord[]>;
  };
  blockedDate: {
    findMany(args?: {
      where?: { date?: { gte?: Date; lte?: Date } };
    }): Promise<BlockedDateRecord[]>;
  };
  booking: {
    findMany(args: {
      where: {
        status: { in: Array<"PENDING" | "CONFIRMED"> };
        endsAt: { gt: Date };
        startsAt: { lt: Date };
      };
      select: { startsAt: true; endsAt: true };
    }): Promise<ActiveBookingWindow[]>;
  };
}

export function getBusinessTimezone(): string {
  const raw = process.env.BUSINESS_TIMEZONE?.trim();
  return raw && raw.length > 0 ? raw : DEFAULT_BUSINESS_TIMEZONE;
}

/**
 * Returns the display/input timezone for a visitor's language.
 * German visitors always see and interact in `Europe/Berlin` (with automatic CET/MEZ & CEST/MESZ DST).
 */
export function getVisitorTimezone(lang?: string | null): string {
  return lang === "de" ? GERMAN_VISITOR_TIMEZONE : getBusinessTimezone();
}

/**
 * Converts a local wall-clock date/time string (e.g. "2026-07-15T10:00:00") in the given
 * IANA timezone (such as "Europe/Berlin") into an exact UTC Date instant for storage,
 * accounting automatically for DST (MEZ UTC+1 / MESZ UTC+2).
 */
export function parseVisitorLocalTimeToUtc(
  localDateTimeIso: string,
  timeZone: string = GERMAN_VISITOR_TIMEZONE
): Date {
  return fromZonedTime(localDateTimeIso, timeZone);
}

/**
 * Determines the German timezone abbreviation (MEZ for CET UTC+1, MESZ for CEST UTC+2)
 * for an exact UTC instant in `Europe/Berlin`.
 */
export function getBerlinTimezoneLabel(dateUtc: Date): "MEZ" | "MESZ" {
  const offset = formatInTimeZone(dateUtc, GERMAN_VISITOR_TIMEZONE, "XXX");
  return offset === "+02:00" ? "MESZ" : "MEZ";
}

export function getMeetingDurationMinutes(): number {
  const parsed = Number.parseInt(
    process.env.MEETING_DURATION_MINUTES ?? "",
    10
  );
  if (Number.isFinite(parsed) && parsed >= 10 && parsed <= 240) {
    return parsed;
  }
  return DEFAULT_MEETING_DURATION_MINUTES;
}

export function getBookingWindowDays(): number {
  const parsed = Number.parseInt(process.env.BOOKING_WINDOW_DAYS ?? "", 10);
  if (Number.isFinite(parsed) && parsed >= 1 && parsed <= 90) {
    return parsed;
  }
  return DEFAULT_BOOKING_WINDOW_DAYS;
}

export function parseTimeToMinutes(hhmm: string): number | null {
  const match = /^([01]\d|2[0-3]):([0-5]\d)$/.exec(hhmm.trim());
  if (!match) return null;
  return Number.parseInt(match[1], 10) * 60 + Number.parseInt(match[2], 10);
}

function minutesToHHMM(totalMinutes: number): string {
  const hh = String(Math.floor(totalMinutes / 60)).padStart(2, "0");
  const mm = String(totalMinutes % 60).padStart(2, "0");
  return `${hh}:${mm}`;
}

function format12HourEn(hour24: number, minute: number): string {
  const period = hour24 >= 12 ? "PM" : "AM";
  const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12;
  const mm = String(minute).padStart(2, "0");
  return `${hour12}:${mm} ${period}`;
}

function format12HourAr(hour24: number, minute: number): string {
  const period = hour24 >= 12 ? "م" : "ص";
  const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12;
  const mm = String(minute).padStart(2, "0");
  return `${hour12}:${mm} ${period}`;
}

function format24HourDe(hour24: number, minute: number): string {
  const hh = String(hour24).padStart(2, "0");
  const mm = String(minute).padStart(2, "0");
  return `${hh}:${mm}`;
}

/**
 * Formats localized English, Arabic (business timezone MYT) and German
 * (`Europe/Berlin` with automatic MEZ/MESZ DST handling and `Intl` de-DE date format)
 * slot labels from exact UTC timestamps.
 */
export function formatSlotLabels(
  startsAtUtc: Date,
  endsAtUtc: Date,
  timeZone: string = getBusinessTimezone()
): Omit<AvailableSlot, "startsAt" | "endsAt"> & {
  label_de: string;
  dayKey_de: string;
  dayLabel_de: string;
  timeRange_de: string;
  timezone_de: string;
} {
  // Business timezone (MYT) labels for EN / AR
  const isoDow = Number.parseInt(
    formatInTimeZone(startsAtUtc, timeZone, "i"),
    10
  ); // 1 (Mon) .. 7 (Sun)
  const dayOfWeek = isoDow % 7; // 0 (Sun) .. 6 (Sat)
  const year = Number.parseInt(
    formatInTimeZone(startsAtUtc, timeZone, "yyyy"),
    10
  );
  const month = Number.parseInt(
    formatInTimeZone(startsAtUtc, timeZone, "M"),
    10
  ); // 1..12
  const day = Number.parseInt(formatInTimeZone(startsAtUtc, timeZone, "d"), 10);
  const dayKey = formatInTimeZone(startsAtUtc, timeZone, "yyyy-MM-dd");

  const startHour = Number.parseInt(
    formatInTimeZone(startsAtUtc, timeZone, "H"),
    10
  );
  const startMin = Number.parseInt(
    formatInTimeZone(startsAtUtc, timeZone, "m"),
    10
  );
  const endHour = Number.parseInt(
    formatInTimeZone(endsAtUtc, timeZone, "H"),
    10
  );
  const endMin = Number.parseInt(
    formatInTimeZone(endsAtUtc, timeZone, "m"),
    10
  );

  const weekdayEn = EN_WEEKDAYS[dayOfWeek];
  const monthEn = EN_SHORT_MONTHS[month - 1];
  const dayLabel_en = `${weekdayEn}, ${monthEn} ${day}, ${year}`;
  const timeRange_en = `${format12HourEn(startHour, startMin)} – ${format12HourEn(endHour, endMin)}`;

  const weekdayAr = AR_WEEKDAYS[dayOfWeek];
  const monthAr = AR_MONTHS[month - 1];
  const dayLabel_ar = `${weekdayAr}، ${day} ${monthAr} ${year}`;
  const timeRange_ar = `${format12HourAr(startHour, startMin)} – ${format12HourAr(endHour, endMin)}`;

  const tzSuffixEn =
    timeZone === "Asia/Kuala_Lumpur"
      ? "MYT (Malaysia time)"
      : `${timeZone} — MYT (Malaysia time)`;
  const tzSuffixAr =
    timeZone === "Asia/Kuala_Lumpur"
      ? "بتوقيت ماليزيا — MYT (Malaysia time)"
      : `${timeZone}`;

  // German labels in Europe/Berlin (automatic CET/MEZ & CEST/MESZ DST + Intl de-DE date)
  const deIsoDow = Number.parseInt(
    formatInTimeZone(startsAtUtc, GERMAN_VISITOR_TIMEZONE, "i"),
    10
  );
  const deDow = deIsoDow % 7;
  const dayKey_de = formatInTimeZone(
    startsAtUtc,
    GERMAN_VISITOR_TIMEZONE,
    "yyyy-MM-dd"
  );
  const deDateFormatted = new Intl.DateTimeFormat("de-DE", {
    timeZone: GERMAN_VISITOR_TIMEZONE,
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(startsAtUtc);
  const deStartHour = Number.parseInt(
    formatInTimeZone(startsAtUtc, GERMAN_VISITOR_TIMEZONE, "H"),
    10
  );
  const deStartMin = Number.parseInt(
    formatInTimeZone(startsAtUtc, GERMAN_VISITOR_TIMEZONE, "m"),
    10
  );
  const deEndHour = Number.parseInt(
    formatInTimeZone(endsAtUtc, GERMAN_VISITOR_TIMEZONE, "H"),
    10
  );
  const deEndMin = Number.parseInt(
    formatInTimeZone(endsAtUtc, GERMAN_VISITOR_TIMEZONE, "m"),
    10
  );
  const deTzAbbr = getBerlinTimezoneLabel(startsAtUtc);
  const dayLabel_de = `${DE_WEEKDAYS[deDow]}, ${deDateFormatted}`;
  const timeRange_de = `${format24HourDe(deStartHour, deStartMin)} – ${format24HourDe(deEndHour, deEndMin)} Uhr`;
  const label_de = `${dayLabel_de} · ${timeRange_de} ${deTzAbbr} (${GERMAN_VISITOR_TIMEZONE})`;

  return {
    dayKey,
    dayKey_de,
    dayLabel_en,
    dayLabel_ar,
    dayLabel_de,
    timeRange_en,
    timeRange_ar,
    timeRange_de,
    timezone_de: GERMAN_VISITOR_TIMEZONE,
    label_en: `${dayLabel_en} · ${timeRange_en} ${tzSuffixEn}`,
    label_ar: `${dayLabel_ar} · ${timeRange_ar} ${tzSuffixAr}`,
    label_de,
  };
}

function addLocalCalendarDays(dateKey: string, daysToAdd: number): string {
  const [y, m, d] = dateKey.split("-").map((part) => Number.parseInt(part, 10));
  const utcNoon = new Date(Date.UTC(y, m - 1, d, 12, 0, 0));
  const shifted = addDays(utcNoon, daysToAdd);
  return shifted.toISOString().slice(0, 10);
}

function getLocalDayOfWeek(dateKey: string): number {
  const [y, m, d] = dateKey.split("-").map((part) => Number.parseInt(part, 10));
  return new Date(Date.UTC(y, m - 1, d, 12, 0, 0)).getUTCDay();
}

export function normalizeBlockedDateKey(dateValue: Date): string {
  return dateValue.toISOString().slice(0, 10);
}

/**
 * Checks whether a candidate [startsAtUtc, endsAtUtc) aligns with active AvailabilityRule rows,
 * avoids BlockedDate entries, and satisfies minimum advance notice + booking window constraints.
 */
export function isSlotAlignedWithSchedule(params: {
  startsAtUtc: Date;
  endsAtUtc: Date;
  rules: AvailabilityRuleRecord[];
  blockedDates: BlockedDateRecord[];
  now: Date;
  timeZone: string;
  durationMinutes: number;
  windowDays: number;
}): boolean {
  const {
    startsAtUtc,
    endsAtUtc,
    rules,
    blockedDates,
    now,
    timeZone,
    durationMinutes,
    windowDays,
  } = params;

  const minStartUtc = new Date(now.getTime() + MIN_ADVANCE_NOTICE_MS);
  if (startsAtUtc < minStartUtc) {
    return false;
  }

  const todayKey = formatInTimeZone(now, timeZone, "yyyy-MM-dd");
  const lastDayExclusiveKey = addLocalCalendarDays(todayKey, windowDays);
  const maxWindowEndUtc = fromZonedTime(
    `${lastDayExclusiveKey}T00:00:00`,
    timeZone
  );
  if (startsAtUtc >= maxWindowEndUtc) {
    return false;
  }

  const expectedDurationMs = durationMinutes * 60 * 1000;
  if (endsAtUtc.getTime() - startsAtUtc.getTime() !== expectedDurationMs) {
    return false;
  }

  // Seconds and milliseconds must be zero so arbitrary timestamps cannot slip in
  if (
    startsAtUtc.getUTCSeconds() !== 0 ||
    startsAtUtc.getUTCMilliseconds() !== 0
  ) {
    return false;
  }

  const slotDayKey = formatInTimeZone(startsAtUtc, timeZone, "yyyy-MM-dd");
  const blockedSet = new Set(
    blockedDates.map((b) => normalizeBlockedDateKey(b.date))
  );
  if (blockedSet.has(slotDayKey)) {
    return false;
  }

  const dayOfWeek = getLocalDayOfWeek(slotDayKey);
  const matchingRules = rules.filter(
    (r) => r.active && r.dayOfWeek === dayOfWeek
  );
  if (matchingRules.length === 0) {
    return false;
  }

  for (const rule of matchingRules) {
    const startMins = parseTimeToMinutes(rule.startTime);
    const endMins = parseTimeToMinutes(rule.endTime);
    if (startMins === null || endMins === null || endMins <= startMins) {
      continue;
    }

    for (
      let cursor = startMins;
      cursor + durationMinutes <= endMins;
      cursor += durationMinutes
    ) {
      const candidateStartUtc = fromZonedTime(
        `${slotDayKey}T${minutesToHHMM(cursor)}:00`,
        timeZone
      );
      if (candidateStartUtc.getTime() === startsAtUtc.getTime()) {
        return true;
      }
    }
  }

  return false;
}

/**
 * Generates available consultation slots in UTC with English, Arabic (MYT)
 * and German (`Europe/Berlin` DST-aware) labels.
 */
export async function getAvailableSlots(
  options: GetAvailableSlotsOptions = {},
  dbClient: AvailabilityDbClient = prisma
): Promise<GetAvailableSlotsResult> {
  const timeZone = options.timeZone ?? getBusinessTimezone();
  const durationMinutes = options.durationMinutes ?? getMeetingDurationMinutes();
  const windowDays = options.windowDays ?? getBookingWindowDays();
  const now = options.now ?? new Date();
  const maxPerDay = options.maxPerDay ?? 6;
  const maxDays = options.maxDays ?? 3;

  const requestedDays =
    options.days !== undefined
      ? Math.min(Math.max(1, Math.floor(options.days)), windowDays)
      : windowDays;

  const minStartUtc = new Date(now.getTime() + MIN_ADVANCE_NOTICE_MS);
  const todayInTz = formatInTimeZone(now, timeZone, "yyyy-MM-dd");
  const windowEndExclusiveKey = addLocalCalendarDays(todayInTz, windowDays);
  const maxWindowEndUtc = fromZonedTime(
    `${windowEndExclusiveKey}T00:00:00`,
    timeZone
  );

  const effectiveStartDate =
    options.fromDate && options.fromDate > now ? options.fromDate : now;
  const startDayKey = formatInTimeZone(
    effectiveStartDate,
    timeZone,
    "yyyy-MM-dd"
  );

  const [rules, blockedDates, activeBookings] = await Promise.all([
    dbClient.availabilityRule.findMany({
      where: { active: true },
      orderBy: [{ dayOfWeek: "asc" }, { startTime: "asc" }],
    }),
    dbClient.blockedDate.findMany({
      where: {
        date: {
          gte: new Date(`${todayInTz}T00:00:00.000Z`),
          lte: new Date(`${windowEndExclusiveKey}T00:00:00.000Z`),
        },
      },
    }),
    dbClient.booking.findMany({
      where: {
        status: { in: ["PENDING", "CONFIRMED"] },
        endsAt: { gt: minStartUtc },
        startsAt: { lt: maxWindowEndUtc },
      },
      select: { startsAt: true, endsAt: true },
    }),
  ]);

  const blockedSet = new Set(
    blockedDates.map((b) => normalizeBlockedDateKey(b.date))
  );

  const selectedSlots: AvailableSlot[] = [];
  let daysIncluded = 0;
  let moreAvailable = false;

  for (let offset = 0; offset < requestedDays; offset += 1) {
    const dayKey = addLocalCalendarDays(startDayKey, offset);
    if (dayKey >= windowEndExclusiveKey) {
      break;
    }

    if (blockedSet.has(dayKey)) {
      continue;
    }

    const dayOfWeek = getLocalDayOfWeek(dayKey);
    const dayRules = rules.filter(
      (r) => r.active && r.dayOfWeek === dayOfWeek
    );
    if (dayRules.length === 0) {
      continue;
    }

    const seenStarts = new Set<number>();
    const dayCandidates: AvailableSlot[] = [];

    for (const rule of dayRules) {
      const startMins = parseTimeToMinutes(rule.startTime);
      const endMins = parseTimeToMinutes(rule.endTime);
      if (startMins === null || endMins === null || endMins <= startMins) {
        continue;
      }

      for (
        let cursor = startMins;
        cursor + durationMinutes <= endMins;
        cursor += durationMinutes
      ) {
        const slotStartUtc = fromZonedTime(
          `${dayKey}T${minutesToHHMM(cursor)}:00`,
          timeZone
        );
        const slotEndUtc = new Date(
          slotStartUtc.getTime() + durationMinutes * 60 * 1000
        );

        if (slotStartUtc < minStartUtc || slotStartUtc >= maxWindowEndUtc) {
          continue;
        }

        const startMs = slotStartUtc.getTime();
        if (seenStarts.has(startMs)) {
          continue;
        }

        const isTaken = activeBookings.some(
          (b) => b.startsAt < slotEndUtc && b.endsAt > slotStartUtc
        );
        if (isTaken) {
          continue;
        }

        seenStarts.add(startMs);
        const labels = formatSlotLabels(slotStartUtc, slotEndUtc, timeZone);
        dayCandidates.push({
          startsAt: slotStartUtc.toISOString(),
          endsAt: slotEndUtc.toISOString(),
          ...labels,
        });
      }
    }

    dayCandidates.sort((a, b) => a.startsAt.localeCompare(b.startsAt));

    if (dayCandidates.length === 0) {
      continue;
    }

    if (daysIncluded >= maxDays) {
      moreAvailable = true;
      break;
    }

    if (dayCandidates.length > maxPerDay) {
      moreAvailable = true;
    }

    selectedSlots.push(...dayCandidates.slice(0, maxPerDay));
    daysIncluded += 1;
  }

  return {
    slots: selectedSlots,
    moreAvailable,
    timezone: timeZone,
  };
}
