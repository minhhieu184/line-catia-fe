import type { APIResponse, Session } from "@/types/app";
import { fetchAuth } from "./request";

export async function nextQuestion(
  game?: string,
  token?: string
): Promise<APIResponse<Session>> {
  if (!token) return {};

  return await fetchAuth(
    { url: `/game/${game}/next`, init: { method: "GET" } },
    token
  );
}
