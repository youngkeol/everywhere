// middleware.js
import { NextResponse } from 'next/server';


import { authMiddleware } from './authMiddleware';
export async function middleware(req) {
  const authResult = await authMiddleware(req);
  if(!authResult) {
    const host = req.headers.get('host');
    const path = req.nextUrl.pathname;

    console.log(`http://${req.headers}`);
    const callbackUrl = `/login?callbackUrl=${encodeURIComponent(`http://${host}${path}`)}`;
    console.log(callbackUrl)
    return NextResponse.redirect(
      // new URL(
      //   `/login?callbackUrl=${encodeURIComponent(req.url)}`,
      //   req.url
      // )
  
      
      new URL(callbackUrl, `http://${host}`)
    );
  }



  // console.log("aa")
  // //console.log(req.headers)
  // const token = req.headers.get('Authorization')?.split(' ')[1];

  // if (!token) {
  //   return NextResponse.json({ message: '토큰이 필요합니다.' }, { status: 401 });
  // }

  // try {
  //   const user = jwt.verify(token, process.env.JWT_SECRET);
  //   req.user = user; // 사용자 정보를 요청 객체에 추가
  // } catch (err) {
  //   return NextResponse.json({ message: '유효하지 않은 토큰입니다.' }, { status: 403 });
  // }

  return NextResponse.next(); // 다음으로 진행
}

// 적용할 경로를 설정합니다.
export const config = {
  matcher: [ {
    source: '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|images|resources).*)',

  }],
};