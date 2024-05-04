import React, { useContext, useEffect, useState } from "react";
import StudentBlock from "../../blocks/blocks/StudentBlock";
import Logo from "../../blocks/Logo/Logo";
import { TranslationContext } from "../../contexts/contexts";

export default function Top() {
  const [students, setStudents] = useState(undefined);
  const { t } = useContext(TranslationContext);
  useEffect(() => {
    fetch("/api/u/get_top")
      .then((res) => {
        if (res.status != "200") {
          return "error";
        }
        return res.json();
      })
      .then((data) => {
        setStudents(data.users);
      });
  }, []);
  return (
    <div>
      <Logo />
      <h1 className="center">{t("top")}</h1>
      {students
        ? students.map((item) => <StudentBlock key={item.id} item={item} />)
        : null}
    </div>
  );
}
