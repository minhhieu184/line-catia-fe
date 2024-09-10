import { Dialog, DialogContent } from "@/components/ui/dialog";
import type { Session } from "@/types/app";
import { ArrowLeftRight } from "lucide-react";
import { useState } from "react";
import { Button } from "./ui/button";

export default function LifelineButtons({
  session,
  onUsed,
}: {
  session: Session;
  onUsed: (v: string) => void;
}) {
  const [lifeline, setLifeline] = useState("");
  const [lifelineDialog, setLifelineDialog] = useState(false);

  function onUseLifeline() {
    onUsed(lifeline);
    setLifelineDialog(false);
    setLifeline("");
  }

  if (!session) return;

  return (
    <>
      <div className="flex gap-4">
        <Button
          onClick={() => {
            setLifeline("change_question");
            setLifelineDialog(true);
          }}
          className="bg-primary flex items-center justify-center"
          disabled={!session.lifeline?.change_question}
        >
          <ArrowLeftRight className="w-5 h-5 stroke-amber-400" />
        </Button>
        <Button
          onClick={() => {
            setLifeline("fifty_fifty");
            setLifelineDialog(true);
          }}
          className="bg-primary flex items-center justify-center font-medium text-sm"
          disabled={!session.lifeline?.fifty_fifty}
        >
          <span className="text-amber-400">50:50</span>
        </Button>
      </div>
      <Dialog open={lifelineDialog} onOpenChange={setLifelineDialog}>
        <DialogContent className="border-none w-[350px] rounded-md">
          <p className="mt-4 text-accent-foreground">
            You're about to use a lifeline, are you sure about this?
          </p>
          <div className="flex gap-4 justify-end">
            <Button
              variant="outline"
              onClick={() => setLifelineDialog(false)}
              className="text-accent-foreground"
            >
              No
            </Button>
            <Button variant="destructive" onClick={onUseLifeline}>
              Yes
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
