import fs from "fs";
import path from "path";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import { pool } from "@/src/lib/db";
import {
  selRegionIdx,
  insPost,
  insPostImages,
  insPostTags,
} from "@/src/lib/myPlaces/myPlacesDb";


export const config = {
  api: {
    bodyParser: {
      sizeLimit: '20mb',  // 파일 업로드 크기 제한 (예: 10MB)
    },
  },
};



export async function POST(req) {
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
  let connection;
  try {
    // JWT 검증 및 사용자 정보 추출
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { idx: userIdx } = decoded;

    // FormData 추출
    const formData = await req.formData();
    const title = formData.get("title") || "제목 없음";
    const addressJson = formData.get("address");
    const { jibunAddress, address } = addressJson ? JSON.parse(addressJson) : {};
    const contents = formData.get("contents") || "";
    const tags = formData.getAll("tags[]").filter(Boolean);
    const files = formData.getAll("files[]").filter((file) => file !== null);
    const openFlag = formData.get("openFlag") || "0";
   
    console.log(addressJson)
    // 주소 정보를 기반으로 카카오 API 호출
    const queryAddress = jibunAddress || address;
    const url = `https://dapi.kakao.com/v2/local/search/address?query=${queryAddress}`;
    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `KakaoAK ${process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID}`,
      },
    });
    console.log(url)
    if (!response.ok) {
      throw new Error(`API 호출 실패(위도, 경도)`);
    }

    const data = await response.json();
    if (data.documents.length === 0) {
      throw new Error(`API 호출 실패(위도, 경도)`);
    }

    const addressPasingData = {
      address_depth1: data.documents[0].address.region_1depth_name,
      address_depth2: data.documents[0].address.region_2depth_name,
      address_depth3: data.documents[0].address.region_3depth_name,
      lat: data.documents[0].y,
      lng: data.documents[0].x,
    };

    // 주소 idx 조회
    const region = await selRegionIdx({
      region: addressPasingData.address_depth1,
    });
    console.log("aaa")
    // 트랜잭션 시작
    connection = await pool.getConnection();
    await connection.beginTransaction();

    // 글 등록
    const insPostResult = await insPost({
      userIdx,
      regionIdx: region.idx,
      title,
      contents,
      address,
      address_depth1: addressPasingData.address_depth1,
      address_depth2: addressPasingData.address_depth2,
      address_depth3: addressPasingData.address_depth3,
      jibun_address : jibunAddress,
      lat : addressPasingData.lat,
      lng : addressPasingData.lng,
      open_flag : openFlag
    });
    const postIdx = insPostResult.insertId;
    console.log("@@@@")
    console.log(insPostResult)
    // 이미지 저장 처리
    let imageIdxArr = [];
    if (files.length > 0) {
      const uploadDir = path.join(process.cwd(), `/app/uploads/${postIdx}`);
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const filePathArr = [];
      for (const [index, file] of files.entries()) {
        const fileBuffer = Buffer.from(await file.arrayBuffer());
        const filePath = path.join(
          uploadDir,
          `image-${index + 1}-${file.name}`
        );
        fs.writeFileSync(filePath, fileBuffer);
        filePathArr.push(`/app/uploads/${postIdx}/image-${index + 1}-${file.name}`);
      }

      imageIdxArr = await insPostImages({ postIdx, filePathArr });
    }

    // 태그 등록
    let tagIdxArr = [];
    if (tags.length > 0) {
      tagIdxArr = await insPostTags({ postIdx, tags });
    }

    // 트랜잭션 커밋
    await connection.commit();

    // 성공 응답 반환
    return new Response(
      JSON.stringify({
        success: true,
        postIdx,
        tags: tagIdxArr,
        images: imageIdxArr,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    // 에러 발생 시 롤백
    if (connection) await connection.rollback();
    console.log(error)
    return NextResponse.json(
      { message: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  } finally {
    // 커넥션 반환
    if (connection) connection.release();
  }
}
