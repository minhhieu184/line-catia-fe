import type { PropsWithClassNameAndChildren } from "@/types/app";
import clsx from "clsx";

const Container = ({ className, children }: PropsWithClassNameAndChildren) => {
  return (
    <div
      className={clsx(
        "mx-auto max-w-2xl lg:max-w-[1192px] px-3 xs:px-5 main:max-w-[1312px]",
        className
      )}
    >
      {children}
    </div>
  );
};

export default Container;
