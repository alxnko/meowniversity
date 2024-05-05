import React, { useContext } from "react";
import { MdDelete, MdEdit } from "react-icons/md";
import { AuthContext, TranslationContext } from "../../contexts/contexts";

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
          <div>
            {user.type == "admin" && user.id != item.id ? (
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
