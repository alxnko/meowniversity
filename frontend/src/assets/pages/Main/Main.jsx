import React, { useContext } from "react";
import IsAuth from "../../blocks/Auth/IsAuth";
import { AuthContext } from "../../contexts/contexts";
import UserPanel from "../../blocks/User/UserPanel";
import AdminPanel from "../../blocks/Admin/AdminPanel";

export default function Main() {
  const { user } = useContext(AuthContext);

  return (
    <div>
      <IsAuth />
      {user == "Admin" ? <AdminPanel /> : <UserPanel />}
    </div>
  );
}
