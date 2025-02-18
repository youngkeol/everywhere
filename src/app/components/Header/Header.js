"use client";

import React, { useContext } from "react";
import classes from "./Header.module.css";
import Image from "next/image";
import logo from "@/public/images/common/logo.png";
import logo_white from "@/public/images/common/logo_white.png";
import Link from "next/link";
import { usePathname } from "next/navigation";
import CommonContext from "@/src/hooks/commonReducer";
const Header = () => {
  const { state, dispatch } = useContext(CommonContext);
  const pathname = usePathname();

  const openMobileGnbHandler = () => {
    dispatch({ type: "OPEN_GNB" });
  };
  const closeMobileGnbHandler = () => {
    dispatch({ type: "CLOSE_GNB" });
  };

  return (
    <>
      {/* header */}
      <div
        className={`${classes["header-gnb-wrapper"]} ${
          state.gnb ? classes["header-gnb-wrapper-open"] : ""
        }`}
      >
        <div className={`${classes.header}`}>
          <h1 className={`${classes.logo}`}>
          <Link href="/">
              {state.isMobile ? (
                <Image
                  src={logo_white}
                  alt="이곳저곳"
                  width={128}
                  height={39}
                />
              ) : (
                <Image src={logo} alt="이곳저곳" width={128} height={39} />
              )}

              <span className="hidden">이곳 저곳</span>
            </Link>
            <button className={`${classes['gnb-close-btn']}`}
              onClick={closeMobileGnbHandler}
            
            ><i className="xi-close-min"></i></button>
          </h1>
        </div>

        <div className={`${classes.gnb}`}>
          <ul>
            <li className={pathname === "/myPlaces" ? `${classes.active}` : ""}>
              <Link href="myPlaces">
                <i className="xi-map-marker"></i>
                <span>나의 장소</span>
              </Link>
            </li>
            <li
              className={pathname === "/publicPlaces" ? `${classes.active}` : ""}
            >
              <Link href="publicPlaces">
                <i className="xi-map"></i>
                <span>공개 장소</span>
              </Link>
            </li>
            <li className={pathname === "/myPage" ? `${classes.active}` : ""}>
              <Link href="myPage">
                <i className="xi-user"></i>
                <span>계정 설정</span>
              </Link>
            </li>
            <li className={pathname === "/notice" ? `${classes.active}` : ""}>
              <Link href="notice">
                <i className="xi-bell"></i>
                <span>공지 사항</span>
              </Link>
            </li>
          </ul>
          <a href="/login" className={`${classes['logout-btn']}`}>
            <i className="xi-reply"></i>
            <span>로그아웃</span>
          </a> 
        </div>
    
      </div>
      {/* //header */}

      {/* 모바일 header */}
      <div className={`${classes["m-header-logo-wrapper"]}`}>
        <div className={`${classes["m-header"]}`}>
          <h1 className={`${classes["m-logo"]}`}>
            <Link href="/">
              <Image
                src={logo}
                alt="이곳저곳"
                width={128}
                height={39}
                //layout="intrinsic"
                //objectFit="contain"
              />
              <span className="hidden">이곳저곳</span>
            </Link>
          </h1>
        </div>
        <div className={`${classes["m-gnb"]}`} onClick={openMobileGnbHandler}>
          <button>
            <span className="hidden">모바일 주 메뉴 열기</span>
            <span className={`${classes.top}`}></span>
            <span className={`${classes.btm}`}></span>
          </button>
        </div>
      </div>
      {/* //모바일 header */}
    </>
  );
};

export default Header;
