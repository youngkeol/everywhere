import React from "react";
import Slider from "react-slick";
import classes from "./MenuFilter.module.css";

const MenuFilter = ({ typeList, selType, typeClick, showAll }) => {
  return (
    <div className={`${classes["menu-filter-box"]}`}>
      <ul className={`${classes["item-box"]}`}>
        {showAll && (
          <li
            onClick={() => typeClick(0)}
            className={
              selType === 0
                ? `${classes.ac} ${classes.item}`
                : `${classes.item}`
            }
          >
            전체
          </li>
        )}

        {typeList.map((item) => {
          return (
            <li
              key={item.idx}
              className={
                item.idx === selType
                  ? `${classes.ac} ${classes.item}`
                  : `${classes.item}`
              }
              onClick={() => {
                typeClick(item.idx);
              }}
            >
              {item.type}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default MenuFilter;
