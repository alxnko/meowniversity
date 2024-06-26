import React, { useContext } from "react";
import { MdDelete, MdEdit } from "react-icons/md";
import { AuthContext, TranslationContext } from "../../contexts/contexts";
import { toLocalTime, toTime } from "../../scripts/time";

export default function StudentBlock({ item, remove, edit }) {
  const { t } = useContext(TranslationContext);
  const { user } = useContext(AuthContext);

  return (
    <div className="block flex jc-sb">
      {item ? (
        <>
          <div>
            <h4>
              {t("name")}: {item.name} ({item.username}#{item.student_id})
            </h4>
            <h4>
              {t("class")}: {item.className} (#{item.class_id})
            </h4>
            <p>
              {t("teacher")}: {item.teacher}
            </p>
            <p>id: {item.id}</p>
            <p>
              {t("time")}: {toTime(toLocalTime(item.time))}
            </p>
            <p>
              {t("type")}: {item.type}
            </p>
          </div>
          <div style={{ minWidth: "65px", textAlign: "right" }}>
            <p>{t("grade")}</p>
            <h2>{item.grade}</h2>
            {user.type == "admin" ? (
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
