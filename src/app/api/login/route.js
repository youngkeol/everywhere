import { NextResponse } from "next/server";
import jwt from 'jsonwebtoken';
import { login } from "@/src/lib/login/loginDb";

// API 핸들러(API 엔드포인트 라우팅)
export async function POST(req) {
  try {
    //사용자 입력한 값
    const { email, password } = await req.json();
    const authInfo = await login({ email, password });


    if (authInfo) {
      console.log(authInfo)
      const token = jwt.sign({email :authInfo.email, idx:authInfo.idx, type:'login'}, process.env.JWT_SECRET, {
        expiresIn: "6h",
      }); // 6시간 후 만료
      console.log(token)
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log(decoded);
      console.log('Decoded Payload:', decoded);  // { email: "admin", iat: 1731652204, exp: 1731663004 }

      return NextResponse.json({ token }, { status: 200 });

      console.log(token)
    } else {
      return NextResponse.json(
        { message: "로그인에 실패했습니다. 이메일이나 비밀번호를 확인하세요." },
        { status: 200 }
      );
    }
  } catch (error) {
    return NextResponse.error(new Error("데이터를 가져오는 중 오류 발생"));
  }
}
