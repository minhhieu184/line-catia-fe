import type { Arena, Extra, GameDetail } from '@/types/app';
import { persist } from 'zustand/middleware';
import { shallow } from 'zustand/shallow';
import { createWithEqualityFn } from 'zustand/traditional';

export interface Checkpoints {
  [index: string]: boolean;
}

interface CatiaStore {
  // initDataRaw
  idToken?: string;
  setIdToken(v: string | null): void;

  accessToken?: string;
  setAccessToken(v: string | undefined): void;

  game?: GameDetail; // control the game settings for the current game
  setGame(v?: GameDetail): void;

  pools?: GameDetail[];
  setPools(v?: GameDetail[]): void;

  reward?: Extra;
  setReward(v?: Extra): void;

  arena?: Arena;
  setArena(v?: Arena): void;

  newsId?: number;
  setNewsId(v?: number): void;
  newsLastCheckedTime?: Date;
  setNewsLastCheckedTime(v?: Date): void;

  // to manipulate back button
  inviteDialogOpen: boolean;
  setInviteDialogOpen(v: boolean): void;
  profileBottomSheetOpen: boolean;
  setProfileBottomSheetOpen(v: boolean): void;
  quizProgressDialogOpen: boolean;
  setQuizProgressDialogOpen(v: boolean): void;
  quizSpinDialogOpen: boolean;
  setQuizSpinDialogOpen(v: boolean): void;
  quizSummaryDialogOpen: boolean;
  setQuizSummaryDialogOpen(v: boolean): void;
  quizFiftyFiftyDialogOpen: boolean;
  setQuizFiftyFiftyDialogOpen(v: boolean): void;
  taskListSheetOpen: boolean;
  setTaskListSheetOpen(v: boolean): void;
  speedUpSheetOpen: boolean;
  setSpeedUpSheetOpen(v: boolean): void;
  quizDetailDialog: boolean;
  setQuizDetailDialog(v: boolean): void;
  closeAllDialog(): void;

  leaderboard: string;
  setLeaderboard(v: string): void;

  referrer?: string;

  inviteThresholdModal: boolean;
  joinSocialModal: boolean;
  useBoostModal: boolean;
  rewardPopup: boolean;
  luckyPopup: boolean;
  luckyResultPopup: boolean;

  leaderboardNoticeCheckedv2?: boolean;
  setLeaderboardNoticeCheckedv2(v: boolean): void;
}

const useCatiaStore = createWithEqualityFn<CatiaStore>()(
  persist(
    (set) => ({
      inviteThresholdModal: false,
      joinSocialModal: false,
      useBoostModal: false,
      rewardPopup: false,
      luckyPopup: false,
      luckyResultPopup: false,
      leaderboard: 'overall_weekly',
      inviteDialogOpen: false,
      profileBottomSheetOpen: false,
      quizProgressDialogOpen: false,
      quizSpinDialogOpen: false,
      quizSummaryDialogOpen: false,
      quizFiftyFiftyDialogOpen: false,
      taskListSheetOpen: false,
      speedUpSheetOpen: false,
      quizDetailDialog: false,

      setIdToken(v) {
        set({ idToken: v });
      },
      setAccessToken(v) {
        set({ accessToken: v });
      },
      setGame(v) {
        set({ game: v });
      },
      setArena(v) {
        set({ arena: v });
      },
      setPools(v) {
        set({ pools: v });
      },
      setReward(v) {
        set({ reward: v });
      },
      setNewsId(v) {
        set({ newsId: v });
      },
      setNewsLastCheckedTime(v) {
        set({ newsLastCheckedTime: v });
      },
      setInviteDialogOpen(v) {
        set({ inviteDialogOpen: v });
      },
      setProfileBottomSheetOpen(v) {
        set({ profileBottomSheetOpen: v });
      },
      setQuizProgressDialogOpen(v) {
        set({ quizProgressDialogOpen: v });
      },
      setQuizSpinDialogOpen(v) {
        set({ quizSpinDialogOpen: v });
      },
      setQuizSummaryDialogOpen(v) {
        set({ quizSummaryDialogOpen: v });
      },
      setQuizFiftyFiftyDialogOpen(v) {
        set({ quizFiftyFiftyDialogOpen: v });
      },
      setTaskListSheetOpen(v) {
        set({ taskListSheetOpen: v });
      },
      setSpeedUpSheetOpen(v) {
        set({ speedUpSheetOpen: v });
      },
      setQuizDetailDialog(v) {
        set({ quizDetailDialog: v });
      },
      setLeaderboard(v) {
        set({ leaderboard: v });
      },
      closeAllDialog() {
        set({
          inviteDialogOpen: false,
          profileBottomSheetOpen: false,
          quizProgressDialogOpen: false,
          quizSpinDialogOpen: false,
          quizSummaryDialogOpen: false,
          quizFiftyFiftyDialogOpen: false,
          taskListSheetOpen: false,
          speedUpSheetOpen: false,
          quizDetailDialog: false,
        });
      },
      setLeaderboardNoticeCheckedv2(v) {
        set({ leaderboardNoticeCheckedv2: v });
      },
    }),
    {
      name: 'catia-store',
      partialize: (state) => ({
        idToken: state.idToken,
        accessToken: state.accessToken,
        game: state.game,
        arena: state.arena,
        referrer: state.referrer,
        newsId: state.newsId,
        newsLastCheckedTime: state.newsLastCheckedTime,
        leaderboardNoticeCheckedv2: state.leaderboardNoticeCheckedv2,
      }),
    }
  ),
  shallow
);

export default useCatiaStore;
