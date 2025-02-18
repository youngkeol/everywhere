
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import { delPost } from "@/src/lib/myPlaces/myPlacesDb";

export async function POST(req) {
  console.log("@@@####")
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
    const { idx: userIdx } = decoded;
    const { idx: postIdx } = await req.json(); // JSON 데이터를 받아옴

    const delPostRow = await delPost({ userIdx, postIdx });
    console.log(delPostRow);
    return new Response(
      JSON.stringify({ success: true, redirectUrl: "/myPlaces" }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.error(new Error("나의 장소 삭제 오류 발생"));
  }
}
