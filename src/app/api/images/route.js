import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

export async function GET(request) {
  const url = new URL(request.url);
  const filename = url.searchParams.get('filename');
  console.log(url)
  console.log(filename)
  if (!filename) {
    return new NextResponse('Filename parameter is required', { status: 400 });
  }

  // 안전한 파일 경로 생성 (업로드 디렉토리만 허용)
  const filePath = path.join(process.cwd(), filename);

  // 파일이 존재하는지 확인
  if (!fs.existsSync(filePath)) {
    return new NextResponse('File not found', { status: 404 });
  }

  const fileBuffer = fs.readFileSync(filePath);

  // 파일 반환 (이미지 파일)
  return new NextResponse(fileBuffer, {
    headers: {
      'Content-Type': 'image/png', // 적절한 MIME 타입으로 설정
    },
  });
}