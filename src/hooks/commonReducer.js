"use client";

import { useReducer, createContext, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

//1.초기상태
const initialState = {
  gnb: false,
  isMobile: false,
};

//2. 리듀서 정의
const commonReducer = (state, action) => {
  switch (action.type) {
    case "OPEN_GNB":
      return { ...state, gnb:true };
    case "CLOSE_GNB":
      return { ...state, gnb:false };
    case "SET_IS_MOBILE":
      return {...state, isMobile: action.payload}
    default:
      return state;
  }
};

//3. Context 정의
const CommonContext = createContext();

//4. Context와 useReducer를 결합한 Provider 컴포넌트
export const CommonProvier = ({ children }) => {
  const pathname = usePathname(); // 현재 경로를 가져옴
  const router = useRouter();
  const [state, dispatch] = useReducer(commonReducer, initialState);


  useEffect(()=>{

    const handleResize = () => {
      const isMobile= window.innerWidth <= 1280; 
      dispatch({type:"SET_IS_MOBILE", payload:isMobile})
      dispatch({ type: "CLOSE_GNB" });
    }
    handleResize();
    window.addEventListener("resize", handleResize);

    return ()=> {
      window.removeEventListener("resize", handleResize);
    }
  }, [])


  useEffect(()=> {
    dispatch({type:"CLOSE_GNB"})
  }, [pathname])

  useEffect(() => {
    if(state.gnb && state.isMobile) {
      document.body.style.overflow = "hidden"; // GNB 열리면 스크롤 막음
    } else {
      document.body.style.overflow = "auto"; // GNB 닫히면 스크롤 복원
    }

    // Cleanup (보호용)
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [state.gnb, state.isMobile])

  return (
    <CommonContext.Provider value={{ state, dispatch }}>
      {children}
    </CommonContext.Provider>
  );
};

export default CommonContext;
