import React, { useContext, useEffect, useState } from "react";
import { TranslationContext } from "../../../contexts/contexts";
import PopUp from "../../PopUps/PopUp";
import { createPostData } from "../../../scripts/createPostData";

export default function AddGrade({
  isShow,
  setIsShow,
  students,
  classes,
  getStudents,
  getClasses,
  getGrades,
  isEdit,
  setIsEdit,
}) {
  const { t } = useContext(TranslationContext);
  const [username, setUsername] = useState("");
  const [className, setClassName] = useState("");
  const [type, setType] = useState("quiz");
  const [grade, setGrade] = useState("");

  useEffect(() => {
    if (isEdit) {
      if (isShow) {
        setUsername(isEdit.username);
        setClassName(isEdit.className);
        setType(isEdit.type);
        setGrade(isEdit.grade);
      } else {
        setUsername("");
        setClassName("");
        setType("quiz");
        setGrade("");
        setIsEdit(false);
      }
    }
  }, [isShow]);

  useEffect(() => {
    if (!students || classes.length == 0) {
      getStudents();
    }
    if (!classes || classes.length == 0) {
      getClasses();
    }
  }, []);

  const gradeHandler = (e) => {
    let val = parseInt(e.target.value);
    if (val >= 0 && val <= 100) {
      setGrade(e.target.value);
    }
  };

  const addGrade = async (e) => {
    e.preventDefault();
    if (isEdit) {
      if (
        students.some((student) => student.username == username) &&
        classes.some((class_) => class_.name == className)
      )
        fetch(
          "/api/g/edit_grade",
          createPostData({
            username: username,
            className: className,
            type: type,
            grade: grade,
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
            setClassName("");
            setUsername("");
            setGrade("");
            setType("quiz");
            getGrades();
            setIsShow(false);
            setIsEdit(false);
          });
    } else {
      if (
        students.some((student) => student.username == username) &&
        classes.some((class_) => class_.name == className)
      ) {
        fetch(
          "/api/g/add_grade",
          createPostData({
            username: username,
            className: className,
            type: type,
            grade: grade,
          })
        )
          .then((res) => {
            if (res.status != "200") {
              return "error";
            }
            return res.json();
          })
          .then((data) => {
            setClassName("");
            setUsername("");
            setGrade("");
            setType("quiz");
            getGrades();
            setIsShow(false);
          });
      }
    }
  };

  return (
    <PopUp show={isShow} setIsShow={setIsShow}>
      <form onSubmit={addGrade}>
        <h3 className="center">{isEdit ? t("editGrade") : t("addGrade")}</h3>
        <label htmlFor="username">{t("username")}</label>
        <input
          type="text"
          name="username"
          autoComplete="off"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          list="students"
        />
        <datalist id="students">
          {students
            ? students.map((student) => (
                <option value={student.username} key={student.username} />
              ))
            : null}
        </datalist>
        <label htmlFor="className">{t("className")}</label>
        <input
          type="text"
          name="className"
          value={className}
          onChange={(e) => setClassName(e.target.value)}
          list="classes"
        />
        <datalist id="classes">
          {classes
            ? classes.map((class_) => (
                <option value={class_.name} key={class_.name} />
              ))
            : null}
        </datalist>
        <label htmlFor="type">{t("type")}</label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          style={{ width: "100%" }}
          name="type"
          id=""
        >
          <option value="quiz">quiz</option>
          <option value="midterm">midterm</option>
          <option value="final">final</option>
        </select>
        <label htmlFor="grade">{t("grade")}</label>
        <input
          type="number"
          name="grade"
          value={grade}
          onChange={gradeHandler}
        />
        <div className="flex-center">
          <input type="submit" value={isEdit ? t("edit") : t("add")} />
        </div>
      </form>
    </PopUp>
  );
}
