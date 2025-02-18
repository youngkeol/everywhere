import React from "react";
import "@/public/css/common.css";
import "@/public/css/board.css";
import classes from './auth.module.css';

const LoginLayout = ({ children }) => {
  return (
    <div className={`${classes.wrapper} ${classes["login-wrapper"]}`}>
      <dl className="skip_navi">
        <dt className="hide">
          <strong>바로가기 메뉴</strong>
        </dt>
        <dd>
          <a href="#real-contents">본문 바로가기</a>
        </dd>
      </dl>

      {children}
    </div>
  );
};

export default LoginLayout;
