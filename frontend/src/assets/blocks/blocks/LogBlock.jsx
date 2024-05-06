import React, { useContext } from "react";
import { AuthContext, TranslationContext } from "../../contexts/contexts";

export default function FeedbackBlock({ item, remove }) {
  const { t } = useContext(TranslationContext);
  const { user } = useContext(AuthContext);

  return (
    <div className="block flex jc-sb">
      {item ? (
        <>
          <div>
            <p>
              {t("time")}: {item.time}
            </p>
            <p>id: {item.id}</p>
            <p>
              {t("action")}: {item.action}
            </p>
          </div>
        </>
      ) : null}
    </div>
  );
}
