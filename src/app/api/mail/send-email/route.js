import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { insVerificationCode, selCheckUser } from "@/src/lib/join/joinDb";

// 이메일 발송 함수
export async function POST(req) {
  try {
    const { email } = await req.json();
    console.log("받은 이메일:", email);

    // 랜덤 인증번호 생성 (6자리 숫자)
    const verificationCode = Math.floor(100000 + Math.random() * 900000);

    // 세션에 인증 코드 저장 (세션이 없으면 생성)
    //req.session.verificationCode = verificationCode;

    const row = await selCheckUser({ email });
    console.log(row);
    if (row.length > 0) {
      return NextResponse.json(
        { message: "이미 사용중인 이메일입니다." },
        { status: 200 }
      );
    }
    //DB에 인증코드 저장
    const affectedRows = await insVerificationCode({
      email: email,
      code: verificationCode,
    });

    // 이메일 내용 설정
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, // 구글 이메일 계정
        pass: process.env.EMAIL_PASS, // 앱 비밀번호
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "이곳저곳 회원가입 이메일 인증",
      text: `이곳저곳 회원가입을 위해 인증번호는 ${verificationCode} 입니다. 인증번호 유효기간은 3분입니다.`,
    };

    // 이메일 발송
    await transporter.sendMail(mailOptions);

    return NextResponse.json(
      {
        message:
          "이메일이 성공적으로 발송되었습니다. 인증번호 유효기간은 3분입니다.",
      },
      { status: 200 }
    );
  } catch (error) {
    console.log("이메일 발송 실패:", error);
    return NextResponse.json({ message: "이메일 발송 실패" }, { status: 200 });
  }
}
