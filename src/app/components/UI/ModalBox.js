// components/ModalBox.jsx
"use client";

import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import classes from "./ModalBox.module.css";

const ModalBox = ({ children }) => {
  const wrapperRef = useRef();

  useEffect(() => {
    const handleScroll = () => {
      // 키보드를 내리기 위해 activeElement(현재 포커스된 요소)를 blur 처리
      if (document.activeElement) {
        document.activeElement.blur(); // 포커스 제거하여 키보드 내리기
      }
    };
    // 스크롤 이벤트 감지
    wrapperRef.current.addEventListener("scroll", handleScroll);
    // 컴포넌트 언마운트 시 이벤트 제거
    return () => {
      if (wrapperRef.current) {
        wrapperRef.current.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  return createPortal(
    <div className={classes["modal-wrapper"]} ref={wrapperRef}>
      <div className={classes["modal-content"]}>{children}</div>
    </div>,
    document.body
  );
};

export default ModalBox;
