import { getTimeDifference } from "@/lib/utils";
import { useEffect, useState } from "react";

export function useGameCountDown({ duration }: { duration?: string | null }) {
  const [gameCountdown, setTimeRemain] = useState<string | null>();

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeRemain(getTimeDifference(duration, "game"));
    }, 60000);

    return () => clearInterval(interval);
  }, [duration]);

  return {
    gameCountdown: gameCountdown || getTimeDifference(duration, "game"),
  };
}
