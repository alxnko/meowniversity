import React, { useContext, useEffect, useState } from "react";
import PopUp from "../../../blocks/PopUps/PopUp";
import { TranslationContext } from "../../../contexts/contexts";
import { createPostData } from "../../../scripts/createPostData";

export default function AddStudent({
  isShow,
  setIsShow,
  getAdmins,
  isEdit,
  setIsEdit,
}) {
  const { t } = useContext(TranslationContext);
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (isEdit) {
      if (isShow) {
        setName(isEdit.name);
        setUsername(isEdit.username);
        setPassword(isEdit.password);
      } else {
        setName("");
        setUsername("");
        setPassword("");
        setIsEdit(false);
      }
    }
  }, [isShow]);

  const handleUsername = (e) => {
    setUsername(e.target.value.replace(/\s/g, "").toLowerCase());
  };

  const addStudent = async (e) => {
    e.preventDefault();
    if (isEdit) {
      if (username.length > 2 && password.length > 7)
        fetch(
          "/api/u/edit_admin",
          createPostData({
            name: name,
            username: username,
            password: password,
            id: isEdit.id,
          })
        )
          .then((res) => {
            if (res.status != "200") {
              return "error";
            }
            return res.json();
          })
          .then((data) => {
            setName("");
            setUsername("");
            setPassword("");
            getAdmins();
            setIsShow(false);
            setIsEdit(false);
          });
    } else {
      if (username.length > 2 && password.length > 7) {
        fetch(
          "/api/u/add_admin",
          createPostData({
            name: name,
            username: username,
            password: password,
          })
        )
          .then((res) => {
            if (res.status != "200") {
              return "error";
            }
            return res.json();
          })
          .then((data) => {
            setName("");
            setUsername("");
            setPassword("");
            getAdmins();
            setIsShow(false);
          });
      }
    }
  };

  return (
    <PopUp show={isShow} setIsShow={setIsShow}>
      <form autoComplete="off" onSubmit={addStudent}>
        <h3 className="center">
          {isEdit ? t("editStudent") : t("addStudent")}
        </h3>
        <label htmlFor="student-name">{t("name")}</label>
        <input
          type="text"
          name="student-name"
          value={name}
          autoComplete="off"
          onChange={(e) => setName(e.target.value)}
        />
        <label htmlFor="username">{t("username")}</label>
        <input
          type="text"
          name="username"
          value={username}
          autoComplete="off"
          onChange={handleUsername}
        />
        <label htmlFor="password">{t("password")}</label>
        <input
          type="text"
          name="password"
          value={password}
          autoComplete="off"
          onChange={(e) => setPassword(e.target.value)}
        />
        <div className="flex-center">
          <input type="submit" value={isEdit ? t("edit") : t("add")} />
        </div>
      </form>
    </PopUp>
  );
}
