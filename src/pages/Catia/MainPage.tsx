import BlinkStar, {
  DiamondIcon,
  GiftBoxIcon,
  LeaderboardIcon,
} from "@/assets/MainPage/SVGs";
import Container from "@/components/Layout/Container";
import { NewArenaDialog } from "@/components/Pages/CatiarenaPage/NewArenaDialog.tsx";
import CampaignRewardDialog from "@/components/Pages/HomePage/CampaignRewardDialog.tsx";
import { CatiarenaButton } from "@/components/Pages/HomePage/CatiarenaButton";
import MoonTap from "@/components/Pages/HomePage/MoonTap";
import NewCampaignDialog from "@/components/Pages/HomePage/NewCampaignDialog.tsx";
import WelcomeDialog from "@/components/Pages/HomePage/WelcomeDialog.tsx";
import UserPersonalSheet from "@/components/UserPersonal/UserPersonalSheet.tsx";
import { useCheckNewCatiaArena } from "@/lib/hooks/useCheckNewCatiaArena.ts";
import { useCheckGamesList, useGameFreebies, useMe } from "@/lib/swr";
import useCatiaStore from "@/lib/useCatiaStore";
import type { Reward } from "@/types/app.ts";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function MainPage() {
  const navigate = useNavigate();
  const { data: me } = useMe();
  const { data: games } = useCheckGamesList(!me);
  const { data: freebies } = useGameFreebies(!me);
  const [newGame, setNewGame] = useState("");
  const [showWelcomeDialog, setShowWelcomeDialog] = useState(false);
  const [showNewGameDialog, setShowNewGameDialog] = useState(false);
  const [showReward, setShowReward] = useState(false);
  const [reward, setReward] = useState<Reward>();
  const [
    { newCatiaArenaKeyLocal, currentOpenedArena },
    { onChangeNewCatiaArenaStatus },
  ] = useCheckNewCatiaArena();
  const isFreebiesClaimable = useMemo(() => {
    const now = new Date();
    if (!freebies || freebies.length < 1) return false;
    for (const freebie of freebies) {
      if (new Date(freebie.countdown).getTime() < now.getTime()) return true;
    }
    return false;
  }, [freebies]);

  useEffect(() => {
    if (!games) return;
    if (!me) return;
    const game = games.find((game) => game.is_new);
    const nowTimestamp = new Date().getTime();
    if (
      game &&
      !me?.is_new_user &&
      (!game.game_start_time ||
        new Date(game.game_start_time).getTime() <= nowTimestamp) &&
      (!game.game_end_time ||
        new Date(game.game_end_time).getTime() > nowTimestamp)
    ) {
      setShowNewGameDialog(true);
      setNewGame(game?.game_slug);
    }
  }, [games, me?.is_new_user]);

  const profileBottomSheetOpen = useCatiaStore(
    (state) => state.profileBottomSheetOpen
  );
  const setProfileBottomSheetOpen = useCatiaStore(
    (state) => state.setProfileBottomSheetOpen
  );

  const isFirstApp = localStorage.getItem("is_first_app");
  const isFirstMount = useMemo(() => {
    return isFirstApp === null || isFirstApp === "false";
  }, [isFirstApp]);

  useEffect(() => {
    if (!me) return;
    if (me?.is_new_user && isFirstMount) {
      setShowWelcomeDialog(true);
      localStorage.setItem("is_first_app", "true");
    }
  }, [me, isFirstMount]);
  const isReward = localStorage.getItem("is_reward");
  const isRewarded = useMemo(() => {
    return isReward === null || isReward === "false";
  }, [isReward]);

  useEffect(() => {
    if (!me) return;
    if (me?.available_rewards && me?.available_rewards.length > 0) {
      const reward = me?.available_rewards.find((reward) => !reward.claimed);
      if (reward && isRewarded) {
        setReward(reward);
        localStorage.setItem("is_reward", "true");
        setShowReward(true);
      }
    }
  }, [me, isReward]);

  const leaderboardNoticeCheckedv2 = useCatiaStore(
    (state) => state.leaderboardNoticeCheckedv2
  );

  return (
    <main className="h-full pb-2 pt-4">
      <Container className="h-full">
        <div className="flex h-full flex-col">
          <div className="relative flex justify-center">
            <div className="absolute left-0 top-9 z-[1] flex flex-col gap-4">
              <button
                className="relative flex h-10 w-10 items-center justify-center"
                type="button"
                onClick={() => navigate("/freebies")}
              >
                <GiftBoxIcon className="pointer-events-none absolute translate-y-1" />
                {isFreebiesClaimable && (
                  <div className="absolute -right-0.5 top-1.5 h-2 w-2 rounded-full bg-[#F73131]" />
                )}
              </button>
              <button
                className="relative flex h-10 w-10 items-center justify-center"
                type="button"
                onClick={() => {
                  navigate("/leaderboard");
                }}
              >
                <LeaderboardIcon className="pointer-events-none absolute translate-y-1" />
                {!leaderboardNoticeCheckedv2 && (
                  <div className="absolute -right-0.5 top-1 h-2 w-2 rounded-full bg-[#F73131]" />
                )}
              </button>
            </div>
            <UserPersonalSheet
              isOpen={profileBottomSheetOpen}
              setIsOpen={(status) => setProfileBottomSheetOpen(status)}
            >
              <div className="relative">
                <div className="absolute left-1/2 top-1/2 h-2 w-full -translate-x-1/2 -translate-y-1/2 rounded-[100%] shadow-[0_0_30px_21px_rgba(115,196,255,1)]" />
                <div className="relative flex items-center justify-center gap-1.5 rounded-xl border-2 border-primary bg-black px-5 py-1.5">
                  <DiamondIcon className="h-7 w-7" />
                  <span className="text-2xl font-semibold">
                    {me?.total_score || 0}
                  </span>
                </div>
              </div>
            </UserPersonalSheet>
          </div>
          <div className="mt-4 max-h-56 w-full flex-1">
            <div className="relative w-full">
              <BlinkStar
                width={11}
                height={11}
                className="absolute left-14 top-10 z-0"
              />
              <BlinkStar
                width={17}
                height={17}
                className="absolute left-2 top-1 z-0 opacity-20 delay-300"
              />
              <BlinkStar
                width={4}
                height={4}
                className="absolute left-[50%] top-0 z-0 delay-500"
              />
              <BlinkStar
                width={5}
                height={5}
                className="absolute right-[20%] top-0 z-0 delay-700"
              />
              <BlinkStar
                width={11}
                height={11}
                className="absolute left-[55%] top-12 z-0 delay-500"
              />
              <BlinkStar
                width={5}
                height={5}
                className="absolute right-6 top-16 z-0 delay-300"
              />
              <BlinkStar
                width={4.3}
                height={4.3}
                className="absolute left-8 top-20 z-0 delay-700"
              />
              <BlinkStar
                width={6.8}
                height={6.8}
                className="delay-600 absolute left-4 top-28 z-0"
              />
              <BlinkStar
                width={7}
                height={7}
                className="absolute right-4 top-32 z-0"
              />
            </div>
            <MoonTap />
          </div>
          <div className="mt-7 w-full">
            <CatiarenaButton />
          </div>
        </div>
      </Container>
      <WelcomeDialog
        open={showWelcomeDialog}
        onOpenChange={setShowWelcomeDialog}
      />
      <NewCampaignDialog
        open={showNewGameDialog}
        newGame={newGame}
        onOpenChange={setShowNewGameDialog}
      />
      <CampaignRewardDialog
        open={showReward}
        reward={reward}
        onOpenChange={setShowReward}
      />
      {currentOpenedArena && (
        <NewArenaDialog
          arena={currentOpenedArena}
          newCatiaArenaKeyLocal={newCatiaArenaKeyLocal}
          onOpenChange={onChangeNewCatiaArenaStatus!}
          open={!!currentOpenedArena.id}
        />
      )}
    </main>
  );
}
