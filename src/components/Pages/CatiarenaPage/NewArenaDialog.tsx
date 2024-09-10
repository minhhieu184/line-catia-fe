import Egg from "@/assets/CatiarenaPage/Egg.png";
import Fire from "@/assets/CatiarenaPage/Fire.png";
import NewCatiaArena from "@/assets/CatiarenaPage/NewCatiaArena.png";
import Seed from "@/assets/CatiarenaPage/Seed.png";
import { Button } from "@/components/ui/button.tsx";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog.tsx";
import useMediaQuery from "@/lib/hooks/useMediaQuery.ts";
import type { Arena } from "@/types/app.ts";
import { useNavigate } from "react-router-dom";

interface NewArenaDialogProps {
  open: boolean;
  onOpenChange: (status: boolean) => void;
  newCatiaArenaKeyLocal: string;
  arena: Arena;
}

export const NewArenaDialog = (props: NewArenaDialogProps) => {
  const { open, onOpenChange, newCatiaArenaKeyLocal, arena } = props;
  const navigate = useNavigate();
  const isSmallMobile = useMediaQuery("(max-width: 400px)");
  return (
    <Dialog
      open={open}
      onOpenChange={(status) => {
        onOpenChange(status);
        localStorage.setItem(newCatiaArenaKeyLocal, "false");
      }}
    >
      <DialogContent className="" hideCloseButton={true}>
        <DialogTitle hidden />
        <div className="relative flex items-center justify-center overflow-x-hidden rounded-xl pb-2 pt-2">
          <div className="flex flex-col items-center gap-3 text-center xs:gap-5">
            <div>
              <p className="mb-1 text-5xl font-semibold xs:text-3xl">Tada!</p>
              {/*<p className='text-[16px] text-[#A6ADBC] xs:text-sm'>Hey buddy, try our new Campaign</p>*/}
            </div>
            <div
              className={`relative flex ${
                isSmallMobile ? "h-[28dvh]" : "h-[32dvh]"
              } w-full justify-center`}
            >
              <img
                className={`absolute ${
                  isSmallMobile ? "top-[-22%]" : "top-[-27%]"
                } w-auto object-cover ${
                  isSmallMobile ? "h-[40dvh]" : "h-[48dvh]"
                } sm:h-[50dvh]`}
                src={NewCatiaArena}
                alt="Catia arena"
              />
            </div>
            <div className="flex flex-col items-center justify-center text-center">
              <div className="relative w-max">
                <div className="absolute right-0 top-[-22px] flex items-center gap-1 rounded-[6px] bg-[#D04D47] px-1 py-[2px]">
                  <img src={Fire} alt="Fire icon" />
                  <p className="text-[12px] font-semibold">NEW</p>
                </div>
                <p
                  className={`${
                    isSmallMobile ? "text-2xl" : "text-3xl"
                  } mb-1 font-semibold`}
                >
                  SEED Legend Challenge
                </p>
              </div>
              <p className="text-sm text-[#A6ADBC]">
                Compete for legend & epic eggs with SEED, the Telegram's no1
                farming app
              </p>
            </div>
            <p className="text-xl font-semibold">Rewards</p>
            <div className="flex w-full justify-between gap-[6px]">
              <div className="flex w-full items-center justify-center gap-1 rounded-[5px] bg-[#0A0A0A] p-[11px]">
                <img
                  className="h-5 w-5 translate-y-[1px]"
                  src={Egg}
                  alt="Egg icon"
                />
                <p className="text-[16px] font-semibold">Legend Egg</p>
              </div>
              <div className="flex w-full items-center justify-center gap-1 rounded-[5px] bg-[#0A0A0A] p-[11px]">
                <img
                  className="h-5 w-5 translate-y-[1px]"
                  src={Seed}
                  alt="Egg icon"
                />
                <p className="text-[16px] font-semibold">
                  {arena?.rewards?.seed || 1} SEED
                </p>
              </div>
            </div>
            <div className="flex w-full flex-col gap-1.5 xs:gap-2">
              <Button
                className="h-8 w-full text-xl xs:h-10"
                size="sm"
                onClick={() => {
                  onOpenChange(false);
                  localStorage.setItem(newCatiaArenaKeyLocal, "false");
                  navigate("/catiarena");
                }}
              >
                Play now
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
