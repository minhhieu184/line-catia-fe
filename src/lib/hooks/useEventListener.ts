import { useEffect, useRef } from "react";

type EventType = keyof WindowEventMap; // Hoặc tùy chỉnh cho element khác nếu cần
type EventCallback<T> = (event: T) => void;

export default function useEventListener<T extends Event>(
  eventType: EventType,
  callback: EventCallback<T>,
  element: HTMLElement | Window = window
): void {
  const callbackRef = useRef<EventCallback<T>>(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    if (element == null) return;
    const handler = (e: Event) => callbackRef.current(e as T);
    element.addEventListener(eventType, handler);

    return () => element.removeEventListener(eventType, handler);
  }, [eventType, element]);
}
