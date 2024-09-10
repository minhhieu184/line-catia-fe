import {
  CopyIcon,
  DiamondIcon,
  DiamondIconAlt,
  FortuneWheel,
  IdeaIcon,
} from "@/assets/QuizPage/SVGs";
import { Button } from "@/components/ui/button";
import { CopyToClipBoard } from "@/components/ui/copy-to-clipboard";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CATIA_GLOBAL_CHAT_URL } from "@/lib/constants";
import { TOAST_IDS } from "@/lib/toast";
import useCatiaStore from "@/lib/useCatiaStore";
import type { GameDetail, Question, Session } from "@/types/app";
import { useUtils } from "@telegram-apps/sdk-react";
import type { PropsWithChildren } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

const getCopyContent = (data?: Question, lang?: string) => {
  const langData =
    lang !== "en" &&
    data?.translations?.find(
      (translation) => translation.language_code === lang
    )
      ? data?.translations?.find(
          (translation) => translation.language_code === lang
        )
      : data;

  if (!langData?.question) return "";

  const question = langData?.question;

  if (!langData?.choices) return question;

  const choices = langData?.choices?.map((choice, index) => {
    const choiceLetter = String.fromCharCode(index + "A".charCodeAt(0));
    return `${choiceLetter}. ${choice.content}\n`;
  });

  return `${question}\n\n${choices.join("")}`;
};

const ProgressDialog = ({
  game,
  session,
  children,
  lang,
}: {
  game: GameDetail | undefined;
  session: Session;
  lang: string;
} & PropsWithChildren) => {
  const { t } = useTranslation("quiz");
  const utils = useUtils();
  const quizProgressDialogOpen = useCatiaStore(
    (state) => state.quizProgressDialogOpen
  );
  const setQuizProgressDialogOpen = useCatiaStore(
    (state) => state.setQuizProgressDialogOpen
  );

  return (
    <Dialog
      open={quizProgressDialogOpen}
      onOpenChange={setQuizProgressDialogOpen}
    >
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="px-3 pb-8 pt-4">
        <DialogHeader>
          <DialogTitle className="text-left text-2xl tracking-wide">
            {t("progress")}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-5">
          <div className="flex flex-col-reverse items-center rounded-2xl border border-primary bg-background py-2">
            {game?.questions.map((question, index) => (
              <div className="relative w-full" key={`question-${index + 1}`}>
                {session?.next_step === index + 1 && (
                  <div className="absolute inset-0">
                    <div className="absolute top-1/2 h-1 w-full -translate-y-1/2 bg-gradient-to-r from-[#00E3D0] via-[#0DC9EB] to-primary" />
                    <div className="absolute inset-x-5 inset-y-0 rounded-full bg-gradient-to-r from-[#00E3D0] via-[#0DC9EB] to-primary">
                      <div className="absolute inset-0.5 bg-[#116589] rounded-full" />
                    </div>
                  </div>
                )}
                <div className="relative flex h-8 w-full items-center justify-center">
                  <div className="w-[47%] text-right">{index + 1}</div>
                  <div className="px-2">-</div>
                  <div className="flex w-[53%] items-center justify-start gap-1">
                    {question.extra ? (
                      <FortuneWheel />
                    ) : (
                      <>
                        {session?.next_step === index + 1 ? (
                          <DiamondIconAlt />
                        ) : (
                          <DiamondIcon />
                        )}
                        {question.score || 0}
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-start gap-2">
            <div className="inline-flex items-center gap-1">
              <IdeaIcon />
            </div>
            <div className="font-medium tracking-wider">
              {t("progress_desc_left")}{" "}
              <span
                className="text-primary underline cursor-pointer"
                onClick={() => utils.openTelegramLink(CATIA_GLOBAL_CHAT_URL)}
              >
                {t("progress_catia")}
              </span>{" "}
              {t("progress_desc_right")}
            </div>
          </div>
          <CopyToClipBoard
            text={getCopyContent(session.current_question, lang)}
            onCopy={() =>
              toast.success(t("question_copied_toast"), {
                id: TOAST_IDS.COPIED,
              })
            }
          >
            <Button size="sm" className="w-full gap-1.5 text-foreground">
              <CopyIcon />
              {t("copy_btn")}
            </Button>
          </CopyToClipBoard>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProgressDialog;
