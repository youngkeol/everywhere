
import { pool } from "@/src/lib/db";

export const selCheckUser = async ({ email }) => {
  //쿼리 생성
  const query = `
    SELECT * FROM user
    WHERE email = ?
    AND use_flag = 0
    AND kakao_token IS NULL
    AND google_token IS NULL
    AND naver_token IS NULL
  `;

  try {
    const [rows] = await pool.query(query, [email]);
    return rows;
  } catch (error) {
    console.log(error);
    throw new Error(`selCheckUser 호출 에러`);
  }
};

export const insVerificationCode = async ({ email, code }) => {
  //쿼리 생성
  const query = `
    INSERT INTO verification(email, code)
    values (?, ?)
  `;

  try {
    const [affectedRows] = await pool.query(query, [email, code]);
    return affectedRows;
  } catch (error) {
    console.log(error);
    throw new Error(`insVerificationCode 호출 에러`);
  }
};


export const selVerrificatinoCode = async ({ email, code }) => {
  //쿼리 생성
  const query = `
    SELECT * FROM verification
    WHERE email = ?
    AND code =? 
    LIMIT 1
  `;

  console.log(email, code)
  try {
    const [rows] = await pool.query(query, [email, code]);
    return rows;
  } catch (error) {
    console.log(error);
    throw new Error(`selVerrificatinoCode 호출 에러`);
  }
};


export const insJoin = async ({ email, password, name, nickname}) => {
  //쿼리 생성
  const query = `
    INSERT INTO user(email, password, name, nickname)
    VALUE (?, ?, ?, ?)
  `;

  try {
    const [affectedRows] = await pool.query(query, [email, password, nickname, nickname]);
    return affectedRows;
  } catch (error) {
    console.log(error);
    throw new Error(`insJoin 호출 에러`);
  }
};

