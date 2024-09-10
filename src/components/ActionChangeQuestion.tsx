import {
  useGameActionUseLifeline,
  useGameUseLifelineByStar,
  useMe,
} from "@/lib/swr";
import type { APIResponse, Session } from "@/types/app";
import { type PropsWithChildren, useState } from "react";
import { Button } from "./ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "./ui/dialog";

export default function ChangeQuestion({
  onSuccess,
  children,
  disabled,
}: {
  onSuccess(v: APIResponse<Session>): void;
  disabled?: boolean;
} & PropsWithChildren) {
  const { dispatch: actionUseLifeline } = useGameActionUseLifeline();
  const { dispatch: actionLifelineByStar } = useGameUseLifelineByStar();
  const [questionChangeModal, setQuestionChangeModal] = useState(false);
  const [isLifeline, setIsLifeline] = useState(true);
  const { data: user, mutate: userMutate } = useMe();

  function onSubmit() {
    actionUseLifeline("change_question", {
      onSuccess,
    });
    setQuestionChangeModal(false);
  }

  function onLifeLineSubmit() {
    if (!user?.boosts) {
      setIsLifeline(false);
      return;
    }
    actionLifelineByStar().then(() => {
      onSubmit();
      userMutate();
    });
  }

  return (
    <Dialog open={questionChangeModal} onOpenChange={setQuestionChangeModal}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      {disabled && (
        <DialogContent className="w-[80%] rounded-lg shadow-lg bg-background text-foreground">
          <DialogHeader>
            <strong>Swap lifeline</strong>
          </DialogHeader>
          <p className="flex flex-col gap-2">
            <span>Oh no! You've run out of swap lifeline.</span>
            <span>
              Redeem 1 Star for a question swap lifeline.{" "}
              {isLifeline && "Are you sure?"}
            </span>
            {!isLifeline && <span>Please earn more Star to redeem.</span>}
            <span>Your stars: {user?.boosts}</span>
          </p>
          {isLifeline && (
            <div className="flex gap-4 justify-end">
              <DialogClose asChild>
                <Button variant="outline">No</Button>
              </DialogClose>
              <Button
                variant="destructive"
                onClick={() => {
                  onLifeLineSubmit();
                }}
              >
                Yes
              </Button>
            </div>
          )}
        </DialogContent>
      )}
      {!disabled && (
        <DialogContent className="w-[80%] rounded-lg shadow-lg bg-background text-foreground">
          <DialogHeader>
            <strong>Swap lifeline</strong>
          </DialogHeader>
          <p className="flex flex-col gap-2">
            <span>Are you totally up for this swap?</span>
            <span>
              We'll trade the current question for another one of the same
              difficulty. This action cannot be undone, are you sure?
            </span>
          </p>
          <div className="flex gap-4 justify-end">
            <DialogClose asChild>
              <Button variant="outline">No</Button>
            </DialogClose>
            <Button
              variant="destructive"
              onClick={() => {
                onSubmit();
              }}
            >
              Yes
            </Button>
          </div>
        </DialogContent>
      )}
    </Dialog>
  );
}
