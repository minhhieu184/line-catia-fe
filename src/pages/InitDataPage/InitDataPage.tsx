// import type { User } from "@telegram-apps/sdk";
// import { useInitData, useInitDataRaw } from "@telegram-apps/sdk-react";
import { type FC, type ReactNode, useMemo } from 'react';

import { DisplayData, type DisplayDataRow } from '@/components/DisplayData/DisplayData';
import { Link } from '@/components/Link/Link';
import { Page } from '@/components/Page/Page';
import './InitDataPage.css';

// function getUserRows(user: User): DisplayDataRow[] {
function getUserRows(user: any): DisplayDataRow[] {
  // return [
  //   { title: "id", value: user.id.toString() },
  //   { title: "last_name", value: user.lastName },
  //   { title: "first_name", value: user.firstName },
  //   { title: "is_bot", value: user.isBot },
  //   { title: "is_premium", value: user.isPremium },
  //   { title: "language_code", value: user.languageCode },
  // ];
  return [
    { title: 'id', value: '6107117300' },
    { title: 'last_name', value: 'lastName' },
    { title: 'first_name', value: 'Minh Hiếu' },
    { title: 'is_bot', value: false },
    { title: 'is_premium', value: false },
    { title: 'language_code', value: 'en' },
  ];
}

export const InitDataPage: FC = () => {
  // const initData = useInitData();
  // const initDataRaw = useInitDataRaw();
  const initData = {
    hash: 'a5061c74995549f919b354ba6e983591887863d8585b6eb9451a443e99dbd98a',
    queryId: 'AAH0NgNsAgAAAPQ2A2y6o4p6',
    chatType: 'x',
    chatInstance: 'x',
    authDate: new Date(),
    startParam: 'x',
    canSendAfter: 'x',
    canSendAfterDate: new Date(),
    user: {},
  };
  const initDataRaw =
    'query_id=AAH0NgNsAgAAAPQ2A2wDJjrc&user=%7B%22id%22%3A6107117300%2C%22first_name%22%3A%22Minh%20Hi%E1%BA%BFu%22%2C%22last_name%22%3A%22%22%2C%22username%22%3A%22mhieu184%22%2C%22language_code%22%3A%22en%22%2C%22allows_write_to_pm%22%3Atrue%7D&auth_date=1725957206&hash=802653264f2912852370aad1779742da8af41eaf9c0e88cb32cb6ab8baccbbb3';

  const initDataRows = useMemo<DisplayDataRow[] | undefined>(() => {
    if (!initData || !initDataRaw) {
      return;
    }
    const { hash, queryId, chatType, chatInstance, authDate, startParam, canSendAfter, canSendAfterDate } = initData;
    return [
      { title: 'raw', value: initDataRaw },
      { title: 'auth_date', value: authDate.toLocaleString() },
      { title: 'auth_date (raw)', value: authDate.getTime() / 1000 },
      { title: 'hash', value: hash },
      { title: 'can_send_after', value: canSendAfterDate?.toISOString() },
      { title: 'can_send_after (raw)', value: canSendAfter },
      { title: 'query_id', value: queryId },
      { title: 'start_param', value: startParam },
      { title: 'chat_type', value: chatType },
      { title: 'chat_instance', value: chatInstance },
    ];
  }, [initData, initDataRaw]);

  const userRows = useMemo<DisplayDataRow[] | undefined>(() => {
    return initData?.user ? getUserRows(initData.user) : undefined;
  }, [initData]);

  const receiverRows = useMemo<DisplayDataRow[] | undefined>(() => {
    // return initData?.receiver ? getUserRows(initData.receiver) : undefined;
    return initData?.user ? getUserRows(initData.user) : undefined;
  }, [initData]);

  const chatRows = useMemo<DisplayDataRow[] | undefined>(() => {
    // if (!initData?.chat) {
    //   return;
    // }
    // const { id, title, type, username, photoUrl } = initData.chat;

    return [
      { title: 'id', value: '123' },
      { title: 'title', value: 'title' },
      { title: 'type', value: 'type' },
      { title: 'username', value: 'username' },
      { title: 'photo_url', value: 'photoUrl' },
    ];
  }, [initData]);

  let contentNode: ReactNode;

  if (!initDataRows) {
    contentNode = <i>Application was launched with missing init data</i>;
  } else {
    contentNode = (
      <>
        <div className='init-data-page__section'>
          <h2 className='init-data-page__section-title'>Init data</h2>
          <DisplayData rows={initDataRows} />
        </div>

        <div className='init-data-page__section'>
          <h2 className='init-data-page__section-title'>User</h2>
          {userRows ? <DisplayData rows={userRows} /> : <i>User information missing</i>}
        </div>

        <div className='init-data-page__section'>
          <h2 className='init-data-page__section-title'>Receiver</h2>
          {receiverRows ? <DisplayData rows={receiverRows} /> : <i>Receiver information missing</i>}
        </div>

        <div className='init-data-page__section'>
          <h2 className='init-data-page__section-title'>Chat</h2>
          {chatRows ? <DisplayData rows={chatRows} /> : <i>Chat information missing</i>}
        </div>
      </>
    );
  }

  return (
    <Page
      title='Init Data'
      disclaimer={
        <>
          This page displays application{' '}
          <Link to='https://docs.telegram-mini-apps.com/platform/launch-parameters'>init data</Link>.
        </>
      }
    >
      {contentNode}
    </Page>
  );
};
