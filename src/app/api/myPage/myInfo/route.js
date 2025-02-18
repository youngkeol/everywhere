import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { selMyInfo, selMyPlacesInfo } from "@/src/lib/myPage/myPageDb";

//API 엔드포인트 라우팅
// API 핸들러
export async function GET(req) {
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
    console.log(decoded)
    const { idx: userIdx, type:type } = decoded;
    console.log(userIdx)
    const myInfo = await selMyInfo(userIdx);
    const myPlacesInfo = await selMyPlacesInfo(userIdx)
    console.log(myInfo)
    console.log(myPlacesInfo)

    return new Response(JSON.stringify({
      myInfo,
      myPlacesInfo
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.log(error)
    return NextResponse.error(new Error("데이터를 가져오는 중 오류 발생"));
  }
}
