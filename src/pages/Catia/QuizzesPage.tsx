import { DiamondIcon } from "@/assets/QuizPage/SVGs";
import Container from "@/components/Layout/Container";
import { useGameCountDown } from "@/components/SessionCountdown";
import BonusIcon from "@/components/icons/BonusIcon";
import { GradientText } from "@/components/ui/gradient-text";
import { useCheckGamesList, useGamesList, useMe } from "@/lib/swr";
import useCatiaStore from "@/lib/useCatiaStore";
import { getCountdownText, getTimeDifference } from "@/lib/utils";
import type { GameDetail } from "@/types/app";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
// import { TOAST_IDS } from "@/lib/toast.ts";
// import i18n from "i18next";
// import { toast } from "sonner";

export default function QuizzesPage() {
  const { data: pools } = useGamesList();
  const { t } = useTranslation("quiz");

  return (
    <Container>
      <div className="flex flex-col items-start py-3 gap-5 w-full">
        <div className="flex flex-col gap-1 items-start font-semibold">
          <h2 className="text-5xl capitalize">{t("quizzes")}</h2>
          <p className="text-base tracking-wide">{t("quizzes_desc")}</p>
        </div>
        <div className="flex flex-col gap-3 w-full">
          {pools?.map((pool) => (
            <QuizzItem key={pool.slug} pool={pool} />
          ))}
          {/*<div*/}
          {/*  className="relative cursor-pointer"*/}
          {/*  onClick={() => {*/}
          {/*    toast.info(i18n.t("common:warn_toast"), {*/}
          {/*      id: TOAST_IDS.COMING_SOON,*/}
          {/*    });*/}
          {/*  }}*/}
          {/*>*/}
          {/*  <img src="/catiarena-bg.png" alt="catiarena-bg" />*/}
          {/*  <div className="absolute top-0 left-0 px-10 py-[34px] w-full">*/}
          {/*    <p className="text-xs font-semibold">{t("explore")}</p>*/}
          {/*    <h4 className="text-[28px] font-semibold">Catiarena</h4>*/}
          {/*  </div>*/}
          {/*</div>*/}
        </div>
      </div>
    </Container>
  );
}

function QuizzItem({ pool }: { pool: GameDetail }) {
  const navigate = useNavigate();
  const { t } = useTranslation("quiz");
  const setGame = useCatiaStore((state) => state.setGame);
  const { data: me } = useMe();
  const { data: games } = useCheckGamesList(!me);

  const unDoneQuiz = useMemo(() => {
    if (!games) return false;
    const game = games?.find((game) => game.game_slug === pool.slug);
    if (game) {
      return !getTimeDifference(game?.countdown);
    }
    return false;
  }, [games, pool]);
  const { gameCountdown: gameStartCountdown } = useGameCountDown({
    duration: pool.start_time,
  });
  const { gameCountdown: gameEndCountdown } = useGameCountDown({
    duration: pool.end_time,
  });

  return (
    <div
      className={`relative flex flex-row p-4 gap-4 rounded-3.5xl bg-bgFreebies items-center justify-between ${
        (pool.start_time && !gameStartCountdown) || !pool.start_time
          ? "cursor-pointer"
          : "opacity-70"
      }`}
      onClick={() => {
        if ((pool.start_time && !gameStartCountdown) || !pool.start_time) {
          setGame(pool);
          navigate(`/${pool?.slug}`);
        }
      }}
    >
      {unDoneQuiz && (!pool.end_time || !!gameEndCountdown) && (
        <div className="absolute right-0 top-0 w-[12px] h-[12px] bg-[#F73131] rounded-full" />
      )}
      <div
        className={`flex flex-row gap-3 items-center ${
          pool.end_time && !gameEndCountdown ? "opacity-50" : ""
        }`}
      >
        <img
          src={pool?.logo}
          alt=""
          className="w-11 h-11 rounded-md flex-none"
        />
        <div className={`flex flex-col gap-1 items-start`}>
          <p
            className={`text-xl font-semibold text-freebies ${
              pool.end_time && !gameEndCountdown ? "opacity-50" : ""
            }`}
          >
            {pool?.name}
          </p>
          <p
            className={`text-xs font-medium text-[#F0F2FA] ${
              pool.end_time && !gameEndCountdown ? "opacity-50" : ""
            }`}
          >
            {t(
              getCountdownText(
                gameStartCountdown || "",
                gameEndCountdown || "",
                pool.start_time,
                pool.end_time
              )
            )}
          </p>
        </div>
      </div>
      <div
        className={`flex flex-col items-center justify-center gap-1 ${
          pool.end_time && !gameEndCountdown ? "opacity-50" : ""
        }`}
      >
        <span
          className={`flex items-center text-countdown ${
            pool.end_time && !gameEndCountdown ? "opacity-50" : ""
          }`}
        >
          <DiamondIcon />
          &nbsp;
          {pool?.questions?.[pool.questions.length - 2]?.score}
          {pool?.bonus_privilege && (
            <span className="flex items-center gap-1 ms-1">
              + <BonusIcon />
            </span>
          )}
        </span>
        <span
          className={`w-28 text-xs rounded-md capitalize font-medium text-center py-1 bg-background border border-primary shadow-[inset_0_0_1px] shadow-primary ${
            pool.end_time && !gameEndCountdown ? "opacity-50" : ""
          }`}
        >
          <GradientText>{t(pool?.difficulty)}</GradientText>
        </span>
      </div>
    </div>
  );
}
