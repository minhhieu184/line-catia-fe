import { DiamondIcon, WheelSpinDialogSVG } from "@/assets/QuizPage/SVGs";
import LuckyWheel from "@/components/LuckyWheel";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import useCatiaStore from "@/lib/useCatiaStore";
import { getRewardCongratulatoryMessage } from "@/lib/utils";
import type { Session } from "@/types/app";
import { useState } from "react";
import { useTranslation } from "react-i18next";

const WheelSpinDialog = ({
  open,
  setOpen,
  session,
  setSession,
  onFinishWheelSpin,
}: {
  open: boolean;
  setOpen: (v: boolean) => void;
  session: Session;
  setSession: (v: Session) => void;
  onFinishWheelSpin: () => void;
}) => {
  const { t } = useTranslation("quiz");
  const reward = useCatiaStore((state) => state.reward);
  const extra = useCatiaStore((state) => state.game?.extra_setup);
  const [spinned, setSpinned] = useState<boolean>(false);
  const [isChanceDialogOpen, setIsChanceDialogOpen] = useState<boolean>(false);

  const onSpinned = () => {
    setSpinned(true);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          onInteractOutside={(e) => {
            e.preventDefault();
          }}
          hideCloseButton
          className="pt-3.5 pb-9"
        >
          <div className="absolute -top-7 left-1/2 -translate-x-1/2">
            <WheelSpinDialogSVG />
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 rounded-full bg-background py-1 pl-1 pr-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#5995E5]">
                <DiamondIcon className="h-6 w-6 translate-y-0" />
              </div>
              <span className="font-semibold">{session.score || 0}</span>
            </div>
            <button
              type="button"
              className="group"
              onClick={() => setIsChanceDialogOpen(true)}
            >
              <InfoButtonIcon />
            </button>
          </div>
          {!spinned ? (
            <div>
              <p className="semibold">{t("lucky_title")}</p>
              <LuckyWheel
                session={session}
                setSession={setSession}
                onSpinned={onSpinned}
                onSkip={onFinishWheelSpin}
              />
            </div>
          ) : (
            <div>
              <p className="text-center text-xl mt-3">{reward?.description}</p>
              <p className="text-center mt-4">
                {getRewardCongratulatoryMessage(reward?.type || "")}
              </p>
              <Button
                size="sm"
                className="w-full mt-6"
                onClick={() => onFinishWheelSpin()}
              >
                {t("received_btn")}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog
        open={isChanceDialogOpen && open}
        onOpenChange={setIsChanceDialogOpen}
      >
        <DialogContent hideCloseButton className="pt-3.5 pb-6">
          <div className="absolute -top-7 left-1/2 -translate-x-1/2">
            <WheelSpinDialogSVG />
          </div>
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold tracking-wide">
              {t("possibilities")}
            </h2>
            <button
              type="button"
              className="group"
              onClick={() => setIsChanceDialogOpen(false)}
            >
              <BackButtonIcon />
            </button>
          </div>
          <div className="w-full p-2.5 space-y-1 rounded-2xl bg-background">
            {extra?.map((item) => (
              <div
                key={item.type}
                className="flex w-full p-1 items-center justify-center"
              >
                <div className="w-[54%] text-right font-medium">
                  {item.description}
                </div>
                <div className="px-3 font-semibold">-</div>
                <div className="w-[46%] font-bold">{item.chance}%</div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default WheelSpinDialog;

const InfoButtonIcon = () => (
  <svg
    width="32"
    height="32"
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g clipPath="url(#clip0_9413_29751)">
      <path
        d="M15.9895 31.2495C7.56749 31.2435 0.744492 24.4115 0.750492 15.9895C0.756492 7.56749 7.58849 0.744492 16.0105 0.750492C24.4286 0.756492 31.2495 7.58199 31.2495 16C31.237 24.421 24.4105 31.243 15.9895 31.2495Z"
        className="fill-white group-hover:fill-slate-100"
      />
      <path
        d="M15.9895 1.501C23.9973 1.507 30.484 8.00275 30.478 16.0105C30.472 24.0182 23.9763 30.505 15.9685 30.499C7.96525 30.493 1.48 24.0033 1.48 16C1.492 7.99325 7.98275 1.507 15.9895 1.501ZM15.9895 9.41908e-07C7.15269 0.00600094 -0.00599623 7.17369 3.76889e-06 16.0105C0.00600377 24.8473 7.17369 32.006 16.0105 32C24.8428 31.994 32 24.8323 32 16C31.997 7.16069 24.8288 -0.00299906 15.9895 9.41908e-07Z"
        className="fill-[#AAC1CE] group-hover:fill-[#5995E5]"
        fill="#AAC1CE"
      />
      <path
        d="M15.9894 3.4037C22.946 3.4082 28.5817 9.05188 28.5772 16.0084C28.5727 22.965 22.929 28.6007 15.9724 28.5962C9.01887 28.5917 3.38468 22.9535 3.38468 15.9999C3.39468 9.04438 9.03337 3.4092 15.9894 3.4037ZM15.9894 2.90338C8.75618 2.90788 2.89681 8.77519 2.90137 16.0084C2.90587 23.2417 8.77325 29.1011 16.0065 29.0965C23.2362 29.0921 29.0946 23.2297 29.0946 15.9999C29.0926 8.7647 23.2252 2.90132 15.9899 2.90332H15.9894V2.90338Z"
        className="fill-[#BAC6CC] group-hover:fill-[#5995E5]"
      />
      <path
        d="M19.3231 22.2733L19.0995 23.1872C18.4289 23.4519 17.8931 23.6534 17.4942 23.7919C17.0948 23.9309 16.6308 24 16.1021 24C15.2901 24 14.6586 23.8011 14.2082 23.406C13.7578 23.0094 13.5325 22.5068 13.5325 21.8971C13.5325 21.661 13.5489 21.4182 13.5828 21.1709C13.6171 20.9232 13.6716 20.6443 13.7462 20.3326L14.5843 17.3659C14.6589 17.0819 14.7223 16.8127 14.773 16.5582C14.8245 16.3052 14.8493 16.0725 14.8493 15.863C14.8493 15.4841 14.7709 15.2191 14.6147 15.0701C14.4586 14.9216 14.1606 14.8461 13.7182 14.8461C13.5015 14.8461 13.2788 14.8808 13.0518 14.948C12.8238 15.0154 12.6289 15.0805 12.4653 15.141L12.6895 14.2264C13.2385 14.0028 13.7634 13.8114 14.2654 13.6525C14.7675 13.4932 15.2418 13.4134 15.6905 13.4134C16.4968 13.4134 17.1191 13.6083 17.556 13.9981C17.9929 14.3881 18.2113 14.8938 18.2113 15.5168C18.2113 15.6457 18.197 15.8729 18.1661 16.1975C18.136 16.5229 18.08 16.821 17.9982 17.0922L17.1636 20.0469C17.0952 20.2843 17.0337 20.5556 16.9802 20.8609C16.925 21.1641 16.8986 21.3959 16.8986 21.5513C16.8986 21.9437 16.9861 22.2115 17.1615 22.3539C17.3382 22.4963 17.6425 22.5672 18.0747 22.5672C18.2776 22.5672 18.5084 22.5312 18.765 22.4605C19.0208 22.3898 19.2074 22.3277 19.3231 22.2733ZM19.5347 9.86849C19.5347 10.3833 19.3407 10.8229 18.9508 11.1845C18.5619 11.5473 18.0933 11.7288 17.5451 11.7288C16.9952 11.7288 16.5254 11.5473 16.132 11.1845C15.7394 10.8228 15.5427 10.3833 15.5427 9.86849C15.5427 9.35469 15.7394 8.91431 16.132 8.54821C16.5247 8.18269 16.9953 8 17.5451 8C18.0932 8 18.5619 8.18312 18.9508 8.54821C19.341 8.91431 19.5347 9.35483 19.5347 9.86849Z"
        className="fill-[#AAC1CE] group-hover:fill-[#5995E5]"
      />
    </g>
    <defs>
      <clipPath id="clip0_9413_29751">
        <rect width="32" height="32" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

const BackButtonIcon = () => (
  <svg
    width="32"
    height="32"
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g clipPath="url(#clip0_9479_904338)">
      <path
        d="M15.9895 31.2495C7.56749 31.2435 0.744492 24.4115 0.750492 15.9895C0.756492 7.56749 7.58849 0.744492 16.0105 0.750492C24.4286 0.756492 31.2495 7.58199 31.2495 16C31.237 24.421 24.4105 31.243 15.9895 31.2495Z"
        className="fill-white group-hover:fill-slate-100"
      />
      <path
        d="M15.9895 1.501C23.9973 1.507 30.484 8.00275 30.478 16.0105C30.472 24.0182 23.9763 30.505 15.9685 30.499C7.96525 30.493 1.48 24.0033 1.48 16C1.492 7.99325 7.98275 1.507 15.9895 1.501ZM15.9895 9.41908e-07C7.15269 0.00600094 -0.00599623 7.17369 3.76889e-06 16.0105C0.00600377 24.8473 7.17369 32.006 16.0105 32C24.8428 31.994 32 24.8323 32 16C31.997 7.16069 24.8288 -0.00299906 15.9895 9.41908e-07Z"
        className="fill-[#AAC1CE] group-hover:fill-red-500"
      />
      <path
        d="M15.9894 3.4037C22.946 3.4082 28.5817 9.05188 28.5772 16.0084C28.5727 22.965 22.929 28.6007 15.9724 28.5962C9.01887 28.5917 3.38468 22.9535 3.38468 15.9999C3.39468 9.04438 9.03337 3.4092 15.9894 3.4037ZM15.9894 2.90338C8.75618 2.90788 2.89681 8.77519 2.90137 16.0084C2.90587 23.2417 8.77325 29.1011 16.0065 29.0965C23.2362 29.0921 29.0946 23.2297 29.0946 15.9999C29.0926 8.7647 23.2252 2.90132 15.9899 2.90332H15.9894V2.90338Z"
        className="fill-[#BAC6CC] group-hover:fill-red-500"
      />
      <path
        d="M24.25 15.5625V15.3125H24H13.1942L18.008 10.4987L18.1854 10.3212L18.0074 10.1445L16.6762 8.8226L16.4994 8.64707L16.3232 8.82322L8.82322 16.3232L8.64645 16.5L8.82322 16.6768L16.3232 24.1768L16.5 24.3536L16.6768 24.1768L17.9987 22.8549L18.1753 22.6783L17.9988 22.5015L13.1934 17.6875H24H24.25V17.4375V15.5625Z"
        className="fill-[#AAC1CE] stroke-[#AAC1CE] group-hover:fill-red-500 group-hover:fill-red-500"
        strokeWidth="0.5"
      />
    </g>
    <defs>
      <clipPath id="clip0_9479_904338">
        <rect width="32" height="32" fill="white" />
      </clipPath>
    </defs>
  </svg>
);
