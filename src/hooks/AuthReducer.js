"use client";
import { useReducer, createContext, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

//1.초기상태
const initialState = {
  token: null,
  userInfo: null,
};

//2. 리듀서 정의
const authReducer = (state, action) => {
  switch (action.type) {
    case "AUTH":
      return { ...state };
    default:
      return state;
  }
};

//3. Context 정의
const AuthContext = createContext();

//4. Context와 useReducer를 결합한 Provider 컴포넌트
export const AuthProvier = ({ children }) => {
  const pathname = usePathname(); // 현재 경로를 가져옴
  const router = useRouter();
  const [state, dispatch] = useReducer(authReducer, initialState);
  //로그인페이지가 아니면
  // const unauthPath = ["/login"];

  // useEffect(() => {
  //   if (!unauthPath.includes(pathname)) {
  //     console.log("인증절차 + 토큰 점검" + state.token);
  //     //새로 고침 또는 a태그로 로 접근시, => 토큰 점검하기
  //     //1.토큰이 없는 경우 -> 로그인 페이지로 이동

  //     if (!state.token) {
  //       //router.push("/login"); // '/'는 메인 페이지 경로
  //     }
  //   }
  // }, []);
  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
