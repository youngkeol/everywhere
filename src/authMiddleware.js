// middleware1.js
import { NextResponse } from "next/server";
//import jwt from 'jsonwebtoken';
import jwt from "jsonwebtoken";
import { jwtVerify } from "jose";
export async function authMiddleware(req) {
  const pathname = req.nextUrl.pathname;

  // 미들웨어를 통과할 경로 목록
  const allowedPaths = ["/login", "/find", "/join"];

  // 경로가 허용된 목록에 포함되면 미들웨어를 통과
  if (allowedPaths.includes(pathname)) {
    return true;
  }

  // 쿠키에서 토큰 여부 확인
  const token = req.cookies.get("token");
  if (!token) {
    return false;
  }

  //유효한 토큰 값인지 확인
  //const decoded = jwt.verify(token.value, process.env.JWT_SECRET); // JWT_SECRET는 환경 변수로 관리
  try {
    const { payload } = await jwtVerify(
      token.value,
      new TextEncoder().encode(process.env.JWT_SECRET)
    );
    return true;
  } catch (error) {
    //console.log("유효한값아님")
    return false;
  }

  //return NextResponse.next(); // 다음으로 진행
}
