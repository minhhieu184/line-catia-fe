import { DiamondIcon } from "@/assets/QuizPage/SVGs.tsx";
import rabbitImg from "@/assets/catia_eduverse_3d_rabbit.jpg";
import { useMe } from "@/lib/swr.ts";
import { cn } from "@/lib/utils.ts";
import type { LeaderboardUser } from "@/types/app.ts";

export default function LeaderboardItem({
  item,
  index,
  isMe,
}: { item: LeaderboardUser; index: number; isMe: boolean }) {
  const { data: user } = useMe();
  return (
    <>
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2">
          <img
            src={item?.avatar ? `/avatar/${item?.avatar}` : rabbitImg}
            alt={`avatar-${item?.user_id}`}
            className="h-12 w-12 rounded-full"
          />
          <div>
            <div className="font-semibold">
              {isMe
                ? user?.username || user?.first_name
                : !!item?.username
                  ? item?.username
                  : "ㅤ"}
            </div>
            <div className="flex items-center gap-1">
              <DiamondIcon />
              <div
                className={cn(
                  "font-semibold",
                  isMe ? "text-accent-foreground " : ""
                )}
              >
                {item.score}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-5 text-center text-sm font-semibold text-accent-foreground">
        #{index + 4}
      </div>
    </>
  );
}
