import { NextResponse } from "next/server";
import { getNoticeList } from "@/src/lib/notice/noticeDb";

//API 엔드포인트 라우팅
// API 핸들러
export async function GET(req) {
  try {
    const notices = await getNoticeList();
    return new Response(JSON.stringify(notices), {
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
