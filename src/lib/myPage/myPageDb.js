import { pool } from "@/src/lib/db";

export const selMyInfo = async (userIdx) => {
  console.log(userIdx);
  const query = `
    SELECT *,
       CASE 
        WHEN kakao_token IS NOT NULL AND kakao_token != '' THEN 'kakao'
        WHEN naver_token IS NOT NULL AND naver_token != '' THEN 'naver'
        WHEN google_token IS NOT NULL AND google_token != '' THEN 'google'
        ELSE 'login'
      END AS login_type
    FROM user
    WHERE use_flag =0
    AND idx =?
  `;
  try {
    const [rows] = await pool.query(query, [userIdx]);
    return rows[0];
  } catch (error) {
    throw new Error(`selMyInfo 호출 에러`);
  }
};

export const selMyPlacesInfo = async (userIdx) => {
  const query = `
    SELECT 
      COUNT(CASE WHEN open_flag = 0 THEN 1 END) AS private_cnt,
      COUNT(CASE WHEN open_flag = 1 THEN 1 END) AS public_cnt
    FROM post
    WHERE use_flag =0
    AND user_idx =?
  `;

  try {
    const [rows] = await pool.query(query, [userIdx]);
    return rows[0];
  } catch (error) {
    throw new Error(`selMyPlacesInfo 호출 에러`);
  }
};

export const delUserInfo = async (userIdx) => {
  console.log(userIdx);
  const query = `
    DELETE FROM user 
    WHERE use_flag =0 AND idx =?
  `;
  try {
    const [result] = await pool.query(query, [userIdx]);
    console.log("회원삭제");
    return result;
  } catch (error) {
    throw new Error(`delUserInfo 호출 에러`);
  }
};

export const udtUserInfo = async ({ userIdx, password, nickname }) => {
  let params = [nickname];
  let query = `
    UPDATE user 
    SET 
      nickname = ?
  `;

  // 비밀번호가 있을 경우 쿼리 업데이트
  if (password) {
    query += `, password = ?`;
    params.push(password); // 비밀번호가 있으면 params에 추가
  }

  query += ` WHERE use_flag = 0 AND idx = ?`;
  params.push(userIdx); // userIdx를 params에 추가

  try {
    const [result] = await pool.query(query, params); // params 배열 전달
    console.log("회원 수정");
    return result;
  } catch (error) {
    console.error("회원 수정 실패:", error);
    throw new Error(`udtUserInfo 호출 에러`);
  }
};
