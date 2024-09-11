import { Header } from '@/components/Header/Header';
import { Nav } from '@/components/Nav/Nav';
import { ScrollArea } from '@/components/ui/scroll-area';
// import {
//   retrieveLaunchParams,
//   useLaunchParams,
//   useViewport,
// } from "@telegram-apps/sdk-react";
import { type FC, useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import useCatiaStore from '../lib/useCatiaStore';
import BackButtonHandler from './BackButtonHandler';
import { liff } from '@line/liff';
import { useMe } from '@/lib/swr';

const dumpLiffData = {
  accessToken:
    'eyJhbGciOiJIUzI1NiJ9.2a9byeJwRZqRiW2-39Q2I7PwTyNr0yzqEGoV0TFb804Rfn5e4KQFVMtJOzKKJJMP16pwIe-1vnZsTtxsvAR7E35uiWQQbV8z33xeQcJJedQ_ga_7gepkSYROiBDeRxj1yWfcX2qHPG5kKwSpftkobpJBi1ZY3c7zHVkv69Tw4po.Kb9ydc_CBsXusCTlMZ32_bMYsAZyUuuMnev0kVKCZaI',
  idToken:
    'eyJraWQiOiJhMmE0NTlhZWM1YjY1ZmE0ZThhZGQ1Yzc2OTdjNzliZTQ0NWFlMzEyYmJjZDZlZWY4ZmUwOWI1YmI4MjZjZjNkIiwidHlwIjoiSldUIiwiYWxnIjoiRVMyNTYifQ.eyJpc3MiOiJodHRwczovL2FjY2Vzcy5saW5lLm1lIiwic3ViIjoiVWM0MzY0YTUyODM2Nzc5NjljNjg3ZGRiYjY5MzA5MWQxIiwiYXVkIjoiMjAwNjI5NjA4OCIsImV4cCI6MTcyNjA0MTY5MywiaWF0IjoxNzI2MDM4MDkzLCJhbXIiOlsibGluZXNzbyJdLCJuYW1lIjoiUGjhuqFtIFRy4bqnbiBNaW5oIEhp4bq_dSJ9.PiQJW_fEqX7xN70v2WN-c6uMid7JpPByAoDtkH-3l0CFFI6QojFA6Ku5j_Nk08LRkp2O4v1Yh4oJMNMAeqwdrQ',
  isLoggedIn: true,
  getDecodedIDToken() {
    return this._DecodedIDToken;
  },
  _DecodedIDToken: {
    iss: 'https://access.line.me',
    sub: 'Uc4364a5283677969c687ddbb693091d1',
    aud: '2006296088',
    exp: 1726041693,
    iat: 1726038093,
    amr: ['linesso'],
    name: 'Phạm Trần Minh Hiếu',
  },
  getAppLanguage() {
    return this._AppLanguage;
  },
  _AppLanguage: 'vi-VN',
  getVersion() {
    return this._Version;
  },
  _Version: '2.24.0',
  isInClient: false,
  getOS() {
    return this._OS;
  },
  _OS: 'web',
  getLineVersion() {
    return this._LineVersion;
  },
  _LineVersion: null,
  // userId: string;
  // displayName: string;
  // pictureUrl?: string;
  // statusMessage?: string;
};

const useLiff = () => {
  useEffect(() => {
    liff
      .init({
        liffId: import.meta.env.VITE_LIFF_ID,
        // withLoginOnExternalBrowser: true,
      })
      .then(() => {
        console.log('LIFF init succeeded.');
        const ss = liff.getAccessToken();
        const accessToken = liff.getAccessToken();
        const idToken = liff.getIDToken();
        const isLoggedIn = liff.isLoggedIn();
        console.log('liff data', {
          accessToken: accessToken,
          idToken: idToken,
          isLoggedIn: isLoggedIn,
          getDecodedIDToken: liff.getDecodedIDToken(),
          getAppLanguage: liff.getAppLanguage(),
          getVersion: liff.getVersion(),
          isInClient: liff.isInClient(),
          getOS: liff.getOS(),
          getLineVersion: liff.getLineVersion(),
        });

        // userId: string;
        // displayName: string;
        // pictureUrl?: string;
        // statusMessage?: string;
        const xx = liff.getProfilePlus();
        if (!xx) return;
        const { regionCode } = xx;
      })
      .catch((e: Error) => {
        console.log('LIFF init failed.', e);
      });
  }, []);
};

export const LayoutFull: FC = () => {
  // useLiff();

  // const viewport = useViewport();
  // const { initDataRaw } = retrieveLaunchParams();
  // const initDataRaw =
  //   'query_id=AAH0NgNsAgAAAPQ2A2wDJjrc&user=%7B%22id%22%3A6107117300%2C%22first_name%22%3A%22Minh%20Hi%E1%BA%BFu%22%2C%22last_name%22%3A%22%22%2C%22username%22%3A%22mhieu184%22%2C%22language_code%22%3A%22en%22%2C%22allows_write_to_pm%22%3Atrue%7D&auth_date=1725957206&hash=802653264f2912852370aad1779742da8af41eaf9c0e88cb32cb6ab8baccbbb3';
  // const lp = useLaunchParams();
  const idToken = useCatiaStore((state) => state.idToken);
  const setIdToken = useCatiaStore((state) => state.setIdToken);
  const setAccessToken = useCatiaStore((state) => state.setAccessToken);
  const { data: user } = useMe();

  // useEffect(() => {
  //   if (!viewport) return;
  //   if (viewport.isStable && !viewport.isExpanded) {
  //     viewport.expand();
  //   }
  // }, [viewport]);

  useEffect(() => {
    // setIdToken(initDataRaw);
    if (idToken) return;
    liff
      .init({
        liffId: import.meta.env.VITE_LIFF_ID,
        // withLoginOnExternalBrowser: true,
      })
      .then(() => {
        const idToken = liff.getIDToken();
        setIdToken(idToken);
        if (!idToken) setIdToken(dumpLiffData.idToken);
      })
      .catch((e: Error) => {
        console.log('LIFF init failed.', e);
      });
  }, [idToken, setIdToken]);

  useEffect(() => {
    setAccessToken(user?.accessToken);
  }, [user?.accessToken, setAccessToken]);

  // useEffect(() => {
  //   if (lp.startParam) {
  //     useCatiaStore.setState({
  //       referrer: lp.startParam,
  //     });
  //   }
  // }, [lp.startParam]);

  return (
    <BackButtonHandler>
      <ScrollArea className='h-screen'>
        <div
          className='relative flex h-full w-full flex-col overflow-hidden bg-background bg-cover bg-center bg-no-repeat text-foreground'
          style={{
            backgroundImage: 'url(/main-background.png)',
          }}
        >
          <Header />
          <div className='flex-1'>
            <Outlet />
          </div>
          <Nav />
        </div>
      </ScrollArea>
    </BackButtonHandler>
  );
};

export const LayoutWithoutHeaderAndNav: FC = () => {
  // const viewport = useViewport();
  // const { initDataRaw } = retrieveLaunchParams();
  const initDataRaw =
    'query_id=AAH0NgNsAgAAAPQ2A2wDJjrc&user=%7B%22id%22%3A6107117300%2C%22first_name%22%3A%22Minh%20Hi%E1%BA%BFu%22%2C%22last_name%22%3A%22%22%2C%22username%22%3A%22mhieu184%22%2C%22language_code%22%3A%22en%22%2C%22allows_write_to_pm%22%3Atrue%7D&auth_date=1725957206&hash=802653264f2912852370aad1779742da8af41eaf9c0e88cb32cb6ab8baccbbb3';
  // const lp = useLaunchParams();
  const setIdToken = useCatiaStore((state) => state.setIdToken);

  // useEffect(() => {
  //   if (!viewport) return;
  //   if (viewport.isStable && !viewport.isExpanded) {
  //     viewport.expand();
  //   }
  // }, [viewport]);

  useEffect(() => {
    setIdToken(initDataRaw);
  }, [initDataRaw, setIdToken]);

  // useEffect(() => {
  //   if (lp.startParam) {
  //     useCatiaStore.setState({
  //       referrer: lp.startParam,
  //     });
  //   }
  // }, [lp.startParam]);

  return (
    <BackButtonHandler>
      <div
        className='relative flex h-screen w-full flex-col overflow-hidden bg-background bg-cover bg-center bg-no-repeat text-foreground'
        style={{
          backgroundImage: 'url(/main-background.png)',
        }}
      >
        <div className='flex-1'>
          <Outlet />
        </div>
      </div>
    </BackButtonHandler>
  );
};

export const LayoutWithoutHeader: FC = () => {
  // const viewport = useViewport();
  // const { initDataRaw } = retrieveLaunchParams();
  const initDataRaw =
    'query_id=AAH0NgNsAgAAAPQ2A2wDJjrc&user=%7B%22id%22%3A6107117300%2C%22first_name%22%3A%22Minh%20Hi%E1%BA%BFu%22%2C%22last_name%22%3A%22%22%2C%22username%22%3A%22mhieu184%22%2C%22language_code%22%3A%22en%22%2C%22allows_write_to_pm%22%3Atrue%7D&auth_date=1725957206&hash=802653264f2912852370aad1779742da8af41eaf9c0e88cb32cb6ab8baccbbb3';
  // const lp = useLaunchParams();
  const setIdToken = useCatiaStore((state) => state.setIdToken);

  // useEffect(() => {
  //   if (!viewport) return;
  //   if (viewport.isStable && !viewport.isExpanded) {
  //     viewport.expand();
  //   }
  // }, [viewport]);

  useEffect(() => {
    setIdToken(initDataRaw);
  }, [initDataRaw, setIdToken]);

  // useEffect(() => {
  //   if (lp.startParam) {
  //     useCatiaStore.setState({
  //       referrer: lp.startParam,
  //     });
  //   }
  // }, [lp.startParam]);

  return (
    <BackButtonHandler>
      <div
        className='relative flex h-screen w-full flex-col overflow-hidden bg-background bg-cover bg-center bg-no-repeat text-foreground'
        style={{
          backgroundImage: 'url(/main-background.png)',
        }}
      >
        <div className='flex-1 overflow-hidden'>
          <Outlet />
        </div>
        <Nav />
      </div>
    </BackButtonHandler>
  );
};

export const LayoutWithoutNav: FC = () => {
  // const viewport = useViewport();
  // const { initDataRaw } = retrieveLaunchParams();
  const initDataRaw =
    'query_id=AAH0NgNsAgAAAPQ2A2wDJjrc&user=%7B%22id%22%3A6107117300%2C%22first_name%22%3A%22Minh%20Hi%E1%BA%BFu%22%2C%22last_name%22%3A%22%22%2C%22username%22%3A%22mhieu184%22%2C%22language_code%22%3A%22en%22%2C%22allows_write_to_pm%22%3Atrue%7D&auth_date=1725957206&hash=802653264f2912852370aad1779742da8af41eaf9c0e88cb32cb6ab8baccbbb3';
  // const lp = useLaunchParams();
  const setIdToken = useCatiaStore((state) => state.setIdToken);

  // useEffect(() => {
  //   if (!viewport) return;
  //   if (viewport.isStable && !viewport.isExpanded) {
  //     viewport.expand();
  //   }
  // }, [viewport]);

  useEffect(() => {
    setIdToken(initDataRaw);
  }, [initDataRaw, setIdToken]);

  // useEffect(() => {
  //   if (lp.startParam) {
  //     useCatiaStore.setState({
  //       referrer: lp.startParam,
  //     });
  //   }
  // }, [lp.startParam]);

  return (
    <BackButtonHandler>
      <div
        className='relative flex h-screen w-full flex-col overflow-hidden bg-background bg-cover bg-center bg-no-repeat text-foreground'
        style={{
          backgroundImage: 'url(/main-background.png)',
        }}
      >
        <Header />
        <div className='flex-1'>
          <Outlet />
        </div>
      </div>
    </BackButtonHandler>
  );
};

export const LayoutCatiarena: FC = () => {
  // const viewport = useViewport();
  // const { initDataRaw } = retrieveLaunchParams();
  const initDataRaw =
    'query_id=AAH0NgNsAgAAAPQ2A2wDJjrc&user=%7B%22id%22%3A6107117300%2C%22first_name%22%3A%22Minh%20Hi%E1%BA%BFu%22%2C%22last_name%22%3A%22%22%2C%22username%22%3A%22mhieu184%22%2C%22language_code%22%3A%22en%22%2C%22allows_write_to_pm%22%3Atrue%7D&auth_date=1725957206&hash=802653264f2912852370aad1779742da8af41eaf9c0e88cb32cb6ab8baccbbb3';
  // const lp = useLaunchParams();
  const setIdToken = useCatiaStore((state) => state.setIdToken);

  // useEffect(() => {
  //   if (!viewport) return;
  //   if (viewport.isStable && !viewport.isExpanded) {
  //     viewport.expand();
  //   }
  // }, [viewport]);

  useEffect(() => {
    setIdToken(initDataRaw);
  }, [initDataRaw, setIdToken]);

  // useEffect(() => {
  //   if (lp.startParam) {
  //     useCatiaStore.setState({
  //       referrer: lp.startParam,
  //     });
  //   }
  // }, [lp.startParam]);

  return (
    <BackButtonHandler>
      <div
        className='relative flex h-screen w-full flex-col overflow-hidden bg-background bg-cover bg-center bg-no-repeat text-foreground'
        style={{
          backgroundImage: 'url(/catiarena-background.png)',
        }}
      >
        <div className='flex-1 overflow-hidden bg-gradient-to-b from-[#0B1425]/0 from-40% to-[#0A1225]/90'>
          <Outlet />
        </div>
      </div>
    </BackButtonHandler>
  );
};
