import { useContext } from "react";
import { NowContext } from ".";

const useNowContext = () => {
  const nowContext = useContext(NowContext);

  if (!nowContext) {
    throw new Error(
      "useNowContext has to be used within <AppContext.Provider>"
    );
  }

  return nowContext;
};

export default useNowContext;
