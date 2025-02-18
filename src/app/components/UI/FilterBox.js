import React from "react";
import classes from "./FilterBox.module.css";
const FilterBox = ({ title, rule, children }) => {
  return (
    <div className={`${classes["filter-box"]}`}>
      <h4 className={`${classes["filter-title"]}`}>
        {title}
        {rule && ( <span>({rule})</span>) }
      </h4>
      <div>{children}</div>
    </div>
  );
};

export default FilterBox;
