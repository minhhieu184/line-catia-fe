import { useArenaList, useMe } from "@/lib/swr.ts";
import type { Arena } from "@/types/app.ts";
import { useEffect, useState } from "react";

export const useCheckNewCatiaArena = () => {
  const { data: me } = useMe();
  const { data: arenas } = useArenaList(!me);
  const [currentOpenedArena, setCurrentOpenedArena] = useState<Arena | null>(
    null
  );
  const [newCatiaArenaKeyLocal, setNewCatiaArenaKeyLocal] = useState(
    `is_new_catiaarena:${me?.id || ""}:`
  );

  const checkNewArenaCampaign = () => {
    if (!arenas) return false;
    let isAlreadyHadNewArena = 0;

    const currentDate = new Date().getTime();
    arenas.map((arena) => {
      const isNewArenaKeyLocal = `is_new_catiaarena:${me?.id || ""}:${
        arena.id
      }`;
      if (!arena.start_date || !arena.end_date) return;
      const arenaStartDate = new Date(arena.start_date).getTime();
      const arenaEndDate = new Date(arena.end_date).getTime();
      if (arenaStartDate <= currentDate && arenaEndDate > currentDate) {
        setNewCatiaArenaKeyLocal(isNewArenaKeyLocal);
        const isNewArenaKeyLocalStatus =
          localStorage.getItem(isNewArenaKeyLocal);
        if (!isNewArenaKeyLocalStatus || isNewArenaKeyLocalStatus === "true") {
          setCurrentOpenedArena(arena);
          isAlreadyHadNewArena++;
        }
        // else if (isAlreadyHadNewArena) {
        //   localStorage.setItem(isNewArenaKeyLocal, "true");
        //   setNewCatiaArenaKeyLocal(isNewArenaKeyLocal);
        // }
      }
    });
  };

  useEffect(() => {
    checkNewArenaCampaign();
  }, [arenas]);

  return [
    {
      currentOpenedArena,
      newCatiaArenaKeyLocal,
    },
    {
      onChangeNewCatiaArenaStatus: (status: boolean) => {
        setCurrentOpenedArena(!status ? null : currentOpenedArena);
      },
    },
  ];
};
