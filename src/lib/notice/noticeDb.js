import { pool } from "@/src/lib/db";

//notice type list 호출
export const getNoticeTypeList = async () => {
  let connection;
  const query = `
    SELECT * FROM notice_type
    WHERE use_flag = 0;
  `;
  try {
    connection = await pool.getConnection(); 
    const [rows] = await connection.query(query);

    return rows;
  } catch (error) {
    console.log(error);
    throw new Error(`getNoticeTypeList 호출 에러`);
  } finally {
    if (connection) {
      connection.release(); // 커넥션을 풀에 반환
    }
  }
};

//noticeList 호출
export const getNoticeList = async () => {
  let connection;
  const query = `
    SELECT 
    	n.idx,
    	n.title,
    	n.contents, 
    	DATE_FORMAT(n.reg_date, '%Y-%m-%d') AS reg_date,
    	n.notice_type_idx as type_idx,
    	nt.type
    FROM notice n
    LEFT JOIN notice_type nt
    ON n.notice_type_idx = nt.idx
    WHERE n.use_flag =0 AND nt.use_flag = 0
    ORDER BY n.reg_date DESC
  `;

  try {
    connection = await pool.getConnection(); 
    const [rows] = await connection.query(query);
    //console.log(rows);
    return rows;
  } catch (error) {
    console.log(error);
    throw new Error(`noticeList 호출 에러`);
  } finally {
    if (connection) {
      connection.release(); // 커넥션을 풀에 반환
    }
  }
};

/*
export const getNoticeList = async () => {
  const query = `
    SELECT 
    	n.idx,
    	n.title,
    	n.contents, 
    	DATE_FORMAT(n.reg_date, '%Y-%m-%d') AS reg_date,
    	n.notice_type_idx as type_idx,
    	nt.type
    FROM notice n
    LEFT JOIN notice_type nt
    ON n.notice_type_idx = nt.idx
    WHERE n.use_flag =0 AND nt.use_flag = 0
    ORDER BY n.reg_date DESC
  `;

  try {
    const [rows] = await pool.query(query);
    //console.log(rows);
    return rows;
  } catch (error) {
    console.log(error);
    throw new Error(`noticeList 호출 에러`);
  } finally {
    if (connection) {
      connection.release(); // 커넥션을 풀에 반환
    }
  }
};
*/