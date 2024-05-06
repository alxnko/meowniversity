import React, { useContext } from "react";
import { MdDelete } from "react-icons/md";
import { AuthContext, TranslationContext } from "../../contexts/contexts";

export default function FeedbackBlock({ item, remove }) {
  const { t } = useContext(TranslationContext);
  const { user } = useContext(AuthContext);

  return (
    <div className="block flex jc-sb">
      {item ? (
        <>
          <div>
            <h3>
              {t("name")}: {item.student}
            </h3>
            <p>id: {item.id}</p>
            <p>
              {t("text")}: {item.text}
            </p>
          </div>
          <div>
            {user.type == "admin" ? (
              <>
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
