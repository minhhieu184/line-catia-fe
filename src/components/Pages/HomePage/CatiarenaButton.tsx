import {
  // CoinIcon,
  DollarIcon,
  EggIcon,
  MedalIcon,
} from "@/assets/CatiarenaPage/SVGs";
import SeedIcon from "@/assets/CatiarenaPage/SeedIcon.png";
import { StarIcon } from "@/assets/QuizPage/SVGs";
import useNowContext from "@/components/Providers/NowProvider/useNowContext";
// import DiamondIcon from "@/components/icons/DiamondIcon";
import { GradientText } from "@/components/ui/gradient-text";
import { TOAST_IDS } from "@/lib/toast";
import { getTimeDiff } from "@/lib/utils";
import i18n from "i18next";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const StartDate = "2024-07-25T14:00:00Z";

export const CatiarenaButton = () => {
  const navigate = useNavigate();
  const { t } = useTranslation("home");
  const { now } = useNowContext();

  const timeDif = useMemo(() => {
    return getTimeDiff(now, StartDate);
  }, [now]);

  return (
    <button
      type="button"
      onClick={() => {
        if (timeDif && timeDif.rawDif >= 0) {
          toast.info(i18n.t("common:warn_toast"), {
            id: TOAST_IDS.COMING_SOON,
          });
          return;
        }
        timeDif && timeDif.rawDif < 0 && navigate("/catiarena");
      }}
      className="relative w-full min-h-[120px] px-6 pt-[13px] pb-[15px] flex flex-col justify-center gap-2 bg-[length:100%_100%] bg-no-repeat"
      style={{
        backgroundImage: "url(./home-catiarena-button-bg.png)",
      }}
    >
      <div className="absolute right-3.5">
        <Moon />
      </div>

      <p className="text-lg font-semibold xs:text-xl">Catiarena</p>

      {timeDif && timeDif.rawDif >= 0 && (
        <div className="flex items-center">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-semibold tracking-wide">
              {i18n.t("quiz:quiz_start_in", { value: "" })}
            </span>
            <div className="flex items-center gap-0.5 text-xs tabular-nums">
              <div className="relative min-w-7 h-7 p-[1px] rounded-md font-extrabold bg-gradient-to-br from-[#19BFEF] via-[#0DC9EB] to-[#00E3D0]">
                <div className="w-full h-full px-0.5 rounded-md flex items-center justify-center bg-[#091428]">
                  <GradientText className="font-extrabold">
                    {timeDif.days > 0
                      ? `${timeDif.days}d`
                      : `${timeDif.hours}h`}
                  </GradientText>
                </div>
              </div>
              <div className="font-black text-foreground">:</div>
              <div className="relative min-w-7 h-7 p-[1px] rounded-md font-extrabold bg-gradient-to-br from-[#19BFEF] via-[#0DC9EB] to-[#00E3D0]">
                <div className="w-full h-full px-0.5 rounded-md flex items-center justify-center bg-[#091428]">
                  <GradientText className="font-extrabold">
                    {timeDif.days > 0
                      ? `${timeDif.hours}h`
                      : `${timeDif.minutes}m`}
                  </GradientText>
                </div>
              </div>
              <div className="font-black text-foreground">:</div>
              <div className="relative min-w-7 h-7 p-[1px] rounded-md font-extrabold bg-gradient-to-br from-[#19BFEF] via-[#0DC9EB] to-[#00E3D0]">
                <div className="w-full h-full px-0.5 rounded-md flex items-center justify-center bg-[#091428]">
                  <GradientText className="font-extrabold">
                    {timeDif.days > 0
                      ? `${timeDif.minutes}m`
                      : `${timeDif.seconds}s`}
                  </GradientText>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="relative flex items-center gap-1">
        <span className="text-xs font-semibold tracking-wide">
          {t("rewards")}
        </span>
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs font-semibold tracking-wide">$50k</span>
          <DollarIcon />
          <img width={20} height={20} src={SeedIcon} alt="Seed" />
          <EggIcon />
          <MedalIcon />
          <StarIcon />
          {/* <DiamondIcon /> */}
        </div>
      </div>
      {!(timeDif && timeDif.rawDif >= 0) && (
        <div className="relative flex items-center gap-1">
          <GradientText className="capitalize font-bold text-[15px] leading-[18px] from-[#AEF5FF] via-[#6BE1F1] to-[#19BFEF] drop-shadow-[0_2px_10px_rgba(107,255,255,0.6)]">
            {t("join_now")}
          </GradientText>
          <ArrowRight />
        </div>
      )}
    </button>
  );
};

const ArrowRight = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M15 6.66669L18.3333 10M18.3333 10L15 13.3334M18.3333 10H3.00012"
      stroke="url(#paint0_linear_9357_13512)"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <defs>
      <linearGradient
        id="paint0_linear_9357_13512"
        x1="19.9092"
        y1="14.9306"
        x2="0.231776"
        y2="11.2934"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#19BFEF" />
        <stop offset="0.5" stopColor="#B2F6FF" />
        <stop offset="1" stopColor="#C5F8FF" />
      </linearGradient>
    </defs>
  </svg>
);

const Moon = () => (
  <svg
    width="142"
    height="159"
    viewBox="0 0 142 159"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g filter="url(#filter0_dddd_9113_25813)">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M113.255 52.5279C113.572 68.4857 106.758 82.9603 95.7037 92.9917C92.4803 90.0492 87.6127 88.7781 82.938 89.2366C78.2619 89.6953 74.3349 92.0549 71.7405 95.4586C74.2759 92.8929 77.7054 91.1605 81.5984 90.7786C86.2119 90.326 90.5558 91.8606 93.7589 94.6765C96.6403 97.2093 98.5988 100.779 99.0003 104.872C99.131 106.204 99.0887 107.515 98.8919 108.781C99.9316 108.257 101.085 107.913 102.316 107.792C104.502 107.578 106.587 108.103 108.317 109.161C108.006 109.306 107.703 109.48 107.414 109.685C105.16 111.279 104.414 114.177 105.482 116.582C105.186 114.491 106.05 112.311 107.913 110.994C110.553 109.127 114.21 109.694 116.133 112.25C115.962 111.811 115.732 111.386 115.442 110.986C114.218 109.297 112.226 108.472 110.269 108.641C111.828 105.712 114.803 103.587 118.387 103.236C119.157 103.16 119.916 103.171 120.653 103.259L120.655 103.256L120.658 103.259C125.331 103.821 129.144 107.514 129.616 112.33C129.725 113.442 129.648 114.529 129.41 115.562C130.057 114.054 130.343 112.372 130.172 110.63C129.726 106.08 126.297 102.532 121.979 101.68L121.974 101.68C130.526 91.0991 135.532 77.6311 135.243 63.0621C134.636 32.4921 110.942 7.77497 80.8951 4.74247C99.6021 12.8089 112.829 31.0458 113.255 52.5279ZM47.5949 131.633C49.3314 133.681 52.4228 133.981 54.5419 132.291C54.755 132.121 54.9502 131.937 55.1277 131.742C55.0327 131.092 55.0735 130.413 55.2707 129.741C55.3874 129.343 55.5514 128.972 55.7561 128.632C55.0477 131.214 56.5647 133.885 59.1786 134.625C61.0231 135.147 62.9254 134.57 64.1666 133.287C63.1158 135.235 60.7964 136.263 58.5646 135.632C57.1999 135.246 56.1439 134.316 55.5671 133.15C53.5605 135.144 50.0607 134.889 48.2361 132.659C47.9739 132.338 47.7597 131.993 47.5949 131.633ZM51.9073 123.494C51.574 120.62 48.9638 118.535 46.032 118.822C43.9635 119.025 42.2821 120.356 41.5521 122.135C41.8159 119.805 43.6713 117.884 46.1086 117.584C46.0322 117.52 45.9553 117.458 45.8769 117.398L45.5743 117.238C45.0553 116.865 44.4906 116.552 43.8913 116.31L43.7181 116.21C42.6187 115.81 41.4127 115.644 40.1671 115.766C36.1265 116.162 33.0803 119.458 32.9418 123.355C32.5299 121.519 33.3684 115.076 40.534 114.239C31.5425 108.282 24.2492 100.006 19.5462 90.2547C28.0044 99.1711 39.5273 105.199 52.4209 106.737C53.8847 104.64 56.0665 103.194 59.0537 102.901C60.2772 102.78 61.4679 102.901 62.5781 103.223C62.1777 103.215 61.7728 103.23 61.3645 103.27C58.5469 103.547 55.926 105.069 54.2366 107.275C52.8098 109.183 52.0638 111.595 52.3131 114.137C52.3622 114.637 52.448 115.125 52.568 115.598C52.2777 115.586 51.9826 115.593 51.6848 115.622C50.0874 115.778 48.6933 116.528 47.7046 117.627C49.9357 118.031 51.7171 119.849 51.9466 122.188C51.9901 122.634 51.9748 123.072 51.9073 123.494ZM37.8874 129.829C38.3812 134.234 43.0634 133.899 43.0807 134.075C43.0843 134.112 43.0565 134.145 43.019 134.149C38.5522 134.648 38.8821 139.266 38.7015 139.284C38.6636 139.287 38.6302 139.26 38.6263 139.224C38.1306 134.815 33.4517 135.156 33.4342 134.977C33.4306 134.941 33.4577 134.907 33.4948 134.903C37.963 134.404 37.6316 129.786 37.8131 129.768C37.8498 129.765 37.8833 129.792 37.8874 129.829ZM110.314 127.117C110.57 129.399 112.994 129.225 113.003 129.316C113.005 129.336 112.991 129.353 112.972 129.355C110.658 129.613 110.829 132.005 110.735 132.014C110.716 132.016 110.699 132.002 110.696 131.983C110.44 129.7 108.017 129.876 108.008 129.784C108.006 129.765 108.02 129.747 108.039 129.745C110.353 129.487 110.181 127.095 110.275 127.086C110.294 127.084 110.312 127.098 110.314 127.117ZM88.9439 110.773C85.4618 109.991 81.9879 111.682 80.4098 114.673C80.4199 114.628 80.4297 114.582 80.4404 114.536C81.2868 110.908 84.9531 108.635 88.6285 109.46C91.0401 110.002 92.8567 111.742 93.5825 113.9C92.5324 112.371 90.9152 111.216 88.9439 110.773ZM62.6171 111.387C62.4363 110.899 62.3153 110.381 62.2622 109.84C61.9244 106.396 64.4807 103.327 67.9718 102.984C71.0139 102.686 73.7619 104.556 74.6424 107.32C73.3517 105.372 71.0326 104.183 68.5184 104.429C64.9551 104.779 62.3358 107.882 62.6171 111.387ZM93.9784 124.668C94.1843 127.238 92.2638 129.513 89.6512 129.769C87.808 129.95 86.1075 129.079 85.1618 127.65C85.4048 128.414 85.8418 129.084 86.4118 129.611C86.0337 130.897 85.2103 132.063 83.9916 132.863C82.8823 133.59 81.6162 133.902 80.3825 133.836C81.9846 134.31 83.7814 134.101 85.2856 133.114C86.3394 132.423 87.0922 131.451 87.5101 130.367C88.2695 130.743 89.1431 130.918 90.0519 130.829C92.6119 130.578 94.486 128.328 94.2383 125.803C94.1996 125.406 94.1108 125.026 93.9784 124.668Z"
        fill="url(#paint0_radial_9113_25813)"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M41.7847 44.2491L52.8063 41.6138L58.3946 31.8813C59.1036 30.6464 60.3261 29.9292 61.7643 29.9028C63.2031 29.8773 64.4514 30.5497 65.2058 31.7584L71.1522 41.2823L82.264 43.5168C83.6737 43.8007 84.7437 44.7253 85.2133 46.0666C85.6823 47.4081 85.4193 48.787 84.4876 49.868L77.1417 58.3893L78.4207 69.5032C78.5828 70.9129 78.0219 72.2027 76.8736 73.0578C75.7253 73.9129 74.3144 74.0917 72.9839 73.5521L62.4971 69.2941L52.176 73.9283C50.8665 74.5162 49.4499 74.3878 48.2703 73.5751C47.0913 72.762 46.4823 71.4937 46.5922 70.079L47.4569 58.9267L39.7992 50.6761C38.8274 49.6293 38.5135 48.2614 38.9329 46.9041C39.3519 45.5468 40.3866 44.5835 41.7847 44.2491Z"
        fill="url(#paint1_radial_9113_25813)"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M51.9818 89.7012C56.478 89.64 56.5986 85.0125 56.7806 85.0125C56.8179 85.0125 56.8486 85.0429 56.8491 85.0802C56.9104 89.5122 61.6028 89.6357 61.6028 89.8125C61.6028 89.85 61.5723 89.8803 61.5343 89.8807C57.0402 89.9413 56.9175 94.5688 56.736 94.5688C56.6982 94.5688 56.6675 94.5386 56.6671 94.5018C56.6043 90.0663 51.9145 89.9485 51.9145 89.7687C51.9143 89.7322 51.9447 89.7017 51.9818 89.7012Z"
        fill="url(#paint2_radial_9113_25813)"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M31.0932 69.5034C33.2779 69.4738 33.3367 67.2249 33.4253 67.2249C33.4432 67.2249 33.4581 67.2398 33.4583 67.258C33.4883 69.4117 35.7684 69.4718 35.7684 69.5574C35.7684 69.5757 35.7535 69.5904 35.7352 69.5908C33.5512 69.6202 33.4917 71.8689 33.4036 71.8689C33.3855 71.8689 33.3702 71.8545 33.3699 71.8364C33.3397 69.6809 31.0605 69.6235 31.0605 69.5364C31.0605 69.5185 31.0752 69.5039 31.0932 69.5034Z"
        fill="url(#paint3_radial_9113_25813)"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M77.7758 28.0462C81.5909 27.9944 81.6937 24.0671 81.848 24.0671C81.8796 24.0671 81.9057 24.093 81.9061 24.1247C81.9581 27.8858 85.9403 27.9906 85.9403 28.1405C85.9403 28.1726 85.914 28.1981 85.8822 28.1988C82.0684 28.2501 81.9643 32.1767 81.81 32.1767C81.7781 32.1767 81.7518 32.1515 81.7516 32.1203C81.6985 28.3562 77.7183 28.2562 77.7183 28.1037C77.7183 28.0724 77.744 28.0466 77.7758 28.0462Z"
        fill="url(#paint4_radial_9113_25813)"
      />
    </g>
    <defs>
      <filter
        id="filter0_dddd_9113_25813"
        x="0.546143"
        y="3.74249"
        width="135.708"
        height="154.541"
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity="0" result="BackgroundImageFix" />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feOffset dx="-1" dy="1" />
        <feGaussianBlur stdDeviation="1" />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"
        />
        <feBlend
          mode="normal"
          in2="BackgroundImageFix"
          result="effect1_dropShadow_9113_25813"
        />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feOffset dx="-3" dy="3" />
        <feGaussianBlur stdDeviation="2" />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.09 0"
        />
        <feBlend
          mode="normal"
          in2="effect1_dropShadow_9113_25813"
          result="effect2_dropShadow_9113_25813"
        />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feOffset dx="-7" dy="7" />
        <feGaussianBlur stdDeviation="3" />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.05 0"
        />
        <feBlend
          mode="normal"
          in2="effect2_dropShadow_9113_25813"
          result="effect3_dropShadow_9113_25813"
        />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feOffset dx="-12" dy="12" />
        <feGaussianBlur stdDeviation="3.5" />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.01 0"
        />
        <feBlend
          mode="normal"
          in2="effect3_dropShadow_9113_25813"
          result="effect4_dropShadow_9113_25813"
        />
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="effect4_dropShadow_9113_25813"
          result="shape"
        />
      </filter>
      <radialGradient
        id="paint0_radial_9113_25813"
        cx="0"
        cy="0"
        r="1"
        gradientUnits="userSpaceOnUse"
        gradientTransform="translate(149.012 20.288) rotate(134.218) scale(173.722 22.8282)"
      >
        <stop stopColor="#C3FCF2" />
        <stop offset="0.570726" stopColor="#49E0CE" />
        <stop offset="1" stopColor="#49E0CE" />
      </radialGradient>
      <radialGradient
        id="paint1_radial_9113_25813"
        cx="0"
        cy="0"
        r="1"
        gradientUnits="userSpaceOnUse"
        gradientTransform="translate(92.4442 37.4686) rotate(143.875) scale(65.0284 8.25495)"
      >
        <stop stopColor="#C3FCF2" />
        <stop offset="0.570726" stopColor="#49E0CE" />
        <stop offset="1" stopColor="#49E0CE" />
      </radialGradient>
      <radialGradient
        id="paint2_radial_9113_25813"
        cx="0"
        cy="0"
        r="1"
        gradientUnits="userSpaceOnUse"
        gradientTransform="translate(53.4219 87.2571) rotate(180) scale(14.4147 14.2178)"
      >
        <stop stopColor="#FDF493" />
        <stop offset="0.49" stopColor="#F0D564" />
        <stop offset="1" stopColor="#886226" />
      </radialGradient>
      <radialGradient
        id="paint3_radial_9113_25813"
        cx="0"
        cy="0"
        r="1"
        gradientUnits="userSpaceOnUse"
        gradientTransform="translate(31.7931 68.3158) rotate(180) scale(7.00558 6.90988)"
      >
        <stop stopColor="#FDF493" />
        <stop offset="0.49" stopColor="#F0D564" />
        <stop offset="1" stopColor="#886226" />
      </radialGradient>
      <radialGradient
        id="paint4_radial_9113_25813"
        cx="0"
        cy="0"
        r="1"
        gradientUnits="userSpaceOnUse"
        gradientTransform="translate(78.9978 25.9719) rotate(180) scale(12.2332 12.0661)"
      >
        <stop stopColor="#FDF493" />
        <stop offset="0.49" stopColor="#F0D564" />
        <stop offset="1" stopColor="#886226" />
      </radialGradient>
    </defs>
  </svg>
);
