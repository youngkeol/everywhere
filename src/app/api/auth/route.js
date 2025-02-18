import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { login } from "@/src/lib/login/loginDb";

// API 핸들러(API 엔드포인트 라우팅)
//사용자 토근 점검
export async function POST(req) {
  try {
    // 클라이언트로부터 전송된 JSON 데이터에서 token 추출
    const { token } = await req.json();

    // 토큰이 없으면 오류 반환
    if (!token) {
      return NextResponse.json(
        { message: "토큰이 필요합니다." },
        { status: 401 }
      );
    }

    // JWT 검증
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    //console.log(decoded);

    // 검증에 성공하면 decoded에서 사용자 정보를 얻을 수 있습니다.
    // 예: const userId = decoded.id; // 토큰의 'id' 필드를 가져옴

    return NextResponse.json(
      { message: "토큰이 유효합니다.", user: decoded },
      { status: 200 }
    );
  } catch (error) {
    // 오류 처리
    console.error("토큰 검증 중 오류 발생:", error);
    return NextResponse.json(
      { message: "토큰이 유효하지 않습니다." },
      { status: 401 }
    );
  }
}
