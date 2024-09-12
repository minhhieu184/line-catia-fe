import type { Moon } from '@/components/Pages/HomePage/MoonTap';
import useCatiaStore from '@/lib/useCatiaStore';
import type {
  Arena,
  ArenaDetail,
  FreebiesResponse,
  Friends,
  Game,
  GameDetail,
  Leaderboard,
  Lifeline,
  ScoreHistory,
  Session,
  SocialTasks,
  User,
} from '@/types/app';
import { toUserFriendlyAddress } from '@tonconnect/ui-react';
import { useMatches } from 'react-router-dom';
import useSWR from 'swr';
import useSWRImmutable from 'swr/immutable';
import useSWRMutation from 'swr/mutation';
import { fetchTyped } from './apiv2';
import { API_V1 } from './constants';
import { useEffect } from 'react';

export function useMe() {
  const idToken = useCatiaStore((state) => state.idToken);
  console.log('useMe ~ idToken:', idToken);
  // console.log('useMe ~ token:', token)
  const referrer = useCatiaStore((state) => state.referrer);
  const url = idToken ? (referrer ? `/user/me?refCode=${referrer || ''}` : '/user/me') : null;
  const { data, error, isLoading, mutate } = useSWRImmutable(url, (url) => {
    localStorage.setItem('is_first_app', 'false');
    localStorage.setItem('is_reward', 'false');
    return fetchTyped<{ token: string; user: User }>(url, {
      headers: {
        Authorization: `Bearer ${idToken}`,
      },
    });
  });
  const accessToken = data?.data?.token;
  const setAccessToken = useCatiaStore((state) => state.setAccessToken);
  useEffect(() => {
    if (accessToken) {
      setAccessToken(accessToken);
    }
  }, [accessToken, setAccessToken]);

  return {
    data: data?.data
      ? ({
          ...data.data.user,
          ton_wallet: data.data.user.ton_wallet ? toUserFriendlyAddress(data.data.user.ton_wallet) : '',
          accessToken: data.data.token,
        } as User)
      : undefined,
    error,
    isLoading,
    mutate,
  };
}

export function useGameMe(shouldDisabled?: boolean) {
  const matches = useMatches();
  const gamePlay = matches.find((v) => v.id === 'quiz-detail');
  const quizGame = matches.find((v) => v.id === 'quiz-game');
  const arenaDetail = matches.find((v) => v.id === 'catiarena-detail');
  const token = useCatiaStore((state) => state.accessToken);
  const game = useCatiaStore((state) => state.game);
  const url = token && (gamePlay || quizGame || arenaDetail) && !shouldDisabled ? `/game/${game?.slug}/me` : null;
  const { data, error, isLoading, mutate } = useSWR(url, (url) =>
    fetchTyped<User>(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  );
  return { data: data?.data, error, isLoading, mutate };
}

export function useGameScoreMine() {
  const matches = useMatches();
  const gameLeaderboard = matches.find((v) => v.id === 'game-leaderboard');
  const quizGame = matches.find((v) => v.id === 'quiz-game');
  const gameOver = matches.find((v) => v.id === 'end-game');
  const game = useCatiaStore((state) => state.game);
  const token = useCatiaStore((state) => state.accessToken);
  const { data, error, isLoading } = useSWR(
    game && token && (gameLeaderboard || quizGame || gameOver) ? `/game/${game?.slug}/scores` : null,
    (url) =>
      fetchTyped<ScoreHistory>(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
  );

  return { data: data?.data, error, isLoading };
}

export function useGameSessionScore() {
  const game = useCatiaStore((state) => state.game);
  const token = useCatiaStore((state) => state.accessToken);
  const { data, error, isLoading } = useSWR(game && token ? `/game/${game?.slug}/last_session_score` : null, (url) =>
    fetchTyped<ScoreHistory>(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  );

  return { data: data?.data, error, isLoading };
}

export function useGameSessionMine() {
  const matches = useMatches();
  const gamePlay = matches.find((v) => v.id === 'quiz-detail');
  const arenaDetail = matches.find((v) => v.id === 'catiarena-detail');
  const game = useCatiaStore((state) => state.game);
  const token = useCatiaStore((state) => state.accessToken);
  const url = !game || !token || (!gamePlay && !arenaDetail) ? null : `/game/${game?.slug}/current_session`;
  const { data, error, isLoading, mutate } = useSWR(url, (url) =>
    fetchTyped<Session>(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  );

  return { data: data?.data, error, isLoading, mutate };
}

export function useGameLeaderboard() {
  const game = useCatiaStore((state) => state.game);
  const setGame = useCatiaStore((state) => state.setGame);
  const token = useCatiaStore((state) => state.accessToken);
  const pools = useCatiaStore((state) => state.pools);
  if (!game) {
    setGame(pools?.[0]);
  }
  const { data, error, isLoading } = useSWR(token ? `/game/${game?.slug}/leaderboard` : null, (url) =>
    fetchTyped<Leaderboard>(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  );

  return { data: data?.data, error, isLoading };
}

export function useArenaLeaderboard() {
  const arena = useCatiaStore((state) => state.arena);
  const token = useCatiaStore((state) => state.accessToken);

  const { data, error, isLoading } = useSWR(token && arena?.slug ? `/arena/${arena?.slug}/leaderboard` : null, (url) =>
    fetchTyped<Leaderboard>(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  );

  return { data: data?.data, error, isLoading };
}

export function useGeneralLeaderboard() {
  const token = useCatiaStore((state) => state.accessToken);
  const leaderboard = useCatiaStore((state) => state.leaderboard);
  const { data, error, isLoading } = useSWR(token ? `/leaderboard/${leaderboard}` : null, (url) =>
    fetchTyped<Leaderboard>(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  );

  return { data: data?.data, error, isLoading };
}

export function useGameFreebies(shouldDisabled: boolean) {
  const token = useCatiaStore((state) => state.accessToken);
  const { data, error, isLoading, mutate } = useSWRImmutable(
    token && !shouldDisabled ? '/user/freebies' : null,
    (url) =>
      fetchTyped<FreebiesResponse>(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
  );

  return {
    data: data?.data?.freebies,
    message: data?.data?.message,
    error,
    isLoading,
    mutate,
  };
}

export function useGameSocialTasks() {
  const token = useCatiaStore((state) => state.accessToken);
  const { data, error, isLoading } = useSWR(token ? '/socials/tasks/overall' : null, (url) =>
    fetchTyped<SocialTasks>(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  );

  return { data: data?.data, error, isLoading };
}

export function useGameCheckSocialTask(socialLink: number, game: string) {
  const token = useCatiaStore((state) => state.accessToken);
  const { data, error, isLoading, mutate } = useSWR(
    token && socialLink >= 0 ? `/socials/join/${game}/${socialLink}` : null,
    (url) =>
      fetchTyped<boolean>(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
  );
  return { data, error, isLoading, mutate };
}

export function useGameActionEndSession() {
  const game = useCatiaStore((state) => state.game);
  const token = useCatiaStore((state) => state.accessToken);

  const { trigger } = useSWRMutation(`/game/${game?.slug}/current_session/end`, (url: string) => {
    return fetchTyped<Session>(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  });

  return {
    dispatch: trigger,
  };
}

export function useGameActionUseLifeline() {
  const game = useCatiaStore((state) => state.game);
  const token = useCatiaStore((state) => state.accessToken);

  const { trigger } = useSWRMutation(
    `/game/${game?.slug}/current_session/assistance`,
    (url: string, { arg }: { arg: keyof Lifeline }) => {
      return fetchTyped<Session>(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          assistance_type: arg,
        }),
      });
    }
  );

  return {
    dispatch: trigger,
  };
}

export function useGameUseLifelineByStar() {
  const game = useCatiaStore((state) => state.game);
  const token = useCatiaStore((state) => state.accessToken);

  const { trigger } = useSWRMutation(`/game/${game?.slug}/convert-lifeline`, (url: string) => {
    return fetchTyped<any>(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  });

  return {
    dispatch: trigger,
  };
}

export function useGameActionAnswer() {
  const game = useCatiaStore((state) => state.game);
  const token = useCatiaStore((state) => state.accessToken);

  const { trigger } = useSWRMutation(
    `/game/${game?.slug}/current_session/answer`,
    (url: string, { arg }: { arg: any }) => {
      return fetchTyped<Session>(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(arg),
      });
    }
  );

  return {
    dispatch: trigger,
  };
}

export function useGameActionBoost() {
  const game = useCatiaStore((state) => state.game);
  const token = useCatiaStore((state) => state.accessToken);

  const { trigger } = useSWRMutation(`/game/${game?.slug}/reduce-countdown`, (url: string) => {
    return fetchTyped<Session>(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  });

  return {
    dispatch: trigger,
  };
}

export function useFreebiesClaim(action: string) {
  const token = useCatiaStore((state) => state.accessToken);

  const { trigger } = useSWRMutation(!token || !action ? null : `/user/freebies/claim/${action}`, (url: string) => {
    return fetchTyped<any>(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  });

  return { dispatch: trigger };
}

export function useFriends({ page, limit }: { page: number; limit: number }) {
  const token = useCatiaStore((state) => state.accessToken);

  const { data, error, isLoading, mutate } = useSWR(
    token ? `/user/friends?page=${page}&limit=${limit}` : null,
    (url) =>
      fetchTyped<Friends>(url, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    {
      revalidateIfStale: false,
    }
  );

  return { data: data?.data, error, isLoading, mutate };
}

export function useFriendClaimAll() {
  const token = useCatiaStore((state) => state.accessToken);

  const { trigger, isMutating } = useSWRMutation(token ? `/user/boost/claim-all` : null, (url: string) => {
    return fetchTyped<any>(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  });
  return { dispatch: trigger, isMutating };
}

export function useFriendClaim({ fId, page, limit }: { fId: number; page: number; limit: number }) {
  const token = useCatiaStore((state) => state.accessToken);
  const { trigger } = useSWRMutation(
    !token || !fId ? null : `/user/boost/claim/${fId}?page=${page}&limit=${limit}`,
    (url: string) => {
      return fetchTyped<any>(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    }
  );

  return { dispatch: trigger };
}

export function useGamesList() {
  const url = '/games';
  const { data, error, isLoading } = useSWR(url, (url) => {
    return fetchTyped<GameDetail[]>(url, { method: 'GET' });
  });

  return { data: data?.data, error, isLoading };
}

export function useCheckGamesList(shouldDisabled: boolean) {
  const url = '/game/game-list';
  const token = useCatiaStore((state) => state.accessToken);
  const { data, error, isLoading } = useSWR(token && !shouldDisabled ? url : null, (url) => {
    return fetchTyped<Game[]>(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  });

  return { data: data?.data, error, isLoading };
}

export function useNewGame(game: string) {
  const token = useCatiaStore((state) => state.accessToken);
  const { data, error, isLoading, mutate } = useSWR(token && game ? `/game/${game}` : null, (url) =>
    fetchTyped<GameDetail>(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
  );
  return { data: data?.data, error, isLoading, mutate };
}

export function useMoon(shouldDisabled: boolean) {
  const token = useCatiaStore((state) => state.accessToken);
  const url = token && !shouldDisabled ? `${API_V1}/moon` : null;
  const { data, error, isLoading, mutate } = useSWRImmutable(url, (url) => {
    return fetchTyped<Moon>(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  });

  return { data: data?.data, error, isLoading, mutate };
}

export function useArenaList(shouldDisabled: boolean) {
  const token = useCatiaStore((state) => state.accessToken);
  const url = token && !shouldDisabled ? `${API_V1}/arenas` : null;
  const { data, error, isLoading, mutate } = useSWRImmutable(url, (url) => {
    return fetchTyped<Arena[]>(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  });

  return { data: data?.data, error, isLoading, mutate };
}

export function useArenaDetail() {
  const token = useCatiaStore((state) => state.accessToken);
  const arena = useCatiaStore((state) => state.arena);
  const url = token ? `${API_V1}/arena/${arena?.slug || 'catia'}` : null;
  const { data, error, isLoading, mutate } = useSWR(url, (url) => {
    return fetchTyped<ArenaDetail>(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  });

  return { data: data?.data, error, isLoading, mutate };
}
