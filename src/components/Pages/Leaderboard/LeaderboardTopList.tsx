import rabbitImg from "@/assets/catia_eduverse_3d_rabbit.jpg";
import LeaderboardTopItem from "@/components/Pages/Leaderboard/LeaderboardTopItem.tsx";
import { useMe } from "@/lib/swr.ts";
import type { Leaderboard } from "@/types/app.ts";

type LeaderboardTopListProps = {
  leaderboard: Leaderboard;
};

export default function LeaderboardTopList(props: LeaderboardTopListProps) {
  const { leaderboard } = props;
  const { data: user } = useMe();
  return (
    <div className="absolute w-full top-0 left-0 flex justify-center">
      {[1, 0, 2].map((index) => {
        const item =
          leaderboard &&
          leaderboard?.leaderboard &&
          leaderboard?.leaderboard[index];

        const avatar = item?.avatar ? `/avatar/${item.avatar}` : rabbitImg;
        const score = item?.score || 0;
        const username = item?.username || "";
        const isMe = user?.id === item?.user_id;

        const frameSrc =
          index === 0
            ? "/frame-gold.png"
            : index === 1
              ? "/frame-silver.png"
              : "/frame-bronze.png";

        return item ? (
          <LeaderboardTopItem
            key={item.user_id}
            avatar={avatar}
            frameSrc={frameSrc}
            score={score}
            username={username}
            isMe={isMe}
            transitionClasses={
              index === 0
                ? "translate-x-6 -translate-y-2"
                : "translate-x-2 -translate-y-1"
            }
          />
        ) : (
          <div className="w-[116px]" key={index} />
        );
      })}
    </div>
  );
}
