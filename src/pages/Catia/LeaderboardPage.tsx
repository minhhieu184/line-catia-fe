import { Loading } from "@/assets/loading.tsx";
import Container from "@/components/Layout/Container";
import LeaderboardItem from "@/components/Pages/Leaderboard/LeaderboardItem.tsx";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useGeneralLeaderboard } from "@/lib/swr";
import useCatiaStore from "@/lib/useCatiaStore";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

import { RewardNoticeDialogTopBg } from "@/assets/LeaderboardPage/RewardNoticeDialogTopBg";
import LeaderboardMe from "@/components/Pages/Leaderboard/LeaderboardMe.tsx";
import LeaderboardTopList from "@/components/Pages/Leaderboard/LeaderboardTopList.tsx";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog.tsx";
import { useEffect, useState } from "react";
// import {GiftIcon} from "@/components/icons/GiftIcon.tsx";

export default function LeaderboardPage() {
  const { leaderboard: type, setLeaderboard } = useCatiaStore((state) => state);
  const { t } = useTranslation("leaderboard");

  const leaderboardNoticeCheckedv2 = useCatiaStore(
    (state) => state.leaderboardNoticeCheckedv2
  );
  const setLeaderboardNoticeCheckedv2 = useCatiaStore(
    (state) => state.setLeaderboardNoticeCheckedv2
  );
  const [open, setOpen] = useState<boolean>(false);

  useEffect(() => {
    if (leaderboardNoticeCheckedv2) setOpen(false);
    else setOpen(true);
  }, [leaderboardNoticeCheckedv2]);

  return (
    <Container className="relative flex h-full flex-col">
      <div>
        <div className="flex items-end justify-between">
          <div className="text-[36px] font-semibold">
            {t("master_leaderboard")}
          </div>
        </div>
      </div>
      <div className="mt-3 flex h-10 w-full cursor-pointer items-center justify-center gap-1 rounded-2xl bg-[#FFFFFF33] p-1 font-medium">
        {/*<div*/}
        {/*  className={`flex-1 flex items-center justify-center text-white ${*/}
        {/*    type === "overall_daily"*/}
        {/*      ? "p-1 h-8 rounded-xl bg-gradient-to-r from-[#19BFEF] via-[#0DC9EB] to-[#00E3D0] font-bold"*/}
        {/*      : ""*/}
        {/*  }`}*/}
        {/*  onClick={() => {*/}
        {/*    if (type === "overall_daily") return;*/}
        {/*    setLeaderboard("overall_daily");*/}
        {/*  }}*/}
        {/*>*/}
        {/*  {t("daily")}*/}
        {/*</div>*/}
        <div
          className={`flex flex-1 items-center justify-center text-white ${
            type === "overall_weekly"
              ? "h-8 rounded-xl bg-gradient-to-r from-[#19BFEF] via-[#0DC9EB] to-[#00E3D0] p-1 font-bold"
              : ""
          }`}
          onClick={() => {
            if (type === "overall_weekly") return;
            setLeaderboard("overall_weekly");
          }}
        >
          {t("weekly")}
        </div>
        <div
          className={`flex flex-1 items-center justify-center text-white ${
            type === "overall"
              ? "h-8 rounded-xl bg-gradient-to-r from-[#19BFEF] via-[#0DC9EB] to-[#00E3D0] p-1 font-bold"
              : ""
          }`}
          onClick={() => {
            if (type === "overall") return;
            setLeaderboard("overall");
          }}
        >
          {t("all_time")}
        </div>
        {/*<div className="w-[32px] h-[32px] flex items-center justify-center rounded-full bg-[#FFFFFF33] border border-[#FFFFFF4D]">*/}
        {/*  <GiftIcon className="w-4 h-4" />*/}
        {/*</div>*/}
      </div>
      <LeaderboardData />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          className="m-0 gap-0 border-0 bg-transparent p-0 ring-0 focus-visible:border-0 focus-visible:ring-0"
          hideCloseButton={true}
        >
          <DialogTitle hidden />
          <RewardNoticeDialogTopBg />
          <div className="relative flex items-center justify-center overflow-x-hidden rounded-xl bg-[#12274E] pb-2 pt-2">
            <div className="flex flex-col items-center gap-3 px-4 text-center xs:gap-5">
              <div className="text-lg font-semibold capitalize xs:text-3xl">
                Star Bonuses For Top Master Leaderboard
              </div>
              <div className="flex flex-col gap-1.5 text-[13px] leading-[1.4] text-[#A6ADBC] xs:gap-2 xs:text-sm">
                <p>
                  Catiarena is on the way with a{" "}
                  <strong>$50,000 reward!</strong>
                </p>
                <p>
                  <strong>TOP 1000</strong> All-time Leaderboard will be given{" "}
                  <strong>Star bonuses</strong> to gear up for the massive
                  campaign.
                </p>
                <p>
                  Only <strong>ONCE</strong>. Let's try to climb leaderboard.
                </p>
                <p>
                  The ranking will be snapshot at{" "}
                  <strong>10:00 AM UTC, July 25, 2024</strong>
                </p>
              </div>

              <div className="flex w-full flex-col gap-1.5 xs:gap-2">
                <Button
                  className="h-8 w-full xs:h-10"
                  size="sm"
                  onClick={() => {
                    setOpen(false);
                  }}
                >
                  OK
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 w-full text-[15px] font-normal text-[#A6ADBC] xs:h-10"
                  onClick={() => {
                    setLeaderboardNoticeCheckedv2(true);
                    setOpen(false);
                  }}
                >
                  Don't show again
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Container>
  );
}

function LeaderboardData() {
  const { data: leaderboard, isLoading: leaderboardLoading } =
    useGeneralLeaderboard();
  if (leaderboardLoading)
    return (
      <div className="flex h-full items-center justify-center">
        <Loading />
      </div>
    );
  if (!leaderboard) return null;
  return (
    <div className="relative mt-5">
      <LeaderboardTopList leaderboard={leaderboard} />

      <div className="relative pt-32">
        {leaderboard?.leaderboard?.length > 3 && (
          <>
            <div className="relative z-[11] flex justify-center">
              <svg width="72" height="13" viewBox="0 0 72 13" fill="none">
                <path
                  d="M-151 45.2776C-151 27.6045 -136.673 13.2776 -119 13.2776H-57.5H-10.75H-3.49759C6.64359 13.2776 15.8642 7.6457 24.8459 2.93703C28.1059 1.22797 31.8814 0 36 0C40.1186 0 43.8941 1.22797 47.1541 2.93703C56.1358 7.6457 65.3564 13.2776 75.4976 13.2776H82.75H129.5H191C208.673 13.2776 223 27.6045 223 45.2776V1112H-151V45.2776Z"
                  fill="#354A53"
                />
              </svg>
              <div className="absolute left-1/2 top-2 z-[11] h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-[#A6E8FA]" />
            </div>
            <div className="h-[calc(100vh-350px)]">
              <ScrollArea className="scroll-controller static z-10 h-full rounded-2xl bg-[#354A53] p-3">
                <div className="space-y-2">
                  {leaderboard?.leaderboard?.slice(3)?.map((item, index) => {
                    return (
                      <div
                        key={`leaderboard-rank-${index + 4}`}
                        className={cn(
                          "flex items-center justify-between rounded-3xl px-4 py-2.5",
                          leaderboard?.me?.rank === index + 4
                            ? "border-2 border-[#19BFEF] bg-[#116589]"
                            : "bg-[#003757]"
                        )}
                      >
                        <LeaderboardItem
                          item={item}
                          index={index}
                          isMe={leaderboard?.me?.rank === index + 4}
                        />
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>
            </div>
          </>
        )}
      </div>
      <LeaderboardMe leaderboard={leaderboard} />
    </div>
  );
}
