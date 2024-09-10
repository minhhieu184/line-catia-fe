import { ComingSoonIcon } from "@/assets/MainPage/SVGs";
import { useCheckGamesList, useGameFreebies, useMe } from "@/lib/swr";
import { TOAST_IDS } from "@/lib/toast";
import { getTimeDifference } from "@/lib/utils";
import clsx from "clsx";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useTaskList } from "../Pages/TaskPage/useTaskList";
import {
  FriendsIcon,
  FriendsIconActive,
  HomeIcon,
  HomeIconActive,
  QuizIcon,
  QuizIconActive,
  TaskIcon,
  TaskIconActive,
} from "./Icon";

interface INavItem {
  title: string;
  route?: string;
  iconDefault: React.ReactNode;
  iconActive: React.ReactNode;
}

const NavItems: INavItem[] = [
  {
    title: "home",
    route: "/",
    iconDefault: <HomeIcon />,
    iconActive: <HomeIconActive />,
  },
  {
    title: "quizzes",
    route: "/quizzes",
    iconDefault: <QuizIcon />,
    iconActive: <QuizIconActive />,
  },
  {
    title: "tasks",
    route: "/tasks",
    iconDefault: <TaskIcon />,
    iconActive: <TaskIconActive />,
  },
  // {
  //   title: "leaderboard",
  //   route: "/leaderboard",
  //   iconDefault: <LeaderboardIcon />,
  //   iconActive: <LeaderboardIconActive />,
  // },
  // {
  //   title: "daily_gifts",
  //   iconDefault: <DailyGiftsIcon />,
  //   iconActive: <DailyGiftsIconActive />,
  // },
  {
    title: "frens",
    route: "/friends",
    iconDefault: <FriendsIcon />,
    iconActive: <FriendsIconActive />,
  },
];

export const Nav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { data: me } = useMe();
  const { data: freebies } = useGameFreebies(!me);
  const [{ data: taskGroup }] = useTaskList(!me);
  const { data: games } = useCheckGamesList(!me);
  const { t } = useTranslation("common");

  const isFreebiesClaimable = useMemo(() => {
    const now = new Date();
    if (!freebies || freebies.length < 1) return false;
    for (const freebie of freebies) {
      if (new Date(freebie.countdown).getTime() < now.getTime()) return true;
    }
    return false;
  }, [freebies]);

  const hasUndoneTask = useMemo(() => {
    for (const group of taskGroup) {
      if (!group) return false;
      for (const task of group.links) {
        if (!task) return false;
        if (!task.joined) return true;
      }
    }
    return false;
  }, [taskGroup]);

  const hasUndoneQuiz = useMemo(() => {
    if (!games) return false;
    const nowTimestamp = new Date().getTime();
    return games?.some(
      (game) =>
        !getTimeDifference(game?.countdown) &&
        (!game.game_start_time ||
          new Date(game.game_start_time).getTime() <= nowTimestamp) &&
        (!game.game_end_time ||
          new Date(game.game_end_time).getTime() > nowTimestamp)
    );
  }, [games]);

  return (
    <div className="py-3 px-3 xs:px-5">
      <nav className="mx-auto grid max-w-sm grid-cols-4 gap-1 rounded-xl bg-[#363D52] p-2">
        {NavItems.map((item) => (
          <div
            key={item.title}
            className="flex cursor-pointer relative flex-col items-center gap-1.5 rounded-lg bg-[#212429]/50 pb-2 pt-1.5"
            onClick={() => {
              if (item.route) {
                navigate(item.route);
              } else {
                toast.info(t("warn_toast"), { id: TOAST_IDS.COMING_SOON });
              }
            }}
          >
            {!item.route && (
              <ComingSoonIcon className="absolute -right-1 -top-1 w-4 h-4" />
            )}
            {location.pathname === item.route
              ? item.iconActive
              : item.iconDefault}
            <span
              className={clsx(
                "text-[10px] text-center font-medium leading-[1.1]",
                !item.route
                  ? "text-[#4B4B4B]"
                  : location.pathname === item.route
                    ? "text-white"
                    : "text-[#A5A5A5]"
              )}
            >
              {t(item.title)}
            </span>
            {((item.title === "freebies" && isFreebiesClaimable) ||
              (item.title === "tasks" && hasUndoneTask) ||
              (item.title === "quizzes" && hasUndoneQuiz)) && (
              <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-[#F73131] rounded-full" />
            )}
          </div>
        ))}
      </nav>
    </div>
  );
};
