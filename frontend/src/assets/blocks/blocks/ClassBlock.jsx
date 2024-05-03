import React, { useContext, useEffect } from "react";
import { TranslationContext, AuthContext } from "../../contexts/contexts";
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
            <p>
              {t("description")}: {item.description}
            </p>
            {user == "Admin" ? (
              <>
                <button onClick={() => edit(item)}>
                  <MdEdit />
                </button>
                <button onClick={() => remove(item.id)}>
                  <MdDelete />
                </button>
              </>
            ) : null}
          </div>
          <div style={{ minWidth: "65px", textAlign: "right" }}>
            <p>{t("average")}</p>
            <h2>{item.averageGrade}</h2>
          </div>
        </>
      ) : null}
    </div>
  );
}
