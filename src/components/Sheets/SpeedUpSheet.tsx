import {
  useArenaDetail,
  useGameActionBoost,
  useGameMe,
  useGameSessionMine,
  useMe,
} from "@/lib/swr";
import { TOAST_IDS } from "@/lib/toast";
import useCatiaStore from "@/lib/useCatiaStore";
import i18n from "i18next";
import type { PropsWithChildren } from "react";
import { toast } from "sonner";
import InviteFriendDialog from "../Dialogs/InviteFriendDialog";
import { SuccessfulBadgeIcon } from "../icons";
import StarLifeLine from "../icons/StarLifeline";
import Close from "../icons/popup/Close";
import { Button } from "../ui/button";
import { GradientText } from "../ui/gradient-text";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "../ui/sheet";

const SpeedUpSheet = ({
  children,
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: (state: boolean) => void;
} & PropsWithChildren) => {
  const { data: user, mutate: mutateUser } = useMe();
  const { mutate: mutateUserGame } = useGameMe();
  const { data: session, mutate: mutateSession } = useGameSessionMine();
  const { dispatch: actionBoost } = useGameActionBoost();
  const { mutate: mutateArena } = useArenaDetail();

  const game = useCatiaStore((state) => state.game);
  const inviteDialogOpen = useCatiaStore((state) => state.inviteDialogOpen);
  const setInviteDialogOpen = useCatiaStore(
    (state) => state.setInviteDialogOpen
  );

  function onGameBoost() {
    if (
      game?.config &&
      game.config.length >= 4 &&
      game.config[2].value !== "-1" &&
      !!session?.used_boost_count &&
      session.used_boost_count >= Number(game.config[2].value)
    ) {
      toast.error(
        i18n.t("quiz:game_boost_toast", { value: game.config[2].value }),
        {
          id: TOAST_IDS.ALREADY_USED,
        }
      );
      return;
    }

    actionBoost()
      .then(() => {
        toast.custom((id) => (
          <div className="flex flex-row items-center justify-between bg-bgFreebies p-3 rounded-lg gap-2">
            <div className="flex flex-row gap-3 items-center">
              <SuccessfulBadgeIcon />
              <p className="text-13 text-[#C8C5C5]">
                {i18n.t("quiz:congratulations_toast")}
              </p>
            </div>
            <button type="button" onClick={() => toast.dismiss(id)}>
              <Close className="w-5 h-5" />
            </button>
          </div>
        ));
        mutateArena();
        mutateUserGame();
        mutateSession();
        mutateUser();
        useCatiaStore.setState({ useBoostModal: false });
      })
      .catch((err) => {
        if (err.cause === "no boost available") {
          toast.error(i18n.t("quiz:no_star_toast"), {
            id: TOAST_IDS.NO_BOOST_AVAILABLE,
          });
          return;
        }
        toast.error(i18n.t("common:error_toast"), {
          id: TOAST_IDS.FETCH_ERROR,
        });
      });
  }

  return (
    <>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild className="cursor-pointer">
          {children}
        </SheetTrigger>
        <SheetContent side="bottom">
          <SheetTitle className="text-3xl capitalize">
            {i18n.t("quiz:speed_up")}
          </SheetTitle>
          <div className="mt-5 space-y-5">
            <div className="space-y-3">
              <p className="text-base font-semibold">
                {i18n.t("quiz:exchange_desc")}
              </p>
              <div className="flex items-center justify-start gap-2 font-semibold">
                <span className="flex items-center justify-center gap-1">
                  1<StarLifeLine />
                </span>
                <span>=</span>
                <span>
                  {i18n.t("quiz:minutes", { value: game?.config?.[3].value })}
                </span>
              </div>
            </div>
            <div className="flex flex-row items-center gap-2.5 text-base font-semibold">
              <span>{i18n.t("quiz:stars")}:</span>
              <span className="flex items-center gap-2">
                {user && user.boosts >= 0 ? user.boosts : "-"} <StarLifeLine />
              </span>
            </div>
            <div className="flex flex-col gap-2">
              <Button
                size="sm"
                className="rounded-lg opacity-100 bg-primary px-8 py-2 text-white capitalize font-medium text-15 w-full border border-primary hover:bg-primary/80"
                onClick={() => onGameBoost()}
              >
                {i18n.t("quiz:speed_up")}
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="rounded-lg opacity-100 px-8 py-2 text-primary bg-[#0f0f0f] capitalize font-medium text-15 w-full border border-primary"
                onClick={() => setInviteDialogOpen(true)}
              >
                <GradientText>{i18n.t("quiz:invite_btn")}</GradientText>
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
      <InviteFriendDialog
        open={inviteDialogOpen}
        onOpenChange={setInviteDialogOpen}
        user={user}
      />
    </>
  );
};

export default SpeedUpSheet;
