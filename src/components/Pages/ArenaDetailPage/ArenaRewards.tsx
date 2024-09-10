import { LeaderboardIcon, RewardIcon } from "@/assets/CatiarenaPage/SVGs";
import BonusIcon from "@/components/icons/BonusIcon";
import type { Arena } from "@/types/app";
import clsx from "clsx";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { RewardIcons } from "../CatiarenaPage/ProjectList/ProjectCard";
import LeaderboardRewardDialog from "../Leaderboard/LeaderboardRewardDialog";

const ArenaRewards = ({ arena }: { arena: Arena }) => {
  const navigate = useNavigate();
  const { slug } = useParams();
  const { t } = useTranslation("arenas");

  return (
    <div className="mt-3 p-3 rounded-3.5xl bg-gradient-to-r from-[#354A57] to-[#292E49]">
      <div className="flex items=center justify-between">
        <h4 className="text-2xl font-semibold">{t("rewards")}</h4>
        <div className="flex items-center gap-1">
          {slug === "seed" && (
            <LeaderboardRewardDialog>
              <div className="w-7 h-7 rounded-full p-[1px] bg-gradient-to-tr from-[#01C9FF] to-[#BBD1F6] cursor-pointer">
                <div className="w-full h-full rounded-full flex items-center justify-center bg-[#3F3F3F]">
                  <RewardIcon />
                </div>
              </div>
            </LeaderboardRewardDialog>
          )}

          <div
            className="p-1 pr-2 rounded-full flex items-center gap-0.5 bg-[#0F0F0F] cursor-pointer"
            onClick={() => navigate(`/catiarena/${arena?.slug}/leaderboard`)}
          >
            <div className="w-7 h-7 rounded-full p-[1px] bg-gradient-to-tr from-[#01C9FF] to-[#BBD1F6]">
              <div className="w-full h-full rounded-full flex items-center justify-center bg-[#3F3F3F]">
                <LeaderboardIcon />
              </div>
            </div>
            <span className="text-xs font-semibold">{t("leaderboard")}</span>
          </div>
        </div>
      </div>
      {arena.rewards && (
        <div className="mt-2.5 grid grid-cols-2 gap-1.5">
          {Object.keys(arena.rewards)
            .map((key) => {
              return { type: key, value: arena.rewards?.[key] };
            })
            .map((reward) => {
              const RenderedReward = RewardRenderer(
                slug || "",
                reward.type,
                reward.value
              );
              return (
                <LeaderboardRewardDialog
                  key={reward.type}
                  disabled={slug !== "seed"}
                >
                  {RenderedReward}
                </LeaderboardRewardDialog>
              );
            })}
        </div>
      )}
    </div>
  );
};

export default ArenaRewards;

const RewardRenderer = (
  slug: string,
  type: string,
  value?: string | number
) => {
  return (
    <div
      className={clsx(
        "w-full p-2 rounded-[10px] flex items-center justify-center bg-background",
        slug === "seed" && "cursor-pointer"
      )}
    >
      <div className="inline-flex items-center gap-1">
        {RewardIcons[type] || <BonusIcon />}
        {value && <span className="font-semibold">{value}</span>}
      </div>
    </div>
  );
};
