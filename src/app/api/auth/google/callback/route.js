import { NextResponse } from "next/server";
import { selGoogleToken, insGoogleUser, udtGoogleUser } from "@/src/lib/auth/google/googleDb";
import { serialize } from 'cookie';
import jwt from "jsonwebtoken";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  let flowFlag = 0;
  try {
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI,
        grant_type: "authorization_code",
      }),
    });

    const tokenData = await tokenResponse.json();
    console.log(tokenData);

    const accessToken = tokenData.access_token;
    console.log(accessToken);

    const userResponse = await fetch(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    console.log(userResponse);

    //구글에서 제공하는 사용자 데이터
    const userData = await userResponse.json();
    console.log(userData);

    //토큰이 DB에 저장되어 있으면, 로그인 진행, DB에 저장되어 있지 않으면 회원가입
    const googleUserFlag = await selGoogleToken(userData.id);
    let userInfo; //사용자 정보(토큰 생성용)
    if (!googleUserFlag) {
      const ins = await insGoogleUser({token:userData.id, email:userData.email, nickname:userData.name});
      if (ins.affectedRows == 1) {
        //회원가입 완료
        flowFlag = 1;
        userInfo = { idx: ins.insertId, email: userData.id, type: "google" }; //구글 사용자는 이메일 대신 고유값 넣음
      } else {
        //회원가입 실패 -> 로그인 페이지 이동
        flowFlag = 0;
      }
    } else {
      //로그인
      const udt = await udtGoogleUser({token:userData.id, email:userData.email, nickname:userData.name});
      if (udt.affectedRows) {
        //정상 로그인
        flowFlag = 1;
        userInfo = {
          idx: googleUserFlag.idx,
          email: userData.id,
          type: "google",
        }; //카카오 사용자는 이메일 대신 고유값 넣음
      } else {
        //로그인 안됨 -> 로그인 페이지 이동
        flowFlag = 0;
      }
    }

    if (flowFlag == 0) {
      //로그인 or 회원가입 실패
      return new Response(null, {
        status: 302,
        headers: {
          Location: '/login', // 로그인 페이지 경로
        },
      });
    } else if (flowFlag == 1) {
      // Access Token을 쿠키에 저장

      //토큰 생성
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
