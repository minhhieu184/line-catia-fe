import { useGameCountDown } from "@/components/SessionCountdown.tsx";
import { FireIcon } from "@/components/icons";
import { Button } from "@/components/ui/button.tsx";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog.tsx";
import { useNewGame } from "@/lib/swr.ts";
import useCatiaStore from "@/lib/useCatiaStore.ts";
import type { PropsWithChildren } from "react";
import { useNavigate } from "react-router-dom";

export default function NewCampaignDialog({
  open,
  onOpenChange,
  newGame,
  children,
}: {
  open: boolean;
  newGame: string;
  onOpenChange: (open: boolean) => void;
} & PropsWithChildren) {
  const navigate = useNavigate();
  const { data: game } = useNewGame(newGame);
  const setGame = useCatiaStore((state) => state.setGame);
  const { gameCountdown: gameStartCountdown } = useGameCountDown({
    duration: game?.start_time,
  });
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent hideCloseButton={true} className="px-8 py-7">
        <DialogHeader>
          <DialogTitle className="text-5xl tracking-wide">Tada!</DialogTitle>
          <DialogDescription className="text-base">
            Hey buddy, try our new quiz.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-center">
            <div>
              <img
                src="/welcome-img.png"
                alt="welcome img"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center justify-end mr-2">
              <div className="bg-[#D04D47] px-1 py-0.5 rounded-md flex items-center justify-center gap-0.5">
                <FireIcon />
                <span className="text-xs font-semibold">NEW</span>
              </div>
            </div>
            <div className="flex items-center justify-center flex-col">
              <h2 className="text-3xl font-semibold">{game?.name}</h2>
              <p className="text-sm text-center text-[#A6ADBC]">
                {game?.description}
              </p>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-1 mt-5">
          <Button
            variant="default"
            onClick={() => {
              if (
                (game?.start_time && !gameStartCountdown) ||
                !game?.start_time
              ) {
                setGame(game);
                navigate(`/${game?.slug}`);
                onOpenChange(false);
                return;
              }

              navigate(`/quizzes`);
              onOpenChange(false);
            }}
          >
            Play Now
          </Button>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Later
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
