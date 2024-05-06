import React, { useContext, useState } from "react";
import PopUp from "../../../blocks/PopUps/PopUp";
import { TranslationContext } from "../../../contexts/contexts";
import { createPostData } from "../../../scripts/createPostData";

export default function AddClass({ isShow, setIsShow }) {
  const { t } = useContext(TranslationContext);
  const [text, setText] = useState("");

  const addClass = async (e) => {
    e.preventDefault();
    if (text.length > 2) {
      fetch(
        "/api/f/add_feedback",
        createPostData({
          text: text,
        })
      )
        .then((res) => {
          if (res.status != "200") {
            return "error";
          }
          return res.json();
        })
        .then((data) => {
          setText("");
          setIsShow(false);
        });
    }
  };

  return (
    <PopUp show={isShow} setIsShow={setIsShow}>
      <form onSubmit={addClass}>
        <h3 className="center">{t("addFeedback")}</h3>
        <label htmlFor="text">{t("text")}</label>
        <input
          type="text"
          name="text"
          value={text}
          autoComplete="off"
          onChange={(e) => setText(e.target.value)}
        />
        <div className="flex-center">
          <input type="submit" value={t("add")} />
        </div>
      </form>
    </PopUp>
  );
}
