import session from "next-session";

// 세션 설정 옵션
const sessionOptions = {
  name: "next-session", // 쿠키 이름
  secret: "your-secret-key", // 강력한 비밀 키 사용
  cookie: {
    httpOnly: true,
    secure: false,//process.env.NODE_ENV === "production", // 프로덕션 환경에서는 HTTPS 사용
    maxAge: 180000, // 3분 동안 유효 (180초)
    path: '/', // 쿠키를 루트 경로에서 공유
    sameSite: 'lax', // 세션 쿠키를 동일한 사이트에서만 공유하도록 설정
  },
};

// 세션을 설정하는 함수
const withSession = (handler) => {
  console.log("aaaa")
  return async (req, res) => {
    const sessionData = await session(sessionOptions)(req, res);
    console.log(sessionData)

    req.session = sessionData; // 세션 데이터 저장
    return handler(req, res); // 핸들러 호출
  };
};

export { withSession };