import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import IsNotAuth from "../../blocks/Auth/IsNotAuth";
import Logo from "../../blocks/Logo/Logo";
import { AuthContext, TranslationContext } from "../../contexts/contexts";
import { createPostData } from "../../scripts/createPostData";
import AdminLogin from "./AdminLogin";

export default function Login() {
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const { t } = useContext(TranslationContext);
  const { fetchUser } = useContext(AuthContext);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const handleUsername = (e) => {
    setUsername(e.target.value.replace(/\s/g, "").toLowerCase());
  };
  const logMe = async (e) => {
    e.preventDefault();
    if (username.length > 2 && password.length > 7) {
      fetch(
        "/api/u/login",
        createPostData({ username: username, password: password })
      )
        .then((res) => {
          if (res.status != "200") {
            return { status: false };
          }
          return res.json();
        })
        .then(async (data) => {
          if ("id" in data) {
            await fetchUser();
            navigate("/");
          } else setError(t("unauth"));
        });
    } else {
      setError(t("baddata"));
    }
  };
  return (
    <>
      <AdminLogin isShow={showAdminLogin} setIsShow={setShowAdminLogin} />
      <Logo />
      <form onSubmit={logMe}>
        <IsNotAuth />
        <h1 className="center">{t("auth")}</h1>
        <label htmlFor="username">{t("username3")}</label>
        <input
          id="username"
          type="username"
          autoComplete="username"
          value={username}
          onChange={handleUsername}
        />
        <label htmlFor="password">{t("password8")}</label>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div className="invalid-feedback">
          <span>{error}</span>
        </div>
        <div className="flex-center">
          <input type="submit" value={t("login")} />
          <input
            className="admin"
            style={{ marginLeft: "10px" }}
            type="button"
            onClick={() => {
              setShowAdminLogin(true);
            }}
            value={t("adminPanel")}
          />
        </div>
      </form>
    </>
  );
}
