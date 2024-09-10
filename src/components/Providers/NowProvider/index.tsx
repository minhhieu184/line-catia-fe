import {
  type PropsWithChildren,
  createContext,
  useEffect,
  useState,
} from "react";

interface NowContextType {
  now: Date;
}

export const NowContext = createContext<NowContextType | null>(null);

const NowProvider = ({ children }: PropsWithChildren) => {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return <NowContext.Provider value={{ now }}>{children}</NowContext.Provider>;
};

export default NowProvider;
