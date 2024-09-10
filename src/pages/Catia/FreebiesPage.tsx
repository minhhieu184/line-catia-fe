import { DiamondIcon } from "@/assets/QuizPage/SVGs";
import Container from "@/components/Layout/Container";
import MessageLog from "@/components/Pages/Freebies/MessageLog.tsx";
import useNowContext from "@/components/Providers/NowProvider/useNowContext";
import StarLifeLine from "@/components/icons/StarLifeline";
import Diamond from "@/components/icons/freebies/DiamondIcon";
import HeartIcon from "@/components/icons/freebies/HeartIcon";
import LifelineClaim from "@/components/icons/freebies/LifelineClaim";
import StarIconReward from "@/components/icons/freebies/StarIcon";
import { Button } from "@/components/ui/button";
import Spinner from "@/components/ui/spinner";
import { CATIA_ANNOUCEMENT_URL } from "@/lib/constants";
import { useFreebiesClaim, useGameFreebies, useMe } from "@/lib/swr";
import useCatiaStore from "@/lib/useCatiaStore";
import {
  convertMinutesToTimeText,
  formatCountdownText,
  getTimeDifference,
} from "@/lib/utils";
import type { Freebies } from "@/types/app";
import { useUtils } from "@telegram-apps/sdk-react";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

export default function FreebiesPage() {
  const { t } = useTranslation("freebies");
  const utils = useUtils();
  const isFirstTime = useMemo(
    () => localStorage.getItem("running_tutorial"),
    []
  );
  const { data: me, mutate: mutateUser } = useMe();
  const {
    data: freebies,
    message: news,
    isLoading: loading,
    mutate: mutateFreebies,
  } = useGameFreebies(!me);
  const { now } = useNowContext();
  const newsId = useCatiaStore((state) => state.newsId);
  const setNewsId = useCatiaStore((state) => state.setNewsId);
  const newsLastCheckedTime = useCatiaStore(
    (state) => state.newsLastCheckedTime
  );
  const setNewsLastCheckedTime = useCatiaStore(
    (state) => state.setNewsLastCheckedTime
  );
  const [stepMessage, setStepMessage] = useState(1);
  useEffect(() => {
    if (
      freebies?.every(
        (item) => item?.countdown && getTimeDifference(item?.countdown)
      )
    ) {
      setStepMessage(3);
    } else if (
      freebies?.some(
        (item) => item?.countdown && getTimeDifference(item?.countdown)
      )
    ) {
      setStepMessage(2);
    } else {
      setStepMessage(1);
    }
  }, [freebies]);

  useEffect(() => {
    localStorage.removeItem("running_tutorial");
  }, []);

  const checkNewsRequired = useMemo(() => {
    if (!news) return null;
    if (isFirstTime) return null;
    if (
      typeof newsId === "undefined" ||
      newsId < news.id ||
      (newsLastCheckedTime &&
        new Date(now).getTime() <
          new Date(newsLastCheckedTime).getTime() + 3000)
    )
      return news.freebie_name || "freebie-gem";
    return null;
  }, [news, now, newsId, isFirstTime, newsLastCheckedTime]);

  const onCheckNews = () => {
    utils.openTelegramLink(CATIA_ANNOUCEMENT_URL);
    newsId !== news?.id && setNewsLastCheckedTime(new Date());
    setNewsId(news?.id);
  };

  if (loading) return;

  return (
    <Container>
      <div className="flex flex-col items-start gap-5 w-full py-3">
        <h2 className="text-5xl font-semibold">{t("freebies")}</h2>
        <div className="flex flex-col gap-3 w-full">
          <FreeItem
            item={freebies?.find((freebie) => freebie.name === "freebie-gem")}
            mutateFreebies={mutateFreebies}
            mutateUser={mutateUser}
            checkNewsRequired={checkNewsRequired}
            onCheckNews={onCheckNews}
          />
          <FreeItem
            item={freebies?.find(
              (freebie) => freebie.name === "freebie-lifeline"
            )}
            mutateFreebies={mutateFreebies}
            mutateUser={mutateUser}
            checkNewsRequired={checkNewsRequired}
            onCheckNews={onCheckNews}
          />
          <FreeItem
            item={freebies?.find((freebie) => freebie.name === "freebie-star")}
            mutateFreebies={mutateFreebies}
            mutateUser={mutateUser}
            checkNewsRequired={checkNewsRequired}
            onCheckNews={onCheckNews}
          />
        </div>
      </div>
      {isFirstTime && <MessageLog step={stepMessage} />}
    </Container>
  );
}

function FreeItem({
  item,
  mutateFreebies,
  mutateUser,
  checkNewsRequired,
  onCheckNews,
}: {
  item: Freebies | undefined;
  mutateFreebies: () => void;
  mutateUser: () => void;
  checkNewsRequired: string | null;
  onCheckNews: () => void;
}) {
  const { now } = useNowContext();
  const lang = localStorage.getItem("i18nextLng");
  const { t } = useTranslation("freebies");
  const { dispatch: actionClaim } = useFreebiesClaim(item?.action || "");
  const [loading, setLoading] = useState<boolean>(false);

  const countdown = useMemo(() => {
    return formatCountdownText(now, item?.countdown);
  }, [now, item?.countdown]);

  return (
    <div className="flex flex-row p-4 rounded-3.5xl bg-bgFreebies items-center justify-between h-[88px]">
      <div className="flex flex-row gap-3 items-center py-1">
        {item?.name?.includes("gem") ? (
          <>
            <Diamond />
            <div className="flex flex-col items-start gap-1 text-freebies font-semibold">
              <p
                className={`${
                  lang === "en" ? "text-2xl" : "text-md"
                } text-foreground`}
              >
                {t("gem")}
              </p>
              <p className="text-xs font-medium text-[#f0f2fa]">
                {item?.amount === 0 ? 5 : item?.amount}{" "}
                {item?.amount > 1 ? t("gems") : t("gem")} {t("every")}{" "}
                {convertMinutesToTimeText(item?.claim_schedule)}
              </p>
            </div>
          </>
        ) : item?.name?.includes("lifeline") ? (
          <>
            <HeartIcon />
            <div className="flex flex-col items-start gap-1 text-freebies font-semibold">
              <p
                className={`${
                  lang === "en" ? "text-2xl" : "text-md"
                } text-foreground`}
              >
                {t("lifeline")}
              </p>
              <p className="text-xs font-medium text-[#f0f2fa]">
                {item?.amount} {item?.amount > 1 ? "Lifelines" : t("lifeline")}{" "}
                {t("every")} {convertMinutesToTimeText(item?.claim_schedule)}
              </p>
            </div>
          </>
        ) : (
          <>
            <StarIconReward />
            <div className="flex flex-col items-start gap-1 text-freebies font-semibold">
              <p
                className={`${
                  lang === "en" ? "text-2xl" : "text-md"
                } text-foreground`}
              >
                {t("star")}
              </p>
              {typeof item?.amount !== "undefined" &&
                typeof item?.claim_schedule !== "undefined" && (
                  <p className="text-xs font-medium text-[#f0f2fa]">
                    {item?.amount} {item?.amount > 1 ? "Stars" : t("star")}{" "}
                    {t("every")}{" "}
                    {convertMinutesToTimeText(item?.claim_schedule)}
                  </p>
                )}
            </div>
          </>
        )}
      </div>
      {item?.countdown && countdown ? (
        <span className="text-base font-semibold text-countdown">
          {countdown && (
            <div className="flex flex-row items-center justify-end tabular-nums">
              {countdown}
            </div>
          )}
        </span>
      ) : (
        <>
          {checkNewsRequired === item?.name ? (
            <div>
              <button
                type="button"
                onClick={() => onCheckNews()}
                className="rounded-[10px] px-[6px] py-[14px] bg-[#35497366] min-w-max"
              >
                <span className="bg-gradient-to-r from-[#05C9FE] via-[#B5CFF4] to-[#1FCAFC] text-transparent bg-clip-text font-semibold p-[8px] border border-[#05C9FE] rounded-[10px]">
                  {t("check_news_btn")}
                </span>
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-1 relative">
              {item?.name?.includes("gem") ? (
                <span className="flex flex-row items-center justify-center">
                  {item?.amount === 0 ? 5 : item?.amount}&nbsp;
                  <DiamondIcon className="w-4 h-4" />
                </span>
              ) : item?.name?.includes("lifeline") ? (
                <span className="flex flex-row items-center justify-center">
                  {item?.amount}&nbsp;
                  <LifelineClaim className="w-4 h-4" />
                </span>
              ) : (
                <span className="flex flex-row items-center justify-center">
                  {item?.amount}&nbsp;
                  <StarLifeLine className="w-4 h-4" />
                </span>
              )}
              <Button
                size="xs"
                disabled={loading}
                className={`min-w-[72px] h-8 rounded-md font-semibold text-white text-base ${
                  loading ? "bg-[#DEDFE0]" : "bg-primary"
                }`}
                onClick={() => {
                  setLoading(true);
                  actionClaim()
                    .then(() => {
                      mutateFreebies();
                      mutateUser();
                    })
                    .finally(() => {
                      setTimeout(() => {
                        setLoading(false);
                      }, 1000);
                    });
                }}
              >
                {loading ? <Spinner /> : t("collect")}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
