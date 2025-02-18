"use client";

import { useEffect } from "react";
import classes from "./error.module.css";
import Image from "next/image";
import logo from "@/public/images/common/logo.png";
import Link from "next/link";

export default function Error() {
  return (
    <div className={classes["error-box"]}>
      <h1 className={classes["error-logo"]}>
        <Link href="/">
          <Image src={logo} width={200} alt="이곳저곳" />
        </Link>
      </h1>
      <h2 className={classes["error-tit"]}>에러가 발생했습니다!</h2>
      <Link href="/" className={classes["error-btn"]}>
        홈으로 이동하기{" "}
      </Link>
    </div>
  );
}
