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
    'eyJraWQiOiJhNzk2OGMyZWExNWYwZjQxNjM1ZGU1ZTA4ODI5MDQ5MWIwMjMxYTU2YTQ5Y2M4YTZjZDZlZDQ0MTcyN2EyNTJmIiwidHlwIjoiSldUIiwiYWxnIjoiRVMyNTYifQ.eyJpc3MiOiJodHRwczovL2FjY2Vzcy5saW5lLm1lIiwic3ViIjoiVWM0MzY0YTUyODM2Nzc5NjljNjg3ZGRiYjY5MzA5MWQxIiwiYXVkIjoiMjAwNjI5NjA4OCIsImV4cCI6MTcyNjE3MjI4NSwiaWF0IjoxNzI2MTY4Njg1LCJhbXIiOlsibGluZXNzbyJdLCJuYW1lIjoiUGjhuqFtIFRy4bqnbiBNaW5oIEhp4bq_dSJ9.AkMpXMQ7UTXwoBUJnjzqB453aPC6MDQBWL4PeM0I80dPwMr-GQCkuZFG2YSGlmKR2RHmHqfJ5j1fBSE3hWY7JQ',
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

const useLiffDebug = () => {
  useEffect(() => {
    liff
      .init({
        liffId: import.meta.env.VITE_LIFF_ID,
        withLoginOnExternalBrowser: true,
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

const useLayout = () => {
  // useLiffDebug();

  const setIdToken = useCatiaStore((state) => state.setIdToken);

  useEffect(() => {
    liff
      .init({
        liffId: import.meta.env.VITE_LIFF_ID,
        withLoginOnExternalBrowser: true,
      })
      .then(() => {
        const idToken = liff.getIDToken() || undefined;
        console.log('.then ~ idToken:', idToken);
        setIdToken(idToken);
        if (!idToken) setIdToken(dumpLiffData.idToken);
      })
      .catch((e: Error) => {
        console.log('LIFF init failed.', e);
      });
  }, [setIdToken]);
};

export const LayoutFull: FC = () => {
  useLayout();

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
  useLayout();

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
  useLayout();

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
  useLayout();

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
  useLayout();

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
