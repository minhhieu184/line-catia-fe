import DetailBg from "@/assets/CatiarenaPage/ArenaDetailBg.png";
import { UsersIcon } from "@/assets/CatiarenaPage/SVGs";
import { Loading } from "@/assets/loading";
import Container from "@/components/Layout/Container";
import ArenaQuiz from "@/components/Pages/ArenaDetailPage/ArenaQuiz";
import ArenaRewards from "@/components/Pages/ArenaDetailPage/ArenaRewards";
import ArenaTasks from "@/components/Pages/ArenaDetailPage/ArenaTasks";
import useNowContext from "@/components/Providers/NowProvider/useNowContext";
import { GradientText } from "@/components/ui/gradient-text";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useArenaDetail } from "@/lib/swr";
import { formatNumberSuffix, getTimeDiff } from "@/lib/utils";
import dayjs from "dayjs";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

export default function ArenaDetailPage() {
  const { t } = useTranslation("arenas");
  const { now } = useNowContext();
  const { data: arenaDetail, isLoading } = useArenaDetail();

  const isArenaActive = useMemo(() => {
    if (
      arenaDetail?.arena?.start_date &&
      new Date(arenaDetail?.arena?.start_date).getTime() >
        new Date(now).getTime()
    ) {
      return false;
    }

    if (
      arenaDetail?.arena?.end_date &&
      new Date(arenaDetail?.arena?.end_date).getTime() <=
        new Date(now).getTime()
    ) {
      return false;
    }

    return true;
  }, [arenaDetail?.arena?.start_date, arenaDetail?.arena?.end_date, now]);

  const hasDoneAllTasks = useMemo(() => {
    if (!arenaDetail?.tasks?.links) return true;

    for (const link of arenaDetail.tasks.links) {
      if (!link.joined && link.required) return false;
    }

    return true;
  }, [arenaDetail?.tasks?.links]);

  const timeDiffTillEnd = useMemo(() => {
    return getTimeDiff(now, arenaDetail?.arena?.end_date);
  }, [now, arenaDetail?.arena?.end_date]);

  if (isLoading) {
    return (
      <main className="w-full h-full flex items-center justify-center">
        <Loading className="w-16 h-16" />
      </main>
    );
  }

  if (!arenaDetail || !arenaDetail?.arena) return null;

  return (
    <main className="h-full bg-gradient-to-b from-[#0B1425]/50 to-[#0A1225]/50">
      <ScrollArea className="h-full">
        <div className="relative rounded-b-[24px] overflow-hidden -mb-7">
          <img
            src={arenaDetail?.arena?.banner || DetailBg}
            alt="Arena banner"
            className="relative w-full aspect-[430/152] object-cover object-bottom"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/20 to-black/80 from-50% via-65%" />
          {arenaDetail?.arena?.participants_count && (
            <div className="absolute right-7 top-3 bg-background p-1 pr-2 rounded-full flex items-center gap-1">
              <div className="w-7 h-7 p-[1px] rounded-full bg-primaryGradient">
                <div className="w-full h-full rounded-full bg-[#3F3F3F] flex items-center justify-center">
                  <UsersIcon />
                </div>
              </div>
              <div>
                {formatNumberSuffix(
                  arenaDetail?.arena?.participants_count,
                  1,
                  true
                )}
                {arenaDetail?.arena?.participants_count > 1000 && "+"}
              </div>
            </div>
          )}
        </div>

        <Container className="relative">
          <div className="w-full pb-3">
            <div className="flex gap-2 xs:gap-3">
              <div className="relative w-20 max-h-20">
                <img
                  src={arenaDetail?.arena?.logo}
                  alt="logo"
                  className="w-20 h-20 flex items-center justify-center rounded-3.5xl bg-[#005C74]"
                />
              </div>

              <div className="flex-1 flex flex-col gap-1">
                <h3 className="text-2xl font-semibold tracking-wide line line-clamp-2">
                  {arenaDetail?.arena?.name}
                </h3>
                {isArenaActive && timeDiffTillEnd ? (
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-semibold">
                      {t("end_in", { value: "" })}
                    </span>
                    <div className="flex items-center gap-0.5 text-xs tabular-nums">
                      <div className="relative min-w-7 h-7 p-[1px] rounded-md font-extrabold bg-gradient-to-br from-[#19BFEF] via-[#0DC9EB] to-[#00E3D0]">
                        <div className="w-full h-full px-0.5 rounded-md flex items-center justify-center bg-[#091428]">
                          <GradientText className="font-extrabold">
                            {timeDiffTillEnd.days > 0
                              ? `${timeDiffTillEnd.days}d`
                              : `${timeDiffTillEnd.hours}h`}
                          </GradientText>
                        </div>
                      </div>
                      <div className="font-black text-foreground">:</div>
                      <div className="relative min-w-7 h-7 p-[1px] rounded-md font-extrabold bg-gradient-to-br from-[#19BFEF] via-[#0DC9EB] to-[#00E3D0]">
                        <div className="w-full h-full px-0.5 rounded-md flex items-center justify-center bg-[#091428]">
                          <GradientText className="font-extrabold">
                            {timeDiffTillEnd.days > 0
                              ? `${timeDiffTillEnd.hours}h`
                              : `${timeDiffTillEnd.minutes}m`}
                          </GradientText>
                        </div>
                      </div>
                      <div className="font-black text-foreground">:</div>
                      <div className="relative min-w-7 h-7 p-[1px] rounded-md font-extrabold bg-gradient-to-br from-[#19BFEF] via-[#0DC9EB] to-[#00E3D0]">
                        <div className="w-full h-full px-0.5 rounded-md flex items-center justify-center bg-[#091428]">
                          <GradientText className="font-extrabold">
                            {timeDiffTillEnd.days > 0
                              ? `${timeDiffTillEnd.minutes}m`
                              : `${timeDiffTillEnd.seconds}s`}
                          </GradientText>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <>
                    {arenaDetail?.arena?.start_date &&
                      arenaDetail?.arena?.end_date && (
                        <div className="text-xs tracking-wide py-1 font-semibold">
                          {t("ended")} ·{" "}
                          {dayjs(arenaDetail?.arena?.start_date).format(
                            "MMM D"
                          )}{" "}
                          -{" "}
                          {dayjs(arenaDetail?.arena?.end_date).format("MMM D")}
                        </div>
                      )}
                  </>
                )}
                <p className="text-sm text-secondary-foreground">
                  {arenaDetail?.arena?.description}
                </p>
              </div>
            </div>

            <ArenaRewards arena={arenaDetail?.arena} />

            {arenaDetail?.tasks?.links && arenaDetail?.tasks?.game_slug && (
              <ArenaTasks
                tasks={arenaDetail.tasks.links}
                gameSlug={arenaDetail.tasks.game_slug}
                isArenaActive={isArenaActive}
                tasksDone={hasDoneAllTasks}
              />
            )}

            {arenaDetail?.game && (
              <ArenaQuiz
                tasksDone={hasDoneAllTasks}
                game={arenaDetail.game}
                isArenaActive={isArenaActive}
              />
            )}
          </div>
        </Container>
      </ScrollArea>
    </main>
  );
}
