import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./assets/blocks/Layout";
import {
  AuthContext,
  LoaderContext,
  MenuContext,
  TranslationContext,
} from "./assets/contexts/contexts";
import Main from "./assets/pages/Main/Main";
import Top from "./assets/pages/Main/Top";
import NoPage from "./assets/pages/NoPage";
import { DetectTheme } from "./assets/scripts/darklight";
import "./assets/scripts/i18n";
import setTrueVH from "./assets/scripts/truevh";
import Login from "./assets/pages/Auth/Login";

function App() {
  const { i18n, t } = useTranslation();
  const [isLoader, setIsLoader] = useState(true);
  const [user, setUser] = useState(undefined);
  const [menu, setMenu] = useState(undefined);

  const ts = (key, ...args) => {
    return t(key).format(args);
  };

  useEffect(() => {
    setTrueVH();
    DetectTheme();
    fetchUser();
  }, []);

  const fetchUser = async () => {
    await fetch("/api/u/get_current_user")
      .then((res) => {
        if (res.status != "200") {
          return undefined;
        }
        return res.json();
      })
      .then((data) => {
        if (typeof data === "object") {
          if ("id" in data) setUser(data);
          else setUser("unAuth");
          setIsLoader(false);
        }
      });
  };

  return (
    <TranslationContext.Provider value={{ t, ts, i18n }}>
      <AuthContext.Provider value={{ user, setUser, fetchUser }}>
        <LoaderContext.Provider value={{ isLoader, setIsLoader }}>
          <MenuContext.Provider value={{ menu, setMenu }}>
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Layout />}>
                  <Route index element={<Main />} />
                  <Route path="login" element={<Login />} />
                  <Route path="top" element={<Top />} />
                  <Route path="*" element={<NoPage />} />
                </Route>
              </Routes>
            </BrowserRouter>
          </MenuContext.Provider>
        </LoaderContext.Provider>
      </AuthContext.Provider>
    </TranslationContext.Provider>
  );
}

export default App;
