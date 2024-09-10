import type { PropsWithChildren } from "react";
import LangProvider from "./LangProvider";
import NowProvider from "./NowProvider";
import TelegramAppProvider from "./TelegramAppProvider";

const Providers = ({ children }: PropsWithChildren) => {
  return (
    <TelegramAppProvider>
      <LangProvider>
        <NowProvider>{children}</NowProvider>
      </LangProvider>
    </TelegramAppProvider>
  );
};

export default Providers;
