import { Loading } from "@/assets/loading";
import Container from "@/components/Layout/Container";
import LeaderboardItem from "@/components/Pages/Leaderboard/LeaderboardItem.tsx";
import LeaderboardMe from "@/components/Pages/Leaderboard/LeaderboardMe.tsx";
import LeaderboardRewardDialog from "@/components/Pages/Leaderboard/LeaderboardRewardDialog.tsx";
import LeaderboardTopList from "@/components/Pages/Leaderboard/LeaderboardTopList.tsx";
import { useGameCountDown } from "@/components/SessionCountdown";
import { GiftIcon } from "@/components/icons/GiftIcon.tsx";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useArenaLeaderboard } from "@/lib/swr";
import useCatiaStore from "@/lib/useCatiaStore";
import { cn, getCountdownText } from "@/lib/utils";
import { useTranslation } from "react-i18next";

export default function ArenaLeaderboardPage() {
  const { t } = useTranslation("arenas");
  const { data: leaderboard, isLoading: leaderboardLoading } =
    useArenaLeaderboard();
  const { arena } = useCatiaStore();
  const { gameCountdown: gameStartCountdown } = useGameCountDown({
    duration: arena?.start_date,
  });
  const { gameCountdown: gameEndCountdown } = useGameCountDown({
    duration: arena?.end_date,
  });

  const timeCountdown = getCountdownText(
    gameStartCountdown || "",
    gameEndCountdown || "",
    arena?.start_date || "",
    arena?.end_date || ""
  );

  if (leaderboardLoading) return <Loading />;
  if (!leaderboard) return null;

  return (
    <Container className="relative grid max-h-screen grid-rows-[auto_1fr] pb-28">
      <div>
        <div className="flex items-center justify-between">
          <div className="text-5xl font-medium">{t("leaderboard")}</div>
          {arena?.slug === "seed" && (
            <LeaderboardRewardDialog>
              <div className="flex cursor-pointer items-center justify-center rounded-full border-[1px] border-[#FFFFFF4D] bg-[#FFFFFF33] p-[6px]">
                <GiftIcon />
              </div>
            </LeaderboardRewardDialog>
          )}
        </div>
        <div className="flex items-end justify-between">
          <div className="mt-2 flex items-end gap-2">
            <div className="leading-nones flex h-8 max-w-max items-center justify-center gap-1 rounded-full border border-[#FFFFFF4D] bg-[#FFFFFF33] px-4 text-sm font-semibold text-white">
              {arena?.name}
            </div>
          </div>
          <div className="flex items-center">
            {timeCountdown.includes(t("quiz_end_in", { value: "" })) ? (
              <div className="flex flex-col items-end gap-1 text-xs font-semibold">
                {t("quiz_end_in", { value: "" })}
                <p className="flex items-center gap-0.5 text-primary">
                  <span className="rounded-md border border-primary p-1">
                    {gameEndCountdown?.split(" ")[0]}
                  </span>
                  <span>:</span>
                  <span className="rounded-md border border-primary p-1">
                    {gameEndCountdown?.split(" ")[1]}
                  </span>
                  <span>:</span>
                  <span className="rounded-md border border-primary p-1">
                    {gameEndCountdown?.split(" ")[2]}
                  </span>
                </p>
              </div>
            ) : timeCountdown.includes(t("quiz_start_in", { value: "" })) ? (
              <div className="flex flex-col items-end gap-1 text-xs font-semibold">
                {t("quiz_start_in", { value: "" })}
                <p className="flex items-center gap-0.5 text-primary">
                  <span className="rounded-md border border-primary p-1">
                    {gameStartCountdown?.split(" ")[0]}
                  </span>
                  <span>:</span>
                  <span className="rounded-md border border-primary p-1">
                    {gameStartCountdown?.split(" ")[1]}
                  </span>
                  <span>:</span>
                  <span className="rounded-md border border-primary p-1">
                    {gameStartCountdown?.split(" ")[2]}
                  </span>
                </p>
              </div>
            ) : (
              <div className="">{timeCountdown}</div>
            )}
          </div>
        </div>
      </div>

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
              <div className="h-[calc(100vh-340px)]">
                <ScrollArea className="scroll-controller static z-10 h-full rounded-2xl bg-[#354A53] p-3">
                  <div className="space-y-2">
                    {leaderboard?.leaderboard?.slice(3)?.map((item, index) => {
                      return (
                        <div
                          key={`leaderboard-rank-${index + 4}`}
                          className={cn(
                            "flex items-center justify-between rounded-3xl p-2.5",
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
    </Container>
  );
}
