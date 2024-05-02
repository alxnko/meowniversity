import React, { useContext, useState } from "react";
import { BiSolidMoon, BiSolidSun } from "react-icons/bi";
import { FaLanguage } from "react-icons/fa";
import { TranslationContext } from "../../contexts/contexts";
import { SwitchTheme } from "../../scripts/darklight";
import LanguageSelector from "./LanguageSelector";

export default function SubMenu() {
  const [isLang, SetIsLang] = useState(false);
  const { t } = useContext(TranslationContext);

  return (
    <>
      <LanguageSelector isLang={isLang} SetIsLang={SetIsLang} />
      <div>
        <button onClick={SwitchTheme} id="sun">
          <BiSolidSun />
        </button>
        <button onClick={SwitchTheme} id="moon">
          <BiSolidMoon />
        </button>
        <button
          onClick={() => {
            SetIsLang(true);
          }}
        >
          <FaLanguage />
        </button>
      </div>
    </>
  );
}
