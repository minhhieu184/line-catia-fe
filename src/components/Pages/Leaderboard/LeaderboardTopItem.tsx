import rabbitImg from "@/assets/catia_eduverse_3d_rabbit.jpg";
import { useMe } from "@/lib/swr.ts";

export default function LeaderboardTopItem({
  avatar,
  username,
  score,
  frameSrc,
  additionalClasses = "",
  transitionClasses = "translate-x-2 -translate-y-2",
  isMe,
}: {
  avatar?: string;
  username: string;
  score: number;
  frameSrc: string;
  additionalClasses?: string;
  transitionClasses?: string;
  isMe: boolean;
}) {
  const { data: user } = useMe();

  return (
    <div
      className={`relative flex flex-col justify-start items-center w-[116px] ${additionalClasses}`}
    >
      <div className="relative">
        <img className="relative z-[1]" src={frameSrc} alt="frame" />
        <div
          className={`absolute bottom-0 left-0 ${transitionClasses} w-11 h-11 rounded overflow-hidden`}
        >
          <img src={avatar ?? rabbitImg} alt="avt" className="w-full h-full" />
        </div>
      </div>
      <p
        className={`line-clamp-1 text-center font-bold ${
          isMe ? "text-primary" : ""
        }`}
      >
        {isMe
          ? user?.username
            ? user?.username
            : user?.first_name
          : username
            ? username
            : "*****"}
      </p>
      <div className="flex gap-1 items-center justify-center mb-1.5">
        <img src="/gem.png" alt="gem" />
        <p className={`font-semibold ${isMe ? "text-primary" : ""}`}>{score}</p>
      </div>
    </div>
  );
}
