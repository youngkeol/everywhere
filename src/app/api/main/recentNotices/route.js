import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import { selRecentNotices } from "@/src/lib/main/mainDb";

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
    const url = new URL(req.url);
    const count = Number(url.searchParams.get("count")) || 3

    const recentNotices = await selRecentNotices({ count });
    return new Response(JSON.stringify(recentNotices), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    return NextResponse.json(
      { message: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
