import { pool } from "@/src/lib/db";

//구글 회원 확인
export const selGoogleToken = async (googleIdx) => {
  let connection;
  const query = `
    SELECT * FROM user
    WHERE google_token = ?
    AND USE_FLAG = 0;
  `;
  try {
    connection = await pool.getConnection(); 
    const [rows] = await connection.query(query, [googleIdx]);
    console.log(rows)
    return rows[0];
  } catch (error) {
    console.log(error);
    throw new Error(`selGoogleToken 호출 에러`);
  } finally {
    if (connection) {
      connection.release(); // 커넥션을 풀에 반환
    }
  }
};



//카카오 회원 등록
export const insGoogleUser = async ({token, email, nickname}) => {
  let connection;
  const query = `
    INSERT INTO user (google_token, email, name, nickname, last_access_date) 
    VALUE (?, ?, ?, ?, NOW())
  `;

  try {
    connection = await pool.getConnection(); 
    const [rows] = await connection.query(query, [token, email, nickname, nickname]);
    console.log(rows);
    return rows;
  } catch (error) {
    console.log(error);
    throw new Error(`insGoogleUser 호출 에러`);
  } finally {
    if (connection) {
      connection.release(); // 커넥션을 풀에 반환
    }
  }
};





//구글 회원 로그인
export const udtGoogleUser = async ({token, email, nickname}) => {
  let connection;
  const query = `
    UPDATE user
    SET
      email = ?,
      name = ?,
      last_access_date = NOW()
    WHERE google_token = ?
    AND use_flag = 0
  `;

  try {
    connection = await pool.getConnection(); 
    const [rows] = await connection.query(query, [email, nickname, token]);
    console.log(rows);
    return rows;
  } catch (error) {
    console.log(error);
    throw new Error(`udtGoogleUser 호출 에러`);
  } finally {
    if (connection) {
      connection.release(); // 커넥션을 풀에 반환
    }
  }
};
