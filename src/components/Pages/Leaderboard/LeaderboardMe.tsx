import { CrownIcon } from "@/assets/MainPage/SVGs.tsx";
import { DiamondIcon } from "@/assets/QuizPage/SVGs.tsx";
import rabbitImg from "@/assets/catia_eduverse_3d_rabbit.jpg";
import { useMe } from "@/lib/swr.ts";
import type { Leaderboard } from "@/types/app.ts";

type LeaderboardMeProps = {
  leaderboard: Leaderboard;
};

export default function LeaderboardMe(props: LeaderboardMeProps) {
  const { leaderboard } = props;
  const { data: user } = useMe();
  return (
    <div className="fixed bottom-0 left-0 w-full bg-[#21242966] backdrop-blur mx-auto px-6 py-2 z-20">
      <div className="flex items-center justify-between rounded-3xl bg-[#091428] py-2.5 px-4 ">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <img
              src={
                leaderboard?.me?.avatar
                  ? `/avatar/${leaderboard?.me?.avatar}`
                  : rabbitImg
              }
              alt=""
              className="h-12 w-12 rounded-full"
            />
            <div>
              <div className="font-semibold">{user?.username}</div>
              <div className="flex items-center gap-1">
                <DiamondIcon />
                <div className="font-semibold text-accent-foreground">
                  {leaderboard?.me?.score}
                </div>
              </div>
            </div>
          </div>
        </div>
        {leaderboard?.me?.rank ? (
          leaderboard?.me?.rank > 3 ? (
            <div className="text-center text-sm font-semibold text-accent-foreground">
              {leaderboard?.me?.rank ? `#${leaderboard?.me?.rank}` : "-/-"}
            </div>
          ) : (
            <>
              {leaderboard?.me?.rank === 1 && <CrownIcon fill="#FFD54B" />}
              {leaderboard?.me?.rank === 2 && <CrownIcon fill="#CFCFCF" />}
              {leaderboard?.me?.rank === 3 && <CrownIcon fill="#F6B191" />}
            </>
          )
        ) : (
          "-/-"
        )}
      </div>
    </div>
  );
}
