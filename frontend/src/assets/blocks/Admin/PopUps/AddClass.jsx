import React, { useContext, useEffect, useState } from "react";
import { TranslationContext } from "../../../contexts/contexts";
import PopUp from "../../../blocks/PopUps/PopUp";
import { createPostData } from "../../../scripts/createPostData";

export default function AddClass({
  isShow,
  setIsShow,
  getClasses,
  isEdit,
  setIsEdit,
}) {
  const { t } = useContext(TranslationContext);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (isEdit) {
      if (isShow) {
        setName(isEdit.name);
        setDescription(isEdit.description);
      } else {
        setName("");
        setDescription("");
        setIsEdit(false);
      }
    }
  }, [isShow]);

  const addClass = async (e) => {
    e.preventDefault();
    if (isEdit) {
      if (name.length > 2)
        fetch(
          "/api/c/edit_class",
          createPostData({
            name: name,
            description: description,
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
            setDescription("");
            getClasses();
            setIsShow(false);
            setIsEdit(false);
          });
    } else {
      if (name.length > 2) {
        fetch(
          "/api/c/add_class",
          createPostData({
            name: name,
            description: description,
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
            setDescription("");
            getClasses();
            setIsShow(false);
          });
      }
    }
  };

  return (
    <PopUp show={isShow} setIsShow={setIsShow}>
      <form onSubmit={addClass}>
        <h3 className="center">{t("addClass")}</h3>
        <label htmlFor="class-name">{t("name")}</label>
        <input
          type="text"
          name="class-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <label htmlFor="description">{t("description")}</label>
        <input
          type="text"
          name="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <div className="flex-center">
          <input type="submit" value={t("add")} />
        </div>
      </form>
    </PopUp>
  );
}
