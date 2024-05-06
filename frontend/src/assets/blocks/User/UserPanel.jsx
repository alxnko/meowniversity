import React, { useContext, useEffect, useState } from "react";
import { VscFeedback } from "react-icons/vsc";
import { AuthContext, TranslationContext } from "../../contexts/contexts";
import AdminList from "../Admin/AdminList";
import AddStudent from "../Admin/PopUps/AddStudent";
import ClassBlock from "../blocks/ClassBlock";
import GradeBlock from "../blocks/GradeBlock";
import Logo from "../Logo/Logo";
import AddFeedback from "./Feedback/AddFeedback";

export default function UserPanel() {
  const { t } = useContext(TranslationContext);
  const { user, fetchUser } = useContext(AuthContext);
  const [panelView, setPanelView] = useState("");

  const [showAddFeedback, setShowAddFeedback] = useState(false);

  const [classes, setClasses] = useState(undefined);
  const [grades, setGrades] = useState(undefined);

  const [isEdit, setIsEdit] = useState(false);

  function getClasses() {
    fetch("/api/c/get_my_classes")
      .then((res) => {
        if (res.status != "200") {
          return "error";
        }
        return res.json();
      })
      .then((data) => {
        setClasses(data.classes);
      });
  }
  function getGrades() {
    fetch("/api/g/get_my_grades")
      .then((res) => {
        if (res.status != "200") {
          return "error";
        }
        return res.json();
      })
      .then((data) => {
        setGrades(data.grades);
      });
  }

  useEffect(() => {
    if (panelView == "classes") {
      getClasses();
    } else if (panelView == "grades") {
      getGrades();
    }
  }, [panelView]);

  return (
    <>
      <AddStudent
        isShow={isEdit}
        setIsShow={setIsEdit}
        getStudents={fetchUser}
        isEdit={user}
        setIsEdit={(a) => {}}
      />
      <AddFeedback isShow={showAddFeedback} setIsShow={setShowAddFeedback} />
      <div>
        {user ? (
          <>
            <Logo />
            <h2 className="center">{t("userPanel")}</h2>
            <br />
            <div className="flex jc-sb">
              <div>
                <h1>{user.name}</h1>
                <h4>
                  {user.username}#{user.id}
                </h4>
                <p>
                  {t("quizAverage")}: {user.quizAverage}
                </p>
                <p>
                  {t("midtermAverage")}: {user.midtermAverage}
                </p>
                <p>
                  {t("finalAverage")}: {user.finalAverage}
                </p>
                <p>
                  {t("email")}: {user.email}
                </p>
                <p>
                  {t("phone")}: {user.phone}
                </p>
                <p>
                  {t("address")}: {user.address}
                </p>
              </div>
              <div style={{ minWidth: "65px", textAlign: "right" }}>
                <p>{t("average")}</p>
                <h1>{user.averageGrade}</h1>
                <button
                  onClick={() => setShowAddFeedback(true)}
                  className="round-button w3"
                >
                  <VscFeedback />
                </button>
              </div>
            </div>
            <div>
              <button
                className={
                  "round-button w3" + (panelView == "classes" ? " active" : "")
                }
                onClick={() => setPanelView("classes")}
              >
                {t("classes")}
              </button>
              <button
                className={
                  "round-button w3" + (panelView == "grades" ? " active" : "")
                }
                onClick={() => setPanelView("grades")}
              >
                {t("grades")}
              </button>
              <button
                onClick={() => setIsEdit(true)}
                className="round-button w3 edit"
              >
                {t("edit")}
              </button>
            </div>
            <div style={{ display: panelView == "classes" ? "block" : "none" }}>
              <AdminList Component={ClassBlock} data={classes} />
            </div>
            <div style={{ display: panelView == "grades" ? "block" : "none" }}>
              <AdminList Component={GradeBlock} data={grades} />
            </div>
          </>
        ) : null}
      </div>
    </>
  );
}
