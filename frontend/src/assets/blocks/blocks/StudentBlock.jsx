import React, { useContext } from "react";
import { FaSignInAlt } from "react-icons/fa";
import { MdDelete, MdEdit } from "react-icons/md";
import { AuthContext, TranslationContext } from "../../contexts/contexts";
import { createPostData } from "../../scripts/createPostData";

export default function StudentBlock({ item, remove, edit }) {
  const { t } = useContext(TranslationContext);
  const { user, setUser } = useContext(AuthContext);

  const login = () => {
    fetch(
      "/api/u/login",
      createPostData({
        username: item.username,
        password: item.password,
      })
    )
      .then((res) => {
        if (res.status != "200") {
          return "error";
        }
        return res.json();
      })
      .then((data) => {
        if ("id" in data) {
          setUser(data);
        }
      });
  };

  return (
    <div className="block flex jc-sb">
      {item ? (
        <>
          <div>
            <h3>
              {t("name")}: {item.name}
            </h3>
            <p>id: {item.id}</p>
            {item.email ? (
              <p>
                {t("email")}: {item.email}
              </p>
            ) : null}
            {item.phone ? (
              <p>
                {t("phone")}: {item.phone}
              </p>
            ) : null}
            <hr />
            {item.password ? <h3>{t("login")}</h3> : null}
            <p>
              {t("username")}: {item.username}
            </p>
            {item.password ? (
              <p>
                {t("password")}: {item.password}
              </p>
            ) : null}
          </div>
          <div style={{ minWidth: "65px", textAlign: "right" }}>
            <p>{t("average")}</p>
            <h2>{item.averageGrade}</h2>
            {item.phone && user.type == "admin" ? (
              <>
                <button onClick={() => edit(item)}>
                  <MdEdit />
                </button>
                <br />
                <button onClick={() => remove(item.id)}>
                  <MdDelete />
                </button>
                <br />
                <button onClick={() => login()}>
                  <FaSignInAlt />
                </button>
              </>
            ) : null}
          </div>
        </>
      ) : null}
    </div>
  );
}
