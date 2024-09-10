import { Loading } from "@/assets/loading";
import type { PropsWithClassNameAndChildren } from "@/types/app";
import { useTranslation } from "react-i18next";
import { Dialog, DialogContent, DialogTitle } from "../../ui/dialog";
import {
  GemBackground,
  LifelineBackground,
  NothingBackground,
  StarBackground,
} from "./Backgrounds";

export default function MoonTapRewardDialog({
  open,
  onOpenChange,
  amount,
  type,
  loading,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  amount: number;
  type: string;
  loading?: boolean;
} & PropsWithClassNameAndChildren) {
  const { t } = useTranslation("home");
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="bg-transparent m-0 p-0 border-0 ring-0 focus-visible:border-0 focus-visible:ring-0"
        hideCloseButton={true}
      >
        <DialogTitle hidden />
        <div className="relative rounded-xl flex items-center justify-center overflow-hidden">
          {loading && (
            <div className="absolute top-0 left-0 right-0 bottom-0 pt-[70px] px-10 flex flex-col items-center justify-center gap-2">
              <Loading className="w-12 h-12" />
            </div>
          )}
          {!loading && (
            <div className="absolute top-0 left-0 right-0 bottom-0 pt-[70px] px-10 flex flex-col text-center items-center gap-2">
              {amount <= 0 && (
                <div className="text-lg xs:text-3xl font-semibold">
                  {t("moon_miss_title_dialog")}
                </div>
              )}
              {amount > 0 && (
                <div className="text-lg xs:text-3xl font-semibold">
                  {t("moon_received_title_dialog")}
                </div>
              )}
              {amount > 0 && (
                <div className="text-lg xs:text-3xl font-semibold">
                  <span className="text-primary">{amount || 0}</span>{" "}
                  {type === "gem" && (amount > 1 ? t("gems") : t("gem"))}
                  {type === "lifeline" &&
                    (amount > 1 ? t("lifelines") : t("lifeline"))}
                  {type === "star" && (amount > 1 ? t("stars") : t("star"))}
                </div>
              )}
              <div className="text-sm text-[#A6ADBC] text-center">
                {type === "gem" && t("moon_gem_desc_dialog")}
                {type === "lifeline" && t("moon_lifeline_desc_dialog")}
                {type === "star" && t("moon_star_desc_dialog")}
                {type === "nothing" && t("moon_nothing_desc_dialog")}
              </div>
              <button
                type="button"
                className="w-full mt-2 rounded-lg px-4 py-2 xs:py-3 flex items-center justify-center text-sm xs:text-lg text-white font-semibold bg-gradient ring-0 border-0 focus:border-0 focus:ring-0"
                onClick={() => {
                  onOpenChange(false);
                }}
              >
                {t("received_btn")}
              </button>
            </div>
          )}
          {type === "nothing" && <NothingBackground />}
          {type === "lifeline" && <LifelineBackground />}
          {type === "gem" && <GemBackground />}
          {type === "star" && <StarBackground />}
        </div>
      </DialogContent>
    </Dialog>
  );
}
