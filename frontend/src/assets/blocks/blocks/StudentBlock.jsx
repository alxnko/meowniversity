import React, { useContext, useEffect } from "react";
import { AuthContext, TranslationContext } from "../../contexts/contexts";
import { MdEdit, MdDelete } from "react-icons/md";

export default function StudentBlock({ item, remove, edit }) {
  const { t } = useContext(TranslationContext);
  const { user } = useContext(AuthContext);

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
            {item.phone && user == "Admin" ? (
              <>
                <button onClick={() => edit(item)}>
                  <MdEdit />
                </button>
                <br />
                <button onClick={() => remove(item.id)}>
                  <MdDelete />
                </button>
              </>
            ) : null}
          </div>
        </>
      ) : null}
    </div>
  );
}
