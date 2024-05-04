import React, { useContext, useEffect, useState } from "react";
import PopUp from "../../../blocks/PopUps/PopUp";
import { TranslationContext } from "../../../contexts/contexts";
import { createPostData } from "../../../scripts/createPostData";

export default function AddStudent({
  isShow,
  setIsShow,
  getStudents,
  isEdit,
  setIsEdit,
}) {
  const { t } = useContext(TranslationContext);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (isEdit) {
      if (isShow) {
        setName(isEdit.name);
        setEmail(isEdit.email);
        setPhone(isEdit.phone);
        setUsername(isEdit.username);
        setPassword(isEdit.password);
      } else {
        setName("");
        setEmail("");
        setPhone("");
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
          "/api/u/edit_user",
          createPostData({
            name: name,
            username: username,
            password: password,
            email: email,
            phone: phone,
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
            setEmail("");
            setPhone("");
            setUsername("");
            setPassword("");
            getStudents();
            setIsShow(false);
            setIsEdit(false);
          });
    } else {
      if (username.length > 2 && password.length > 7) {
        fetch(
          "/api/u/add_user",
          createPostData({
            name: name,
            username: username,
            password: password,
            email: email,
            phone: phone,
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
            setEmail("");
            setPhone("");
            setUsername("");
            setPassword("");
            getStudents();
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
        <label htmlFor="email">{t("email")}</label>
        <input
          type="email"
          name="email"
          value={email}
          autoComplete="off"
          onChange={(e) => setEmail(e.target.value)}
        />
        <label htmlFor="phone">{t("phone")}</label>
        <input
          type="phone"
          name="phone"
          value={phone}
          autoComplete="off"
          onChange={(e) => setPhone(e.target.value)}
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
