import { GameTaskIcon } from "@/assets/TaskPage/SVGs";
import {
  AttentionBadgeIcon,
  CloseIcon,
  EmergencyIcon,
  SuccessfulBadgeIcon,
  TelegramTaskIcon,
  TwitterIcon,
} from "@/components/icons";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet.tsx";
import { useGameCheckSocialTask, useMe } from "@/lib/swr.ts";
import { capitalizeAndReplaceUnderscore } from "@/lib/utils.ts";
import type { FetchTaskList } from "@/pages/Catia/TaskPage.tsx";
import type { Tasks } from "@/types/app.ts";
// import { useUtils } from "@telegram-apps/sdk-react";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";

interface TaskListProps extends FetchTaskList {
  isOpen: boolean;
  onClose: (val?: boolean) => void;
  tasks: Tasks[];
  game_slug: string;
  title: string;
  description?: string | null;
}

export const TaskList = (props: TaskListProps) => {
  const { t } = useTranslation("tasks");
  const {
    isOpen,
    onClose,
    tasks,
    game_slug,
    title,
    fetchTaskList,
    description,
  } = props;

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent
        side="bottom"
        hideCloseButton
        className="min-h-[400px] bg-gameDetail"
      >
        <div className="relative">
          <SheetHeader className="w-full">
            <SheetTitle className="mb-5">
              <p className="text-center text-[32px] font-semibold leading-[38.4px] text-accent-foreground text-freebies">
                {title || "Tasks"}
              </p>
              {description && (
                <p className="mt-1 text-base font-semibold text-secondary-foreground">
                  {description}
                </p>
              )}
            </SheetTitle>
            {isOpen ? (
              <div className="absolute right-0 top-[-5px]">
                <SheetClose>
                  <CloseIcon />
                </SheetClose>
              </div>
            ) : null}
          </SheetHeader>
          <div className="w-full">
            <div style={{ width: "100%" }} className="max-h-[340px]">
              {tasks
                ?.sort(
                  (task1, task2) =>
                    (task2.priority || 0) - (task1.priority || 0)
                )
                .sort(
                  (task1, task2) =>
                    (task1.joined ? 1 : 0) - (task2.joined ? 1 : 0)
                )
                .map((task) => {
                  return (
                    <TaskItem
                      fetchTaskList={fetchTaskList}
                      key={`${task.id}-${task.description}`}
                      game_slug={game_slug}
                      task={task}
                    />
                  );
                })}
            </div>
            {tasks.some((item) => item.required) && (
              <p className="mt-5 text-left text-sm font-normal leading-[19.6px] text-secondary-foreground">
                <EmergencyIcon className="mr-1 inline" />
                {t("task_left")} " <AttentionBadgeIcon className="inline" /> "{" "}
                {t("task_right")}
              </p>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

const TaskItem = ({
  task,
  game_slug,
  fetchTaskList,
}: { task: Tasks; game_slug: string } & FetchTaskList) => {
  const { mutate: mutateMe } = useMe();
  const [link, setLink] = useState<number>(-1);
  useGameCheckSocialTask(link, game_slug);
  // const utils = useUtils();

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
      className={`relative flex cursor-pointer items-center justify-between bg-secondary px-4 py-5 ${
        task.joined && "opacity-[50%]"
      } mt-4 w-full flex-1 rounded-[20px] text-freebies`}
      onClick={() => {
        !task.joined && setLink(task.id);
        /// await
        // task.link_type.includes("telegram") ||
        // task.link_type.includes("teletop")
        //   ? utils.openTelegramLink(task.ref_url || task.url)
        //   : utils.openLink(task.ref_url || task.url);
        window.open(task.ref_url || task.url, "_blank");
        setTimeout(() => {
          fetchTaskList()
            .then(() => mutateMe())
            .finally();
        }, 4000);
      }}
    >
      <div className="flex items-center gap-3">
        <div className="relative rounded-full bg-primary p-[5.25px]">
          <IconRender />
          {task.required && (
            <AttentionBadgeIcon className="absolute right-[-6px] top-[-10px]" />
          )}
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
        <div className="absolute right-[-5px] top-0 -translate-x-1 -translate-y-1/2">
          <SuccessfulBadgeIcon />
        </div>
      )}
    </div>
  );
};
