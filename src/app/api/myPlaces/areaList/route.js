import { NextResponse } from "next/server";
import { selAreaList } from "@/src/lib/myPlaces/myPlacesDb";

//API 엔드포인트 라우팅
// API 핸들러
export async function GET(req) {
  try {
    const areaList = await selAreaList();
    return new Response(JSON.stringify(areaList), {
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
