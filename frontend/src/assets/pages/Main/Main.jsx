import React, { useContext } from "react";
import AdminPanel from "../../blocks/Admin/AdminPanel";
import IsAuth from "../../blocks/Auth/IsAuth";
import UserPanel from "../../blocks/User/UserPanel";
import { AuthContext } from "../../contexts/contexts";

export default function Main() {
  const { user } = useContext(AuthContext);

  return (
    <div>
      <IsAuth />
      {user && user.type == "admin" ? <AdminPanel /> : <UserPanel />}
    </div>
  );
}
