import React, { useState, useEffect, useContext } from "react";
import { TranslationContext } from "../../contexts/contexts";
import StudentBlock from "../blocks/StudentBlock";

export default function AdminList({ Component, data, remove, edit }) {
  const [search, setSearch] = useState("");
  const { t } = useContext(TranslationContext);

  const hasValue = (obj, value) => {
    value = value.toLowerCase();
    let has = false;
    Object.values(obj).forEach((item) => {
      if (!has && item.toString().toLowerCase().includes(value)) {
        has = true;
      }
    });
    return has;
  };

  return (
    <div>
      {data ? (
        <input
          className="search"
          style={{ marginBottom: "0", marginTop: "10px" }}
          placeholder={t("search")}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      ) : null}
      {data
        ? data.map((item) =>
            hasValue(item, search) ? (
              <Component
                key={item.id}
                item={item}
                remove={remove}
                edit={edit}
              />
            ) : null
          )
        : null}
    </div>
  );
}
