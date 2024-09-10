import type { APIResponse, GameDetail } from "@/types/app";
import { API_V1 } from "./constants";
import { AppError } from "./error";

export async function fetchGame(game: string) {
  return fetchTyped<GameDetail>(`/game/${game}`);
}

export async function fetchListGames() {
  return fetchTyped<GameDetail[]>("/games");
}

export function fetchTyped<T, K = APIResponse<T>>(
  input: RequestInfo | URL,
  init?: RequestInit | undefined
): Promise<K> {
  let _input = input;
  if (typeof _input === "string" && !_input.startsWith("http")) {
    _input = `${API_V1 || ""}${_input}`;
  }

  if (init) {
    init.headers = {
      ...init.headers,
      "Content-Type": "application/json",
    };
  }

  return fetch(_input, init).then(async (response) => {
    if (response.ok) {
      const body = await response.json();
      if (body.code) {
        return Promise.reject(
          new AppError(body.code, body.message ?? "failed")
        );
      }

      return body;
    }

    try {
      const body = await response.json();
      if (body.code) {
        return Promise.reject(
          new AppError(body.code, body.message ?? "failed")
        );
      }
    } catch (err) {
      console.debug(err);
    }

    return Promise.reject(response.statusText);
  });
}
