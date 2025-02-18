"use client";

import React, { useState, useRef, useEffect } from "react";
import classes from "./CustomSelect.module.css";

const CustomSelect = ({ options, selectedValue, selectedHandler }) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef(null); // CustomSelect 영역 참조

  const toggleOptions = () => {
    setIsOpen((prev) => !prev); // 상태 토글
  };

  // 외부 클릭 감지 함수
  const handleOutsideClick = (event) => {
    if (selectRef.current && !selectRef.current.contains(event.target)) {
      setIsOpen(false); // 외부 클릭 시 닫기
    }
  };

  useEffect(() => {
    // 전역 클릭 이벤트 리스너 등록
    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      // 컴포넌트 언마운트 시 이벤트 리스너 제거
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  return (
    <div className={classes["custom-select"]} ref={selectRef}>
      <div className={classes["custom-selected"]} onClick={toggleOptions}>
        {selectedValue.type || "이곳 저곳"}
        <i className="xi-angle-down-min"></i>
      </div>
      {isOpen && (
        <div
          className={`${classes["options"]} ${isOpen ? classes["open"] : ""}`}
        >
          <div
            className={classes["option-item"]}
            onClick={() => {
              selectedHandler({ idx: "all", type: "전체" });
              setIsOpen(false);
            }}
          >
            전체
          </div>
          {options.map((item) => {
            return (
              <div
                key={item.idx}
                className={classes["option-item"]}
                onClick={() => {
                  selectedHandler(item);
                  setIsOpen(false);
                }}
              >
                {item.type}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default CustomSelect;