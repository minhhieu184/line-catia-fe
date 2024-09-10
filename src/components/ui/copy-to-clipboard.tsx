import type { PropsWithChildren } from "react";
import CopyToClipboard from "react-copy-to-clipboard";

interface IProps {
  text: string;
  onCopy?: () => void;
}

export const CopyToClipBoard = ({
  text,
  onCopy,
  children,
}: IProps & PropsWithChildren) => {
  return (
    <CopyToClipboard text={text} onCopy={onCopy}>
      {children}
    </CopyToClipboard>
  );
};
