import React, { useContext, useEffect, useState } from "react";
import { TranslationContext, AuthContext } from "../../contexts/contexts";
import ClassBlock from "../blocks/ClassBlock";
import GradeBlock from "../blocks/GradeBlock";
import AdminList from "../Admin/AdminList";

export default function UserPanel() {
  const { t } = useContext(TranslationContext);
  const { user } = useContext(AuthContext);
  const [panelView, setPanelView] = useState("");

  const [classes, setClasses] = useState(undefined);
  const [grades, setGrades] = useState(undefined);

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
    <div>
      {user ? (
        <>
          <div>
            <p>{t("userPanel")}</p>
            <h2>{user.name}</h2>
            <h4>
              {user.username}#{user.id}
            </h4>
            <p>
              {t("email")}: {user.email}
            </p>
            <p>
              {t("phone")}: {user.phone}
            </p>
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
  );
}
