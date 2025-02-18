import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { delUserInfo } from "@/src/lib/myPage/myPageDb";

//API 엔드포인트 라우팅
// API 핸들러
export async function POST(req) {
  const cookies = req.headers.get("cookie");
  if (!cookies) {
    return new Response(JSON.stringify({ error: "쿠키가 없습니다." }), {
      status: 401,
    });
  }

  const tokenMatch = cookies.match(/token=([^;]+)/);
  if (!tokenMatch) {
    return new Response(JSON.stringify({ error: "token 쿠키가 없습니다." }), {
      status: 401,
    });
  }

  const token = tokenMatch[1];

  try {
    // JWT 검증 및 사용자 정보 추출
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { idx: userIdx, type: type } = decoded;

    const delUserRow = await delUserInfo(userIdx);
    console.log(delUserRow);

    console.log("a");
  // 서버 코드 (200 상태 코드 반환)
    return new Response(
        JSON.stringify({ success: true, redirectUrl: "/login" }),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
  } catch (error) {
    console.log(error);
    return NextResponse.error(new Error("사용자 정보 삭제 오류 발생"));
  }
}
