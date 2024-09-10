import {
  initClosingBehavior,
  initMiniApp,
  initSwipeBehavior,
} from "@telegram-apps/sdk";
import { type PropsWithChildren, useEffect } from "react";

const TelegramAppProvider = ({ children }: PropsWithChildren) => {
  const [closingBehavior] = initClosingBehavior();
  const [swipeBehavior] = initSwipeBehavior();
  const [miniApp] = initMiniApp();

  useEffect(() => {
    closingBehavior.enableConfirmation();
    if (swipeBehavior.supports("disableVerticalSwipe")) {
      swipeBehavior.disableVerticalSwipe();
    } else {
      const overflow = 2;
      document.body.style.overflowY = "hidden";
      document.body.style.marginTop = `${overflow}px`;
      document.body.style.height = `${window.innerHeight + overflow}px`;
      document.body.style.paddingBottom = `${overflow}px`;
      window.scrollTo(0, overflow);
    }
    if (miniApp.supports("setHeaderColor")) {
      miniApp.setHeaderColor("#091428");
    }
    if (miniApp.supports("setBackgroundColor")) {
      miniApp.setBgColor("#091428");
    }
  });

  return children;
};

export default TelegramAppProvider;
