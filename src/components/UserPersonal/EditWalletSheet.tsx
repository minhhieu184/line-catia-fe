import { EmergencyIcon } from "@/assets/MainPage/SVGs";
import type { PropsWithChildren } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";

export default function EditWalletSheet({ children }: PropsWithChildren) {
  return (
    <Sheet>
      <SheetTrigger asChild className="cursor-pointer">
        {children}
      </SheetTrigger>
      <SheetContent side="bottom">
        <div className="text-3xl font-semibold">Edit Wallet</div>
        <Input
          wrapperClassName="mt-3"
          placeholder="Enter your address"
          label="Address"
        />
        <div className="relative mt-9 rounded-xl bg-[#12274E] px-4 pb-7 pt-8">
          <div className="absolute -top-5 left-1/2 -translate-x-1/2">
            <EmergencyIcon />
          </div>
          <div className="text-center">
            Your wallet is not verified. To verify, go to your wallet app and
            sign following message: userid@catia.io
          </div>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <Button variant="outline" className="text-md" size="sm">
              Copy
            </Button>
            <Button variant="outline" className="text-md" size="sm">
              Guide
            </Button>
          </div>
        </div>
        <Input
          wrapperClassName="mt-6"
          placeholder=""
          label="Verfication signature"
        />
        <div className="mt-5 flex gap-2">
          <Button className="text-md flex-1" size="sm">
            Save
          </Button>
          <Button variant="ghost" className="text-md" size="sm">
            Do this on web app
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
