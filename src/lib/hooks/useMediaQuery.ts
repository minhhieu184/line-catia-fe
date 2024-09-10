import { useEffect, useState } from "react";
import useEventListener from "./useEventListener";

export default function useMediaQuery(mediaQuery: string): boolean {
  const [isMatch, setIsMatch] = useState(false);
  const [mediaQueryList, setMediaQueryList] = useState<MediaQueryList | null>(
    null
  );

  useEffect(() => {
    const list = window.matchMedia(mediaQuery);
    setMediaQueryList(list);
    setIsMatch(list.matches);
  }, [mediaQuery]);

  useEventListener<MediaQueryListEvent>(
    "change",
    (e) => setIsMatch(e.matches),
    mediaQueryList as unknown as HTMLElement
  );

  return isMatch;
}
