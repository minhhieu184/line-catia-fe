import { useMe } from "@/lib/swr";
import useCatiaStore from "@/lib/useCatiaStore";
import InviteFriendDialog from "../Dialogs/InviteFriendDialog";
import LanguageSwitch from "../Language/LanguageSwitch";
import Container from "../Layout/Container";
import { Logo } from "../Logo/Logo";
import UserPersonalSheet from "../UserPersonal/UserPersonalSheet";
import { ProfileBunnyIcon, QRIcon } from "./Icon";

export const Header = () => {
  const { data: user } = useMe();
  const inviteDialogOpen = useCatiaStore((state) => state.inviteDialogOpen);

  const setInviteDialogOpen = useCatiaStore(
    (state) => state.setInviteDialogOpen
  );
  const profileBottomSheetOpen = useCatiaStore(
    (state) => state.profileBottomSheetOpen
  );
  const setProfileBottomSheetOpen = useCatiaStore(
    (state) => state.setProfileBottomSheetOpen
  );

  return (
    <>
      <header>
        <Container className="py-3">
          <div className="grid grid-cols-3">
            <div className="inline-flex items-center">
              <UserPersonalSheet
                setIsOpen={setProfileBottomSheetOpen}
                isOpen={profileBottomSheetOpen}
              >
                <div className="flex relative cursor-pointer items-center gap-2 text-xs font-semibold text-white line-clamp-1">
                  <div className="w-9 h-9 flex items-center justify-center rounded-[10px] bg-white/[0.06]">
                    <div className="w-9 h-9 flex items-center justify-center rounded-[10px] bg-[#4E4949]/20">
                      <ProfileBunnyIcon />
                    </div>
                  </div>
                  <span className="line-clamp-1">
                    {user?.first_name ||
                      user?.last_name ||
                      (user?.username && `@${user?.username}`) ||
                      ""}
                  </span>
                </div>
              </UserPersonalSheet>
            </div>
            <div className="flex items-center justify-center">
              <Logo />
            </div>
            <div className="inline-flex items-center justify-end gap-1.5">
              <LanguageSwitch />
              {/* <button className="bg-[#84DBFF4D] p-1 rounded-md" type="button" onClick={() => {
                i18n.changeLanguage(i18n.language === "en" ? "ru" : "en").then();
              }}>
                <TranslateIcon/>
              </button> */}
              <button
                className="bg-[#84DBFF4D] p-1 rounded-md"
                type="button"
                onClick={() => setInviteDialogOpen(true)}
              >
                <QRIcon />
              </button>
            </div>
          </div>
        </Container>
      </header>
      <InviteFriendDialog
        open={inviteDialogOpen}
        onOpenChange={setInviteDialogOpen}
        user={user}
      />
    </>
  );
};
