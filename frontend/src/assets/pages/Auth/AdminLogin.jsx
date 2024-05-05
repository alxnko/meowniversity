import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import PopUp from "../../blocks/PopUps/PopUp";
import { AuthContext, TranslationContext } from "../../contexts/contexts";
import { createPostData } from "../../scripts/createPostData";

export default function LanguageSelector({ isShow, setIsShow }) {
  const { t } = useContext(TranslationContext);
  const { setUser } = useContext(AuthContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleUsername = (e) => {
    setUsername(e.target.value.replace(/\s/g, "").toLowerCase());
  };

  const authAdmin = async (e) => {
    e.preventDefault();
    fetch(
      "/api/u/admin_login",
      createPostData({ username: username, password: password })
    )
      .then((res) => {
        if (res.status != "200") {
          return "error";
        }
        return res.json();
      })
      .then((data) => {
        if ("id" in data) {
          setUser(data);
          navigate("/");
        }
      });
  };

  return (
    <PopUp show={isShow} setIsShow={setIsShow}>
      <form onSubmit={authAdmin}>
        <label htmlFor="admin-username">{t("username")}</label>
        <input
          id="admin-username"
          type="username"
          autoComplete="username"
          value={username}
          onChange={handleUsername}
        />
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
