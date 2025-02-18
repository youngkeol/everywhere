import localFont from "next/font/local";
import "./globals.css"; //reset
import "@/public/css/board.css";
import "@/public/css/common.css";
import "@/public/xeicon/xeicon.css";
import AuthCheck from "./components/Auth/AuthCheck";
import { AuthProvier } from "../hooks/AuthReducer";
import Head from "next/head"; // Head를 임포트
import { CommonProvier } from "../hooks/commonReducer";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: "이곳저곳",
  description:
    "이곳저곳은 다양한 특별한 장소를 발견하고 간편하게 저장할 수 있는 플랫폼입니다.",
  openGraph: {
    title: '이곳저곳',
    description: '이곳저곳은 다양한 특별한 장소를 발견하고 간편하게 저장할 수 있는 플랫폼입니다.',
    url: 'https://everywhere.younggori.com', // 실제 웹사이트 URL
    siteName: '이곳저곳',
    images: [
      {
        url: 'https://everywhere.younggori.com/images/common/logo2.png', // 공유 시 표시될 이미지 URL
        width: 122,
        height: 120,
        alt: '이곳저곳',
      },
    ],
    locale: 'ko_KR', // 한국어 설정
    type: 'website',
  },
};

// 별도의 viewport export 추가
export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: "no",
};

export default function RootLayout({ children }) {
  
  return (
    <html lang="ko">
      {/* <Head>
        <script
          type="text/javascript"
          src="//dapi.kakao.com/v2/maps/sdk.js?appkey=98be10b063be33a30d57a6e7fa8d24b9&libraries=services,clusterer"
        ></script>

      </Head> */}
      <AuthProvier>
        <CommonProvier>
          <body className={`${geistSans.variable} ${geistMono.variable}`}>
            <AuthCheck>{children}</AuthCheck>
          </body>
        </CommonProvier>
      </AuthProvier>
    </html>
  );
}
