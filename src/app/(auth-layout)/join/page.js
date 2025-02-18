"use client";
import React, { useRef } from "react";
import classes from "./join.module.css";
import Button from "../../components/UI/Button";
import { useRouter, useSearchParams } from "next/navigation";
import { fetchSendEmail } from "@/src/lib/mail/mailApi";
import { fetchJoin } from "@/src/lib/join/joinApi";
const JoinPage = () => {
  const emailRef = useRef();
  const verificationCodeRef = useRef();
  const passwordRef = useRef();
  const passwordCheckRef = useRef();
  const nicknameRef = useRef();
  const router = useRouter();

  //인증번호 발송
  const handlerSendEmail = async (e) => {
    e.preventDefault();
    try {
      let email = emailRef.current.value;

      if (!isValidEmail(email)) {
        alert("유효하지 않는 이메일 형식입니다.");
        return false;
      }

      const sendEmailResult = await fetchSendEmail({
        email: email,
      });
      alert(sendEmailResult.message);
    } catch (error) {}

    return false;
  };

  const handleGoBack = () => {
    router.back(); // 브라우저의 이전 페이지로 이동
  };

  //회원가입
  const handlerJoin = async () => {
    let email = emailRef.current.value;
    let verificationCode = verificationCodeRef.current.value;
    let password = passwordRef.current.value;
    let passwordCheck = passwordCheckRef.current.value;
    let nickname = nicknameRef.current.value;

    if (email?.length <= 0) {
      alert("이메일을 입력해주세요.");
      return false;
    }
    if (!isValidEmail(email)) {
      alert("유효하지 않는 이메일 형식입니다.");
      return false;
    }

    if (verificationCode?.length <= 0) {
      alert("이메일 인진번호를 입력해주세요.");
      return false;
    }
    if (verificationCode?.length != 6) {
      alert("이메일 인진번호는 6자입니다.");
      return false;
    }

    if (password?.length <= 0) {
      alert("패스워드를 입력해주세요.");
      return false;
    }

    if (password?.length < 6) {
      alert("패스워드는 6자 이상 입력해주세요.");
      return false;
    }

    if (passwordCheck?.length <= 0) {
      alert("패스워드 확인을 입력해주세요.");
      return false;
    }

    if (passwordCheck?.length < 6) {
      alert("패스워드는 6자 이상 입력해주세요.");
      return false;
    }

    if (password !== passwordCheck) {
      alert("비밀번호가 일치하지 않습니다.");
      return false;
    }

    if (nickname?.length <= 0) {
      alert("닉네임을 입력해주세요.");
      return false;
    }

    if (nickname?.length < 2) {
      alert("닉네임은 2자 이상 입력해주세요.");
      return false;
    }

    const joinResult = await fetchJoin({
      email,
      password,
      nickname,
      verificationCode,
    });
    alert(joinResult.message);
    console.log(joinResult);
    if (joinResult.result) {
      router.push("./");
    }
  };

  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  return (
    <div className={classes["join-content-box"]}>
      <div className={classes["join-header"]}>
        <span onClick={handleGoBack}>
          <i className="xi-angle-left-min"></i>
        </span>
        <h2>회원 가입</h2>
      </div>
      <div className={classes["join-body"]}>
        <form>
          <div
            className={`${classes["form-each"]} ${classes["form-each-email"]}`}
          >
            <label>이메일</label>
            <input
              ref={emailRef}
              className={`${classes["email-input"]}`}
              type="email"
              autoComplete="off"
              placeholder="이메일을 입력해주세요."
            />
            <button
              className={`${classes["email-check-btn"]}`}
              onClick={handlerSendEmail}
            >
              인증번호 발송
            </button>

            <input
              ref={verificationCodeRef}
              className={`${classes["email-check-num"]}`}
              type="text"
              autoComplete="off"
              placeholder="이메일로 받은 인증번호를 입력해주세요."
            />
          </div>

          <div className={`${classes["form-each"]}`}>
            <label>패스워드</label>
            <input
              ref={passwordRef}
              type="password"
              autoComplete="off"
              placeholder="패스워드를 입력해주세요.(6자 이상)"
            />
          </div>

          <div className={`${classes["form-each"]}`}>
            <label>패스워드 확인</label>
            <input
              ref={passwordCheckRef}
              type="password"
              autoComplete="off"
              placeholder="패스워드를 입력해주세요.(6자 이상)"
              min={6}
            />
          </div>
          <div className={`${classes["form-each"]}`}>
            <label>닉네임</label>
            <input
              ref={nicknameRef}
              type="text"
              autoComplete="off"
              placeholder="닉네임을 입력해주세요.(2자 이상)"
            />
          </div>
        </form>
      </div>
      <div className={classes["join-footer"]}>
        <Button title="회원가입" size="big" onClick={handlerJoin} />
      </div>
    </div>
  );
};

export default JoinPage;
