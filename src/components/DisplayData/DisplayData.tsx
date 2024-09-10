import { type InitData, type RGB as RGBType, isRGB } from "@telegram-apps/sdk";
import type { FC, ReactNode } from "react";

import type { SDKContextItem } from "@telegram-apps/sdk-react";
import React from "react";
import { RGB } from "../RGB/RGB";
import "./DisplayData.css";

export interface DisplayDataRow {
  title: string;
  value?:
    | RGBType
    | string
    | number
    | boolean
    | ReactNode
    | SDKContextItem<InitData | undefined>;
}

export interface DisplayDataProps {
  rows: DisplayDataRow[];
}

export const DisplayData: FC<DisplayDataProps> = ({ rows }) => {
  return (
    <div className="display-data">
      {rows.map(({ title, value }, idx) => {
        let valueNode: ReactNode;

        if (value === undefined) {
          valueNode = <i>empty</i>;
        } else if (typeof value === "string" && isRGB(value)) {
          valueNode = <RGB color={value} />;
        } else if (typeof value === "boolean") {
          valueNode = value ? "✔️" : "❌";
        } else if (React.isValidElement(value)) {
          valueNode = value;
        }

        return (
          // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
          <div className="display-data__line" key={idx}>
            <span className="display-data__line-title">{title}</span>
            <span className="display-data__line-value">{valueNode}</span>
          </div>
        );
      })}
    </div>
  );
};
