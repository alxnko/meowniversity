import React, { useContext } from "react";
import { TranslationContext } from "../contexts/contexts";

export default function NoPage() {
  const { t } = useContext(TranslationContext);
  return (
    <div>
      <h1>{t("error404")}</h1>
    </div>
  );
}
