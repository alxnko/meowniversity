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
import NoPage from "./assets/pages/NoPage";
import { DetectTheme } from "./assets/scripts/darklight";
import "./assets/scripts/i18n";
import setTrueVH from "./assets/scripts/truevh";

function App() {
  const { i18n, t } = useTranslation();
  const [isLoader, setIsLoader] = useState(false);
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

  const fetchUser = async () => {};

  return (
    <TranslationContext.Provider value={{ t, ts, i18n }}>
      <AuthContext.Provider value={{ user, setUser, fetchUser }}>
        <LoaderContext.Provider value={{ isLoader, setIsLoader }}>
          <MenuContext.Provider value={{ menu, setMenu }}>
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Layout />}>
                  <Route index element={<Main />} />
                  {/* <Route path="login" element={<Login />} /> */}
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
