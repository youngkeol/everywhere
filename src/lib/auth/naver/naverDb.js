import { pool } from "@/src/lib/db";

//카카오 회원 확인
export const selNaverToken = async (naverIdx) => {
  console.log("@@@@" + naverIdx)
  let connection;
  const query = `
    SELECT * FROM user
    WHERE naver_token = ?
    AND USE_FLAG = 0;
  `;
  try {
    connection = await pool.getConnection(); 
    const [rows] = await connection.query(query, [naverIdx]);
    console.log(rows)
    return rows[0];
  } catch (error) {
    console.log(error);
    throw new Error(`selNaverToken 호출 에러`);
  } finally {
    if (connection) {
      connection.release(); // 커넥션을 풀에 반환
    }
  }
};



//카카오 회원 등록
export const insNaverUser = async ({token, email, nickname}) => {
  let connection;
  const query = `
    INSERT INTO user (naver_token, email, name, nickname,  last_access_date) 
    VALUE (?, ?, ?, ?, NOW())
  `;

  try {
    connection = await pool.getConnection(); 
    const [rows] = await connection.query(query, [token, email, nickname, nickname]);
    console.log(rows);
    return rows;
  } catch (error) {
    console.log(error);
    throw new Error(`insNaverUser 호출 에러`);
  } finally {
    if (connection) {
      connection.release(); // 커넥션을 풀에 반환
    }
  }
};





//카카오 회원 로그인
export const udtNaverUser = async ({token, email, nickname}) => {
  let connection;
  const query = `
    UPDATE user
    SET
      email = ?,
      name = ?,
      last_access_date = NOW()
    WHERE naver_token = ?
    AND use_flag = 0
  `;

  try {
    connection = await pool.getConnection(); 
    const [rows] = await connection.query(query, [email, nickname, token]);
    console.log(rows);
    return rows;
  } catch (error) {
    console.log(error);
    throw new Error(`udtNaverUser 호출 에러`);
  } finally {
    if (connection) {
      connection.release(); // 커넥션을 풀에 반환
    }
  }
};
