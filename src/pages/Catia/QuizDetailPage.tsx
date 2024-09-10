// import { useUtils } from "@telegram-apps/sdk-react";
import { useMemo, useState } from "react";
import Markdown from "react-markdown";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import {
  BonusIcon,
  HourglassIcon,
  LeaderboardIcon,
  QuestionIcon,
} from "@/assets/QuizPage/SVGs";
import { Loading } from "@/assets/loading";
import InviteFriendDialog from "@/components/Dialogs/InviteFriendDialog";
import Container from "@/components/Layout/Container";
import useNowContext from "@/components/Providers/NowProvider/useNowContext";
import { SuccessfulBadgeIcon } from "@/components/icons";
import DiamondIcon from "@/components/icons/DiamondIcon";
import StarLifeLine from "@/components/icons/StarLifeline";
import Close from "@/components/icons/popup/Close";
import TelegramIcon from "@/components/icons/socials/TelegramIcon";
import TwitterIcon from "@/components/icons/socials/TwitterIcon";
import WebIcon from "@/components/icons/socials/WebIcon";
import YoutubeIcon from "@/components/icons/socials/YoutubeIcon";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  useGameActionBoost,
  useGameCheckSocialTask,
  useGameMe,
  useGameSessionMine,
  useMe,
} from "@/lib/swr";
import { TOAST_IDS } from "@/lib/toast";
import {
  convertMinutesToTimeTextShort,
  formatCountdownText,
  getCountdownText,
} from "@/lib/utils";
import i18n from "i18next";
import { useTranslation } from "react-i18next";
import useCatiaStore from "../../lib/useCatiaStore";

const getSpeedUpTime = (time: number) => {
  const hours = Math.floor(time / 60);
  const minutes = Math.floor(time % 60);

  const formattedHours =
    hours > 0
      ? hours > 1
        ? i18n.t("quiz:hours", { value: hours })
        : i18n.t("quiz:hour", { value: hours })
      : "";
  const formattedMinutes =
    minutes > 0
      ? minutes > 1
        ? i18n.t("quiz:minutes", { value: minutes })
        : i18n.t("quiz:minute", { value: minutes })
      : "";

  return `${formattedHours}${formattedMinutes}`;
};

export default function QuizDetailPage() {
  const { now } = useNowContext();
  const { t } = useTranslation("quiz");
  const game = useCatiaStore((state) => state.game);
  const useBoostModal = useCatiaStore((state) => state.useBoostModal);
  const inviteDialogOpen = useCatiaStore((state) => state.inviteDialogOpen);
  const setInviteDialogOpen = useCatiaStore(
    (state) => state.setInviteDialogOpen
  );
  const [link, setLink] = useState<number>(-1);
  useGameCheckSocialTask(link, game?.slug || "");
  // const utils = useUtils();
  const navigate = useNavigate();
  const { data: userGame, mutate: mutateUserGame } = useGameMe();
  const {
    data: session,
    isLoading: sessionLoading,
    mutate: mutateSession,
    error: errorSession,
  } = useGameSessionMine();
  const { dispatch: actionBoost } = useGameActionBoost();
  const { data: user, mutate: mutateUser } = useMe();

  const sessionCountdown = useMemo(() => {
    return formatCountdownText(now, userGame?.countdown, true);
  }, [now, userGame?.countdown]);
  const gameStartCountdown = useMemo(() => {
    return formatCountdownText(now, game?.start_time, true);
  }, [now, game?.start_time]);
  const gameEndCountdown = useMemo(() => {
    return formatCountdownText(now, game?.end_time, true);
  }, [now, game?.end_time]);

  const timeCountdown = getCountdownText(
    gameStartCountdown || "",
    gameEndCountdown || "",
    game?.start_time || "",
    game?.end_time || ""
  );

  function startQuiz() {
    navigate(`/quiz/${game?.slug}`);
  }

  function onGameBoost() {
    if (
      game?.config &&
      game.config.length >= 4 &&
      game.config[2].value !== "-1" &&
      !!session?.used_boost_count &&
      session.used_boost_count >= Number(game.config[2].value)
    ) {
      toast.error(t("game_boost_toast", { value: game.config[2].value }), {
        id: TOAST_IDS.ALREADY_USED,
      });
      return;
    }

    actionBoost()
      .then(() => {
        toast.custom((id) => (
          <div className="flex flex-row items-center justify-between bg-bgFreebies p-3 rounded-lg gap-2">
            <div className="flex flex-row gap-3 items-center">
              <SuccessfulBadgeIcon />
              <p className="text-13 text-[#C8C5C5]">
                {t("congratulations_toast")}
              </p>
            </div>
            <button type="button" onClick={() => toast.dismiss(id)}>
              <Close className="w-5 h-5" />
            </button>
          </div>
        ));
        mutateUserGame();
        mutateSession();
        mutateUser();
        useCatiaStore.setState({ useBoostModal: false });
      })
      .catch((err) => {
        if (err.cause === "no boost available") {
          toast.error(t("no_star_toast"), {
            id: TOAST_IDS.NO_BOOST_AVAILABLE,
          });
          return;
        }
        toast.error(i18n.t("common:error_toast"), {
          id: TOAST_IDS.FETCH_ERROR,
        });
      });
  }

  function onClickUseBoost() {
    if (
      game?.config &&
      game.config.length >= 4 &&
      game.config[2].value !== "-1" &&
      !!session?.used_boost_count &&
      session.used_boost_count >= Number(game.config[2].value)
    ) {
      toast.error(
        `You already used ${game.config[2].value} Stars for this session`,
        { id: TOAST_IDS.ALREADY_USED }
      );
      return;
    }

    useCatiaStore.setState({
      useBoostModal: true,
    });
  }

  if (!game && sessionLoading) return <Loading />;

  return (
    <main className="h-screen relative">
      <ScrollArea className="h-screen">
        <Container>
          <div className="flex w-full flex-col gap-4 py-5">
            <div className="flex w-full flex-col gap-2.5 py-3">
              <div className="flex flex-row items-start justify-between gap-3">
                <div className="flex flex-row gap-3">
                  <img
                    src={game?.logo}
                    alt=""
                    className="h-[52px] w-[52px] rounded-full flex-none"
                  />
                  <div className="tabular-nums">
                    <h1 className="flex flex-wrap text-xl font-semibold capitalize">
                      {game?.name}
                    </h1>
                    {timeCountdown.includes(t("quiz_end_in", { value: "" })) ? (
                      <div className="mt-1 flex items-center gap-2.5 text-xs font-semibold tabular-nums">
                        {t("quiz_end_in", { value: "" })}
                        <p className="flex items-center gap-0.5 text-xs text-primary">
                          <span className="min-w-7 h-7 flex items-center justify-center rounded-md border border-primary p-1 font-extrabold shadow-[inset_0_0_1px] shadow-primary">
                            {gameEndCountdown?.split(" ")[0]}
                          </span>
                          <span className="font-black text-foreground">:</span>
                          <span className="min-w-7 h-7 flex items-center justify-center rounded-md border border-primary p-1 font-extrabold shadow-[inset_0_0_1px] shadow-primary">
                            {gameEndCountdown?.split(" ")[1]}
                          </span>
                          <span className="font-black text-foreground">:</span>
                          <span className="min-w-7 h-7 flex items-center justify-center rounded-md border border-primary p-1 font-extrabold shadow-[inset_0_0_1px] shadow-primary">
                            {gameEndCountdown?.split(" ")[2]}
                          </span>
                        </p>
                      </div>
                    ) : timeCountdown.includes(
                        t("quiz_start_in", { value: "" })
                      ) ? (
                      <div className="mt-1 flex items-center gap-2.5 text-xs font-semibold tabular-nums">
                        {t("quiz_start_in", { value: "" })}
                        <p className="flex items-center gap-0.5 text-xs text-primary">
                          <span className="min-w-7 h-7 flex items-center justify-center rounded-md border border-primary p-1 font-extrabold shadow-[inset_0_0_1px] shadow-primary">
                            {gameStartCountdown?.split(" ")[0]}
                          </span>
                          <span className="font-black text-foreground">:</span>
                          <span className="min-w-7 h-7 flex items-center justify-center rounded-md border border-primary p-1 font-extrabold shadow-[inset_0_0_1px] shadow-primary">
                            {gameStartCountdown?.split(" ")[1]}
                          </span>
                          <span className="font-black text-foreground">:</span>
                          <span className="min-w-7 h-7 flex items-center justify-center rounded-md border border-primary p-1 font-extrabold shadow-[inset_0_0_1px] shadow-primary">
                            {gameStartCountdown?.split(" ")[2]}
                          </span>
                        </p>
                      </div>
                    ) : (
                      <div className="mt-1 text-xs font-semibold">
                        {timeCountdown}
                      </div>
                    )}
                  </div>
                </div>
                {(game?.start_time || game?.end_time) && game?.is_public && (
                  <button
                    type="button"
                    className="w-9 h-9 flex items-center justify-center bg-[#344A53] rounded-full"
                    onClick={() => navigate(`/game/${game?.slug}/leaderboard`)}
                  >
                    <LeaderboardIcon />
                  </button>
                )}
              </div>
              <p className="text-gameDescription text-15 font-medium tracking-wide">
                {game?.description}
              </p>
            </div>
            {game?.social_links && game.social_links.length > 0 && (
              <div className="flex flex-row items-center justify-end gap-2">
                {game.social_links.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className={`bg-gameDetail flex flex-row items-center justify-center rounded-lg border border-primary p-2.5 shadow-[inset_0_0_1px] shadow-primary ${
                      item.joined ? "opacity-80" : ""
                    }`}
                    onClick={() => {
                      setLink(item.id);
                      // item.link_type.includes("telegram")
                      //   ? utils.openTelegramLink(item.ref_url || item.url)
                      //   : utils.openLink(item.ref_url || item.url);
                      window.open(item.ref_url || item.url);
                    }}
                  >
                    {item.link_type.includes("telegram") ? (
                      <TelegramIcon />
                    ) : item.link_type.includes("twitter") ? (
                      <TwitterIcon />
                    ) : item.link_type.includes("youtube") ? (
                      <YoutubeIcon />
                    ) : (
                      <WebIcon />
                    )}
                  </button>
                ))}
              </div>
            )}
            <div className="flex w-full flex-col gap-4 rounded-2xl bg-bgFreebies p-5">
              <div className="flex flex-col items-start gap-3">
                <p className="text-xl font-semibold capitalize tracking-wide">
                  {t("level")}:{" "}
                  {game?.difficulty ? t(game?.difficulty) : game?.difficulty}
                </p>
                <div className="w-full grid grid-cols-3 gap-3 font-semibold">
                  <div className="h-11 flex items-center justify-center gap-1.5 bg-gameDetail rounded-lg border border-primary shadow-[inset_0_0_1px] shadow-primary">
                    <QuestionIcon />
                    {(game?.questions?.length || 0) - 1}
                  </div>
                  <div className="h-11 flex items-center justify-center gap-1.5 bg-gameDetail rounded-lg border border-primary shadow-[inset_0_0_1px] shadow-primary">
                    <DiamondIcon />
                    {game?.questions?.[game.questions.length - 2]?.score}
                  </div>
                  <div className="h-11 flex items-center justify-center gap-1.5 bg-gameDetail rounded-lg border border-primary shadow-[inset_0_0_1px] shadow-primary">
                    <HourglassIcon />
                    {convertMinutesToTimeTextShort(
                      Number(game?.config?.[1]?.value)
                    )}
                  </div>
                </div>
              </div>
              {game?.bonus_privilege && (
                <div className="flex gap-1 items-start p-2 bg-gameDetail rounded-lg border border-black">
                  <BonusIcon />
                  <Markdown className="flex flex-col gap-1 text-15 leading-[18px] tracking-wide pt-0.5">
                    {game.bonus_privilege}
                  </Markdown>
                </div>
              )}
              {errorSession?.cause === "game not started yet" && (
                <strong>Game has not started yet!</strong>
              )}
              {errorSession?.cause === "game ended" && (
                <strong>{i18n.t("quiz:game_has_ended")}</strong>
              )}
              {session && userGame?.countdown && sessionCountdown && (
                <div className="px-3 py-1.5 rounded-lg flex gap-2.5 items-center justify-center bg-[#344A53] tabular-nums">
                  <span className="font-semibold tracking-wide">
                    {t("next_quiz")}:
                  </span>
                  <p className="flex items-center gap-0.5 text-xs text-primary">
                    <span className="min-w-7 h-7 flex items-center justify-center rounded-md border border-primary p-1 font-extrabold shadow-[inset_0_0_1px] shadow-primary">
                      {sessionCountdown?.split(" ")[0]}
                    </span>
                    <span className="font-black text-foreground">:</span>
                    <span className="min-w-7 h-7 flex items-center justify-center rounded-md border border-primary p-1 font-extrabold shadow-[inset_0_0_1px] shadow-primary">
                      {sessionCountdown?.split(" ")[1]}
                    </span>
                    <span className="font-black text-foreground">:</span>
                    <span className="min-w-7 h-7 flex items-center justify-center rounded-md border border-primary p-1 font-extrabold shadow-[inset_0_0_1px] shadow-primary">
                      {sessionCountdown?.split(" ")[2]}
                    </span>
                  </p>
                  {/* <p className="bg-session flex flex-row items-center justify-between rounded-md border border-primary p-3 py-2 text-base">
                    <span className="font-extrabold text-primary tabular-nums">
                      {sessionCountdown || "..."}
                    </span>
                  </p> */}
                </div>
              )}
            </div>
            {session && (
              <div>
                {userGame?.countdown && !sessionCountdown ? (
                  <button
                    type="button"
                    onClick={startQuiz}
                    className="text-15 w-full rounded-lg border border-primary bg-primary px-8 py-2 font-semibold uppercase text-white opacity-100 hover:bg-primary/80"
                  >
                    <span className="font-medium">
                      {session?.next_step === 0 ? t("play") : t("continue")}
                    </span>
                  </button>
                ) : (
                  <div className="flex items-center gap-5">
                    <Button
                      type="button"
                      disabled={!user?.boosts || user.boosts <= 0}
                      className="text-15 flex-1 col-span-2 flex flex-col items-center rounded-lg bg-primary px-8 font-medium text-white hover:bg-primary/80"
                      onClick={onClickUseBoost}
                    >
                      <span className="text-15">{t("speed_up")}</span>
                      <span className="flex items-center text-15">
                        1&nbsp;
                        <StarLifeLine />
                        &nbsp;={" "}
                        {t(
                          getSpeedUpTime(Number(game?.config?.[3].value || "0"))
                        )}
                      </span>
                    </Button>
                    <p className="pr-3 text-15 col-span-1 flex flex-col items-start justify-start font-medium text-freebies">
                      <span className="flex items-center">
                        {t("invite_left")}{" "}
                        {user && user.boosts >= 0 ? user.boosts : "-"}
                        &nbsp;
                        <StarLifeLine />
                      </span>
                      <span
                        className="cursor-pointer underline"
                        onClick={() => setInviteDialogOpen(true)}
                      >
                        {t("invite_right")}
                      </span>
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
          <InviteFriendDialog
            open={inviteDialogOpen}
            onOpenChange={setInviteDialogOpen}
            user={user}
          />
          <Dialog
            open={useBoostModal}
            onOpenChange={(v) => {
              useCatiaStore.setState({
                useBoostModal: v,
              });
            }}
          >
            <DialogContent className="w-[85%] rounded-2xl shadow-lg bg-gameDetail text-foreground p-7 flex flex-col gap-5">
              <DialogHeader className="flex flex-row items-center justify-between">
                <p className="font-semibold text-28 text-freebies">
                  {t("exchange")}
                </p>
                {/* <button
              type="button"
              onClick={() => useCatiaStore.setState({ useBoostModal: false })}
            >
              <Close />
            </button> */}
              </DialogHeader>
              <div className="flex flex-col gap-6 items-start">
                <p className="text-lg font-semibold text-white">
                  Exchange stars for other assets
                </p>
                <p className="flex items-center justify-start gap-2">
                  <span className="flex items-center justify-center gap-1">
                    1<StarLifeLine />
                  </span>
                  <span>=</span>
                  <span>
                    {t("quiz:minutes", { value: game?.config?.[3].value })}
                  </span>
                </p>
              </div>
              <p className="flex flex-row items-center gap-2.5">
                <span>{t("stars")}:</span>
                <span className="flex items-center gap-2">
                  {user && user.boosts >= 0 ? user.boosts : "-"}{" "}
                  <StarLifeLine />
                </span>
              </p>
              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  className="rounded-lg opacity-100 bg-primary px-8 py-2 text-white capitalize font-medium text-15 w-full border border-primary hover:bg-primary/80"
                  onClick={() => onGameBoost()}
                >
                  {t("speed_up")}
                </button>
                <button
                  type="button"
                  className="rounded-lg opacity-100 px-8 py-2 text-primary bg-[#0f0f0f] capitalize font-medium text-15 w-full border border-primary"
                  onClick={() => setInviteDialogOpen(true)}
                >
                  {t("invite_btn")}
                </button>
              </div>
            </DialogContent>
          </Dialog>
        </Container>
      </ScrollArea>
    </main>
  );
}
