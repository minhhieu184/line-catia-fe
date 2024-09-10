import { CollapseExpandIcon } from "@/assets/CatiarenaPage/SVGs";
import { GameTaskIcon } from "@/assets/TaskPage/SVGs";
import {
  SuccessfulBadgeIcon,
  TelegramTaskIcon,
  TwitterIcon,
} from "@/components/icons";
import { useArenaDetail, useGameCheckSocialTask, useMe } from "@/lib/swr";
import { capitalizeAndReplaceUnderscore } from "@/lib/utils";
import type { APIResponse, ArenaDetail, Tasks } from "@/types/app";
// import { useUtils } from "@telegram-apps/sdk-react";
import clsx from "clsx";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import type { KeyedMutator } from "swr";

const ArenaTasks = ({
  tasks,
  gameSlug,
  isArenaActive,
  tasksDone,
}: {
  tasks?: Tasks[];
  gameSlug?: string;
  isArenaActive: boolean;
  tasksDone: boolean;
}) => {
  const { t } = useTranslation("arenas");
  const { mutate: mutateArena } = useArenaDetail();
  const [isExpanded, setIsExpanded] = useState(!tasksDone);

  return (
    <div
      className={clsx(
        "mt-3 rounded-3.5xl bg-gradient-to-r from-[#354A57] to-[#292E49] p-3 overflow-hidden transition-all",
        !isExpanded && "max-h-[53px]"
      )}
    >
      <div className="flex items-center justify-between">
        <h4 className="text-2xl font-semibold">{t("tasks")}</h4>
        <button type="button" onClick={() => setIsExpanded(!isExpanded)}>
          <CollapseExpandIcon
            className={clsx(
              "transition-transform",
              !isExpanded && "rotate-180"
            )}
          />
        </button>
      </div>

      {isExpanded && (
        <div className="mt-2.5 flex flex-col gap-2">
          {tasks
            ?.sort(
              (task1, task2) => (task2.priority || 0) - (task1.priority || 0)
            )
            .sort(
              (task1, task2) => (task1.joined ? 1 : 0) - (task2.joined ? 1 : 0)
            )
            .map((task) => {
              if (gameSlug)
                return (
                  <TaskItem
                    mutateArena={mutateArena}
                    key={`${task.id}-${task.description}`}
                    gameSlug={gameSlug}
                    task={task}
                    isArenaActive={isArenaActive}
                  />
                );
            })}
        </div>
      )}
    </div>
  );
};

export default ArenaTasks;

const TaskItem = ({
  task,
  gameSlug,
  mutateArena,
  isArenaActive,
}: {
  task: Tasks;
  gameSlug: string;
  mutateArena: KeyedMutator<APIResponse<ArenaDetail>>;
  isArenaActive: boolean;
}) => {
  // const utils = useUtils();
  const { mutate: mutateMe } = useMe();
  const [socialLink, setSocialLink] = useState<number>(-1);
  const taskPending = localStorage.getItem("task-pending");
  const { mutate: mutateGameCheck } = useGameCheckSocialTask(
    socialLink,
    gameSlug
  );

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (!taskPending) return;
    if (taskPending) {
      setSocialLink(+taskPending);
      mutateGameCheck();

      setTimeout(() => {
        isArenaActive &&
          mutateArena()
            .then(() => {
              localStorage.removeItem("task-pending");
              mutateMe();
            })
            .finally();
      }, 1000);
    }
  }, [taskPending]);

  const IconRender = useCallback(() => {
    const link = task.link_type;
    switch (link) {
      case "telegram_channel":
        return <TelegramTaskIcon className="h-5 w-5" />;
      case "telegram_group":
        return <TelegramTaskIcon className="h-5 w-5" />;
      case "twitter":
        return <TwitterIcon className="h-5 w-5" />;
      case "teletop":
        return <GameTaskIcon className="h-5 w-5" />;
      case "telegram_app":
        return <GameTaskIcon className="h-5 w-5" />;
      default:
        return <TelegramTaskIcon className="h-5 w-5" />;
    }
  }, [task]);

  return (
    <div
      className={clsx(
        "relative flex w-full flex-1 cursor-pointer items-center justify-between rounded-[20px] bg-[#091428] px-4 py-5 text-freebies",
        (task.joined || !isArenaActive) && "opacity-[50%]"
      )}
      onClick={() => {
        if (!task.joined && isArenaActive) {
          localStorage.setItem("task-pending", `${task.id}`);
          setSocialLink(task.id);
        }

        // task.link_type.includes("telegram") ||
        // task.link_type.includes("teletop")
        //   ? utils.openTelegramLink(task.ref_url || task.url)
        //   : utils.openLink(task.ref_url || task.url);
        window.open(task.ref_url || task.url, "_blank");

        setTimeout(() => {
          isArenaActive &&
            mutateArena()
              .then(() => {
                localStorage.removeItem("task-pending");
                mutateMe();
              })
              .finally();
        }, 4000);
      }}
    >
      <div className="flex items-center gap-3">
        <div className="relative rounded-full bg-primary p-[5.25px]">
          <IconRender />
        </div>
        <p className="text-left text-xl font-semibold leading-6 text-freebies">
          {task.description ||
            `Join ${capitalizeAndReplaceUnderscore(task.link_type)}`}
        </p>
      </div>
      <div className="flex items-center gap-[5px]">
        <img src="/gem.png" alt="Gem" />
        <p className="text-left text-xl font-semibold leading-6 text-freebies">
          {task.star}
        </p>
      </div>
      {task.joined && (
        <div className="absolute -right-1 -top-1">
          <SuccessfulBadgeIcon />
        </div>
      )}
    </div>
  );
};
