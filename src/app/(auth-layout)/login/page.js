"use client";

import React, { useRef,useState, useEffect, Suspense} from "react";
import { useRouter, useSearchParams } from "next/navigation"; 
import Link from "next/link";
//import logo from '@/public/images/common/logo.png';
import Image from "next/image";
import logo from '@/public/images/common/logo.png';
import classes from './login.module.css';
import {fetchLogin} from '@/src/lib/login/loginApi';
import { setCookie, deleteCookie } from "@/src/utill/cookie";

const LoginpageComponent = () => {

  const router = useRouter();
  const emailRef = useRef();
  const pwdRef = useRef();
  const searchParams = useSearchParams();


  useEffect(() =>{
    // 로그인 페이지에 들어올 때 로컬 스토리지 비우기
    deleteCookie('token');
    //router.prefetch("/"); //Link 컴포넌트로 이동하는 경우가 아닌경우, 임의로 프리페칭 적용해야 함
  }, [])


  const handleLogin = async(e) => {
    e.preventDefault();
    const emailValue = emailRef.current.value;
    const pwdValue = pwdRef.current.value;


    const response = await fetchLogin(emailValue, pwdValue);

    if(response.token) {
      //토큰이 존재하면 로그인 성공
      //localStorage.setItem('token', response.token);
      //console.log(response.token)
      setCookie('token', response.token, 6);
      
    
      //로그인 성공
      const callbackUrl = searchParams.get("callbackUrl") || "./"; // 기본 경로 설정
      //console.log(callbackUrl)
      //console.log("이동")
      router.push(callbackUrl); // '/'는 메인 페이지 경로
    } else {
      //반환 토큰이 없으면 로그인 실패
      alert(response.message);
    }

    return false;

  }


  const kakaoLoginHandler = () => {
    const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID}&redirect_uri=${process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI}&response_type=code`;
    console.log(kakaoAuthUrl)
    window.location.href = kakaoAuthUrl;
  }

  const googleLoginHandler = () => {
    // 구글 OAuth에서 요청할 scope
    const scope = "https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email";
    // 구글 인증 URL 생성
    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}&redirect_uri=${encodeURIComponent(process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI)}&response_type=code&scope=${encodeURIComponent(scope)}`;
  
    // 브라우저를 구글 로그인 페이지로 리디렉션
    window.location.href = googleAuthUrl;
  }

  const naverLoginHandler = () => {
    const redirectUri = process.env.NEXT_PUBLIC_NAVER_REDIRECT_URI;
    const state = "random_state"; // CSRF 방지를 위한 랜덤 값
    const naverAuthUrl = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${process.env.NEXT_PUBLIC_NAVER_CLIENT_ID}&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&state=${state}`;
    
    window.location.href = naverAuthUrl;
  }

  return (
  <div className={`${classes["login-contents-box"]}`}>
    {/* login-tit-box */}
    <div className={`${classes["login-tit-box"]}`}>
      <Image
        src={logo}
        alt="이곳저곳"
        width={230}
        // height={100}
        priority
        //layout="intrinsic"
        //objectFit="contain"
      />
      <h2 className="hide">
        <span>이곳 저곳</span>
      </h2>
    </div>
    {/* //login-tit-box */}

    {/* login-form-box */}
    <div className={`${classes["login-form-box"]}`}>
      <form className={`${classes["login-form"]}`} onSubmit={handleLogin}>
        <div className={`${classes["form-each"]}`}>
          <label htmlFor="" className="hide">
            이메일
          </label>
          <input
            placeholder="이메일"
            id="real-contents"
            autoComplete="email"
            ref={emailRef}
          />
        </div>
        <div className={`${classes["form-each"]}`}>
          <label htmlFor="" className="hide">
            비밀번호
          </label>
          <input
            type="password"
            placeholder="비밀번호"
            autoComplete="current-password"
            ref={pwdRef}
          />
        </div>
        <button className={`${classes['login-btn']}`}>
          로그인
        </button>
      </form>

      <div className={`${classes['login-util-box']}`}>
        <ul className={`${classes['login-util']}`}>
          {/* <li>
            <Link href="/find">비밀번호를 잊으셨나요?이메일 &#183; 비밀번호 찾기</Link>
          </li> */}
          <li>
            <Link href="/join">아직 회원이 아니신가요?</Link>
          </li>
        </ul>
      </div>

      <div className={`${classes['sns-login-box']}`}>
        <h3>SNS 로그인</h3>
        <ul>
          <li className={`${classes['sns-icon']} ${classes.naver}`}>
            <a href="#"
              onClick={naverLoginHandler}
            ></a>
          </li>
          <li className={`${classes['sns-icon']} ${classes.kakao}`}>
            <a href="#"
                onClick={kakaoLoginHandler}
            ></a>
          </li>
          <li className={`${classes['sns-icon']} ${classes.google}`}>
            <a href="#"
                onClick={googleLoginHandler}
            ></a>
          </li>
        </ul>
      </div>
    </div>
    {/* login-form-box */}

    <p className={`${classes.copy}`}>Copyright 2024. Gori. All rights reserved</p>
  </div>

  )
  
};



// Suspense로 감싸서 사용
const Loginpage = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <LoginpageComponent />
  </Suspense>
);


export default Loginpage;
