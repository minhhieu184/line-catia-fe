import type { Extra, TimeDif } from "@/types/app";
import { type ClassValue, clsx } from "clsx";
import dayjs from "dayjs";
import i18n from "i18next";
import { twMerge } from "tailwind-merge";
import { INVITATION_CHECKPOINT } from "./constants";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getRewardCongratulatoryMessage = (type: string) => {
  switch (type) {
    case "double":
      return i18n.t("quiz:reward_double");
    case "half":
      return i18n.t("quiz:reward_half");
    case "minus_2":
    case "minus_5":
    case "minus_15":
    case "minus_50":
      return i18n.t("quiz:reward_minus");
    case "plus_2":
    case "plus_5":
    case "plus_10":
    case "plus_15":
    case "plus_30":
    case "plus_50":
    case "plus_100":
      return i18n.t("quiz:reward_plus");
    case "to_0":
      return i18n.t("quiz:reward_to_zero");
    case "to_40":
    case "to_110":
    case "to_360":
      return i18n.t("quiz:reward_to");
    default:
      return i18n.t("quiz:reward_default");
  }
};

export function getRewardDescription(type: string) {
  switch (type) {
    case "double":
      return i18n.t("quiz:double");
    case "half":
      return i18n.t("quiz:half");
    case "minus_50":
      return i18n.t("quiz:minus_50");
    case "plus_50":
      return i18n.t("quiz:plus_50");
    case "to_0":
      return i18n.t("quiz:to_0");
    case "to_360":
      return i18n.t("quiz:to_360");
    case "plus_100":
      return i18n.t("quiz:plus_100");
    case "plus_15":
      return i18n.t("quiz:plus_15");
    case "plus_30":
      return i18n.t("quiz:plus_30");
    case "minus_15":
      return i18n.t("quiz:minus_15");
    case "to_110":
      return i18n.t("quiz:to_110");
    case "plus_5":
      return i18n.t("quiz:plus_5");
    case "plus_10":
      return i18n.t("quiz:plus_10");
    case "minus_5":
      return i18n.t("quiz:minus_5");
    case "to_40":
      return i18n.t("quiz:to_40");
    default:
      return i18n.t("quiz:reward_desc_default");
  }
}

export function mapRewardToRotation(extra: Extra[], answer: number) {
  if (!extra) return;
  if (answer < 0 || answer > extra.length - 1) return;
  const result = extra[answer];
  if (!result) return;
  return { ...result, rotation: answer + 0.5 };
}

export function shareTelegram(url: string) {
  const text = encodeURIComponent(
    `Hey, join in Catia Eduverse with me to learn, earn rewards, and have loads of fun! Click the link to start your exciting journey now! 👇\n\n${url}`
  );
  return `https://telegram.me/share/url?url=%20&text=${text}`;
}

export function getRequiredInvitation(score: number) {
  let requiredInvitations = 0;
  for (let i = 0; i < INVITATION_CHECKPOINT.length; i++) {
    if (score >= INVITATION_CHECKPOINT[i].score) {
      requiredInvitations = INVITATION_CHECKPOINT[i].required;
    } else {
      break;
    }
  }
  return requiredInvitations;
}

export function getTimeDiff(
  start?: string | Date | number | null,
  end?: string | Date | number | null
): TimeDif | null {
  if (!start || !end) return null;

  const startTime = new Date(start).getTime();
  const endTime = new Date(end).getTime();
  const difference = endTime - startTime;

  const days = Math.floor(difference / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (difference % (1000 * 60 * 60 * 24)) / (60 * 60 * 1000)
  );
  const minutes = Math.floor((difference % (60 * 60 * 1000)) / (60 * 1000));
  const seconds = Math.floor((difference % (1000 * 60)) / 1000);

  return {
    days: days,
    hours: hours,
    minutes: minutes,
    seconds: seconds,
    rawDif: difference,
  };
}

export function formatCountdownText(
  start?: string | Date | number,
  end?: string | Date | number,
  shorten?: boolean
): string | null {
  const timeDif = getTimeDiff(start, end);
  if (!timeDif || timeDif.rawDif < 0) return null;
  const { days, hours, minutes, seconds } = timeDif;

  if (shorten) {
    if (days > 0) return `${days}d ${hours}h ${minutes}m`;
    return `${hours}h ${minutes}m ${seconds}s`;
  }

  const formattedDays = days < 10 ? `0${days}` : days;
  const formattedHours = hours < 10 ? `0${hours}` : hours;
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
  const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;

  if (days > 0)
    return `${formattedDays}d ${formattedHours}h ${formattedMinutes}m`;

  return `${formattedHours}h ${formattedMinutes}m ${formattedSeconds}s`;
}

export function getTimeDifference(
  time?: string | null,
  type?: string
): string | null {
  if (!time) return null;

  const currentTime = new Date();
  const targetDate = new Date(time);
  const difference = targetDate.getTime() - currentTime.getTime();

  if (difference <= 0) {
    return "";
  }

  if (type === "game") {
    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (difference % (1000 * 60 * 60 * 24)) / (60 * 60 * 1000)
    );
    const minutes = Math.floor((difference % (60 * 60 * 1000)) / (60 * 1000));

    const formatDays = days < 10 ? `0${days}` : days;
    const formatHours = hours < 10 ? `0${hours}` : hours;
    const formatMinutes = minutes < 10 ? `0${minutes}` : minutes;

    return `${formatDays}d ${formatHours}h ${formatMinutes}m`;
  }

  const hours = Math.floor(
    (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((difference % (1000 * 60)) / 1000);

  const formattedHours = hours < 10 ? `0${hours}` : hours;
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
  const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds;

  return `${formattedHours}h ${formattedMinutes}m ${formattedSeconds}s`;
}

export function getCountdownText(
  gameStartCountdown: string,
  gameEndCountdown: string,
  start_time: string,
  end_time: string
) {
  if (!start_time) {
    if (!end_time) {
      return i18n.t("quiz:always_on");
    }
    if (gameEndCountdown) {
      return i18n.t("quiz:quiz_end_in", { value: gameEndCountdown });
    }
    return i18n.t("quiz:game_ended");
  }
  if (gameStartCountdown) {
    return i18n.t("quiz:quiz_start_in", { value: gameStartCountdown });
  }
  if (!end_time) {
    return i18n.t("quiz:always_on");
  }
  if (gameEndCountdown) {
    return i18n.t("quiz:quiz_end_in", { value: gameEndCountdown });
  }
  return i18n.t("quiz:game_ended");
}

export function convertMinutesToTimeText(time: number) {
  const days = Math.floor(time / (60 * 24));
  const hours = Math.floor((time % (60 * 24)) / 60);
  const minutes = Math.floor(time % 60);

  const formattedDays =
    days > 0
      ? days > 1
        ? i18n.t("quiz:days", { value: days })
        : i18n.t("quiz:day", { value: days })
      : "";
  const formattedHours =
    hours > 0
      ? hours > 1
        ? i18n.t("quiz:hours", { value: hours })
        : i18n.t("quiz:hour", { value: hours })
      : "";
  const formattedMinutes =
    minutes > 0
      ? minutes > 1
        ? i18n.t("quiz:minutes", { value: minutes })
        : i18n.t("quiz:minute", { value: minutes })
      : "";

  return `${formattedDays}${formattedHours}${formattedMinutes}`;
}

export function convertMinutesToTimeTextShort(time: number) {
  const days = Math.floor(time / (60 * 24));
  const hours = Math.floor((time % (60 * 24)) / 60);
  const minutes = Math.floor(time % 60);

  const formattedDays = days > 0 ? `${days}d ` : "";
  const formattedHours = hours > 0 ? `${hours}h ` : "";
  const formattedMinutes = minutes > 0 ? `${minutes}m` : "";

  return `${formattedDays}${formattedHours}${formattedMinutes}`;
}

export function capitalizeAndReplaceUnderscore(str: string) {
  if (!str) return str;

  // Replace underscores with spaces
  let result = str.replace(/_/g, " ");

  // Capitalize the first letter of each word
  result = result.replace(/\b\w/g, (char) => char.toUpperCase());

  return result;
}

export function shorten(s: string | undefined, max = 12) {
  if (!s) return "";
  return s.length > max
    ? `${s.substring(0, max / 2 - 1)}…${s.substring(
        s.length - max / 2 + 2,
        s.length
      )}`
    : s;
}

export function parseTimeStatus(
  now: string | Date,
  start?: string | Date | null,
  end?: string | Date | null,
  showTimeWhenEnded?: boolean
) {
  const timeTillStart = getTimeDiff(now, start);
  const timeTillEnd = getTimeDiff(now, end);

  if (!timeTillStart && !timeTillEnd) return i18n.t("arenas:upcoming");

  if (timeTillStart && timeTillStart.rawDif > 0) {
    const { days, hours, minutes, seconds } = timeTillStart;
    const countdownText =
      days > 0
        ? `${days}d ${hours}h ${minutes}m`
        : `${hours}h ${minutes}m ${seconds}s`;
    return i18n.t("arenas:start_in", { value: countdownText });
  }

  if (timeTillEnd && timeTillEnd.rawDif > 0) {
    const { days, hours, minutes, seconds } = timeTillEnd;
    const countdownText =
      days > 0
        ? `${days}d ${hours}h ${minutes}m`
        : `${hours}h ${minutes}m ${seconds}s`;
    return i18n.t("arenas:end_in", { value: countdownText });
  }

  if (!timeTillEnd) return i18n.t("quiz:always_on");

  if (showTimeWhenEnded) {
    const formattedStart = dayjs(start).format("MMM D");
    const formattedEnd = dayjs(end).format("MMM D");
    return `${i18n.t("arenas:ended")} · ${formattedStart} - ${formattedEnd}`;
  }

  return i18n.t("arenas:ended");
}

export function formatNumberSuffix(
  num: number,
  precision = 3,
  compact = false
) {
  const map = [
    { suffix: "T", threshold: 1e12 },
    { suffix: "B", threshold: 1e9 },
    { suffix: "M", threshold: 1e6 },
    { suffix: "K", threshold: 1e3 },
    { suffix: "", threshold: 1 },
  ];

  const found = map.find((x) => Math.abs(num) >= x.threshold);
  if (found) {
    if (compact) {
      const divided = num / found.threshold;
      if (divided >= 10) {
        const formatted = Number.parseFloat(divided.toFixed(0)) + found.suffix;
        return formatted;
      }
      const formatted =
        Number.parseFloat(divided.toFixed(precision)) + found.suffix;
      return formatted;
    }

    const formatted =
      Number.parseFloat((num / found.threshold).toFixed(precision)) +
      found.suffix;
    return formatted;
  }

  return num;
}
