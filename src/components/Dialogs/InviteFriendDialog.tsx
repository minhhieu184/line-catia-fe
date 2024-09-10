import { CopyIcon, ShareIcon } from "@/assets/MainPage/SVGs.tsx";
import { CloseIcon } from "@/components/icons";
import { DIRECT_LINK } from "@/lib/constants.ts";
import { TOAST_IDS } from "@/lib/toast";
import { shareTelegram } from "@/lib/utils.ts";
import type { PropsWithClassNameAndChildren, User } from "@/types/app";
import QRCodeStyling from "qr-code-styling";
import { useEffect, useRef } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import type { ButtonProps } from "../ui/button";
import { Dialog, DialogContent, DialogHeader } from "../ui/dialog";

const qrCode = new QRCodeStyling({
  width: 220,
  height: 220,
  dotsOptions: {
    type: "rounded",
  },
  backgroundOptions: {
    color: "#FDFDFD",
  },
  qrOptions: {
    typeNumber: 0,
    errorCorrectionLevel: "L",
  },
});

export default function InviteFriendDialog(
  props: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    user?: User;
  } & PropsWithClassNameAndChildren
) {
  const { open, onOpenChange } = props;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="w-[100%] rounded-lg shadow-lg bg-bgFreebies text-foreground"
        hideCloseButton={true}
        onInteractOutside={(event) => event.preventDefault()}
      >
        <FriendContent {...props} />
      </DialogContent>
    </Dialog>
  );
}

function FriendButton({
  icon,
  name,
  ...rest
}: { icon: JSX.Element; name: string } & ButtonProps) {
  const lang = localStorage.getItem("i18nextLng");
  return (
    <button
      className={`flex-1 py-2 ${
        lang === "en" ? "px-12" : ""
      }  border rounded-lg hover:bg-bgFriend flex items-center justify-center gap-1.5`}
      {...rest}
    >
      {icon}
      <span className="text-sm font-semibold text-white">{name}</span>
    </button>
  );
}

function FriendContent({
  onOpenChange,
  user,
}: {
  onOpenChange: (open: boolean) => void;
  user?: User;
}) {
  const { t } = useTranslation("common");
  const referLink = `${DIRECT_LINK}?startapp=${user?.ref_code || user?.id}`;
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    ref?.current && qrCode.append(ref.current);
  }, []);

  useEffect(() => {
    qrCode.update({
      data: referLink,
    });
  }, [referLink]);

  return (
    <>
      <DialogHeader className="flex flex-row items-center justify-between">
        <h4 className="text-2xl font-semibold leading-none text-freebies">
          {t("invite_fren")}
        </h4>
        <div
          className="pb-1.5 cursor-pointer"
          onClick={() => {
            onOpenChange(false);
          }}
        >
          <CloseIcon />
        </div>
      </DialogHeader>
      <div className="flex items-center justify-center relative">
        <img
          src="/frame.png"
          alt="frame"
          className="max-w-80 max-h-80 w-full h-full"
        />

        <div ref={ref} className="absolute rounded-xl overflow-hidden" />
      </div>
      <div className="flex justify-center items-center gap-3">
        <FriendButton
          icon={<ShareIcon />}
          name={t("share")}
          onClick={() => {
            if (!user?.username) return;
            window.open(shareTelegram(referLink));
          }}
        />
        <CopyToClipboard
          text={referLink}
          onCopy={() =>
            toast.success(t("copy_toast"), { id: TOAST_IDS.COPIED })
          }
        >
          <FriendButton icon={<CopyIcon />} name={t("copy")} />
        </CopyToClipboard>
      </div>
    </>
  );
}
