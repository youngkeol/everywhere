import React from "react";
import classes from "./Button.module.css";
const Button = ({ title, size, onClick, color}) => {
  return (
    <button
      className={`${classes["add-button"]} ${classes[size]} ${classes[color]}`}
      onClick={onClick}
    >
      {title}
    </button>
  );
};

export default Button;
