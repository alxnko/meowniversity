import React, { useContext, useEffect, useState } from "react";
import { TranslationContext } from "../../../contexts/contexts";
import PopUp from "../../../blocks/PopUps/PopUp";
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
      setName(isEdit.name);
      setEmail(isEdit.email);
      setPhone(isEdit.phone);
      setUsername(isEdit.username);
      setPassword(isEdit.password);
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
      <form onSubmit={addStudent}>
        <h3 className="center">{t("addStudent")}</h3>
        <label htmlFor="student-name">{t("name")}</label>
        <input
          type="text"
          name="student-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <label htmlFor="email">{t("email")}</label>
        <input
          type="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <label htmlFor="phone">{t("phone")}</label>
        <input
          type="phone"
          name="phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <label htmlFor="username">{t("username")}</label>
        <input
          type="text"
          name="username"
          value={username}
          onChange={handleUsername}
        />
        <label htmlFor="password">{t("password")}</label>
        <input
          type="text"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div className="flex-center">
          <input type="submit" value={t("add")} />
        </div>
      </form>
    </PopUp>
  );
}
