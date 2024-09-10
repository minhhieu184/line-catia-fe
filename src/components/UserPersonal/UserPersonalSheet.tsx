import {
  CopyIcon,
  GemIcon,
  LifeLineIcon,
  RabbitIcon,
  StarIcon,
  TelegramFillIcon,
} from "@/assets/MainPage/SVGs";
import { fetchTyped } from "@/lib/apiv2";
import { API_V1 } from "@/lib/constants";
import { useMe } from "@/lib/swr";
import { TOAST_IDS } from "@/lib/toast";
import useCatiaStore from "@/lib/useCatiaStore";
import { cn, shorten } from "@/lib/utils";
import {
  type TonProofItemReplySuccess,
  toUserFriendlyAddress,
  useTonConnectUI,
  useTonWallet,
} from "@tonconnect/ui-react";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import {
  Fragment,
  type PropsWithChildren,
  useEffect,
  useRef,
  useState,
} from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { TwitterIcon } from "../icons";
import { Button } from "../ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "../ui/sheet";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";

import { useUtils } from "@telegram-apps/sdk-react";
import { useTranslation } from "react-i18next";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import "./index.scss";

const socials: { url: string; type: "TELEGRAM" | "X" }[] = [
  { url: "https://t.me/+xAg-y5zAQuQyNjI9", type: "TELEGRAM" },
  { url: "https://t.me/+dH64omsI6W01MDg1K", type: "TELEGRAM" },
  { url: "https://x.com/WeAreCatia", type: "X" },
];

export default function UserPersonalSheet({
  children,
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: (state: boolean) => void;
} & PropsWithChildren) {
  const { data: user, mutate } = useMe();
  const utils = useUtils();
  const [showWalletAddress, setShowWalletAddress] = useState(false);
  const [walletTab, setWalletTab] = useState("ton");
  const [showDialogConfirm, setShowDialogConfirm] = useState(false);
  const [loadingConnectTon, setLoadingConnectTon] = useState(false);
  const [nonce, setNonce] = useState("");
  const { t } = useTranslation("common");
  const tonWallet = useTonWallet();
  const [tonConnectUI] = useTonConnectUI();
  const firstProofLoading = useRef<boolean>(true);
  const token = useCatiaStore((state) => state.token);
  const hasNft = !!user?.avatar;

  const randomString = (length = 12) => {
    const preset =
      "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
    const len = preset.length - 1;

    let a = "";

    for (a = ""; a.length < length; ) {
      a += preset[(Math.random() * len) | 0];
    }

    return a;
  };

  useEffect(() => {
    if (tonConnectUI && !tonWallet?.connectItems?.tonProof) {
      tonConnectUI.disconnect();
    }
  }, [tonConnectUI, tonWallet]);

  useEffect(() => {
    if (!tonConnectUI) return;

    if (firstProofLoading.current) {
      const nonce = randomString(12);
      setNonce(nonce);
      tonConnectUI.setConnectRequestParameters({
        state: "ready",
        value: { tonProof: nonce },
      });
    } else {
      tonConnectUI.setConnectRequestParameters({ state: "loading" });
    }
  }, [tonConnectUI, firstProofLoading]);

  useEffect(() => {
    if (tonWallet?.connectItems?.tonProof) {
      setShowDialogConfirm(true);
      return;
    }
  }, [tonWallet]);

  const connectTonWallet = async () => {
    if (!token) return;

    if (!tonWallet?.connectItems?.tonProof) {
      tonConnectUI.disconnect();
      return;
    }

    setShowDialogConfirm(false);
    setLoadingConnectTon(true);

    const proof = tonWallet.connectItems.tonProof as TonProofItemReplySuccess;

    await fetchTyped<string>(`${API_V1}/user/connect/ton`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        address: tonWallet.account.address,
        nonce,
        proof: {
          ...proof.proof,
          state_init: tonWallet.account.walletStateInit,
        },
      }),
    })
      .then(async () => {
        toast.success(t("success_toast"));
        await mutate();
      })
      .catch((e) => {
        toast.error(e?.message || t("verify_signature_toast"));
        console.log(e);
        return "";
      })
      .finally(() => {
        setLoadingConnectTon(false);
      });
  };

  return (
    <div>
      {isOpen && (
        <div
          onClick={() => {
            setIsOpen(false);
          }}
          className="fixed inset-0 z-50 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
        />
      )}
      <Sheet open={isOpen} onOpenChange={setIsOpen} modal={false}>
        <SheetTrigger asChild className="cursor-pointer">
          {children}
        </SheetTrigger>
        <SheetContent
          side="bottom"
          hideCloseButton
          onInteractOutside={(e) => {
            e.preventDefault();
          }}
        >
          <SheetTitle />
          {isOpen && (
            <div className="absolute -top-10 left-12">
              <div className="h-20 w-20 rounded-full bg-gradient-to-b from-[#19BFEF] to-[#00E3D0] p-1">
                <div
                  className="h-full w-full rounded-full bg-cover bg-center"
                  style={{
                    backgroundImage: hasNft
                      ? `url('./avatar/${user?.avatar}')`
                      : "url('https://d17mt0dwfjb4ne.cloudfront.net/catia_eduverse_default_avatar.png')",
                  }}
                />
              </div>
            </div>
          )}
          <div className="mt-6 flex items-center justify-between">
            <div className="space-x-1 text-3xl font-semibold">
              {user?.first_name ? `${user.first_name} ` : ""}
              {user?.last_name || ""}
            </div>
            {/* <div className='flex items-center gap-2 rounded-xl bg-[#12274E] px-3 py-1.5'>
            <QuizPowerIcon />
            <div className='text-xs'>
              <div>Quiz power</div>
              <div className='font-semibold'>32</div>
            </div>
          </div> */}
          </div>
          {/* <div className='flex items-center gap-1'>
          <div className='text-xs font-semibold opacity-75'>Beginner</div>
          <UserLevelIcon />
        </div> */}
          <div className="text-xs font-semibold">@{user?.username || ""}</div>
          <div className="mt-2.5 rounded-lg bg-[#12274E] px-4 py-3 backdrop-blur-sm">
            <div className="flex items-center gap-2">
              <div className="text-[15px] font-semibold">{t("wallet")}</div>
              <Tabs value={walletTab} onValueChange={setWalletTab}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="ton" className="h-full">
                    TON
                  </TabsTrigger>
                  <TabsTrigger value="evm">EVM</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            {walletTab === "evm" && (
              <div className="mt-2 flex items-center">
                <div
                  className={cn(
                    "relative flex h-6 flex-1 items-center gap-2 truncate rounded-full px-2 text-xs",
                    user?.evm_wallet
                      ? "border border-[#19BFEF]"
                      : "bg-[#B2B2B2]"
                  )}
                >
                  {user?.evm_wallet ? (
                    <>
                      <div className="w-full truncate pr-6">
                        {showWalletAddress
                          ? shorten(user.evm_wallet, 24)
                          : shorten(user.evm_wallet, 24).replaceAll(/./g, "*")}
                      </div>
                      <button
                        type="button"
                        className="absolute right-2 [&>svg]:w-4"
                        onClick={() => setShowWalletAddress(!showWalletAddress)}
                      >
                        {showWalletAddress ? <Eye /> : <EyeOff />}
                      </button>
                    </>
                  ) : (
                    t("not_connected")
                  )}
                </div>
                {user?.evm_wallet ? (
                  <CopyToClipboard
                    text={user?.evm_wallet || ""}
                    onCopy={() =>
                      toast.success(t("wallet_copy_toast"), {
                        id: TOAST_IDS.COPIED,
                      })
                    }
                  >
                    <button type="button" className="ml-2.5 [&>svg]:w-5">
                      <CopyIcon />
                    </button>
                  </CopyToClipboard>
                ) : (
                  <Button size="xs" className="ml-2.5" disabled>
                    {t("connect")}
                  </Button>
                )}

                {/* <EditWalletSheet>
                <Button size='xs' className='h-4'>
                  Edit
                </Button>
              </EditWalletSheet> */}
              </div>
            )}

            {walletTab === "ton" && (
              <div className="mt-2 flex w-full items-center">
                {user?.ton_wallet && (
                  <div
                    className={cn(
                      "relative flex h-6 flex-1 items-center gap-2 truncate rounded-full px-2 text-xs",
                      user.ton_wallet
                        ? "border border-[#19BFEF]"
                        : "bg-[#B2B2B2]"
                    )}
                  >
                    <div className="w-full truncate pr-6">
                      {showWalletAddress
                        ? shorten(user.ton_wallet, 24)
                        : shorten(user.ton_wallet, 24).replaceAll(/./g, "*")}
                    </div>
                    <button
                      type="button"
                      className="absolute right-2 [&>svg]:w-4"
                      onClick={() => setShowWalletAddress(!showWalletAddress)}
                    >
                      {showWalletAddress ? <Eye /> : <EyeOff />}
                    </button>
                  </div>
                )}
                {user?.ton_wallet ? (
                  <CopyToClipboard
                    text={user.ton_wallet || ""}
                    onCopy={() =>
                      toast.success(t("wallet_copy_toast"), {
                        id: TOAST_IDS.COPIED,
                      })
                    }
                  >
                    <button type="button" className="ml-2.5 [&>svg]:w-5">
                      <CopyIcon />
                    </button>
                  </CopyToClipboard>
                ) : (
                  <div className="w-full">
                    {loadingConnectTon && (
                      <Loader2 size={16} className="mx-auto animate-spin" />
                    )}

                    <Dialog
                      open={
                        showDialogConfirm && !!tonWallet?.connectItems?.tonProof
                      }
                      onOpenChange={(val) => {
                        setShowDialogConfirm(val);
                        tonConnectUI.disconnect();
                      }}
                    >
                      {!loadingConnectTon && (
                        <DialogTrigger
                          asChild
                          onClick={() => {
                            setTimeout(
                              () => (document.body.style.pointerEvents = ""),
                              0
                            );
                          }}
                        >
                          <Button
                            className="h-6 w-full truncate rounded-full px-2 text-xs"
                            onClick={() => {
                              tonConnectUI.openModal();
                            }}
                          >
                            {t("connect")}
                          </Button>
                        </DialogTrigger>
                      )}
                      <DialogTitle />
                      <DialogContent
                        hideCloseButton
                        className="flex w-[350px] flex-col gap-4 rounded-md border-none"
                      >
                        <div className="text-center font-bold">
                          Your TON wallet:{" "}
                          {!!tonWallet &&
                            shorten(
                              toUserFriendlyAddress(tonWallet.account.address),
                              14
                            )}
                        </div>
                        <div className="text-center">
                          This TON wallet will be bound to your account. This
                          action cannot be reversed. Are you sure?
                        </div>
                        <div className="flex items-center justify-center gap-2">
                          <Button
                            className="px-2 py-1 text-sm"
                            onClick={() => {
                              connectTonWallet();
                            }}
                          >
                            Yes, I'm sure
                          </Button>
                          <button
                            type="button"
                            className="px-2 py-1 text-sm"
                            onClick={() => {
                              setShowDialogConfirm(false);
                              tonConnectUI.disconnect();
                            }}
                          >
                            No, I'm not
                          </button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                )}

                {/* <EditWalletSheet>
                <Button size='xs' className='h-4'>
                  Edit
                </Button>
              </EditWalletSheet> */}
              </div>
            )}

            <div className={cn("mt-4", hasNft && "grid grid-cols-2 gap-3")}>
              <div
                className={cn(
                  "grid gap-2.5",
                  hasNft ? "grid-cols-2" : "grid-cols-4",
                  "[&>div>div>div]:text-sm [&>div>div>div]:font-bold",
                  "[&>div>div>svg]:h-5",
                  "[&>div>div]:flex [&>div>div]:h-full [&>div>div]:flex-col [&>div>div]:items-center [&>div>div]:justify-center [&>div>div]:gap-[5px] [&>div>div]:rounded-lg [&>div>div]:bg-[#313E55]",
                  "[&>div]:h-[70px] [&>div]:rounded-lg [&>div]:bg-gradient-to-b [&>div]:from-[#54C0EB] [&>div]:to-[#32363C] [&>div]:p-[1px]"
                )}
              >
                <div>
                  <div>
                    <GemIcon />
                    <div>{user?.total_score || 0}</div>
                  </div>
                </div>
                <div>
                  <div>
                    <StarIcon />
                    <div>{user?.boosts || 0}</div>
                  </div>
                </div>
                {/* <div>
                  <LuckyWheelIcon />
                  <div>22</div>
                </div> */}
                <div>
                  <div>
                    <LifeLineIcon />
                    <div>{user?.lifeline_balance || 0}</div>
                  </div>
                </div>
                <div>
                  <div>
                    <RabbitIcon />
                    <div>?</div>
                  </div>
                </div>
                {/* <div>
                  <PuzzleIcon />
                  <div>3</div>
                </div>
                <div>
                  <RabbitIcon />
                  <div>3</div>
                </div> */}

                {/*<ExchangeSheet>*/}
                {/*  <Button variant='outline' size='xs' className=' mt-4 w-full'>*/}
                {/*    Get more*/}
                {/*  </Button>*/}
                {/*</ExchangeSheet>*/}
              </div>
              {hasNft && (
                <div
                  className="rounded-lg bg-cover bg-center"
                  style={{
                    backgroundImage: hasNft
                      ? `url('./avatar/${user?.avatar}')`
                      : "url('https://d17mt0dwfjb4ne.cloudfront.net/catia_eduverse_default_avatar.png')",
                  }}
                />
              )}
            </div>
          </div>
          <Link to="/friends" onClick={() => setIsOpen(false)}>
            <Button className="mt-3 h-9 w-full text-[15px]">
              {t("frens")}
            </Button>
          </Link>
          <div className="mt-5 flex items-center justify-center gap-2 [&>button]:h-5 [&>button]:w-5 [&>button]:p-0 [&_svg]:w-3">
            {socials.map(({ type, url }) => (
              <Fragment key={url}>
                {type === "TELEGRAM" ? (
                  <Button onClick={() => utils.openTelegramLink(url)}>
                    <TelegramFillIcon />
                  </Button>
                ) : (
                  <Button onClick={() => utils.openLink(url)}>
                    <TwitterIcon />
                  </Button>
                )}
              </Fragment>
            ))}
          </div>
          <div className="mt-2 text-center text-xs opacity-60">
            © Catia Eduverse {APP_VERSION}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
