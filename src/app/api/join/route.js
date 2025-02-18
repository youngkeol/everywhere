import { NextResponse } from "next/server";
import { withSession } from "../session";
import {
  insJoin,
  selCheckUser,
  selVerrificatinoCode,
} from "@/src/lib/join/joinDb";

// 회원가입 처리 함수
export async function POST(req) {
  try {
    const { email, password, nickname, verificationCode } = await req.json();
    const result = await selVerrificatinoCode({
      email,
      code: verificationCode,
    });

    if (result.length == 0) {
      // 회원가입 성공 후 응답
      return NextResponse.json(
        { message: "인증 코드가 일치하지 않습니다. 다시 시도하세요." },
        { status: 200 }
      );
    }
    const checkUser = await selCheckUser({ email });

    if (checkUser.length > 0) {
      // 회원가입 성공 후 응답
      return NextResponse.json(
        { message: "이미 사용중인 이메일입니다." },
        { status: 200 }
      );
    }

    const { affectedRows } = await insJoin({ email, password, nickname });
    // 회원가입 성공 후 응답
    return NextResponse.json(
      { message: "회원가입 성공!", result: true },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "회원가입 실패!", result: false },
      { status: 500 }
    );
  }
}
