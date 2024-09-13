import { Header } from '@/components/Header/Header';
import { Nav } from '@/components/Nav/Nav';
import { ScrollArea } from '@/components/ui/scroll-area';
import { type FC, useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import useCatiaStore from '../lib/useCatiaStore';
import BackButtonHandler from './BackButtonHandler';
import { liff } from '@line/liff';
import { useMe } from '@/lib/swr';

const useLiffDebug = () => {
  useEffect(() => {
    liff
      .init({
        liffId: import.meta.env.VITE_LIFF_ID,
        // withLoginOnExternalBrowser: true,
      })
      .then(() => {
        if (liff.isLoggedIn() || liff.isInClient()) return;
        // get query params
        const queryParams = new URLSearchParams(window.location.search);
        const referrerId = queryParams.get('ref');
        const endpointUrl = liff.getContext()?.endpointUrl;
        const redirectUri = endpointUrl && referrerId ? `${endpointUrl}?ref=${referrerId}` : undefined;
        liff.login({ redirectUri });
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
          context: liff.getContext(),
        });

        const profilePlus = liff.getProfilePlus();
        if (!profilePlus) return;
        const { regionCode } = profilePlus;
      })
      .catch((e: Error) => {
        console.log('LIFF init failed.', e);
      });
  }, []);
};

const useLayout = () => {
  // useLiffDebug();

  const setIdToken = useCatiaStore((state) => state.setIdToken);
  const setReferrerId = useCatiaStore((state) => state.setReferrerId);

  useEffect(() => {
    liff
      .init({ liffId: import.meta.env.VITE_LIFF_ID })
      .then(() => {
        if (liff.isLoggedIn() || liff.isInClient()) return;
        // get query params
        const queryParams = new URLSearchParams(window.location.search);
        const referrerId = queryParams.get('ref');
        const endpointUrl = liff.getContext()?.endpointUrl;
        const redirectUri = endpointUrl && referrerId ? `${endpointUrl}?ref=${referrerId}` : undefined;
        liff.login({ redirectUri });
      })
      .then(() => {
        const idToken = liff.getIDToken() || undefined;
        console.log('.then ~ idToken:', idToken);
        setIdToken(idToken);
        // if (!idToken) setIdToken(dumpLiffData.idToken);
        const queryParams = new URLSearchParams(window.location.search);
        const referrerId = queryParams.get('ref');
        setReferrerId(referrerId);
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
