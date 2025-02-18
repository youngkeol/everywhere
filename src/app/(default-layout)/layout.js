import React from "react";
import Header from "../components/Header/Header";
const LoginLayout = ({ children }) => {
  return (
    <div className="wrapper">
      <Header />

      <div className="contents">
        <div className="contents-inner">{children}</div>
      </div>
    </div>
  );
};

export default LoginLayout;
