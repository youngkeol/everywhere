import React from "react";
import classes from "./RadioInput.module.css";

const RadioInput = ({
  option1,
  description1,
  option2,
  description2,
  openFlag,
  chageOpenFlagHandler,
}) => {
  return (
    <div className={`${classes["radio-input-box"]}`}>
      <input
        id="option1"
        type="radio"
        name="option"
        value="1"
        checked={openFlag == "1"}
        className={`${classes["radio-input"]}`}
        onChange={() => {
          chageOpenFlagHandler(1);
        }}
      />
      <label htmlFor="option1">
        <p>{option1}</p>
        <p>{description1}</p>
      </label>

      <input
        id="option2"
        type="radio"
        name="option"
        value="0"
        checked={openFlag == "0"}
        className={`${classes["radio-input"]}`}
        onChange={() => {
          chageOpenFlagHandler(0);
        }}
      />
      <label htmlFor="option2">
        <p>{option2}</p>
        <p>{description2}</p>
      </label>
    </div>
  );
};

export default RadioInput;
