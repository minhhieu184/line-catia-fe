import { BonusIcon, HourglassIcon, QuestionIcon } from "@/assets/QuizPage/SVGs";
import DiamondIcon from "@/components/icons/DiamondIcon";
import TelegramIcon from "@/components/icons/socials/TelegramIcon";
import TwitterIcon from "@/components/icons/socials/TwitterIcon";
import WebIcon from "@/components/icons/socials/WebIcon";
import YoutubeIcon from "@/components/icons/socials/YoutubeIcon";
import useCatiaStore from "@/lib/useCatiaStore";
import { convertMinutesToTimeTextShort } from "@/lib/utils";
import { useUtils } from "@telegram-apps/sdk-react";
import { useTranslation } from "react-i18next";
import Markdown from "react-markdown";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogTitle } from "../ui/dialog";
import { GradientText } from "../ui/gradient-text";

const QuizDetailDialog = ({
  isOpen,
  setIsOpen,
  onPlay,
}: {
  isOpen: boolean;
  setIsOpen: (state: boolean) => void;
  onPlay: () => void;
}) => {
  const utils = useUtils();
  const { t } = useTranslation("quiz");

  const game = useCatiaStore((state) => state.game);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent hideCloseButton className="py-6 px-4 xs:p-7">
        <DialogTitle hidden />
        <div className="w-full flex flex-col gap-5">
          <div className="flex w-full flex-col gap-2.5">
            <div className="flex flex-row items-start justify-between gap-3">
              <div className="flex flex-row gap-3">
                <img
                  src={game?.logo}
                  alt=""
                  className="h-[52px] w-[52px] rounded-full flex-none"
                />
                <div className="tabular-nums">
                  <h1 className="flex flex-wrap text-xl font-semibold capitalize tracking-wide">
                    {game?.name}
                  </h1>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
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
                      item.link_type.includes("telegram")
                        ? utils.openTelegramLink(item.ref_url || item.url)
                        : utils.openLink(item.ref_url || item.url);
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

            <div className="flex w-full flex-col gap-4 rounded-2xl bg-background p-4 xs:p-5">
              <div className="flex flex-col items-start gap-3">
                <p className="text-xl font-semibold capitalize tracking-wide">
                  {t("level")}:{" "}
                  {game?.difficulty ? t(game?.difficulty) : game?.difficulty}
                </p>
                <div className="w-full grid grid-cols-3 gap-2 xs:gap-3 font-semibold">
                  <div className="h-11 flex items-center justify-center gap-1.5 rounded-lg bg-[#303E51]">
                    <QuestionIcon />
                    {(game?.questions?.length || 0) - 1}
                  </div>
                  <div className="h-11 flex items-center justify-center gap-1.5 rounded-lg bg-[#303E51]">
                    <DiamondIcon />
                    {game?.questions?.[game.questions.length - 2]?.score}
                  </div>
                  <div className="h-11 flex items-center justify-center gap-1.5 rounded-lg bg-[#303E51]">
                    <HourglassIcon />
                    {convertMinutesToTimeTextShort(
                      Number(game?.config?.[1]?.value)
                    )}
                  </div>
                </div>
              </div>
              {game?.bonus_privilege && (
                <div className="flex gap-1 items-start p-2 bg-[#303E51] rounded-lg">
                  <BonusIcon />
                  <Markdown className="flex flex-col gap-1 text-15 leading-[18px] tracking-wide pt-0.5">
                    {game.bonus_privilege}
                  </Markdown>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <Button size="sm" className="w-full uppercase" onClick={onPlay}>
              {t("play")}
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="w-full bg-[#0F0F0F]"
              onClick={() => setIsOpen(false)}
            >
              <GradientText>{t("close")}</GradientText>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QuizDetailDialog;
