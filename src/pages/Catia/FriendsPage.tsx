import {
  DiamondStarIcon,
  QrcodeIcon,
  StarIcon,
} from "@/assets/MainPage/SVGs.tsx";
import { Loading } from "@/assets/loading.tsx";
import InviteFriendDialog from "@/components/Dialogs/InviteFriendDialog";
import Container from "@/components/Layout/Container";
import { ScrollArea } from "@/components/ui/scroll-area.tsx";
import { fetchTyped } from "@/lib/apiv2.ts";
import { useFriendClaim, useFriendClaimAll, useMe } from "@/lib/swr.ts";
import useCatiaStore from "@/lib/useCatiaStore";
import { cn } from "@/lib/utils.ts";
import type { Friend, Friends } from "@/types/app.ts";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useInView } from "react-intersection-observer";
import { toast } from "sonner";

const limit = 10;

export default function FriendsPage() {
  const { t } = useTranslation("friends");
  const token = useCatiaStore((state) => state.token);
  const inviteDialogOpen = useCatiaStore((state) => state.inviteDialogOpen);
  const setInviteDialogOpen = useCatiaStore(
    (state) => state.setInviteDialogOpen
  );
  const { data: user, mutate: mutateUser } = useMe();
  const { dispatch: actionClaimAll, isMutating: isLoading } =
    useFriendClaimAll();
  const [allFriends, setAllFriends] = useState<Friend[]>([]);
  const [totalFrens, setTotalFrens] = useState(0);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const isClaimed = allFriends?.every((f) => f?.claimed || !f?.validated);

  const [hasMore, setHasMore] = useState(true);
  const { ref, inView } = useInView({
    threshold: 0,
  });

  const loadFrens = () => {
    setLoading(true);
    return fetchTyped<Friends>(`/user/friends?page=${page}&limit=${limit}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        setLoading(false);
        return response?.data;
      })
      .catch(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    loadFrens().then((data) => {
      if (!data) return;
      if (!data?.friend_list) return;
      setAllFriends((prev) => [
        ...new Set([...(page ? prev : []), ...(data?.friend_list || [])]),
      ]);
      if (page === 0) {
        setTotalFrens(data?.friend_count || 0);
      }
    });
  }, [page]);

  useEffect(() => {
    if (allFriends?.length > 0 && totalFrens <= page * limit) {
      setHasMore(false);
    }
  }, [totalFrens, page, allFriends]);

  useEffect(() => {
    if (inView && hasMore) {
      setPage((prev) => prev + 1);
    }
  }, [inView, hasMore]);

  const handleClaim = (id: number) => {
    const newAllFriends = [...allFriends];
    const friendIdx = newAllFriends.findIndex((f) => f.id === id);
    newAllFriends[friendIdx].claimed = true;
    setAllFriends(newAllFriends);
  };

  const handleCalculatePage = (id: number) => {
    const friendIdx = allFriends.findIndex((f) => f.id === id);
    return Math.floor((friendIdx + 1) / limit);
  };

  return (
    <div className="flex flex-col h-[84dvh]">
      <Container className="flex flex-col w-full">
        <div className="pt-3">
          <div className="flex items-center justify-between gap-5 w-full">
            <h2 className="text-5xl font-semibold">{t("frens")}</h2>
            <div className="flex items-center justify-center gap-1">
              <StarIcon />
              <h6 className="text-3xl font-semibold leading-none">
                {user?.boosts ?? 0}
              </h6>
            </div>
          </div>
          <div className="flex items-center justify-between mt-5">
            <div className="relative min-w-[127px]">
              <div className="absolute ml-3 left-1/2 top-1/2 h-12 w-44 -translate-x-1/2 -translate-y-1/2 rounded-[100%] bg-[rgba(115,196,255,1)] blur-lg" />
              <div className="relative flex justify-center items-end gap-2 rounded-xl border border-primary bg-bgFriend px-4 py-1.5">
                <h6 className="text-4xl font-semibold text-freebies leading-9">
                  {totalFrens}
                </h6>
                <span className="font-light text-sm">{t("frens")}</span>
              </div>
            </div>
            <div className="flex items-center justify-center gap-2">
              <button
                type="button"
                className="bg-white p-3 rounded-xl hover:opacity-95"
                onClick={() => {
                  setInviteDialogOpen(true);
                }}
              >
                <QrcodeIcon />
              </button>
              <button
                onClick={() => {
                  actionClaimAll()
                    .then(() => {
                      setPage(0);
                      setHasMore(true);
                      setAllFriends([]);
                      loadFrens().then((data) => {
                        if (!data) return;
                        setAllFriends((prev) => [
                          ...new Set([...prev, ...(data?.friend_list || [])]),
                        ]);
                        setTotalFrens(data?.friend_count || 0);
                      });
                      mutateUser().then();
                      toast.success(t("claim_all_stars_toast"), {
                        id: "CLAIM_ALL_SUCCESS",
                      });
                    })
                    .catch(() => {
                      toast.error(t("claim_all_stars_error_toast"), {
                        id: "CLAIM_ALL_ERROR",
                      });
                    });
                }}
                type="button"
                disabled={isLoading || isClaimed}
                className={cn(
                  "h-11 leading-none min-w-[100px] rounded-xl font-semibold transition-all hover:from-[#19BFEF] hover:to-[#00E3D0]",
                  isLoading || isClaimed
                    ? "bg-[#DEDFE0]"
                    : "bg-gradient-to-r from-[#00E3D0] via-[#0DC9EB] to-[#19BFEF]"
                )}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <Loading />
                  </div>
                ) : (
                  t("claim_all")
                )}
              </button>
            </div>
          </div>
          <div className="mt-[38px] text-[#FDFDFDE5] font-light text-sm flex-nowrap gap-1">
            {t("frens_left")}{" "}
            <StarIcon width={16} height={16} className="inline" />{" "}
            {t("frens_right")}
          </div>
        </div>
      </Container>
      {loading && page === 0 ? (
        <div className="flex items-center justify-center h-full w-full">
          <Loading />
        </div>
      ) : (
        <ScrollArea className="flex-1 mt-3.5 px-5 scroll-container">
          <div className="relative flex flex-col items-center gap-2.5">
            {allFriends?.map((friend) => (
              <FriendItem
                friend={friend}
                key={friend.id}
                onCalculatePage={handleCalculatePage}
                onClaim={handleClaim}
                mutateUser={mutateUser}
                disabledClaim={isLoading}
              />
            ))}
            <div
              ref={ref}
              className="absolute left-0 bottom-0 w-full h-[1px]"
            />
          </div>
          {loading && (
            <div className="flex items-center justify-center">
              <Loading />
            </div>
          )}
        </ScrollArea>
      )}
      <InviteFriendDialog
        open={inviteDialogOpen}
        onOpenChange={setInviteDialogOpen}
        user={user}
      />
    </div>
  );
}

const FriendItem = ({
  friend,
  onClaim,
  onCalculatePage,
  mutateUser,
  disabledClaim,
}: {
  friend: Friend;
  onClaim: (id: number) => void;
  onCalculatePage: (id: number) => number;
  mutateUser: () => void;
  disabledClaim: boolean;
}) => {
  const lang = localStorage.getItem("i18nextLng");
  const { dispatch: actionClaim } = useFriendClaim({
    fId: friend.id,
    page: onCalculatePage(friend.id),
    limit: limit,
  });
  const { t } = useTranslation("friends");
  const [loading, setLoading] = useState(false);
  return (
    <div className="bg-bgFriend p-3 w-full rounded-xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div>
            <div className="w-12 h-12 rounded-full">
              <img src="/avt.png" alt="avatar" className="w-full h-full" />
            </div>
          </div>
          <div className="flex flex-col items-start gap-1">
            <h6 className="text-xl text-freebies font-semibold line-clamp-1">
              {friend?.last_name} {friend?.first_name}
            </h6>
            <div className="bg-bgFreebies px-2 py-1 rounded-lg flex items-center justify-center gap-0.5">
              <DiamondStarIcon />
              <span className="text-xs font-semibold leading-none">
                {friend?.gems}
              </span>
            </div>
          </div>
        </div>

        {!friend?.validated ? (
          <button
            type="button"
            className={`"px-8 py-2 bg-bgGray rounded-lg flex items-center justify-center gap-0.5 ${
              lang === "en" ? "w-[100px]" : "w-[120px]"
            } pointer-events-none"`}
          >
            <span className="text-white font-semibold leading-5">
              {t("claim")}
            </span>
          </button>
        ) : friend?.claimed ? (
          <button
            type="button"
            className={`px-8 py-2 rounded-lg border border-[#1ac1ef] flex items-center justify-center ${
              lang === "en" ? "w-[100px]" : "w-[120px]"
            } pointer-events-none`}
          >
            <span className="font-semibold leading-5 bg-gradient-to-r from-bgClaim via-[#0DC9EB] to-[#00E3D0] bg-clip-text text-transparent">
              {t("claimed")}
            </span>
          </button>
        ) : (
          <button
            type="button"
            className={`px-8 py-2 ${
              loading ? "bg-[#DEDFE0] h-9" : "bg-bgClaim"
            } rounded-lg flex items-center justify-center gap-0.5 ${
              lang === "en" ? "w-[100px]" : "w-[120px]"
            }`}
            disabled={disabledClaim}
            onClick={() => {
              setLoading(true);
              actionClaim().then(() => {
                onClaim(friend.id);
                mutateUser();
                setLoading(false);
              });
            }}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <Loading />
              </div>
            ) : (
              <>
                <div>
                  <StarIcon width={16} height={16} />
                </div>
                <span className="text-white font-semibold leading-5">
                  {t("claim")}
                </span>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};
