import React, { useContext, useState } from "react";
import { AuthContext, TranslationContext } from "../../contexts/contexts";
import PopUp from "../../blocks/PopUps/PopUp";
import { useNavigate } from "react-router-dom";

export default function LanguageSelector({ isShow, setIsShow }) {
  const { t } = useContext(TranslationContext);
  const { setUser } = useContext(AuthContext);
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const authAdmin = async (e) => {
    e.preventDefault();
    if (password == "meowniversity") {
      setUser("Admin");
      navigate("/");
    }
  };

  return (
    <PopUp show={isShow} setIsShow={setIsShow}>
      <form onSubmit={authAdmin}>
        <label htmlFor="admin-password">{t("adminPassword")}</label>
        <input
          type="password"
          name="admin-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div className="flex-center">
          <input type="submit" value={t("login")} />
        </div>
      </form>
    </PopUp>
  );
}
