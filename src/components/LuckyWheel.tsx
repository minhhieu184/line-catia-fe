import { LeaveIcon, WheelSpinButtonIcon } from "@/assets/QuizPage/SVGs";
import { Loading } from "@/assets/loading";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useGameActionAnswer, useGameActionEndSession } from "@/lib/swr";
import { TOAST_IDS } from "@/lib/toast";
import useCatiaStore from "@/lib/useCatiaStore";
import { getRewardDescription, mapRewardToRotation } from "@/lib/utils";
import type { Session } from "@/types/app";
import anime from "animejs";
import { arc as ARC, pie as PIE, type PieArcDatum } from "d3";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { Button } from "./ui/button";

type Prize = { id: number; text: string; positions: number[] };
type Slot = { id: number; text: string; position: number; lines: string[] };

const ArcColor = ["#45A599", "#F78550", "#F13D51", "#2E5457"];

function getArcColor(index: number, total: number) {
  function getColorsInUsed(a: number, b: number, cap?: number) {
    if (b === 0 && (!cap || a <= cap)) {
      return a;
    }
    return getColorsInUsed(b, a % b);
  }

  const colorsCount = ArcColor.length;
  const colorsInUsed = getColorsInUsed(colorsCount, total, colorsCount);
  return ArcColor[index % colorsInUsed] || ArcColor[0];
}

function Pie(
  pieces: Slot[],
  {
    width = 509,
    height = 509,
    outerRadius = Math.min(width, height) / 2 - 30,
    labelRadius = outerRadius * 0.8,
    stroke = "black",
    strokeWidth = 4,
    strokeLinejoin = "round",
  }: {
    width?: number;
    height?: number;
    outerRadius?: number;
    labelRadius?: number;
    stroke?: string;
    strokeWidth?: number;
    strokeLinejoin?: "round" | "miter" | "bevel" | "inherit";
  }
) {
  const arcs = PIE<Slot>().value(() => {
    return 1;
  })(pieces);

  const arc = ARC<PieArcDatum<Slot>>().innerRadius(0).outerRadius(outerRadius);
  const arcLabel = ARC<PieArcDatum<Slot>>()
    .innerRadius(labelRadius)
    .outerRadius(labelRadius);

  return {
    width,
    height,
    stroke,
    strokeWidth,
    strokeLinejoin,
    arcs,
    arc,
    arcLabel,
  };
}

export default function LuckyWheel({
  session,
  setSession,
  onSpinned,
  onSkip,
}: {
  session: Session;
  setSession: (v: Session) => void;
  onSpinned: () => void;
  onSkip: () => void;
}) {
  const { t } = useTranslation("quiz");
  const wheelRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [lastRotation, setLastRotation] = useState(0);
  const game = useCatiaStore((state) => state.game);
  const extra = useCatiaStore((state) => state.game?.extra_setup);
  const setReward = useCatiaStore((state) => state.setReward);
  const luckyPopup = useCatiaStore((state) => state.luckyPopup);
  const { dispatch: actionAnswer } = useGameActionAnswer();
  const { dispatch: actionEndSession } = useGameActionEndSession();

  const prizes: Prize[] = (extra || []).map((e, i) => ({
    id: i,
    text: e.description,
    positions: [i],
  }));

  const slots: Slot[] = prizes
    .reduce((acc: Slot[], val) => {
      for (const p of val.positions) {
        acc.push({
          id: val.id,
          text: val.text,
          lines: val.text.split(" "),
          position: p,
        });
      }
      return acc;
    }, [])
    .sort((a, b) => {
      return a.position - b.position;
    });

  const pie = Pie(slots, {
    stroke: "transparent",
    strokeWidth: 0,
  });

  const handleSpin = async () => {
    const target = wheelRef.current;
    if (loading || !target) {
      return;
    }

    setLoading(true);
    const data = await actionAnswer({
      answer: 0,
      question: (session?.next_step || 1) - 1,
    });
    if (!extra) return;
    if (!data.data) {
      toast.error(t("reward_failed_toast"), {
        id: TOAST_IDS.FETCH_ERROR,
      });
      return;
    }

    const reward = mapRewardToRotation(
      extra,
      data?.data?.history[(game?.questions?.length || 0) - 1].answer || 0
    );

    let rotation = lastRotation;

    const timeline = anime.timeline({ targets: target });
    timeline.add({
      rotate: "+=360",
      duration: 2000,
      easing: "easeInCubic",
      update: () => {
        rotation += 360;
      },
    });

    timeline.add({
      rotate: "+=360",
      duration: 500,
      easing: "linear",
      update: () => {
        rotation += 360;
      },
      changeComplete: (anim) => {
        anime.set(target, { rotate: 0 });
        if (!data) {
          setTimeout(() => anim.restart(), 0);
          return;
        }

        const pieAngle = 360 / extra.length;

        if (!reward) return;
        const rewardRotation = -reward.rotation * pieAngle;
        anime({
          targets: target,
          rotate:
            (rewardRotation % 360) +
            360 * 5 +
            anime.random(-pieAngle / 3, pieAngle / 3),
          duration: 3000,
          easing: "easeOutQuad",
        }).finished.then(() => {
          setLoading(false);
          setLastRotation(rotation % 360);

          toast.success(t("value_toast", { value: reward?.description }), {
            id: TOAST_IDS.REWARD,
          });

          data?.data && setSession(data.data);
          setReward({
            type: reward.type,
            description: reward.description,
            chance: reward.chance,
          });

          onSpinned();
        });
      },
    });
  };

  const onSessionEnd = () => {
    actionEndSession().then((resp) => {
      if (!resp.data) {
        toast.error(t("error_toast"), { id: TOAST_IDS.FETCH_ERROR });
        return;
      }
      toast.success(t("game_ended"), { id: TOAST_IDS.GAME_ENDED });
    });
  };

  const Wheel = () => (
    <svg
      width={pie.width}
      height={pie.height}
      viewBox={`0 0 ${pie.width} ${pie.height}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        cx={pie.width / 2}
        cy={pie.height / 2}
        r={pie.width / 2}
        fill="url(#paint0_linear_7772_25580)"
      />
      <circle
        cx={pie.width / 2}
        cy={pie.height / 2}
        r={pie.width / 2 - 12}
        fill="url(#paint0_linear_7772_25581)"
      />
      <circle
        cx={pie.width / 2}
        cy={pie.height / 2}
        r={pie.width / 2 - 24}
        fill="#C22B5D"
      />
      <g ref={null} transform={`translate(${pie.width / 2},${pie.height / 2})`}>
        <g
          stroke={pie.stroke}
          strokeWidth={pie.strokeWidth}
          strokeLinejoin={pie.strokeLinejoin}
          className="text-gamefiDark-900"
        >
          {pie.arcs.map((arc: PieArcDatum<Slot>, index) => (
            <path
              key={arc.data.id}
              d={pie.arc(arc) || undefined}
              fill={getArcColor(index, 8)}
            />
          ))}
        </g>

        <g
          fontFamily="sans-serif"
          fontSize={20}
          textAnchor="middle"
          className="font-extrabold tracking-wider"
          fill="white"
        >
          {pie.arcs.map((arc: PieArcDatum<Slot>) => {
            const midAngle = arc.startAngle / 2 + arc.endAngle / 2 + Math.PI;
            return (
              <text
                key={arc.data.id}
                transform={`translate(${pie.arcLabel.centroid(arc)}) rotate(${
                  (midAngle * 180) / Math.PI + 180
                })`}
                className="uppercase leading-[1.2]"
              >
                {arc.data.lines.map((line: string, i: number) => (
                  <tspan key={line} x="0" y={`${i * 1}em`}>
                    {line}
                  </tspan>
                ))}
              </text>
            );
          })}
        </g>
      </g>

      <linearGradient
        id="paint0_linear_7772_25581"
        x1="117.501"
        y1="235.228"
        x2="117.501"
        y2="0.45844"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#FFE373" />
        <stop offset="0.498" stopColor="#FFB94F" />
        <stop offset="0.8031" stopColor="#F1A437" />
        <stop offset="1" stopColor="#EB9B2E" />
      </linearGradient>
      <linearGradient
        id="paint0_linear_7772_25580"
        x1="125.501"
        y1="250.92"
        x2="125.501"
        y2="0.766054"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#EB9B2E" />
        <stop offset="0.1969" stopColor="#F1A437" />
        <stop offset="0.502" stopColor="#FFB94F" />
        <stop offset="1" stopColor="#FFE373" />
      </linearGradient>
    </svg>
  );

  return (
    <div className="flex flex-col gap-6 pt-7 overflow-hidden relative">
      <div
        className="w-[256px] h-[256px] mx-auto relative hover:cursor-pointer"
        onClick={() => {
          handleSpin();
        }}
      >
        <div className="absolute w-full h-full flex items-center justify-center z-10">
          <MiddleCircle />
        </div>
        <div className="absolute w-full flex justify-center z-10 -top-3">
          <Pointer />
        </div>
        <div className="absolute w-full flex justify-center -bottom-9 select-none pointer-events-none">
          <WheelStand />
        </div>
        <div
          ref={wheelRef}
          className="absolute w-full h-full flex items-center justify-center"
        >
          <Wheel />
        </div>
      </div>
      <div className="grid items-center relative justify-center grid-cols-2 gap-3 mt-7">
        <Button
          variant="outline"
          size="sm"
          className="w-full gap-1 border-white"
          disabled={loading}
          onClick={() => {
            onSessionEnd();
            onSkip();
          }}
        >
          <LeaveIcon />
          <span className="leading-[20px]">{t("refuse")}</span>
        </Button>
        <Button
          size="sm"
          className="gap-1.5"
          disabled={loading}
          onClick={() => {
            handleSpin();
          }}
        >
          {loading ? (
            <Loading />
          ) : (
            <>
              <WheelSpinButtonIcon />
              <span className="leading-[20px]">{t("spin")}</span>
            </>
          )}
        </Button>
      </div>
      <Dialog
        open={luckyPopup}
        onOpenChange={(v) => {
          useCatiaStore.setState({
            luckyPopup: v,
          });
        }}
      >
        <DialogContent className="w-[90%] h-[80%] rounded-lg shadow-lg bg-background text-foreground">
          <DialogHeader>
            <strong>{t("probability_percentage")}</strong>
          </DialogHeader>
          <ScrollArea>
            <div className="flex flex-col w-full gap-y-2">
              <ul className="flex flex-col gap-y-2 list-disc list-inside">
                {extra?.map((e) => (
                  <li key={e.description}>
                    <span className="font-bold">{e.description}</span>
                    <p>
                      {getRewardDescription(e.type)} [{e.chance}%]
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
}

const MiddleCircle = () => (
  <svg
    width="69"
    height="69"
    viewBox="0 0 69 69"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M68.3366 34.5125C68.3366 53.2123 53.1841 68.3618 34.489 68.3618C15.7966 68.3618 0.644531 53.2122 0.644531 34.5125C0.644531 15.8157 15.7966 0.670898 34.489 0.670898C53.1841 0.670898 68.3366 15.8157 68.3366 34.5125Z"
      fill="url(#paint0_linear_7772_26012)"
    />
    <path
      d="M61.4115 34.5124C61.4115 49.3838 49.359 61.4389 34.4892 61.4389C19.6199 61.4389 7.56836 49.3838 7.56836 34.5124C7.56836 19.6451 19.6199 7.59473 34.4892 7.59473C49.359 7.59473 61.4115 19.6451 61.4115 34.5124Z"
      fill="url(#paint1_linear_7772_26012)"
    />
    <path
      d="M55.6013 34.5122C55.6013 46.1792 46.1456 55.6272 34.4887 55.6272C22.8328 55.6272 13.3789 46.1792 13.3789 34.5122C13.3789 22.8525 22.8328 13.4062 34.4887 13.4062C46.1456 13.4062 55.6013 22.8525 55.6013 34.5122Z"
      fill="url(#paint2_linear_7772_26012)"
    />
    <path
      d="M37.9017 18.8866L41.1281 25.427C41.1281 25.427 44.3593 25.8964 48.3474 26.4759C52.3326 27.0555 53.2252 29.8038 50.3411 32.6153L45.1187 37.7057C45.1187 37.7057 45.6707 40.924 46.351 44.8946C47.0319 48.8641 44.6933 50.5637 41.1283 48.689L34.6731 45.2949C34.6731 45.2949 31.7825 46.8135 28.2174 48.689C24.653 50.5637 22.3143 48.8641 22.995 44.8946L24.2301 37.7057C24.2301 37.7057 21.8909 35.4263 19.007 32.6153C16.1234 29.8038 17.0158 27.0555 21.0034 26.4759L28.2199 25.427C28.2199 25.427 29.6642 22.4996 31.4463 18.8866C33.2288 15.2748 36.1172 15.2748 37.9017 18.8866Z"
      fill="url(#paint3_radial_7772_26012)"
    />
    <path
      opacity="0.7"
      d="M37.5775 21.1326C36.0831 17.9799 33.6651 17.9799 32.1726 21.1326C30.6805 24.2864 29.4716 26.8418 29.4716 26.8418L23.4298 27.7573C20.6881 28.1727 19.696 29.8652 20.7655 31.8162C21.4229 30.6782 22.9353 28.9116 25.9098 29.1873C30.2479 29.5893 30.73 30.3935 31.4048 29.5893C32.0796 28.7852 34.9729 19.3337 36.7072 21.1462C38.4412 22.9586 40.2784 26.8417 40.2784 26.8417L37.5775 21.1326Z"
      fill="white"
    />
    <path
      opacity="0.7"
      d="M39.8948 45.9227C42.8923 47.7079 44.9003 46.3603 44.3825 42.9108C43.864 39.4605 43.4439 36.665 43.4439 36.665L47.9501 32.538C49.9949 30.6652 49.876 28.7071 47.9006 27.6831C47.989 28.9943 47.7177 31.3042 45.0943 32.7326C41.268 34.8163 40.4196 34.4172 40.3074 35.4609C40.1953 36.5046 43.0597 45.9646 40.6097 45.4263C38.1599 44.8877 34.4707 42.687 34.4707 42.687L39.8948 45.9227Z"
      fill="#FFD389"
    />
    <defs>
      <linearGradient
        id="paint0_linear_7772_26012"
        x1="34.4906"
        y1="68.3618"
        x2="34.4906"
        y2="0.670947"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#EB9B2E" />
        <stop offset="0.1969" stopColor="#F1A437" />
        <stop offset="0.502" stopColor="#FFB94F" />
        <stop offset="1" stopColor="#FFE373" />
      </linearGradient>
      <linearGradient
        id="paint1_linear_7772_26012"
        x1="34.4899"
        y1="61.439"
        x2="34.4899"
        y2="7.59476"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#FFE373" />
        <stop offset="0.498" stopColor="#FFB94F" />
        <stop offset="0.8031" stopColor="#F1A437" />
        <stop offset="1" stopColor="#EB9B2E" />
      </linearGradient>
      <linearGradient
        id="paint2_linear_7772_26012"
        x1="59.9409"
        y1="65.7426"
        x2="4.26418"
        y2="61.2679"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#19BFEF" />
        <stop offset="0.5" stopColor="#0DC9EC" />
        <stop offset="1" stopColor="#00E3D0" />
      </linearGradient>
      <radialGradient
        id="paint3_radial_7772_26012"
        cx="0"
        cy="0"
        r="1"
        gradientUnits="userSpaceOnUse"
        gradientTransform="translate(32.6998 29.524) scale(26.0203 26.0203)"
      >
        <stop stopColor="#FFE785" />
        <stop offset="0.1428" stopColor="#FFE07D" />
        <stop offset="0.3648" stopColor="#FFCD67" />
        <stop offset="0.5534" stopColor="#FFB94F" />
        <stop offset="0.673" stopColor="#F8AC3D" />
        <stop offset="0.8772" stopColor="#EF9923" />
        <stop offset="1" stopColor="#EB921A" />
      </radialGradient>
    </defs>
  </svg>
);

const Pointer = () => (
  <svg
    width="44"
    height="42"
    viewBox="0 0 44 42"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <mask
      id="mask0_7772_26021"
      style={{ maskType: "luminance" }}
      maskUnits="userSpaceOnUse"
      x="0"
      y="0"
      width="44"
      height="42"
    >
      <path
        d="M22.7583 40.7216C37.4962 35.3726 43.1578 18.9359 43.3676 9.19462L43.4039 7.45821L42.2522 6.15909C37.4579 0.755843 25.5679 0.0876195 22.0362 0.0111766C18.5065 -0.0636528 6.59632 0.0900453 1.57408 5.28131L0.36794 6.53001L0.329604 8.26662C0.11984 18.0088 5.06747 34.6731 19.5594 40.6506L21.1467 41.3047L22.7583 40.7216Z"
        fill="white"
      />
    </mask>
    <g mask="url(#mask0_7772_26021)">
      <path
        d="M22.7583 40.7216C37.4962 35.3726 43.1578 18.9359 43.3676 9.19462L43.4039 7.45821L42.2522 6.15909C37.4579 0.755843 25.5679 0.0876195 22.0362 0.0111766C18.5065 -0.0636528 6.59632 0.0900453 1.57408 5.28131L0.36794 6.53001L0.329604 8.26662C0.11984 18.0088 5.06747 34.6731 19.5594 40.6506L21.1467 41.3047L22.7583 40.7216Z"
        fill="url(#paint0_linear_7772_26021)"
      />
    </g>
    <mask
      id="mask1_7772_26021"
      style={{ maskType: "luminance" }}
      maskUnits="userSpaceOnUse"
      x="3"
      y="2"
      width="38"
      height="37"
    >
      <path
        d="M21.7517 37.9442C35.0939 33.1012 40.2231 18.0591 40.4147 9.13002L40.4268 8.55096L40.0435 8.11913C35.8543 3.39741 23.3814 2.99402 21.9736 2.96417C20.5637 2.93331 8.08677 2.79857 3.69584 7.33452L3.29447 7.75042L3.28235 8.32869C3.08873 17.2586 7.56437 32.5086 20.6847 37.9222L21.2152 38.1396L21.7517 37.9442Z"
        fill="white"
      />
    </mask>
    <g mask="url(#mask1_7772_26021)">
      <path
        d="M21.7517 37.9442C35.0939 33.1012 40.2231 18.0591 40.4147 9.13002L40.4268 8.55096L40.0435 8.11913C35.8543 3.39741 23.3814 2.99402 21.9736 2.96417C20.5637 2.93331 8.08677 2.79857 3.69584 7.33452L3.29447 7.75042L3.28235 8.32869C3.08873 17.2586 7.56437 32.5086 20.6847 37.9222L21.2152 38.1396L21.7517 37.9442Z"
        fill="url(#paint1_linear_7772_26021)"
      />
    </g>
    <mask
      id="mask2_7772_26021"
      style={{ maskType: "luminance" }}
      maskUnits="userSpaceOnUse"
      x="4"
      y="4"
      width="35"
      height="33"
    >
      <path
        d="M21.2457 36.5579C8.07088 31.1213 4.59969 15.5956 4.75701 8.36212C8.82321 4.15716 21.9395 4.44154 21.9395 4.44154C21.9395 4.44154 35.0558 4.72372 38.9365 9.10033C38.7812 16.3313 34.6444 31.6942 21.2457 36.5579Z"
        fill="white"
      />
    </mask>
    <g mask="url(#mask2_7772_26021)">
      <path
        d="M21.2457 36.5579C8.07088 31.1213 4.59969 15.5956 4.75701 8.36212C8.82321 4.15716 21.9395 4.44154 21.9395 4.44154C21.9395 4.44154 35.0558 4.72372 38.9365 9.10033C38.7812 16.3313 34.6444 31.6942 21.2457 36.5579Z"
        fill="url(#paint2_linear_7772_26021)"
      />
    </g>
    <mask
      id="mask3_7772_26021"
      style={{ maskType: "luminance" }}
      maskUnits="userSpaceOnUse"
      x="10"
      y="10"
      width="23"
      height="20"
    >
      <path
        d="M10.5883 11.6313L20.3443 29.405C20.6206 29.9106 21.3407 29.9249 21.6392 29.4332L32.1536 12.0952C32.4521 11.6028 32.1072 10.9741 31.5304 10.9598L11.2599 10.5242C10.6831 10.51 10.3099 11.127 10.5883 11.6313Z"
        fill="white"
      />
    </mask>
    <g mask="url(#mask3_7772_26021)">
      <path
        d="M10.5883 11.6313L20.3443 29.405C20.6206 29.9106 21.3407 29.9249 21.6392 29.4332L32.1536 12.0952C32.4521 11.6028 32.1072 10.9741 31.5304 10.9598L11.2599 10.5242C10.6831 10.51 10.3099 11.127 10.5883 11.6313Z"
        fill="url(#paint3_linear_7772_26021)"
      />
    </g>
    <defs>
      <linearGradient
        id="paint0_linear_7772_26021"
        x1="21.9676"
        y1="1.8325"
        x2="21.1418"
        y2="51.5321"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#873C1A" />
        <stop offset="0.169284" stopColor="#A27627" />
        <stop offset="0.213489" stopColor="#873C1A" />
        <stop offset="0.399693" stopColor="#DADE54" />
        <stop offset="0.435163" stopColor="#EAF167" />
        <stop offset="0.892937" stopColor="#96601F" />
        <stop offset="1" stopColor="#914E1A" />
      </linearGradient>
      <linearGradient
        id="paint1_linear_7772_26021"
        x1="40.1605"
        y1="20.9512"
        x2="3.02741"
        y2="20.1503"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#873C1A" />
        <stop offset="0.169284" stopColor="#A27627" />
        <stop offset="0.213489" stopColor="#873C1A" />
        <stop offset="0.399693" stopColor="#DADE54" />
        <stop offset="0.435163" stopColor="#EAF167" />
        <stop offset="0.892937" stopColor="#96601F" />
        <stop offset="1" stopColor="#914E1A" />
      </linearGradient>
      <linearGradient
        id="paint2_linear_7772_26021"
        x1="-14.031"
        y1="69.2646"
        x2="35.6392"
        y2="-8.42446"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#873C1A" />
        <stop offset="0.169284" stopColor="#A27627" />
        <stop offset="0.213489" stopColor="#873C1A" />
        <stop offset="0.399693" stopColor="#DADE54" />
        <stop offset="0.435163" stopColor="#EAF167" />
        <stop offset="0.892937" stopColor="#96601F" />
        <stop offset="1" stopColor="#914E1A" />
      </linearGradient>
      <linearGradient
        id="paint3_linear_7772_26021"
        x1="37.3937"
        y1="2.57712"
        x2="6.1949"
        y2="28.3628"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#873C1A" />
        <stop offset="0.169284" stopColor="#A27627" />
        <stop offset="0.724242" stopColor="#873C1A" />
        <stop offset="0.892937" stopColor="#96601F" />
        <stop offset="1" stopColor="#914E1A" />
      </linearGradient>
    </defs>
  </svg>
);

const WheelStand = () => (
  <svg
    width="159"
    height="84"
    viewBox="0 0 159 84"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M80.53 65.754L130.078 63.2524C130.078 63.2524 110.942 58.2999 110.942 5.05537C110.942 -4.25148 85.3072 2.94708 79.5008 4.69692C73.6944 2.94708 48.0598 -4.25148 48.0598 5.05537C48.0598 58.2999 28.9238 63.2524 28.9238 63.2524L78.4718 65.754L78.4719 65.858L79.5008 65.806L80.5297 65.858L80.53 65.754Z"
      fill="#204D67"
    />
    <path
      d="M79.778 54.6076C93.0077 54.6076 105.638 52.0439 117.202 47.3889C113.743 38.7285 110.942 25.4264 110.942 5.05537C110.942 -4.25148 85.3078 2.94708 79.5014 4.69692C73.695 2.94708 48.0604 -4.25148 48.0604 5.05537C48.0604 25.2775 45.3 38.5325 41.876 47.1971C53.569 51.9746 66.3659 54.6076 79.778 54.6076Z"
      fill="#204D67"
    />
    <path
      d="M15.9269 63.2524C6.84817 63.2524 1.45329 72.0547 0.51837 81.1597C0.358218 82.7212 1.64622 83.9998 3.21713 83.9998H155.786C157.358 83.9998 158.644 82.7212 158.484 81.1597C157.551 72.0546 152.152 63.2524 143.074 63.2524H15.9269Z"
      fill="#1A4355"
    />
  </svg>
);
