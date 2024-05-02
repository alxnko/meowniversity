import React, { useContext, useState, useEffect } from "react";
import {
  BiSolidMoon,
  BiSolidSun,
  BiSolidLogOut,
  BiSolidUser,
} from "react-icons/bi";
import { FaRankingStar } from "react-icons/fa6";
import { FaLanguage } from "react-icons/fa";
import { TranslationContext, AuthContext } from "../../contexts/contexts";
import { SwitchTheme } from "../../scripts/darklight";
import { GiHamburgerMenu } from "react-icons/gi";
import LanguageSelector from "./LanguageSelector";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function SubMenu() {
  const navigate = useNavigate();
  const [isLang, SetIsLang] = useState(false);
  const { user, setUser, fetchUser } = useContext(AuthContext);
  const [isOnTop, setIsOnTop] = useState(false);

  useEffect(() => {
    setIsOnTop(window.location.href.includes("/top"));
  }, [navigate]);

  const logout = () => {
    if (user == "Admin") {
      setUser("unAuth");
    }
    fetch("/api/u/logout").then(() => setUser("unAuth"));
  };

  return (
    <>
      <LanguageSelector isLang={isLang} SetIsLang={SetIsLang} />
      <div className="submenu">
        {isOnTop ? (
          <Link to="/">
            <button>
              <BiSolidUser />
            </button>
          </Link>
        ) : (
          <Link to="/top">
            <button>
              <FaRankingStar />
            </button>
          </Link>
        )}

        {/* <button id="openMenu">
          <GiHamburgerMenu />
        </button> */}
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
        {/* {user && user != "Admin" ? (
          <button>
            <BiSolidUser />
          </button>
        ) : null} */}
        {user && user != "unAuth" ? (
          <button onClick={logout}>
            <BiSolidLogOut />
          </button>
        ) : null}
      </div>
    </>
  );
}
