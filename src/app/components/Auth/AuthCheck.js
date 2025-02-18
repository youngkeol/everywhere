"use client";
import React, { useContext, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import AuthContext from "@/src/hooks/AuthReducer";



const AuthCheck = ({ children }) => {
  const { state } = useContext(AuthContext);
  const pathname = usePathname(); // 현재 경로를 가져옴
  const router = useRouter();
  const unauthPath = ["/login"];

  // useEffect(() => {
  //   // 로그인 페이지가 아니면서 토큰이 없으면 로그인 이동
  //   if (!unauthPath.includes(pathname) && !state.token) {
  //     console.log("로그인 이동");
  //     router.push("/login");
  //   }
  // }, [pathname, state.token, router]);

  return <>{children}</>;
};

export default AuthCheck;
