import React from "react";
import classes from "./Arrow.module.css";

export const PrevArrow = (props) => {
  const { onClick } = props;
  return (
    <button className={`${classes.left} ${classes.arrow}`} onClick={onClick}>
      <i className="xi-angle-left-min"></i>
    </button>
  );
};

export const NextArrow = (props) => {
  const { onClick } = props;
  return (
    <button className={`${classes.right} ${classes.arrow}`} onClick={onClick}>
      <i className="xi-angle-right-min"></i>
    </button>
  );
};
