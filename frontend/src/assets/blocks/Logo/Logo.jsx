import React, { useContext, useState } from "react";
import { useInterval } from "../../../hooks/useInterval";
import { TranslationContext } from "../../contexts/contexts";

export default function Logo({ fontSize }) {
  fontSize = fontSize ? fontSize : "24px";
  const { t } = useContext(TranslationContext);
  const [logoText1, setLogoText1] = useState(t("logoText1"));
  const [logoStyle1, setLogoStyle1] = useState("green");
  const [logoText2, setLogoText2] = useState(t("logoText2"));
  const [logoStyle2, setLogoStyle2] = useState("");
  let step = 0;

  useInterval(() => {
    if (step == 0) {
      setLogoText1(t("logoText1"));
      setLogoText2(t("logoText2"));
      setLogoStyle1("green");
      setLogoStyle2("");
      step = 1;
    } else {
      setLogoText1(t("logo2Text1"));
      setLogoText2(t("logo2Text2"));
      setLogoStyle1("");
      setLogoStyle2("green");
      step = 0;
    }
  }, 500);

  return (
    <div className="flex-center">
      <p style={{ fontSize: fontSize }} className="flex">
        <span className={logoStyle1}>{logoText1}</span>
        <span className={logoStyle2}>{logoText2}</span>
      </p>
    </div>
  );
}
