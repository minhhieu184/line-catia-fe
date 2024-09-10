import { type RGB as RGBType, classNames } from "@telegram-apps/sdk";
import type { FC } from "react";

import "./RGB.css";

export type RGBProps = JSX.IntrinsicElements["div"] & {
  color: RGBType;
};

export const RGB: FC<RGBProps> = (props) => {
  const { color, className, ...rest } = props;

  return (
    <span {...rest} className={classNames("rgb", className)}>
      <i className="rgb__icon" style={{ backgroundColor: color }} />
      {color}
    </span>
  );
};
