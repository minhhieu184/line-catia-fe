import type { Checkpoints } from "@/lib/useCatiaStore";
import type { PropsWithChildren } from "react";

export type PropsWithClassName = {
  className?: string;
};

export type PropsWithClassNameAndChildren = PropsWithChildren &
  PropsWithClassName;

export interface APIResponse<T> {
  data?: T;
  code?: string;
  message?: string;
}

export interface GameDetail {
  name: string;
  slug: string;
  description: string;
  questions: ScoreLadder[];
  checkpoints: Checkpoints;
  logo: string;
  task: {
    game_slug: string;
    links: Tasks[];
  };
  config: KeyConfig[];
  start_time: string;
  end_time: string;
  difficulty: string;
  social_links: Tasks[];
  extra_setup: Extra[];
  bonus_privilege: string;
  is_public?: boolean;
}

export interface Game {
  countdown: string;
  current_bonus_milestone?: number;
  current_streak?: number;
  extra_sessions?: number;
  game_slug: string;
  gift_points?: number;
  id: number;
  is_new?: boolean;
  total_score?: number;
  total_sessions?: number;
  user_id: number;
  game_start_time?: null | string;
  game_end_time?: null | string;
}

export interface KeyConfig {
  key: string;
  value: string;
}

export interface TimeDif {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  rawDif: number;
}

export interface ScoreLadder {
  difficulty: string;
  score: number;
  extra: boolean;
}

export interface Extra {
  type: string;
  description: string;
  chance: number;
}

export interface Session {
  id: string;
  game_id: string;
  user_id: number;
  next_step: number;
  current_question?: Question;
  current_question_score: number;
  total_score: number;
  question_started_at?: string;
  started_at?: string;
  ended_at?: string;
  history: History;
  lifeline?: Lifeline;
  used_boost_count?: number;
  streak_point: number;
  correct_answer_count?: number;
  score: number;
}

export interface Leaderboard {
  leaderboard: LeaderboardUser[];
  me: {
    user_id: number;
    rank: number;
    score: number;
    avatar: string;
  };
}

export interface LeaderboardUser {
  username: string;
  score: number;
  avatar: string;
  user_id: number;
}

export interface Lifeline {
  change_question: boolean;
  fifty_fifty: boolean;
}

export interface Reward {
  campaign: string;
  claimed: boolean;
  gem: number;
  lifeline: number;
  star: number;
  user_id: number;
  metadata: {
    rank: string;
  } & Record<string, number | string>;
}

export interface User {
  id: number;
  first_name: string;
  is_bot: boolean;
  is_premium: boolean;
  last_name: string;
  username: string;
  language_code: string;
  ref_code: string;
  photo_url: string;
  created_at: string;
  updated_at: string;
  extra_sessions: number;
  countdown?: string;
  current_session_id: string;
  lifeline: Record<string, Lifeline>;
  inviter_id?: string;
  total_invites: number;
  boosts: number;
  total_score: number;
  lifeline_balance: number;
  evm_wallet: string;
  ton_wallet: string;
  gift_points: number;
  is_new_user: boolean;
  avatar: string;
  available_rewards: Reward[];
  accessToken: string;
}

export interface QuestionTranslation {
  category: string;
  id: number;
  choices: Answer[];
  language_code: string;
  question: string;
  question_bank_id?: number;
}

export interface Question {
  id: number;
  question: string;
  choices: Answer[];
  difficulty: string;
  extra: boolean;
  translations?: QuestionTranslation[];
}

export interface History {
  [index: string]: HistoryDetail;
}

export interface HistoryDetail {
  total_score: number;
  question: Question;
  question_score: number;
  started_at: string;
  answer?: number;
  answered_at?: string;
  correct?: boolean;
  correct_answer?: number | null;
}

export interface Answer {
  content: string;
  key: number;
}

export interface ScoreHistory {
  game_id: string;
  user_id: number;
  total_sessions: number;
  total_score: number;
  history_sessions: Session[];
  total_score_current_session: number;
  current_streak: number;
  milestone: number;
  achieved_new_milestone: boolean;
  last_milestone: number;
}

export interface HistoryByDate {
  game_id: string;
  total_sessions: number;
  total_score: number;
  created_at?: string;
  ended_at?: string;
}

export interface ScoreSession {
  total_score: number;
  date_index: number;
  started_at?: string;
  ended_at?: string;
}

export interface TaskGroup {
  id: number;
  game_slug: string;
  links: Tasks[];
  passed_all: boolean;
  logo?: string;
  priority?: number;
  title?: string;
  description?: string | null;
}

export interface Tasks {
  id: number;
  link_type: string;
  required: boolean;
  url: string;
  ref_url: string;
  joined: boolean;
  star: number;
  description: string;
  priority?: number;
}

export interface SocialTasks {
  game_slug: string;
  links: Tasks[];
}

export interface FreebiesResponse {
  freebies: Freebies[];
  message: FreebiesMessage | null;
}

export interface Freebies {
  id: number;
  name: string;
  countdown: string;
  action: string;
  amount: number;
  claim_schedule: number;
}

export interface FreebiesMessage {
  id: number;
  time_last_message: string;
  freebie_name: string;
}

export interface Friend {
  id: number;
  username: string;
  gems: number;
  claimed: boolean;
  first_name: string;
  last_name: string;
  validated: boolean;
}

export interface Friends {
  friend_count: number;
  friend_list: Friend[];
}

export type ArenaRewards = Record<string, number | string>;

export interface Arena {
  id: number;
  name: string;
  slug: string;
  description: string;
  logo: string;
  enabled?: boolean | null;
  start_date?: string | null;
  end_date?: string;
  rewards?: ArenaRewards;
  priority?: number;
  banner?: string;
  participants_count?: number;
}

export interface ArenaDetail {
  arena: Arena;
  game: GameDetail;
  tasks: TaskGroup;
  user_game: User;
}
