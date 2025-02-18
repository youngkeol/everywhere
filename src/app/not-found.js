import React from "react";
import classes from "./error.module.css";
import Image from "next/image";
import logo from "@/public/images/common/logo.png";
import Link from "next/link";
const notFound = () => {
  return (
    <div className={classes["error-box"]}>
      <h1 className={classes["error-logo"]}>
        <Link href="/">
          <Image src={logo} width={200} alt="이곳저곳" />
        </Link>
      </h1>
      <h2 className={classes["error-tit"]}>
        요청하신 페이지를 찾을 수 없습니다.
      </h2>
      <Link href="/"
      className={classes["error-btn"]}>
        홈으로 이동하기{" "}
      </Link>
    </div>
  );
};

export default notFound;
