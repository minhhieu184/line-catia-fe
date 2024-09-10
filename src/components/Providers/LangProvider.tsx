import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import type { PropsWithChildren } from "react";
import { initReactI18next } from "react-i18next";

import arenas_en from "@/locales/en/arenas.json";
import common_en from "@/locales/en/common.json";
import freebies_en from "@/locales/en/freebies.json";
import friends_en from "@/locales/en/friends.json";
import home_en from "@/locales/en/home.json";
import leaderboard_en from "@/locales/en/leaderboard.json";
import quiz_en from "@/locales/en/quiz.json";
import tasks_en from "@/locales/en/tasks.json";

import arenas_ru from "@/locales/ru/arenas.json";
import common_ru from "@/locales/ru/common.json";
import freebies_ru from "@/locales/ru/freebies.json";
import friends_ru from "@/locales/ru/friends.json";
import home_ru from "@/locales/ru/home.json";
import leaderboard_ru from "@/locales/ru/leaderboard.json";
import quiz_ru from "@/locales/ru/quiz.json";
import tasks_ru from "@/locales/ru/tasks.json";

const languages = {
  EN: "en",
  RU: "ru",
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    interpolation: { escapeValue: false },
    lng: localStorage.getItem("i18nextLng") || languages.EN,
    fallbackLng: languages.EN,
    keySeparator: ".",
    resources: {
      en: {
        common: common_en,
        freebies: freebies_en,
        friends: friends_en,
        home: home_en,
        quiz: quiz_en,
        tasks: tasks_en,
        arenas: arenas_en,
        leaderboard: leaderboard_en,
      },
      ru: {
        common: common_ru,
        freebies: freebies_ru,
        friends: friends_ru,
        home: home_ru,
        quiz: quiz_ru,
        tasks: tasks_ru,
        arenas: arenas_ru,
        leaderboard: leaderboard_ru,
      },
    },
  });

const LangProvider = ({ children }: PropsWithChildren) => {
  return children;
};

export default LangProvider;
