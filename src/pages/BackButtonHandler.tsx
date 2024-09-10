import useCatiaStore from "@/lib/useCatiaStore";
import { useBackButton } from "@telegram-apps/sdk-react";
import { type PropsWithChildren, useEffect, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const TopLevelPages = ["/", "/quizzes", "/tasks", "/friends"];

const BackButtonHandler = ({ children }: PropsWithChildren) => {
  const navigate = useNavigate();
  const location = useLocation();
  const buttonBack = useBackButton();

  const inviteDialogOpen = useCatiaStore((state) => state.inviteDialogOpen);
  const profileBottomSheetOpen = useCatiaStore(
    (state) => state.profileBottomSheetOpen
  );
  const quizProgressDialogOpen = useCatiaStore(
    (state) => state.quizProgressDialogOpen
  );
  const quizFiftyFiftyDialogOpen = useCatiaStore(
    (state) => state.quizFiftyFiftyDialogOpen
  );
  const taskListSheetOpen = useCatiaStore((state) => state.taskListSheetOpen);
  const speedUpSheetOpen = useCatiaStore((state) => state.speedUpSheetOpen);
  const quizDetailDialog = useCatiaStore((state) => state.quizDetailDialog);

  const closeAllDialog = useCatiaStore((state) => state.closeAllDialog);

  const anyCloseableDialogOpen = useMemo(() => {
    return (
      inviteDialogOpen ||
      profileBottomSheetOpen ||
      quizProgressDialogOpen ||
      quizFiftyFiftyDialogOpen ||
      taskListSheetOpen ||
      speedUpSheetOpen ||
      quizDetailDialog
    );
  }, [
    inviteDialogOpen,
    profileBottomSheetOpen,
    quizProgressDialogOpen,
    quizFiftyFiftyDialogOpen,
    taskListSheetOpen,
    speedUpSheetOpen,
    quizDetailDialog,
  ]);

  useEffect(() => {
    function onClick() {
      if (anyCloseableDialogOpen) {
        closeAllDialog();
      } else {
        navigate(-1);
        closeAllDialog();
      }
    }
    buttonBack.on("click", onClick);
    return () => {
      buttonBack.off("click", onClick);
    };
  }, [buttonBack, navigate, anyCloseableDialogOpen, closeAllDialog]);

  useEffect(() => {
    if (anyCloseableDialogOpen) {
      buttonBack.show();
      return;
    }
    if (
      location.key === "default" ||
      TopLevelPages.includes(location.pathname)
    ) {
      buttonBack.hide();
      return;
    }
    if (!buttonBack.supports("show")) {
      return;
    }
    buttonBack.show();
  }, [location, buttonBack, anyCloseableDialogOpen]);

  return children;
};

export default BackButtonHandler;
