import React, { useContext, useState } from "react";
import { AuthContext, TranslationContext } from "../../contexts/contexts";
import PopUp from "../../blocks/PopUps/PopUp";
import { useNavigate } from "react-router-dom";
import { createPostData } from "../../scripts/createPostData";

export default function LanguageSelector({ isShow, setIsShow }) {
  const { t } = useContext(TranslationContext);
  const { setUser } = useContext(AuthContext);
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const authAdmin = async (e) => {
    e.preventDefault();
    fetch("/api/u/admin_login", createPostData({ password: password }))
      .then((res) => {
        if (res.status != "200") {
          return "error";
        }
        return res.json();
      })
      .then((data) => {
        if (data.isAdmin) {
          setUser("Admin");
          navigate("/");
        }
      });
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
