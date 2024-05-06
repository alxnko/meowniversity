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
            <p>
              {t("description")}: {item.description}
            </p>
            <hr />
            <p>
              {t("quizAverage")}: {item.quizAverage}
              {item.quizCount
                ? "(" + item.quizCount + "/" + item.all + ")"
                : null}
            </p>
            <p>
              {t("midtermAverage")}: {item.midtermAverage}{" "}
              {item.midtermCount
                ? "(" + item.midtermCount + "/" + item.all + ")"
                : null}
            </p>
            <p>
              {t("finalAverage")}: {item.finalAverage}
              {item.finalCount
                ? "(" + item.finalCount + "/" + item.all + ")"
                : null}
            </p>
          </div>
          <div style={{ minWidth: "65px", textAlign: "right" }}>
            <p>{t("average")}</p>
            <h2>{item.averageGrade}</h2>
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
