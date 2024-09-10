import { DollarIcon, EggIcon } from "@/assets/CatiarenaPage/SVGs";
import SeedIcon from "@/assets/CatiarenaPage/SeedIcon.png";
import { StarIcon } from "@/assets/QuizPage/SVGs";
import useNowContext from "@/components/Providers/NowProvider/useNowContext";
import BonusIcon from "@/components/icons/BonusIcon";
import DiamondIcon from "@/components/icons/DiamondIcon";
import { TOAST_IDS } from "@/lib/toast";
import useCatiaStore from "@/lib/useCatiaStore";
import { getTimeDiff, parseTimeStatus } from "@/lib/utils";
import type { Arena } from "@/types/app";
import clsx from "clsx";
import { type ReactNode, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export const RewardIcons: Record<string, ReactNode> = {
  star: <StarIcon />,
  gem: <DiamondIcon />,
  usdt: <DollarIcon />,
  bonus: <BonusIcon />,
  egg: <EggIcon />,
  seed: <img width={20} height={20} src={SeedIcon} alt="Seed" />,
};

const ProjectCard = ({ arena }: { arena: Arena }) => {
  const navigate = useNavigate();
  const { t } = useTranslation("arenas");
  const { now } = useNowContext();
  const setArena = useCatiaStore((state) => state.setArena);

  const timeStatus = useMemo(() => {
    return parseTimeStatus(now, arena.start_date, arena.end_date, true);
  }, [now, arena.start_date, arena.end_date]);

  const isNotStarted = useMemo(() => {
    const timeTillStart = getTimeDiff(now, arena.start_date);
    if (!timeTillStart || timeTillStart.rawDif > 0) return true;
    return false;
  }, [now, arena.start_date]);

  const isArenaEnded = useMemo(() => {
    if (
      arena?.end_date &&
      new Date(arena?.end_date).getTime() <= new Date(now).getTime()
    ) {
      return true;
    }

    return false;
  }, [arena?.end_date, now]);

  return (
    <div
      className={clsx(
        "cursor-pointer rounded-[30px] px-0.5 pb-1 pt-0.5",
        isArenaEnded
          ? "bg-[#242A3D]/70"
          : "bg-gradient-to-br from-[#19BFEF]/85 via-[#0DC9EB]/90 to-[#00E3D0]"
      )}
      onClick={() => {
        if (isNotStarted) {
          toast.info(t("arena_not_started_toast"), {
            id: TOAST_IDS.COMING_SOON,
          });
          return;
        }
        setArena(arena);
        navigate(`/catiarena/${arena.slug}`);
      }}
    >
      <div className="relative flex min-h-28 w-full items-center rounded-[28px] bg-gradient-to-br from-[#536976] to-[#292E49] px-6 py-4 xs:min-h-[120px]">
        {arena?.logo && (
          <div className={clsx("relative", isArenaEnded && "opacity-50")}>
            <div className="z-10 h-20 w-20">
              <img
                src="/logo-frame.png"
                alt="logo-frame"
                className="h-full w-full"
              />
            </div>

            <img
              src={arena?.logo}
              alt="logo"
              className="absolute left-0 top-0 h-[68px] w-[68px] translate-x-1.5 translate-y-1.5 rounded-full border border-[#6EFFFF33] shadow-[0_8px_48px_0] shadow-[#91F8DAE5]"
            />
          </div>
        )}
        <div
          className={clsx(
            "flex w-full items-center pl-6",
            isArenaEnded && "opacity-50"
          )}
        >
          <div className="flex flex-col gap-1">
            <div className="text-xs text-secondary-foreground">
              {timeStatus}
            </div>
            <div className="text-xl font-semibold capitalize">{arena.name}</div>
            {arena.rewards && (
              <div className="flex flex-wrap items-center gap-2 font-semibold">
                {Object.keys(arena.rewards)
                  .map((key) => {
                    return { type: key, value: arena.rewards?.[key] };
                  })
                  .map((reward) => {
                    const RenderedReward = RewardRenderer(
                      reward.type,
                      reward.value
                    );
                    // if (index === 0) return RenderedReward;
                    return (
                      <span
                        key={`${reward.type}-${reward.value}`}
                        className="flex items-center gap-1"
                      >
                        {/* <span>+</span> */}
                        {RenderedReward}
                      </span>
                    );
                  })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;

const RewardRenderer = (type: string, value?: string | number) => {
  return (
    <span className="inline-flex items-center gap-1">
      {RewardIcons[type] || <BonusIcon />}
      {value && <span>{value}</span>}
    </span>
  );
};
