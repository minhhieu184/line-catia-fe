import { NoCampaignBg } from "@/assets/CatiarenaPage/NoCampaignBg";
import { CATIA_GLOBAL_CHAT_URL } from "@/lib/constants";
import type { Arena } from "@/types/app";
// import { useUtils } from "@telegram-apps/sdk-react";
import { useTranslation } from "react-i18next";
import ProjectCard from "./ProjectCard";

const ProjectList = ({ arenas }: { arenas?: Arena[] }) => {
  // const utils = useUtils();
  const { t } = useTranslation("arenas");

  if (!arenas || arenas?.length === 0)
    return (
      <div className="mt-[5vh] flex flex-col items-center relative">
        <div className="relative w-[220px] h-[220px]">
          <NoCampaignBg />
        </div>
        <div className="relative text-center">
          <p className="font-semibold">{t("currently_no_campaigns")}</p>
          <p className="mt-2.5 text-sm">
            <span className="capitalize">{t("follow")}</span>{" "}
            <span
              className="text-primary underline font-semibold"
              // onClick={() => utils.openTelegramLink(CATIA_GLOBAL_CHAT_URL)}
              onClick={() => window.open(CATIA_GLOBAL_CHAT_URL, "_blank")}
            >
              Catia ANN
            </span>{" "}
            <span>{t("for_campaigns")}</span>
          </p>
        </div>
      </div>
    );

  return (
    <div className="mt-6 space-y-4">
      {arenas
        ?.sort(
          (arena1, arena2) => (arena2.priority || 0) - (arena1.priority || 0)
        )
        .sort(
          (arena1, arena2) =>
            (arena2.end_date &&
            new Date(arena2.end_date).getTime() > new Date().getTime()
              ? 1
              : 0) -
            (arena1.end_date &&
            new Date(arena1.end_date).getTime() > new Date().getTime()
              ? 1
              : 0)
        )
        .map((arena) => (
          <ProjectCard key={arena.id} arena={arena} />
        ))}
    </div>
  );
};

export default ProjectList;
