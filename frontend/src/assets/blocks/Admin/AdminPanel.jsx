import React, { useContext, useEffect, useState } from "react";
import { AuthContext, TranslationContext } from "../../contexts/contexts";
import AdminBlock from "../blocks/AdminBlock";
import ClassBlock from "../blocks/ClassBlock";
import FeedbackBlock from "../blocks/FeedbackBlock";
import GradeBlock from "../blocks/GradeBlock";
import LogBlock from "../blocks/LogBlock";
import StudentBlock from "../blocks/StudentBlock";
import Logo from "../Logo/Logo";
import AdminList from "./AdminList";
import AddAdmin from "./PopUps/AddAdmin";
import AddClass from "./PopUps/AddClass";
import AddGrade from "./PopUps/AddGrade";
import AddStudent from "./PopUps/AddStudent";

export default function AdminPanel() {
  const { t } = useContext(TranslationContext);
  const { user } = useContext(AuthContext);

  const [panelView, setPanelView] = useState(undefined);

  const [students, setStudents] = useState(undefined);
  const [classes, setClasses] = useState(undefined);
  const [grades, setGrades] = useState(undefined);
  const [admins, setAdmins] = useState(undefined);
  const [feedbacks, setFeedbacks] = useState(undefined);
  const [logs, setLogs] = useState(undefined);

  const [showAddStudent, setShowAddStudent] = useState(false);
  const [showAddClass, setShowAddClass] = useState(false);
  const [showAddGrade, setShowAddGrade] = useState(false);
  const [showAddAdmin, setShowAddAdmin] = useState(false);

  const [isEdit, setIsEdit] = useState(false);

  function edit(item) {
    setIsEdit(item);
    if ("grade" in item) {
      setShowAddGrade(true);
    } else if ("type" in item) {
      setShowAddAdmin(true);
    } else if ("description" in item) {
      setShowAddClass(true);
    } else if ("password" in item) {
      setShowAddStudent(true);
    }
  }

  function deleteStudent(id) {
    fetch("/api/u/delete_user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: id }),
    })
      .then((res) => {
        if (res.status != "200") {
          return "error";
        }
        return res.json();
      })
      .then((data) => {
        getStudents();
      });
  }
  function deleteClass(id) {
    fetch("/api/c/delete_class", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: id }),
    })
      .then((res) => {
        if (res.status != "200") {
          return "error";
        }
        return res.json();
      })
      .then((data) => {
        getClasses();
      });
  }
  function deleteGrade(id) {
    fetch("/api/g/delete_grade", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: id }),
    })
      .then((res) => {
        if (res.status != "200") {
          return "error";
        }
        return res.json();
      })
      .then((data) => {
        getGrades();
      });
  }
  function deleteAdmin(id) {
    fetch("/api/u/delete_admin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: id }),
    })
      .then((res) => {
        if (res.status != "200") {
          return "error";
        }
        return res.json();
      })
      .then((data) => {
        getAdmins();
      });
  }
  function deleteFeedback(id) {
    fetch("/api/f/delete_feedback", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: id }),
    })
      .then((res) => {
        if (res.status != "200") {
          return "error";
        }
        return res.json();
      })
      .then((data) => {
        getFeedbacks();
      });
  }

  function getStudents() {
    fetch("/api/u/get_users")
      .then((res) => {
        if (res.status != "200") {
          return "error";
        }
        return res.json();
      })
      .then((data) => {
        setStudents(data.users);
      });
  }
  function getClasses() {
    fetch("/api/c/get_classes")
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
    fetch("/api/g/get_grades")
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
  function getAdmins() {
    fetch("/api/u/get_admins")
      .then((res) => {
        if (res.status != "200") {
          return "error";
        }
        return res.json();
      })
      .then((data) => {
        setAdmins(data.admins);
      });
  }
  function getFeedbacks() {
    fetch("/api/f/get_feedbacks")
      .then((res) => {
        if (res.status != "200") {
          return "error";
        }
        return res.json();
      })
      .then((data) => {
        setFeedbacks(data.feedbacks);
      });
  }
  function getLogs() {
    fetch("/api/l/get_logs")
      .then((res) => {
        if (res.status != "200") {
          return "error";
        }
        return res.json();
      })
      .then((data) => {
        setLogs(data.logs);
      });
  }

  useEffect(() => {
    if (panelView == "students") {
      getStudents();
    } else if (panelView == "classes") {
      getClasses();
    } else if (panelView == "grades") {
      getGrades();
    } else if (panelView == "admins") {
      getAdmins();
    } else if (panelView == "feedbacks") {
      getFeedbacks();
    } else if (panelView == "logs") {
      getLogs();
    }
  }, [panelView]);

  useEffect(() => {});

  return (
    <>
      <AddStudent
        isShow={showAddStudent}
        setIsShow={setShowAddStudent}
        getStudents={getStudents}
        isEdit={isEdit}
        setIsEdit={setIsEdit}
      />
      <AddClass
        isShow={showAddClass}
        setIsShow={setShowAddClass}
        getClasses={getClasses}
        isEdit={isEdit}
        setIsEdit={setIsEdit}
      />
      <AddGrade
        isShow={showAddGrade}
        setIsShow={setShowAddGrade}
        students={students}
        classes={classes}
        getStudents={getStudents}
        getClasses={getClasses}
        getGrades={getGrades}
        isEdit={isEdit}
        setIsEdit={setIsEdit}
      />
      <AddAdmin
        isShow={showAddAdmin}
        setIsShow={setShowAddAdmin}
        admins={admins}
        getAdmins={getAdmins}
        isEdit={isEdit}
        setIsEdit={setIsEdit}
      />
      <div>
        <Logo />
        <h3 className="center">
          {t("hi")}, {user.name}
        </h3>
        <h2 className="center">{t("adminPanel")}</h2>
        <p className="center">
          {user.username}#{user.id}
        </p>
        <div className="flex-center">
          <button className="round-button w3 edit" onClick={() => edit(user)}>
            {t("edit")}
          </button>
          <button
            onClick={() => setPanelView("logs")}
            className={
              "round-button w3 edit" + (panelView == "logs" ? " active" : "")
            }
          >
            {t("logs")}
          </button>
          <button
            className={
              "round-button w3 edit" +
              (panelView == "feedbacks" ? " active" : "")
            }
            onClick={() => setPanelView("feedbacks")}
          >
            {t("feedbacks")}
          </button>
        </div>
        <div className="flex-center">
          <button
            onClick={() => setShowAddStudent(true)}
            className="round-button w3"
          >
            {t("addStudent")}
          </button>
          <button
            onClick={() => setShowAddClass(true)}
            className="round-button w3"
          >
            {t("addClass")}
          </button>
          <button
            onClick={() => setShowAddGrade(true)}
            className="round-button w3"
          >
            {t("addGrade")}
          </button>
        </div>
        <div className="flex-center">
          <button
            className={
              "round-button w3" + (panelView == "students" ? " active" : "")
            }
            onClick={() => setPanelView("students")}
          >
            {t("students")}
          </button>
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
            style={{ display: user.username == "alxnko" ? "block" : "none" }}
            className={
              "round-button w3" + (panelView == "admins" ? " active" : "")
            }
            onClick={() => setPanelView("admins")}
          >
            {t("admins")}
          </button>
        </div>
        <div style={{ display: panelView == "students" ? "block" : "none" }}>
          <AdminList
            Component={StudentBlock}
            data={students}
            remove={deleteStudent}
            edit={edit}
          />
        </div>
        <div style={{ display: panelView == "classes" ? "block" : "none" }}>
          <AdminList
            Component={ClassBlock}
            data={classes}
            remove={deleteClass}
            edit={edit}
          />
        </div>
        <div style={{ display: panelView == "grades" ? "block" : "none" }}>
          <AdminList
            Component={GradeBlock}
            data={grades}
            remove={deleteGrade}
            edit={edit}
          />
        </div>
        <div style={{ display: panelView == "feedbacks" ? "block" : "none" }}>
          <AdminList
            Component={FeedbackBlock}
            data={feedbacks}
            remove={deleteFeedback}
          />
        </div>
        <div style={{ display: panelView == "logs" ? "block" : "none" }}>
          <AdminList Component={LogBlock} data={logs} />
        </div>
        <div style={{ display: panelView == "admins" ? "block" : "none" }}>
          <div
            style={{ marginTop: "10px" }}
            onClick={() => setShowAddAdmin(true)}
            className="flex-center"
          >
            <button className="">{t("addAdmin")}</button>
          </div>
          <AdminList
            Component={AdminBlock}
            data={admins}
            remove={deleteAdmin}
            edit={edit}
          />
        </div>
      </div>
    </>
  );
}
