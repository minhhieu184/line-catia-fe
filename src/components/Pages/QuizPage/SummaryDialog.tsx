import { LeaderboardIcon } from "@/assets/CatiarenaPage/SVGs";
import {
  CursorIcon,
  DiamondIcon,
  HomeIcon,
  SummaryDialogSvg,
} from "@/assets/QuizPage/SVGs";
import { LogoIcon } from "@/components/Logo/Logo";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { GradientText } from "@/components/ui/gradient-text";
import { useMe } from "@/lib/swr";
import useCatiaStore from "@/lib/useCatiaStore";
import { capitalizeAndReplaceUnderscore } from "@/lib/utils";
import type { Session } from "@/types/app";
import { LoaderCircle } from "lucide-react";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { useTaskList } from "../TaskPage/useTaskList";

const SummaryDialog = ({
  open,
  setOpen,
  session,
  correctAnswersCount,
}: {
  open: boolean;
  setOpen: (v: boolean) => void;
  session: Session;
  correctAnswersCount: number;
}) => {
  const navigate = useNavigate();
  const game = useCatiaStore((state) => state.game);
  const arena = useCatiaStore((state) => state.arena);
  const setTaskListSheetOpen = useCatiaStore(
    (state) => state.setTaskListSheetOpen
  );
  const { t } = useTranslation("quiz");
  const { data: me } = useMe();
  const [{ data: taskGroups, isLoading: scoreLoading }] = useTaskList(!me);

  const undone = useMemo(() => {
    const taskGroupOfQuiz = taskGroups.find(
      (group) => group.game_slug === game?.slug
    );
    if (taskGroupOfQuiz) {
      const undoneTasks = taskGroupOfQuiz.links.filter((task) => !task.joined);
      if (undoneTasks.length > 0) {
        return { group: taskGroupOfQuiz, count: undoneTasks.length };
      }
    }
  }, [taskGroups, game?.slug]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent
        onInteractOutside={(e) => {
          e.preventDefault();
        }}
        hideCloseButton
        className="bg-transparent p-0 shadow-none"
      >
        <div>
          <div className="rounded-xl bg-grayGradient px-4 py-7">
            <div className="flex items-center justify-center">
              <SummaryDialogSvg />
            </div>
            <div className="mt-5 text-center font-semibold">
              {t("result_desc")} {correctAnswersCount}/
              {(game?.questions?.length || 1) - 1} {t("questions")}
            </div>
            <div className="mt-7 space-y-2.5 rounded-xl bg-background py-3.5">
              {scoreLoading ? (
                <LoaderCircle className="animate-spin" />
              ) : (
                <div className="grid grid-cols-2 gap-5">
                  <div className="flex items-center justify-end">
                    <DiamondIcon className="h-7 w-7" />
                  </div>
                  <div className="flex items-center justify-start font-semibold tracking-wider">
                    +{session.score || 0}
                  </div>
                </div>
              )}

              {/* <div className="grid grid-cols-2 gap-5">
              <div className="flex items-center justify-end">
                <PowerIcon />
              </div>
              <div className="flex items-center justify-start font-semibold tracking-wider">
                +{sessionScore}
              </div>
            </div> */}
            </div>
          </div>
          {undone && game?.is_public && (
            <>
              <div className="mt-5 px-5 font-medium">
                <span className="inline-block mr-1 translate-y-0.5">
                  <CursorIcon />
                </span>
                {t("wrong_answer")}
              </div>
              <div
                className="rounded-xl cursor-pointer flex items-center justify-between bg-grayGradient px-4 py-5 mt-3"
                onClick={() => {
                  setTaskListSheetOpen(true);
                  navigate(`/tasks?group=${undone.group.game_slug}`, {
                    replace: true,
                  });
                }}
              >
                <div className="flex gap-3">
                  {undone.group.logo ? (
                    <img
                      className="w-11 h-11 object-fill rounded-full"
                      src={undone.group.logo}
                      alt="Catia logo"
                    />
                  ) : (
                    <div className="w-11 h-11 flex items-center justify-center rounded-full bg-background">
                      <LogoIcon />
                    </div>
                  )}
                  <div className="flex flex-col flex- gap-1">
                    <p className="text-xl font-semibold">
                      {undone.group.title ||
                        capitalizeAndReplaceUnderscore(undone.group.game_slug)}
                    </p>
                    <p className="text-xs font-semibold">
                      {undone.group.links.length > 1 ? t("tasks") : t("task")}
                    </p>
                  </div>
                </div>
                <div className="flex w-7 h-7 justify-center items-center rounded-full border-2 border-white bg-gradient-to-r to-primary via-[#0DC9EB] from-[#00E3D0] text-sm">
                  {undone.count}
                </div>
              </div>
            </>
          )}
          {game?.is_public ? (
            <div className="flex flex-row items-center justify-center gap-3 mt-5">
              <Button
                size="sm"
                variant="outline"
                className="flex-none bg-transparent border-white text-white p-2 rounded-lg"
                onClick={() => {
                  setOpen(false);
                  navigate(-3);
                }}
              >
                <HomeIcon />
              </Button>
              <div className=" w-full flex flex-row items-center gap-3">
                <Button
                  size="sm"
                  variant="outline"
                  className="bg-background p-2 flex-1"
                  onClick={() => {
                    setOpen(false);
                    navigate(-1);
                  }}
                >
                  <GradientText>{t("play_again_btn")}</GradientText>
                </Button>
                <Button
                  size="sm"
                  className="text-white p-2 flex-1"
                  onClick={() => {
                    setOpen(false);
                    navigate(-2);
                  }}
                >
                  {t("play_another_btn")}
                </Button>
              </div>
            </div>
          ) : (
            <div className="mt-5 w-full flex flex-row items-center gap-3">
              <Button
                size="sm"
                variant="outline"
                className="bg-background p-2 flex-1 gap-2.5"
                onClick={() => {
                  setOpen(false);
                  if (arena?.slug) {
                    navigate(`/catiarena/${arena?.slug}/leaderboard`, {
                      replace: true,
                    });
                  } else {
                    navigate(-1);
                  }
                }}
              >
                <LeaderboardIcon className="w-[18px] h-[18px]" />
                <GradientText>{t("leaderboard")}</GradientText>
              </Button>
              <Button
                size="sm"
                className="flex-1 p-2"
                onClick={() => {
                  setOpen(false);
                  navigate(-2);
                }}
              >
                {t("back_to")} Catiarena
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SummaryDialog;
