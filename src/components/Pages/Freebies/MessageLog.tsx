import { GuidanceArrowIcon, MegaPhoneIcon } from "@/components/icons";
import { Button } from "@/components/ui/button.tsx";
import { useNavigate } from "react-router-dom";

type MessageLogProps = {
  step: number;
};

export default function MessageLog(props: MessageLogProps) {
  const { step } = props;
  const navigate = useNavigate();

  return (
    <div className="relative w-full h-[132px] flex items-center justify-center bg-[#11658980] rounded-2xl mt-3">
      <div className="absolute left-0 bottom-0 -translate-x-1/4">
        <MegaPhoneIcon className="w-12 h-12" />
      </div>
      {step !== 3 && (
        <div className="absolute top-0 right-0 translate-x-1/2 -translate-y-10">
          <GuidanceArrowIcon className="h-[88px] w-[38px]" />
        </div>
      )}

      <div className="max-w-[288px] flex flex-col gap-3 justify-center items-center">
        {step === 1 ? (
          <p className="text-base text-[#FDFDFD] font-semibold text-center ">
            Click <span className="font-extrabold">Collect</span> to claim your
            first freebie!
          </p>
        ) : step === 2 ? (
          <p className="text-base text-[#FDFDFD] font-semibold text-center ">
            It takes some time to recharge. Now, collect the remaining freebies.
          </p>
        ) : (
          <p className="text-base text-[#FDFDFD] font-semibold text-center ">
            You’ve done it! Let’s explore the Catia Eduverse!
          </p>
        )}
        {step === 3 && (
          <Button
            variant="default"
            className="h-10 text-base max-w-[220px]"
            onClick={() => {
              navigate("/");
            }}
          >
            Yah, I am ready!
          </Button>
        )}
      </div>
    </div>
  );
}
