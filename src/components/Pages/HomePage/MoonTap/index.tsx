import gem1 from '@/assets/Gems/gem-1.png';
import gem2 from '@/assets/Gems/gem-2.png';
import { Blob, TappingMoon } from '@/assets/MainPage/SVGs';
import MoonTapRewardDialog from '@/components/Dialogs/MoonTapRewardDialog/MoonTapRewardDialog';
import { useEffect, useMemo, useState } from 'react';

import useNowContext from '@/components/Providers/NowProvider/useNowContext';
import { fetchTyped } from '@/lib/apiv2';
import { API_V1 } from '@/lib/constants';
import useCatiaStore from '@/lib/useCatiaStore';
import clsx from 'clsx';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { toast } from 'sonner';

import cloud1 from '@/assets/Gems/cloud-1.png';
import cloud2 from '@/assets/Gems/cloud-2.png';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { useMe, useMoon } from '@/lib/swr';
import { useTranslation } from 'react-i18next';
import './index.scss';

dayjs.extend(duration);
export interface Moon {
  expired_at: string;
  active_at: string;
  next_active_at: string;
  claimed: boolean;
}

export interface SpinReward {
  type: string;
  amount: number;
}

const MAX_TAP = 15;

export default function MoonTap() {
  const { now } = useNowContext();
  const { t } = useTranslation('home');
  const [current, setCurrent] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [showCompleted, setShowCompleted] = useState(false);
  const [isCollecting, setIsCollecting] = useState(false);
  const [rewardAmount, setRewardAmount] = useState(0);
  const [rewardType, setRewardType] = useState('nothing');
  const [showAlert, setShowAlert] = useState(false);

  const { data: me, mutate: mutateMe } = useMe();
  const { data: moon, isLoading: loadingMoon, mutate: mutateMoon } = useMoon(!me);

  const token = useCatiaStore((state) => state.accessToken);

  const isExpired = useMemo(() => {
    if (!moon) return true;

    return (
      now.getTime() < new Date(moon.active_at).getTime() ||
      (now.getTime() > new Date(moon.expired_at).getTime() && now.getTime() < new Date(moon.next_active_at).getTime())
    );
  }, [moon, now]);

  const progress = Math.round((current / MAX_TAP) * 100) / 100;

  const nextActiveAfter = useMemo(() => {
    if (!moon) return '';
    const dateFrom = dayjs(now);
    const dateTo = dayjs(now.getTime() < new Date(moon.active_at).getTime() ? moon.active_at : moon.next_active_at);

    const duration = dayjs.duration(dateTo.diff(dateFrom, 'ms'));

    const h = duration.hours() > 0 ? duration.hours() : 0;
    const m = duration.minutes() > 0 ? duration.minutes() : 0;
    const s = duration.seconds() > 0 ? duration.seconds() : 0;
    return `${h < 10 ? '0' : ''}${h}h : ${m < 10 ? '0' : ''}${m}m : ${s < 10 ? '0' : ''}${s}s`;
  }, [moon, now]);

  const expiredAfter = useMemo(() => {
    if (!moon) return '';
    const dateFrom = dayjs(now);
    const dateTo = dayjs(moon.expired_at);

    const duration = dayjs.duration(dateTo.diff(dateFrom, 'ms'));

    const h = duration.hours() > 0 ? duration.hours() : 0;
    const m = duration.minutes() > 0 ? duration.minutes() : 0;
    const s = duration.seconds() > 0 ? duration.seconds() : 0;
    return `${h < 10 ? '0' : ''}${h}h : ${m < 10 ? '0' : ''}${m}m : ${s < 10 ? '0' : ''}${s}s`;
  }, [moon, now]);

  const spinable = useMemo(() => {
    if (isExpired || moon?.claimed) return false;
    return true;
  }, [isExpired, moon]);

  useEffect(() => {
    if (moon?.claimed) {
      setCurrent(MAX_TAP);
    }
  }, [moon]);

  useEffect(() => {
    if (!moon?.claimed) {
      setCurrent(0);
    }
  }, [spinable, moon]);

  useEffect(() => {
    if (!moon) return;
    if (now.getTime() >= new Date(moon.next_active_at).getTime()) {
      mutateMoon();
    }
  }, [now, moon, mutateMoon]);

  const spin = async () => {
    setIsCollecting(true);

    const res = await fetchTyped<SpinReward>(`${API_V1}/moon/spin`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .catch((e: any) => {
        toast.error(e.cause || t('error_toast'), {
          id: 'moon-error',
        });
        setShowModal(false);
        setCurrent(0);
      })
      .finally(() => {
        setIsCollecting(false);
        setCurrent(0);
        mutateMoon();
      });

    if (res?.data) {
      setShowModal(true);
      setRewardAmount(res.data.amount || 0);
      setRewardType(res.data.type || 'nothing');
      mutateMe();
    }
  };

  const tap = async () => {
    if (!spinable) {
      toast.info(t('moon_ended_desc_dialog'), {
        id: 'wait-for-new-turn',
      });
      return;
    }

    if (current > MAX_TAP) return;

    setCurrent((val) => val + 1);

    if (current + 1 === MAX_TAP) {
      setShowCompleted(true);
      setTimeout(async () => {
        await spin();
        setShowCompleted(false);
      }, 800);
    }
  };

  if (!me) {
    return (
      <div className='flex h-full select-none flex-col items-center justify-center overflow-visible'>
        <div className='max-h-44 flex-1 transform-gpu overflow-visible pb-4 pt-5'>
          <TappingMoon className='h-36 w-36 translate-x-[5%] scale-[1.2]' loading={false} progress={0} />
        </div>
      </div>
    );
  }

  return (
    <div
      className={clsx(
        'flex h-full select-none flex-col items-center justify-center overflow-visible',
        spinable ? 'cursor-pointer' : 'cursor-default'
      )}
    >
      <div
        className={clsx(
          'flex aspect-square max-h-44 flex-1 transform-gpu flex-col items-center overflow-visible px-5 pb-4 pt-5 active:scale-[1.02]',
          {
            'z-20': showCompleted,
            grayscale: !spinable && current < MAX_TAP,
          }
        )}
        onClick={() => {
          tap();
        }}
      >
        <div className='relative w-full'>
          {spinable && (current <= 1 || current >= (MAX_TAP * 2) / 3) && current < MAX_TAP && (
            <Blob className='absolute -right-[90px] -top-12 z-[2]' />
          )}
          {spinable && current <= 1 && (
            <div className='absolute -right-[55px] top-1 z-[2] -rotate-6 text-lg font-bold text-white'>
              {t('tap_me')}
            </div>
          )}
          {spinable && current >= (MAX_TAP * 2) / 3 && current < MAX_TAP && (
            <div className='absolute -right-[55px] top-1 z-[2] -rotate-6 text-lg font-bold text-white'>
              {t('quicker')}
            </div>
          )}
        </div>
        <TappingMoon
          className='h-full max-h-36 min-h-28 w-auto min-w-28 max-w-36 scale-[1.2] transform-gpu'
          loading={!moon && loadingMoon}
          progress={moon?.claimed ? 1 : progress}
        />
        <div className='relative w-full'>
          {!showCompleted && (
            <img
              src={cloud1}
              alt=''
              className='cloud-right absolute bottom-0 z-[1] w-full -translate-y-[60%] translate-x-[30%] scale-[1.2] transform-gpu delay-500'
            />
          )}
          {!showCompleted && (
            <img
              src={cloud2}
              alt=''
              className='cloud-left absolute bottom-0 z-[1] w-full -translate-x-[45%] translate-y-[25%] scale-[1.2] transform-gpu'
            />
          )}
        </div>
      </div>
      <div className='mt-2 h-8'>
        {!loadingMoon && (
          <div className='rounded-xl bg-[#081325]/60 px-3 py-2 text-center text-sm font-medium text-accent-foreground'>
            {(!!moon?.claimed || isExpired) && (
              <div>
                {t('starts_moon')} <span className='text-nowrap'>{nextActiveAfter}</span>
              </div>
            )}
            {!moon?.claimed && !isExpired && (
              <div>
                {t('ends_moon')} <span className='text-nowrap'>{expiredAfter}</span>
              </div>
            )}
            {/* {current > 0 && current < (MAX_TAP * 1) / 3 && (
              <div>Tap the moon</div>
            )}
            {current >= (MAX_TAP * 1) / 3 && current < (MAX_TAP * 2) / 3 && (
              <div>Quicker...</div>
            )}
            {current >= (MAX_TAP * 2) / 3 && current < MAX_TAP && (
              <div>Almost there...</div>
            )}
            {current >= MAX_TAP && <div>Such a beautiful moon...</div>} */}
          </div>
        )}
        {!moon && loadingMoon && (
          <div className='rounded-xl bg-[#081325]/60 px-3 py-2 text-center text-sm font-medium text-accent-foreground'>
            {t('loading')}
          </div>
        )}
      </div>

      <MoonTapRewardDialog
        loading={isCollecting}
        amount={rewardAmount}
        type={rewardType}
        open={showModal}
        onOpenChange={(val) => {
          setShowModal(val);
          if (!val) {
            setRewardAmount(0);
            setRewardType('nothing');
          }
        }}
      />
      <Dialog open={showAlert} onOpenChange={setShowAlert}>
        <DialogTitle />
        <DialogContent hideCloseButton className='flex w-[350px] flex-col gap-4 rounded-md border-none'>
          <div className='text-center font-bold'>{t('moon_ended_dialog')}</div>
          <div className='text-center'>{t('moon_ended_desc_dialog')}</div>
          <div className='flex items-center justify-center gap-2'>
            <Button
              className='w-full px-2 py-1 text-sm'
              onClick={() => {
                setShowAlert(false);
              }}
            >
              {t('okay_btn')}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      {showCompleted && <GemsDrop />}
    </div>
  );
}

export function GemsDrop() {
  return (
    <div className='absolute bottom-0 left-0 right-0 top-0 z-10 h-full w-full bg-black/50'>
      <div className='h-full w-full'>
        <div className='gem-wrapper relative'>
          <img className='absolute left-[100px] top-[60px] mx-auto mt-32' alt='gem 1' src={gem1} />
          <img className='absolute left-[200px] top-[60px] mx-auto mt-32 rotate-[35deg]' alt='gem 1' src={gem1} />
          <img
            className='absolute left-[120px] top-[100px] mx-auto mt-32 rotate-90'
            alt='gem 1'
            width={18}
            height={18}
            src={gem1}
          />
          <img
            className='absolute left-[100px] top-[70px] mx-auto mt-32'
            alt='gem 2'
            width={75}
            height={75}
            src={gem2}
          />
          <img className='absolute left-[200px] top-[30px] mx-auto mt-32' alt='gem 2' src={gem2} />
          <img
            className='absolute left-[200px] top-[30px] mx-auto mt-32 -rotate-90'
            alt='gem 2'
            width={18}
            height={18}
            src={gem2}
          />
          <img
            className='absolute left-[200px] top-[30px] mx-auto mt-32 -rotate-90'
            alt='gem 2'
            width={18}
            height={18}
            src={gem2}
          />
        </div>
      </div>
    </div>
  );
}
