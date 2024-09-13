import { ApplicationIcon, DiamondIcon, LifeLineIcon, QuizProgress, SubmitIcon } from '@/assets/QuizPage/SVGs';
import FiftyFifty from '@/components/ActionFiftyFifty';
import LanguageSwitch from '@/components/Language/LanguageSwitch';
import Container from '@/components/Layout/Container';
import ProgressDialog from '@/components/Pages/QuizPage/ProgressDialog';
import SummaryDialog from '@/components/Pages/QuizPage/SummaryDialog';
import WheelSpinDialog from '@/components/Pages/QuizPage/WheelSpinDialog';
import { Button, Button3D } from '@/components/ui/button';
import { GradientText } from '@/components/ui/gradient-text';
import { ScrollArea } from '@/components/ui/scroll-area';
import { nextQuestion } from '@/lib/api';
import { AppError } from '@/lib/error';
import { useGameActionAnswer, useMe } from '@/lib/swr';
import { TOAST_IDS } from '@/lib/toast';
import type { Session } from '@/types/app';
import clsx from 'clsx';
import i18n from 'i18next';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import useCatiaStore from '../../lib/useCatiaStore';

export default function QuizPage() {
  const { t } = useTranslation('quiz');
  const navigate = useNavigate();
  const { dispatch: actionAnswer } = useGameActionAnswer();
  const { data: user } = useMe();
  const game = useCatiaStore((state) => state.game);
  const token = useCatiaStore((state) => state.accessToken);
  const quizSpinDialogOpen = useCatiaStore((state) => state.quizSpinDialogOpen);
  const setQuizSpinDialogOpen = useCatiaStore((state) => state.setQuizSpinDialogOpen);
  const quizSummaryDialogOpen = useCatiaStore((state) => state.quizSummaryDialogOpen);
  const setQuizSummaryDialogOpen = useCatiaStore((state) => state.setQuizSummaryDialogOpen);
  const [selected, setSelected] = useState<number>(-1);
  const [loading, setLoading] = useState(false);
  const [session, setSession] = useState<Session>();
  const [lang, setLang] = useState(i18n.language);

  const currentQuestion = useMemo(() => {
    const translation = session?.current_question?.translations?.find(
      (translation) => translation.language_code === lang
    );

    if (lang !== 'en' && translation && translation?.choices?.length > 0) return translation;

    return session?.current_question;
  }, [lang, session]);

  function onSubmit() {
    if (selected === -1) {
      toast.error(i18n.t('common:answer_toast'), {
        id: TOAST_IDS.CHOOSE_AN_ANSWER,
      });
      return;
    }
    if (loading) return;
    setLoading(true);
    actionAnswer({ answer: selected, question: (session?.next_step || 1) - 1 })
      .then((resp) => {
        if (!resp.data) {
          toast.error(t('error_toast'), { id: TOAST_IDS.FETCH_ERROR });
          return;
        }

        setSession(resp?.data);
        if (resp.data.current_question?.extra) return;

        if (!resp.data.history[resp.data.next_step - 1].correct) {
          setSelected(-1);
          toast.error(t('wrong_answer_toast'), {
            duration: 1000,
            id: TOAST_IDS.ANSWER_WRONG,
          });
          return;
        }

        toast.success(i18n.t('common:correct_toast'), {
          duration: 1000,
          id: TOAST_IDS.ANSWER_CORRECT,
        });
        setSelected(-1);
        return nextQuestion(game?.slug, token).then((resp) => {
          if (resp.code === 'validation') {
            if (resp.message === 'game ended') {
              toast.error(t('out_move_toast'), {
                id: TOAST_IDS.NO_TURN_LEFT,
              });
            }
            if (resp.message === 'countdown not ended') {
              toast.error(i18n.t('quiz:game_has_ended'), {
                id: TOAST_IDS.GAME_ENDED,
              });
            }
            navigate(`/${game?.slug}`, { replace: true });
            return;
          }
          if (!resp.data) return;
          setSession(resp.data);
        });
      })
      .catch((err) => {
        if (err instanceof AppError) {
          if (err.cause === 'unqualified') {
            useCatiaStore.setState({
              inviteThresholdModal: true,
            });
            return;
          }

          if (err.cause === 'unverified') {
            toast(t('join_social_toast'), {
              icon: '🎉',
            });
            useCatiaStore.setState({
              joinSocialModal: true,
            });
            return;
          }

          if (err.cause === 'session ended') {
            toast.error(t('session_ended_toast'), { id: TOAST_IDS.TIMES_UP });
            navigate(`/${game?.slug}`, { replace: true });
            return;
          }

          if (err.cause === 'session not started') {
            toast.error(i18n.t('quiz:game_has_ended'), {
              id: TOAST_IDS.GAME_ENDED,
            });
            navigate(`/${game?.slug}`, { replace: true });
            return;
          }

          if (err.cause === 'wrong question index') {
            toast.error(t('wrong_question_toast'), {
              id: TOAST_IDS.STATE_MISMATCHED,
            });
            navigate(`/${game?.slug}`, { replace: true });
            return;
          }
          return;
        }
        toast.error(t('error_toast'), { id: TOAST_IDS.FETCH_ERROR });
      })
      .finally(() => {
        setLoading(false);
      });
  }

  useEffect(() => {
    nextQuestion(game?.slug, token).then((resp) => {
      if (resp.code === 'validation') {
        if (resp.message === 'game ended') {
          toast.error(t('out_move_toast'), {
            id: TOAST_IDS.NO_TURN_LEFT,
          });
        }
        if (resp.message === 'countdown not ended') {
          toast.error(t('countdown_toast'), {
            id: TOAST_IDS.COUNTDOWN_NOT_ENDED,
          });
        }
        navigate(`/${game?.slug}`, { replace: true });
        return;
      }

      if (!resp.data) return;
      setSession(resp.data);
    });
  }, [game?.slug, token, navigate]);

  useEffect(() => {
    setQuizSpinDialogOpen(!!session?.current_question?.extra);
  }, [session?.current_question?.extra, setQuizSpinDialogOpen]);

  const correctAnswersCount = useMemo(() => {
    const correctAnswers = Object.values(session?.history || {}).filter(
      (item) => item.correct === true && item.question_score !== 0
    );
    return correctAnswers.length;
  }, [session?.history]);

  const onFinishWheelSpin = () => {
    setQuizSpinDialogOpen(false);
    setQuizSummaryDialogOpen(true);
  };

  if (!session || !session?.current_question) return;

  return (
    <main className='relative h-screen'>
      <ScrollArea>
        <Container className='h-screen'>
          {currentQuestion && (
            <div className='flex h-full max-h-screen flex-1 flex-col'>
              <div className='grid grid-cols-3 pt-4 smH:pt-3'>
                <div className='flex items-center gap-1.5'>
                  <div className='flex h-9 w-9 items-center justify-center rounded-full bg-[#927AFF]'>
                    <DiamondIcon className='h-6 w-6 translate-y-0' />
                  </div>
                  <span className='font-semibold'>{session.score >= 0 ? session.score : 0}</span>
                </div>
                <div className='relative flex h-12 items-center justify-center'>
                  <QuizProgress
                    className='absolute'
                    progress={session?.next_step - 1 || 0}
                    total={game?.questions?.length || 1}
                  />
                  <span className='text-xs font-semibold'>
                    {String(session?.next_step || 1).padStart(2, '0')}/
                    {String(game?.questions?.length || 1).padStart(2, '0')}
                  </span>
                </div>
                <div className='flex items-center justify-end gap-2'>
                  <LanguageSwitch onChangeLang={setLang} />
                  <ProgressDialog game={game} session={session} lang={lang}>
                    <button
                      type='button'
                      className='self-center justify-self-end rounded-full border-2 border-white/40 p-1.5'
                    >
                      <ApplicationIcon />
                    </button>
                  </ProgressDialog>
                </div>
              </div>

              {game?.name && (
                <div className='mt-1 flex items-center justify-center'>
                  <div className='rounded-2xl bg-bgFreebies px-3 py-2'>
                    <GradientText className='text-lg font-bold leading-[1.25] tracking-wide'>{game?.name}</GradientText>
                  </div>
                </div>
              )}

              <ScrollArea className='no-scrollbar relative mt-5 min-h-40 flex-1 rounded-2xl bg-white/15 smH:mt-2 smH:min-h-36'>
                <div className='flex h-full flex-1 shrink flex-col items-center gap-4 p-3'>
                  <div className='flex items-center justify-center gap-1.5 rounded-full bg-black/25 px-3 py-1.5'>
                    <DiamondIcon />
                    <span className='text-sm font-semibold leading-none'>
                      {session.current_question_score - session.score > 0 &&
                        `+${session.current_question_score - session.score}`}
                    </span>
                  </div>
                  <div className='flex flex-1 shrink items-center justify-center pb-3'>
                    <p className='text-center font-semibold tracking-wide'>{currentQuestion.question}</p>
                  </div>
                </div>
              </ScrollArea>

              <div className='mt-5 flex flex-col gap-4'>
                {currentQuestion?.choices?.length === 2 && (
                  <Button3D
                    disabled
                    className='invisible h-auto min-h-[60px] rounded-full smH:min-h-12'
                    contentClassName='h-auto min-h-[60px] smH:min-h-12'
                  />
                )}
                {currentQuestion?.choices?.map((choice) => (
                  <Button3D
                    key={choice.key}
                    onClick={() =>
                      session?.history[session?.next_step - 1]?.correct !== false && setSelected(choice.key)
                    }
                    className={clsx(
                      'h-auto min-h-[60px] rounded-full bg-[#5BB6D0] smH:min-h-12',
                      session?.history[session?.next_step - 1]?.correct === false && 'cursor-default'
                    )}
                    contentClassName={clsx(
                      'h-auto min-h-[60px] smH:min-h-12 py-2.5 rounded-full text-base font-semibold whitespace-normal',
                      choice.key === selected
                        ? 'bg-gradient-to-r to-primary via-[#0DC9EB] from-[#00E3D0] translate-y-0'
                        : 'bg-white text-black',
                      session?.history[session?.next_step - 1]?.correct === false &&
                        'active:-translate-y-1.5 group-active:-translate-y-1.5',
                      session?.history[session?.next_step - 1]?.correct === false &&
                        session?.history[session?.next_step - 1]?.answer === choice.key &&
                        'border-2 border-[#F73131] bg-[#FFC8C8]',
                      session?.history[session?.next_step - 1]?.correct === false &&
                        session?.history[session?.next_step - 1]?.correct_answer === choice.key &&
                        'border-2 border-[#00B058] bg-[#87EBB9]'
                    )}
                  >
                    {choice.content}
                  </Button3D>
                ))}
                {currentQuestion?.choices?.length === 2 && (
                  <Button3D
                    disabled
                    className='invisible h-auto min-h-[60px] rounded-full smH:min-h-12'
                    contentClassName='h-auto min-h-[60px] smH:min-h-12'
                  />
                )}
              </div>

              {session?.history[session?.next_step - 1]?.correct !== false ? (
                <div className='mt-4 grid grid-cols-2 gap-1.5 pb-6 smH:pb-3'>
                  <FiftyFifty
                    onSuccess={(res) => {
                      setSession(res.data);
                    }}
                  >
                    <Button size='sm' variant='outline' disabled={currentQuestion?.choices?.length !== 4}>
                      <LifeLineIcon />
                      <span className='ml-1.5 leading-none text-primary'>50:50</span>
                      <span className='ml-1.5 inline-flex h-4 w-4 items-center justify-center rounded-full border border-white pr-[1px] text-[10px] leading-none'>
                        {user?.lifeline_balance || 0}
                      </span>
                    </Button>
                  </FiftyFifty>
                  <Button onClick={() => onSubmit()} className='gap-1.5 text-white' size='sm'>
                    <SubmitIcon />
                    {i18n.t('quiz:submit')}
                  </Button>
                </div>
              ) : (
                <div className='mt-4 w-full pb-6 smH:pb-3'>
                  {/* <p className="text-center">
                    {i18n.t("quiz:incorrect_answer_bottom_message")}
                  </p> */}
                  <Button className='w-full' size='sm' onClick={() => setQuizSummaryDialogOpen(true)}>
                    Finish
                  </Button>
                </div>
              )}
            </div>
          )}
        </Container>
      </ScrollArea>

      <WheelSpinDialog
        open={quizSpinDialogOpen}
        setOpen={setQuizSpinDialogOpen}
        session={session}
        setSession={setSession}
        onFinishWheelSpin={onFinishWheelSpin}
      />
      <SummaryDialog
        open={quizSummaryDialogOpen}
        setOpen={setQuizSummaryDialogOpen}
        session={session}
        correctAnswersCount={correctAnswersCount}
      />
    </main>
  );
}
