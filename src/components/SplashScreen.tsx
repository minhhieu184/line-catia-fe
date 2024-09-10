import { useTranslation } from "react-i18next";

export default function SplashScreen() {
  const { t } = useTranslation("common");
  return (
    <div
      className="flex h-screen flex-col items-center bg-background bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: "url(/main-background.png)",
      }}
    >
      <img
        src="/splash-screen/moon-2.svg"
        className="mt-24 w-[260px]"
        alt="Moon"
      />
      <div className="mt-4 rounded-xl bg-[#081325]/60 px-14 py-2 font-medium text-accent-foreground">
        {t("slogan")}
      </div>
      <img
        src="/catia-eduverse.png"
        alt=""
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
      />
    </div>
  );
}
