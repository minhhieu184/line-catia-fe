import { Loading } from "@/assets/loading.tsx";
import Container from "@/components/Layout/Container.tsx";
import { TaskList } from "@/components/Pages/TaskPage/TaskList";
import { useTaskList } from "@/components/Pages/TaskPage/useTaskList";
import { SuccessfulBadgeIcon } from "@/components/icons";
import { ErrorBadgeIcon } from "@/components/icons/ErrorBadgeIcon.tsx";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useMe } from "@/lib/swr";
import useCatiaStore from "@/lib/useCatiaStore";
import { capitalizeAndReplaceUnderscore } from "@/lib/utils.ts";
import type { TaskGroup } from "@/types/app.ts";
import clsx from "clsx";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";

export interface FetchTaskList {
  fetchTaskList: () => Promise<any>;
}

interface TaskBoxProps extends FetchTaskList {
  taskGroup: TaskGroup;
  openGroup: string | null;
}

export default function TaskPage() {
  const { data: me } = useMe();
  const [{ data: taskGroup, isLoading: loading }, { fetchTaskList }] =
    useTaskList(!me);
  const { t } = useTranslation("tasks");
  const [params] = useSearchParams();
  const openGroup = params.get("group");
  if (loading)
    return (
      <div className="flex h-[100vh] w-[100vw] items-center justify-center">
        <Loading />
      </div>
    );

  return (
    <main className="h-full">
      <ScrollArea className="h-full">
        <Container>
          <div className="py-3 flex w-full flex-col gap-6">
            <h2 className="text-3xl font-semibold">{t("tasks")}</h2>
            <div className="flex w-full flex-col gap-[18px]">
              {taskGroup
                .sort(
                  (task1, task2) =>
                    (task2.priority || 0) - (task1.priority || 0)
                )
                .sort(
                  (task1, task2) =>
                    (task1.links?.some((link) => !link.joined) ? 0 : 1) -
                    (task2.links?.some((link) => !link.joined) ? 0 : 1)
                )
                .map((taskGroup) => {
                  return (
                    <TaskGroupBox
                      fetchTaskList={fetchTaskList}
                      key={taskGroup.game_slug}
                      taskGroup={taskGroup}
                      openGroup={openGroup}
                    />
                  );
                })}
            </div>
          </div>
        </Container>
      </ScrollArea>
    </main>
  );
}

const TaskGroupBox = (props: TaskBoxProps) => {
  const taskListSheetOpen = useCatiaStore((state) => state.taskListSheetOpen);
  const setTaskListSheetOpen = useCatiaStore(
    (state) => state.setTaskListSheetOpen
  );
  const { t } = useTranslation("tasks");
  const { taskGroup, openGroup, fetchTaskList } = props;
  const taskLength = taskGroup.links.length;
  const [isOpenTaskList, setIsOpenTaskList] = useState(
    openGroup === taskGroup.game_slug
  );

  const taskUndone = useMemo(() => {
    let taskUndone = 0;
    for (const task of taskGroup.links) {
      if (!task.joined) taskUndone++;
    }
    return taskUndone;
  }, [taskGroup]);

  const isPassedAll = useMemo(() => {
    let isPassed = true;
    for (const link of taskGroup.links) {
      if (!link.joined) {
        isPassed = false;
      }
    }
    return isPassed;
  }, [taskGroup]);

  return (
    <div
      className={clsx(
        "relative text-freebies",
        isPassedAll && "text-secondary-foreground"
      )}
    >
      <div
        onClick={() => {
          setIsOpenTaskList(true);
          setTaskListSheetOpen(true);
        }}
        className="relative flex w-full cursor-pointer items-center justify-between gap-6 rounded-[20px] border-b-[3px] border-r-[3px] border-primary bg-secondary px-5 py-4 transition-all duration-75 ease-linear active:translate-y-[2px] active:transform active:border-transparent"
      >
        <div className="flex items-center gap-2">
          <img
            className="h-10 w-10 rounded-full object-fill"
            src={taskGroup.logo || "/catia-logo.png"}
            alt="Catia logo"
          />
          <div className="flex w-full flex-col gap-[2px]">
            <p className="text-left text-[28px] font-semibold leading-[33.6px]">
              {taskGroup.title ||
                capitalizeAndReplaceUnderscore(taskGroup.game_slug)}
            </p>
            <span className="text-left text-sm font-normal leading-[19.6px] text-secondary-foreground">
              {taskLength} {taskLength > 1 ? t("tasks") : t("task")}
            </span>
          </div>
        </div>
        {isPassedAll ? (
          <SuccessfulBadgeIcon />
        ) : (
          <div className="relative rounded-full bg-primary p-1 text-center">
            <ErrorBadgeIcon className="absolute right-[-2px] top-[-2px]" />
            <p className="h-5 min-w-5 translate-y-[-1px] transform text-center text-[15px] font-bold leading-6 tracking-[0.4000000059604645px]">
              {taskUndone}
            </p>
          </div>
        )}
        {isPassedAll && (
          <div className="absolute inset-0 rounded-[20px] bg-black/40" />
        )}
      </div>
      <TaskList
        fetchTaskList={fetchTaskList}
        title={taskGroup.title || ""}
        game_slug={taskGroup.game_slug}
        tasks={taskGroup.links}
        description={taskGroup.description}
        isOpen={isOpenTaskList && taskListSheetOpen}
        onClose={(val?: boolean) => {
          setIsOpenTaskList(val ? val : false);
          setTaskListSheetOpen(val ? val : false);
        }}
      />
    </div>
  );
};
