import { fetchTyped } from '@/lib/apiv2.ts';
import useCatiaStore from '@/lib/useCatiaStore.ts';
import type { TaskGroup } from '@/types/app.ts';
import useSWRImmutable from 'swr/immutable';

export const useTaskList = (shouldDisabled: boolean) => {
  const token = useCatiaStore((state) => state.idToken);
  const { data, error, isLoading, mutate } = useSWRImmutable(
    token && !shouldDisabled ? '/socials/tasks' : null,
    async (url) => {
      return await fetchTyped<TaskGroup[]>(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    }
  );

  return [{ data: data?.data || [], isLoading, error }, { fetchTaskList: mutate }] as const;
};
