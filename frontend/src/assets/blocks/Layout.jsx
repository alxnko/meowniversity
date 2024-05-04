import React, { useContext, useState } from "react";
import { Outlet } from "react-router-dom";
import { AuthContext, LoaderContext } from "../contexts/contexts";
import Loader from "./Loader/Loader";
import AdminMenu from "./Menu/AdminMenu";
import Menu from "./Menu/Menu";
import SubMenu from "./Menu/SubMenu";

export default function Layout() {
  const { user } = useContext(AuthContext);
  const { isLoader } = useContext(LoaderContext);
  const [isMenuOpen, openMenu] = useState(false);

  const switchMenu = () => {
    if (isMenuOpen) {
      openMenu(false);
    } else {
      openMenu(true);
    }
  };

  return (
    <>
      <Loader show={isLoader} />
      <SubMenu />
      {user && user != "unAuth" ? (
        user == "Admin" ? (
          <AdminMenu />
        ) : (
          <Menu />
        )
      ) : null}
      <main>
        <div style={{ marginBottom: "60px" }} className="content">
          <Outlet />
        </div>
      </main>
    </>
  );
}
