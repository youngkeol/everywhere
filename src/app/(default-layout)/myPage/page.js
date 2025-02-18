"use client";
import React, { useEffect, useState, useRef } from "react";
import classes from "./myPage.module.css";
import { fetchMyInfo, fetchUserLeave, fetchModifyUserInfo } from "@/src/lib/myPage/myPageApi";
import LoadingBox from "../../components/LoadingBox/LoadingBox";

const MyPage = () => {
  const [myInfo, setMyInfo] = useState(null); // 초기 상태 명시
  const [myPlacesCnt, setMyPlacesCnt] = useState([0, 0]);
  const [isLoaded, setIsLoaded] = useState(false);
  const pwdRef = useRef();
  const nicknameRef = useRef();

  useEffect(() => {
    const loadData = async () => {
      try {
        const { myInfo, myPlacesInfo } = await fetchMyInfo();
        setMyInfo(myInfo);
        setMyPlacesCnt([
          myPlacesInfo?.public_cnt || 0,
          myPlacesInfo?.private_cnt || 0,
        ]);
      } catch (error) {
        console.error("데이터 로드 에러:", error);
      } finally {
        setIsLoaded(true);
      }
    };

    loadData();
  }, []);

  const leaveHandler = async () => {
    if (window.confirm("회원탈퇴를 하시겠습니까?")) {
      try {
        const response = await fetchUserLeave();
        if (response.redirectUrl) {
          window.location.href = response.redirectUrl;
        } else {
          throw new Error("회원 탈퇴 실패");
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  const modifyHandler = async () => {
    const pwd = pwdRef?.current?.value;
    const nickname = nicknameRef.current.value;

    if (!nickname || nickname.length < 2 || nickname.length > 8) {
      alert("닉네임은 2자 이상 8자 이하로 입력해주세요.");
      return false;
    }

    if (pwd && (pwd.length < 4 || pwd.length > 16)) {
      alert("패스워드는 4자 이상 16자 이하로 입력해주세요.");
      return false;
    }

    if (!pwd && myInfo?.login_type === "login") {
      alert("패스워드를 입력해주세요.");
      return false;
    }

    if (window.confirm("회원정보를 수정하시겠습니까?")) {
      try {
        const requestData = { nickname, ...(pwd && { password: pwd }) };
        const response = await fetchModifyUserInfo(requestData);

        if (response.redirectUrl) {
          alert("회원정보 수정 성공");
          window.location.href = response.redirectUrl;
        } else {
          alert("회원정보 수정 실패");
        }
      } catch (error) {
        console.error("회원 정보 수정 실패:", error);
      }
    }
  };

  if (!isLoaded) {
    return <LoadingBox title="데이터를 불러오는 중입니다." height="500px" />;
  }

  return (
    <>
      <div className={classes["my-introdution-box"]}>
        <p>안녕하세요! {myInfo?.nickname && `${myInfo.nickname}님`}</p>
        <p>
          현재 저장된 나의 장소는 <span>{myPlacesCnt[0]}</span> 곳이며,
          <br />
          공개한 장소는 <span>{myPlacesCnt[1]}</span> 곳 입니다.
        </p>
      </div>

      <div className={classes["my-set-box"]}>
        {myInfo?.login_type === "login" ? (
          <>
            {/* <p className={classes["descript"]}>**현재 SNS 로그인 상태가 아닙니다.</p> */}
            <div className={classes["modify-box"]}>
              <div className={classes["form-each"]}>
                <label>이메일</label>
                <input type="text" value={myInfo?.email} readOnly />
              </div>
              <div className={classes["form-each"]}>
                <label>닉네임</label>
                <input
                  type="text"
                  minLength={2}
                  maxLength={8}
                  defaultValue={myInfo?.nickname}
                  ref={nicknameRef}
                />
              </div>
              <div className={classes["form-each"]}>
                <label>패스워드</label>
                <input
                  type="password"
                  minLength={4}
                  maxLength={16}
                  ref={pwdRef}
                />
              </div>
              <div className={classes["my-button-box"]}>
                <button
                  className={classes["modify-btn"]}
                  onClick={modifyHandler}
                >
                  정보 수정
                </button>
                <button
                  className={classes["my-leave-btn"]}
                  onClick={leaveHandler}
                >
                  회원 탈퇴
                </button>
              </div>
            </div>
          </>
        ) : (
          <>
            <p className={classes["descript"]}>**현재 SNS 로그인 상태입니다.</p>
            <div className={classes["modify-box"]}>
              <div className={classes["form-each"]}>
                <label>이메일</label>
                <input type="text" value={myInfo?.email} readOnly />
              </div>
              <div className={classes["form-each"]}>
                <label>닉네임</label>
                <input
                  type="text"
                  minLength={2}
                  maxLength={8}
                  defaultValue={myInfo?.nickname}
                  ref={nicknameRef}
                />
              </div>
            </div>
            <div className={classes["my-button-box"]}>
              <button
                className={classes["modify-btn"]}
                onClick={modifyHandler}
              >
                정보 수정
              </button>
              <button
                className={classes["my-leave-btn"]}
                onClick={leaveHandler}
              >
                회원 탈퇴
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default MyPage;