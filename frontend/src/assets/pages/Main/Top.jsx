import React, { useContext, useEffect, useState } from "react";
import { TranslationContext } from "../../contexts/contexts";
import StudentBlock from "../../blocks/blocks/StudentBlock";

export default function Top() {
  const [students, setStudents] = useState(undefined);
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
      <h1>Top</h1>
      {students
        ? students.map((item) => <StudentBlock key={item.id} item={item} />)
        : null}
    </div>
  );
}
