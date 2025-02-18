import { NextResponse } from "next/server";

import { getNoticeTypeList } from "@/src/lib/notice/noticeDb";

//API 엔드포인트 라우팅
// API 핸들러
export async function GET(req) {
  try {
    const notices = await getNoticeTypeList();
    return new Response(JSON.stringify(notices), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    return NextResponse.error(new Error("데이터를 가져오는 중 오류 발생"));
  }
}
