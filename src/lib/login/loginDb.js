import { pool } from "@/src/lib/db";

export const login = async ({ email, password }) => {

  //쿼리 생성
  const query = `
    SELECT * FROM user
    WHERE use_flag =0
    AND email = '${email}' 
    AND password = '${password}'
  `;

  console.log(query);
  try {
    const [rows] = await pool.query(query);
    return rows[0];
  } catch (error) {
    console.log(error);
  }
};
