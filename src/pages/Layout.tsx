import { Header } from "@/components/Header/Header";
import { Nav } from "@/components/Nav/Nav";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  retrieveLaunchParams,
  useLaunchParams,
  useViewport,
} from "@telegram-apps/sdk-react";
import { type FC, useEffect } from "react";
import { Outlet } from "react-router-dom";
import useCatiaStore from "../lib/useCatiaStore";
import BackButtonHandler from "./BackButtonHandler";

export const LayoutFull: FC = () => {
  const viewport = useViewport();
  const { initDataRaw } = retrieveLaunchParams();
  const lp = useLaunchParams();
  const setToken = useCatiaStore((state) => state.setToken);

  useEffect(() => {
    if (!viewport) return;
    if (viewport.isStable && !viewport.isExpanded) {
      viewport.expand();
    }
  }, [viewport]);

  useEffect(() => {
    setToken(initDataRaw);
  }, [initDataRaw, setToken]);

  useEffect(() => {
    if (lp.startParam) {
      useCatiaStore.setState({
        referrer: lp.startParam,
      });
    }
  }, [lp.startParam]);

  return (
    <BackButtonHandler>
      <ScrollArea className="h-screen">
        <div
          className="relative flex h-full w-full bg-cover bg-no-repeat bg-center flex-col overflow-hidden bg-background text-foreground"
          style={{
            backgroundImage: "url(/main-background.png)",
          }}
        >
          <Header />
          <div className="flex-1">
            <Outlet />
          </div>
          <Nav />
        </div>
      </ScrollArea>
    </BackButtonHandler>
  );
};

export const LayoutWithoutHeaderAndNav: FC = () => {
  const viewport = useViewport();
  const { initDataRaw } = retrieveLaunchParams();
  const lp = useLaunchParams();
  const setToken = useCatiaStore((state) => state.setToken);

  useEffect(() => {
    if (!viewport) return;
    if (viewport.isStable && !viewport.isExpanded) {
      viewport.expand();
    }
  }, [viewport]);

  useEffect(() => {
    setToken(initDataRaw);
  }, [initDataRaw, setToken]);

  useEffect(() => {
    if (lp.startParam) {
      useCatiaStore.setState({
        referrer: lp.startParam,
      });
    }
  }, [lp.startParam]);

  return (
    <BackButtonHandler>
      <div
        className="relative flex h-screen w-full bg-cover bg-no-repeat bg-center flex-col overflow-hidden bg-background text-foreground"
        style={{
          backgroundImage: "url(/main-background.png)",
        }}
      >
        <div className="flex-1">
          <Outlet />
        </div>
      </div>
    </BackButtonHandler>
  );
};

export const LayoutWithoutHeader: FC = () => {
  const viewport = useViewport();
  const { initDataRaw } = retrieveLaunchParams();
  const lp = useLaunchParams();
  const setToken = useCatiaStore((state) => state.setToken);

  useEffect(() => {
    if (!viewport) return;
    if (viewport.isStable && !viewport.isExpanded) {
      viewport.expand();
    }
  }, [viewport]);

  useEffect(() => {
    setToken(initDataRaw);
  }, [initDataRaw, setToken]);

  useEffect(() => {
    if (lp.startParam) {
      useCatiaStore.setState({
        referrer: lp.startParam,
      });
    }
  }, [lp.startParam]);

  return (
    <BackButtonHandler>
      <div
        className="relative flex h-screen w-full bg-cover bg-no-repeat bg-center flex-col overflow-hidden bg-background text-foreground"
        style={{
          backgroundImage: "url(/main-background.png)",
        }}
      >
        <div className="flex-1 overflow-hidden">
          <Outlet />
        </div>
        <Nav />
      </div>
    </BackButtonHandler>
  );
};

export const LayoutWithoutNav: FC = () => {
  const viewport = useViewport();
  const { initDataRaw } = retrieveLaunchParams();
  const lp = useLaunchParams();
  const setToken = useCatiaStore((state) => state.setToken);

  useEffect(() => {
    if (!viewport) return;
    if (viewport.isStable && !viewport.isExpanded) {
      viewport.expand();
    }
  }, [viewport]);

  useEffect(() => {
    setToken(initDataRaw);
  }, [initDataRaw, setToken]);

  useEffect(() => {
    if (lp.startParam) {
      useCatiaStore.setState({
        referrer: lp.startParam,
      });
    }
  }, [lp.startParam]);

  return (
    <BackButtonHandler>
      <div
        className="relative flex h-screen w-full bg-cover bg-no-repeat bg-center flex-col overflow-hidden bg-background text-foreground"
        style={{
          backgroundImage: "url(/main-background.png)",
        }}
      >
        <Header />
        <div className="flex-1">
          <Outlet />
        </div>
      </div>
    </BackButtonHandler>
  );
};

export const LayoutCatiarena: FC = () => {
  const viewport = useViewport();
  const { initDataRaw } = retrieveLaunchParams();
  const lp = useLaunchParams();
  const setToken = useCatiaStore((state) => state.setToken);

  useEffect(() => {
    if (!viewport) return;
    if (viewport.isStable && !viewport.isExpanded) {
      viewport.expand();
    }
  }, [viewport]);

  useEffect(() => {
    setToken(initDataRaw);
  }, [initDataRaw, setToken]);

  useEffect(() => {
    if (lp.startParam) {
      useCatiaStore.setState({
        referrer: lp.startParam,
      });
    }
  }, [lp.startParam]);

  return (
    <BackButtonHandler>
      <div
        className="relative flex h-screen w-full bg-cover bg-no-repeat bg-center flex-col overflow-hidden bg-background text-foreground"
        style={{
          backgroundImage: "url(/catiarena-background.png)",
        }}
      >
        <div className="flex-1 overflow-hidden bg-gradient-to-b from-[#0B1425]/0 to-[#0A1225]/90 from-40%">
          <Outlet />
        </div>
      </div>
    </BackButtonHandler>
  );
};
