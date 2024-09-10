import { DisplayData } from "@/components/DisplayData/DisplayData";
import { Link } from "@/components/Link/Link";
import { Page } from "@/components/Page/Page";
// import { useThemeParams } from "@telegram-apps/sdk-react";
import type { FC } from "react";

export const ThemeParamsPage: FC = () => {
  // const themeParams = useThemeParams();

  return (
    <Page
      title="Theme Params"
      disclaimer={
        <>
          This page displays current{" "}
          <Link to="https://docs.telegram-mini-apps.com/platform/theming">
            theme parameters
          </Link>
          . It is reactive, so, changing theme externally will lead to this page
          updates.
        </>
      }
    >
      {/* <DisplayData
        rows={Object.entries(themeParams.getState()).map(([title, value]) => ({
          title: title
            .replace(/[A-Z]/g, (m) => `_${m.toLowerCase()}`)
            .replace(/background/, "bg"),
          value,
        }))}
      /> */}
    </Page>
  );
};
