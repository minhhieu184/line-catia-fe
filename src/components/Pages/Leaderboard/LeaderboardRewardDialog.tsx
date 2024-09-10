import EggCommon from "@/assets/CatiarenaPage/EggCommon.png";
import EggEpic from "@/assets/CatiarenaPage/EggEpic.png";
import EggLegend from "@/assets/CatiarenaPage/EggLegend.png";
import EggRare from "@/assets/CatiarenaPage/EggRare.png";
import EggUncommon from "@/assets/CatiarenaPage/EggUncommon.png";
import SeedIcon from "@/assets/CatiarenaPage/SeedIcon.png";
import { GemIcon } from "@/assets/MainPage/SVGs.tsx";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import useCatiaStore from "@/lib/useCatiaStore";
import type { PropsWithChildren } from "react";

const rewards = [
  {
    key: 1,
    label: "1",
    value: "1 Legend Egg",
    img: <img width={15} height={20} src={EggLegend} alt="EggLegend" />,
  },
  {
    key: 2,
    label: "2",
    value: "1 Epic Egg",
    img: <img width={15} height={20} src={EggEpic} alt="EggEpic" />,
  },
  {
    key: 3,
    label: "3",
    value: "1 Rare Egg",
    img: <img width={15} height={20} src={EggRare} alt="EggRare" />,
  },
  {
    key: 4,
    label: "4-10",
    value: "1 Uncommon Egg",
    img: <img width={15} height={20} src={EggUncommon} alt="EggUncommon" />,
  },
  {
    key: 5,
    label: "11-20",
    value: "1 Common Egg",
    img: <img width={15} height={20} src={EggCommon} alt="EggCommon" />,
  },
  {
    key: 6,
    label: "21-100",
    value: "50 SEED",
    img: <img width={20} height={20} src={SeedIcon} alt="Seed" />,
  },
  {
    key: 7,
    label: "101-500",
    value: "20 SEED",
    img: <img width={20} height={20} src={SeedIcon} alt="Seed" />,
  },
  {
    key: 8,
    label: "Others > 200 ",
    value: "5 SEED",
    img: <img width={20} height={20} src={SeedIcon} alt="Seed" />,
  },
];

const LeaderboardRewardDialog = ({
  disabled,
  children,
}: { disabled?: boolean } & PropsWithChildren) => {
  const quizProgressDialogOpen = useCatiaStore(
    (state) => state.quizProgressDialogOpen
  );
  const setQuizProgressDialogOpen = useCatiaStore(
    (state) => state.setQuizProgressDialogOpen
  );

  if (disabled) return children;

  return (
    <Dialog
      open={quizProgressDialogOpen}
      onOpenChange={setQuizProgressDialogOpen}
    >
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="px-4 py-5">
        <DialogTitle hidden />
        <div className="">
          <div className="flex items-center gap-1">
            <h4 className="text-2xl font-semibold text-[#FDFDFD]">Reward</h4>
            <div className="bg-gradient-to-tr from-[#00E3D0] via-[#0DC9EBE5] to-[#19BFEFD9] rounded-full p-[1px] w-[110px] h-[22px]">
              <div className="w-full h-full text-xs font-medium rounded-full flex items-center justify-center bg-[#0F0F0F]">
                <span className="bg-gradient-to-tr from-[#00E3D0] via-[#0DC9EB] to-[#19BFEF] bg-clip-text text-transparent">
                  Reward for Each
                </span>
              </div>
            </div>
          </div>
          <div className="mt-4 rounded-2xl w-full flex flex-col gap-2 py-2.5 pl-5 bg-[#091428]">
            {rewards.map((reward) => (
              <div
                key={reward.key}
                className="flex items-center justify-between gap-3"
              >
                <div className="flex items-center justify-center w-[120px] gap-1">
                  <span className="">{reward.label}</span>
                  {reward.key === 8 && <GemIcon />}
                </div>
                <span>-</span>
                <div className="flex-1 flex items-start gap-1">
                  <span className="w-[20px] flex items-center justify-center mt-1">
                    {reward.img}
                  </span>
                  <span className="inline">{reward.value}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LeaderboardRewardDialog;
