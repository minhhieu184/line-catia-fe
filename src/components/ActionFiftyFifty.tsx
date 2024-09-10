import { LifeLineIcon, StarIcon } from "@/assets/QuizPage/SVGs";
import {
  useGameActionUseLifeline,
  useGameUseLifelineByStar,
  useMe,
} from "@/lib/swr";
import { TOAST_IDS } from "@/lib/toast";
import useCatiaStore from "@/lib/useCatiaStore";
import type { APIResponse, Session } from "@/types/app";
import type { PropsWithChildren } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import InviteFriendDialog from "./Dialogs/InviteFriendDialog";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";

export default function FiftyFifty({
  children,
  onSuccess,
}: {
  onSuccess(v: APIResponse<Session>): void;
  disabled?: boolean;
} & PropsWithChildren) {
  const { t } = useTranslation("quiz");
  const { dispatch: actionUseLifeline } = useGameActionUseLifeline();
  const { dispatch: actionLifelineByStar } = useGameUseLifelineByStar();
  const { data: user, mutate: userMutate } = useMe();
  const inviteDialogOpen = useCatiaStore((state) => state.inviteDialogOpen);
  const setInviteDialogOpen = useCatiaStore(
    (state) => state.setInviteDialogOpen
  );
  const quizFiftyFiftyDialogOpen = useCatiaStore(
    (state) => state.quizFiftyFiftyDialogOpen
  );
  const setQuizFiftyFiftyDialogOpen = useCatiaStore(
    (state) => state.setQuizFiftyFiftyDialogOpen
  );

  function onSubmit() {
    actionUseLifeline("fifty_fifty", {
      onSuccess,
    }).then(() => {
      userMutate();
    });
    setQuizFiftyFiftyDialogOpen(false);
  }

  function onLifeLineSubmit() {
    actionLifelineByStar().then((res) => {
      if (res?.data) {
        toast.success(t("lifeline_toast"), {
          id: TOAST_IDS.FETCH_SUCCESS,
        });
        userMutate();
      } else {
        toast.error(t("error_toast"), { id: TOAST_IDS.FETCH_ERROR });
      }
    });
  }

  return (
    <>
      <Dialog
        open={quizFiftyFiftyDialogOpen}
        onOpenChange={setQuizFiftyFiftyDialogOpen}
      >
        <DialogTrigger asChild>{children}</DialogTrigger>
        {(user?.lifeline_balance || 0) <= 0 && (user?.boosts || 0) <= 0 && (
          <DialogContent className="w-[80%] rounded-lg shadow-lg bg-background text-foreground">
            <DialogHeader>
              <DialogTitle className="text-left text-2xl tracking-wide">
                {t("lifeline_title_dialog")}
              </DialogTitle>
            </DialogHeader>
            <div className="flex flex-col text-sm leading-5">
              <p>{t("lifeline_desc_zero_left")}</p>
              <p className="mt-1">{t("lifeline_desc_zero_right")}</p>
            </div>

            <Button
              size="sm"
              variant="outline"
              onClick={() => setInviteDialogOpen(true)}
            >
              {t("lifeline_btn")}
            </Button>
          </DialogContent>
        )}
        {(user?.lifeline_balance || 0) <= 0 && (user?.boosts || 0) > 0 && (
          <DialogContent className="w-[80%] rounded-lg shadow-lg bg-background text-foreground">
            <DialogHeader>
              <DialogTitle className="text-left text-2xl tracking-wide">
                {t("lifeline_title_dialog")}
              </DialogTitle>
            </DialogHeader>
            <div className="flex flex-col text-sm leading-5">
              <p>{t("lifeline_star_left")}</p>
              <p className="mt-1">{t("lifeline_star_right")}</p>
              <div className="flex items-center gap-1 mt-3">
                <span>1</span> <StarIcon /> <span className="mx-1">=</span>{" "}
                <span>3</span> <LifeLineIcon />
              </div>
              <div className="flex items-center gap-1 mt-3">
                <span>{t("stars")}:</span>
                <span className="ml-1.5">{user?.boosts}</span> <StarIcon />
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <Button
                size="sm"
                disabled={(user?.boosts || 0) < 1}
                onClick={() => {
                  onLifeLineSubmit();
                }}
              >
                {t("exchange")}
              </Button>

              <Button
                size="sm"
                variant="outline"
                onClick={() => setInviteDialogOpen(true)}
              >
                {t("lifeline_btn")}
              </Button>
            </div>
          </DialogContent>
        )}
        {(user?.lifeline_balance || 0) > 0 && (
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-left text-2xl tracking-wide">
                {t("lifeline_title_dialog")}
              </DialogTitle>
            </DialogHeader>
            <div className="flex flex-col text-sm">
              <p>{t("lifeline_desc_dialog")}</p>
              <div className="mt-2 flex items-center">
                <span>
                  {t("your_lifeline")}: {user?.lifeline_balance}
                </span>
                <span className="ml-1">
                  <LifeLineIcon />
                </span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <DialogClose asChild>
                <Button variant="outline" size="sm">
                  {t("no_btn")}
                </Button>
              </DialogClose>
              <Button
                size="sm"
                onClick={() => {
                  onSubmit();
                }}
              >
                {t("yes_btn")}
              </Button>
            </div>
          </DialogContent>
        )}
      </Dialog>
      <InviteFriendDialog
        open={inviteDialogOpen}
        onOpenChange={setInviteDialogOpen}
        user={user}
      />
    </>
  );
}
