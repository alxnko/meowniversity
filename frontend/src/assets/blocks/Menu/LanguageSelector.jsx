import React, { useContext } from "react";
import { AuthContext, TranslationContext } from "../../contexts/contexts";
import { setLang } from "../../scripts/language";
import PopUp from "../PopUps/PopUp";

export default function LanguageSelector({ isLang, SetIsLang }) {
  const { t } = useContext(TranslationContext);
  const { user } = useContext(AuthContext);

  const changeLang = (lang) => {
    setLang(lang);
    SetIsLang(false);
  };

  return (
    <PopUp show={isLang} setIsShow={SetIsLang}>
      <h3 className="center">{t("lang")}</h3>
      <br />
      <button
        onClick={() => {
          changeLang("en");
        }}
      >
        English
      </button>
      {user && user.isTester ? (
        <button
          onClick={() => {
            changeLang("kg");
          }}
        >
          Кыргызча
        </button>
      ) : (
        ""
      )}
      <button
        onClick={() => {
          changeLang("ru");
        }}
      >
        Русский
      </button>
    </PopUp>
  );
}
