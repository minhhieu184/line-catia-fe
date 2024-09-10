import i18n from "i18next";
import { useState } from "react";

const LanguageSwitch = ({
  onChangeLang,
}: { onChangeLang?: (lang: string) => void }) => {
  const [lang, setLang] = useState(i18n.language);

  return (
    <button
      type="button"
      className="flex items-center gap-1 bg-[#FFFFFF66] font-semibold px-1.5 py-1 text-xs rounded-full transition ease-in-out delay-500"
      onClick={() => {
        setLang(lang === "en" ? "ru" : "en");
        i18n.changeLanguage(lang === "en" ? "ru" : "en");
        onChangeLang?.(lang === "en" ? "ru" : "en");
      }}
    >
      <div
        className={
          lang === "en"
            ? "text-[#19BFEF] px-2 py-0.5 bg-white rounded-full"
            : ""
        }
      >
        En
      </div>
      <div
        className={
          lang === "ru"
            ? "text-[#19BFEF] px-2 py-0.5 bg-white rounded-full"
            : ""
        }
      >
        Ru
      </div>
    </button>
  );
};

export default LanguageSwitch;
