import { NextResponse } from "next/server";
import { selNaverToken, insNaverUser, udtNaverUser } from "@/src/lib/auth/naver/naverDb";
import { serialize } from "cookie";
import jwt from "jsonwebtoken";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  let flowFlag = 0;
  try {
    // 토큰 요청
    const tokenResponse = await fetch("https://nid.naver.com/oauth2.0/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        client_id: process.env.NEXT_PUBLIC_NAVER_CLIENT_ID,
        client_secret: process.env.NAVER_CLIENT_SECRET,
        code,
        state,
      }),
    });

    const tokenData = await tokenResponse.json();
    console.log(tokenData);

    const accessToken = tokenData.access_token;
    console.log(accessToken);

    // 사용자 정보 요청
    const userResponse = await fetch("https://openapi.naver.com/v1/nid/me", {
      headers: {
        method: "GET",
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const userData = await userResponse.json();;
    console.log(userData);

    //토큰이 DB에 저장되어 있으면, 로그인 진행, DB에 저장되어 있지 않으면 회원가입
    const naverUserFlag = await selNaverToken(userData.response.id);
    let userInfo; //사용자 정보(토큰 생성용)
    if (!naverUserFlag) {
      const ins = await insNaverUser({token:userData.response.id, email:userData.response.email, nickname:userData.response.nickname});
      if (ins.affectedRows == 1) {
        //회원가입 완료
        flowFlag = 1;
        userInfo = { idx: ins.insertId, email: userData.response.id, type: "naver" }; //구글 사용자는 이메일 대신 고유값 넣음
      } else {
        //회원가입 실패 -> 로그인 페이지 이동
        flowFlag = 0;
      }
    } else {
      //로그인
      const udt = await udtNaverUser({token:userData.response.id, email:userData.response.email, nickname:userData.response.nickname});
      if (udt.affectedRows) {
        //정상 로그인
        flowFlag = 1;
        userInfo = {
          idx: naverUserFlag.idx,
          email: userData.response.id,
          type: "naver",
        }; //네이버 사용자는 이메일 대신 고유값 넣음
      } else {
        //로그인 안됨 -> 로그인 페이지 이동
        flowFlag = 0;
      }
    }
    if (flowFlag == 0) {
      return new Response(null, {
        status: 302,
        headers: {
          Location: '/login', // 로그인 페이지 경로
        },
      });
    } else if (flowFlag == 1) {
      const token = jwt.sign(userInfo, process.env.JWT_SECRET, {
        expiresIn: "6h",
      }); // 6시간 후 만료

      // Access Token을 쿠키에 저장 (znzl)
      const cookie = serialize("token", token, {
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 6, // 쿠키 만료 7일 (60 * 60 * 24 * 7)
        path: "/",
      });

      return new Response(null, {
        status: 302,
        headers: {
          Location: "/",
          "Set-Cookie": cookie,
        },
      });
    }
  } catch (error) {
    console.log(error);
  }

  return null;
}
