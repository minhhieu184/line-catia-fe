import { GemIcon } from "@/assets/MainPage/SVGs.tsx";
import { GiftHeart } from "@/assets/WelcomeDialog/SVGs";
import { Button } from "@/components/ui/button.tsx";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog.tsx";
import type { PropsWithChildren } from "react";
import { useNavigate } from "react-router-dom";

export default function WelcomeDialog({
  open,
  onOpenChange,
  children,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
} & PropsWithChildren) {
  const navigate = useNavigate();
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent hideCloseButton={true} className="bg-[#12274E]">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold flex flex-col text-freebies">
            Welcome to
            <div className="flex justify-center mt-2.5">
              <img src="/catia-text-logo.png" alt="catia-logo" />
            </div>
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-2.5 px-[25px] py-[15px] bg-[#091428] rounded-lg ">
          <div className="flex items-center justify-between gap-5">
            <div className="w-7 h-7">
              <GemIcon className="w-7 h-7" />
            </div>
            <p className="text-base font-semibold">
              Earn Gems while learning web3 & fun facts
            </p>
          </div>
          <div className="flex items-center justify-between gap-5">
            <div className="w-7 h-7">
              <GiftHeart />
            </div>
            <p className="text-base font-semibold">
              Get free premium whitelist spots & giveaways
            </p>
          </div>
        </div>
        <div className="flex flex-col justify-center items-center gap-3 w-full">
          <h2 className="text-2xl font-semibold text-freebies">
            Official Partners
          </h2>
          <div className="flex items-center justify-center gap-1.5 w-full">
            <div className="w-full">
              <img className="w-full" src="/partner-tether.png" alt="tether" />
            </div>
            <div className="w-full">
              <img className="w-full" src="/partner-aethir.png" alt="Aethir" />
            </div>
            <div className="w-full">
              <img
                className="w-full"
                src="/partner-gamefi.png"
                alt="GameFi.org"
              />
            </div>
          </div>
        </div>
        <Button
          variant="default"
          size="sm"
          className="mt-3 text-white text-[15px] from-[#00E3D0] via-[#0DC9EB] to-bgClaim"
          onClick={() => {
            navigate("/freebies");
            localStorage.setItem("running_tutorial", "true");
          }}
        >
          Let's go
        </Button>
      </DialogContent>
    </Dialog>
  );
}
