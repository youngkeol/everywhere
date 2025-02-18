import { NextResponse } from "next/server";
import { selPublicPlaces } from "@/src/lib/publicPlaces/publicPlacesDb";
//API 엔드포인트 라우팅
// API 핸들러
export async function GET(req) {
  try {
    const url = new URL(req.url);
    const idx = url.searchParams.get("idx"); // 'idx' 파라미터 가져오기
    const publicPlaces = await selPublicPlaces({regionIdx:idx});
    console.log(publicPlaces)
    return new Response(JSON.stringify(publicPlaces), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.log(error)
    return NextResponse.json(
      { message: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
