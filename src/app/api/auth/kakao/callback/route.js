import { NextResponse } from "next/server";
import {selKakaoToken, insKakaoUser, udtKakaoUser } from '@/src/lib/auth/kakao/kakaoDb';
import { serialize } from 'cookie';
import jwt from "jsonwebtoken";


// API 핸들러(API 엔드포인트 라우팅)
//사용자 토근 점검
export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  let flowFlag = 0;
  try {
    const tokenResponse = await fetch("https://kauth.kakao.com/oauth/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        client_id: process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID,
        redirect_uri: process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI,
        code,
      }),
    });

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    // 사용자 정보 가져오기 ==> 받아올 사용자 정보 없음
    const userResponse = await fetch("https://kapi.kakao.com/v2/user/me", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    

    //카카오에서 제공하는 사용자 데이터
    const userData = await userResponse.json();

    //토큰이 DB에 저장되어 있으면, 로그인 진행, DB에 저장되어 있지 않으면 회원가입
    const kakaoUserFlag= await selKakaoToken(userData.id);

    let userInfo; //사용자 정보(토큰 생성용)
 
    if(!kakaoUserFlag){
      //회원가입 후 로그인
      const ins = await insKakaoUser({token:userData.id, email:userData.kakao_account.email, nickname:userData.kakao_account.profile.nickname})
    
      if(ins.affectedRows == 1) {
        //회원가입 완료
        flowFlag =1;
        userInfo = {idx: ins.insertId, email: userData.id, type:'kakao',}; //카카오 사용자는 이메일 대신 고유값 넣음
      } else {
        //회원가입 실패 -> 로그인 페이지 이동
        flowFlag = 0;
      }
    } else {
      //로그인 
      const udt = await udtKakaoUser({token:userData.id, email:userData.kakao_account.email, nickname:userData.kakao_account.profile.nickname})
      if(udt.affectedRows) {
        //정상 로그인
        flowFlag = 1;
        userInfo = {idx: kakaoUserFlag.idx, email: userData.id, type:'kakao'}; //카카오 사용자는 이메일 대신 고유값 넣음
      } else {
        //로그인 안됨 -> 로그인 페이지 이동
        flowFlag = 0;
      }
    }


    if(flowFlag == 0) {
      //로그인 or 회원가입 실패
      
      return new Response(null, {
        status: 302,
        headers: {
          Location: '/login', // 로그인 페이지 경로
        },
      });
    } else if(flowFlag == 1) {
      // Access Token을 쿠키에 저장

      //토큰 생성
      const token = jwt.sign(userInfo, process.env.JWT_SECRET, {
        expiresIn: "6h",
      }); // 6시간 후 만료
      

      // Access Token을 쿠키에 저장 (znzl)
      const cookie = serialize('token', token, {
        httpOnly: false,  
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 6,  // 쿠키 만료 7일 (60 * 60 * 24 * 7)
        path: '/',
      });

      return new Response(null, {
        status: 302,
        headers: {
          Location: '/',
          'Set-Cookie': cookie,
        },
      });
    }

  } catch(error) {
    console.log(error)
  }

  // try {
  //   // 클라이언트로부터 전송된 JSON 데이터에서 token 추출
  //   const { token } = await req.json();

  //   // 토큰이 없으면 오류 반환
  //   if (!token) {
  //     return NextResponse.json(
  //       { message: "토큰이 필요합니다." },
  //       { status: 401 }
  //     );
  //   }

  //   // JWT 검증
  //   const decoded = jwt.verify(token, SECRET_KEY);
  //   console.log(decoded);
    
  //   // 검증에 성공하면 decoded에서 사용자 정보를 얻을 수 있습니다.
  //   // 예: const userId = decoded.id; // 토큰의 'id' 필드를 가져옴

  //   return NextResponse.json(
  //     { message: "토큰이 유효합니다.", user: decoded },
  //     { status: 200 }
  //   );
  // } catch (error) {
  //   // 오류 처리
  //   console.error("토큰 검증 중 오류 발생:", error);
  //   return NextResponse.json(
  //     { message: "토큰이 유효하지 않습니다." },
  //     { status: 401 }
  //   );
  // }
}
