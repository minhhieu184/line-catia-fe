import { ArrowRightIcon } from "@/assets/CatiarenaPage/SVGs";
import QuizDetailDialog from "@/components/Dialogs/QuizDetailDialog";
import useNowContext from "@/components/Providers/NowProvider/useNowContext";
import SpeedUpSheet from "@/components/Sheets/SpeedUpSheet";
import BonusIcon from "@/components/icons/BonusIcon";
import DiamondIcon from "@/components/icons/DiamondIcon";
import { Button } from "@/components/ui/button";
import { CATIA_LOGO_WITH_BG_URL } from "@/lib/constants";
import { useGameMe } from "@/lib/swr";
import { TOAST_IDS } from "@/lib/toast";
import useCatiaStore from "@/lib/useCatiaStore";
import { formatCountdownText } from "@/lib/utils";
import type { GameDetail } from "@/types/app";
import clsx from "clsx";
import { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const ArenaQuiz = ({
  tasksDone,
  game,
  isArenaActive,
}: {
  tasksDone: boolean;
  game: GameDetail;
  isArenaActive: boolean;
}) => {
  const { t } = useTranslation("arenas");
  const setGame = useCatiaStore((state) => state.setGame);

  useEffect(() => {
    setGame(game);
  });

  return (
    <div className="mt-3 p-3 rounded-3.5xl bg-gradient-to-r from-[#354A57] to-[#292E49]">
      <h4 className="text-2xl font-semibold">{t("quiz")}</h4>
      <div className="mt-2.5">
        <QuizzItem
          game={game}
          tasksDone={tasksDone}
          isArenaActive={isArenaActive}
        />
      </div>
    </div>
  );
};

export default ArenaQuiz;

const QuizzItem = ({
  game,
  tasksDone,
  isArenaActive,
}: {
  game: GameDetail;
  tasksDone: boolean;
  isArenaActive: boolean;
}) => {
  const navigate = useNavigate();
  const { t } = useTranslation("arenas");
  const { now } = useNowContext();
  const { data: userGame } = useGameMe(!isArenaActive);
  const setGame = useCatiaStore((state) => state.setGame);
  const speedUpSheetOpen = useCatiaStore((state) => state.speedUpSheetOpen);
  const setSpeedUpSheetOpen = useCatiaStore(
    (state) => state.setSpeedUpSheetOpen
  );
  const quizDetailDialog = useCatiaStore((state) => state.quizDetailDialog);
  const setQuizDetailDialog = useCatiaStore(
    (state) => state.setQuizDetailDialog
  );

  const sessionCountdown = useMemo(() => {
    return formatCountdownText(now, userGame?.countdown, true);
  }, [now, userGame?.countdown]);

  return (
    <>
      <div
        className={clsx(
          "relative flex flex-row px-4 py-2.5 gap-4 rounded-3.5xl items-center justify-between",
          isArenaActive && tasksDone && !sessionCountdown
            ? "cursor-pointer bg-[#091428]"
            : "bg-[#091428]/50"
        )}
        onClick={() => {
          if (!tasksDone && isArenaActive) {
            toast.info(t("complete_tasks_to_play_quiz_toast"), {
              id: TOAST_IDS.TASKS_NOT_COMPLETED,
            });
            return;
          }
          if (isArenaActive && !sessionCountdown) {
            setGame(game);
            setQuizDetailDialog(true);
          }
        }}
      >
        <div
          className={clsx(
            "flex flex-row gap-3 items-center",
            (!isArenaActive || !tasksDone || sessionCountdown) && "opacity-50"
          )}
        >
          <img
            src={game?.logo || CATIA_LOGO_WITH_BG_URL}
            alt="logo"
            className="w-11 h-11 rounded-full flex-none"
          />
          <div className="flex flex-col gap-0.5 items-start">
            <p className="text-xl font-semibold">{game?.name}</p>
            <span className="flex items-center gap-1 text-xl font-semibold">
              <DiamondIcon />
              {game?.questions?.[game.questions.length - 2]?.score}
              {game?.bonus_privilege && (
                <>
                  <span>+</span>
                  <BonusIcon />
                </>
              )}
            </span>
          </div>
        </div>
        <div className="relative z-10 flex flex-col items-center justify-center gap-1">
          {isArenaActive && sessionCountdown ? (
            <>
              <span className="font-semibold leading-[18px] tabular-nums">
                {sessionCountdown}
              </span>
              <SpeedUpSheet
                isOpen={speedUpSheetOpen}
                setIsOpen={setSpeedUpSheetOpen}
              >
                <Button size="sm" className="h-7 rounded-lg">
                  {t("speed_up")}
                </Button>
              </SpeedUpSheet>
            </>
          ) : (
            <div
              className={clsx(
                (!isArenaActive || !tasksDone || sessionCountdown) &&
                  "opacity-50"
              )}
            >
              <ArrowRightIcon />
            </div>
          )}
        </div>
      </div>

      <QuizDetailDialog
        isOpen={quizDetailDialog}
        setIsOpen={setQuizDetailDialog}
        onPlay={() => {
          if (!tasksDone && isArenaActive) {
            toast.info(t("complete_tasks_to_play_quiz_toast"), {
              id: TOAST_IDS.TASKS_NOT_COMPLETED,
            });
            return;
          }
          if (isArenaActive && !sessionCountdown) {
            setQuizDetailDialog(false);
            navigate(`/quiz/${game?.slug}`);
          }
        }}
      />
    </>
  );
};
