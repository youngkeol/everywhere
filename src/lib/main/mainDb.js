import { pool } from "@/src/lib/db";

//최근 
export const selRecentPosts = async ({userIdx,count=3}) => {
  const query = `
    SELECT p.*,
      GROUP_CONCAT(i.path) AS image_paths,
      GROUP_CONCAT(DISTINCT t.name) AS tag_names
    FROM (
      SELECT * FROM post
      WHERE use_flag = 0
      AND user_idx = ?
    ) p
    LEFT JOIN post_image pi
    ON p.idx = pi.post_idx
    LEFT JOIN image i
    ON pi.image_idx = i.idx
    LEFT JOIN post_tag pt
    ON p.idx = pt.post_idx
    LEFT JOIN tag t
    ON pt.tag_idx = t.idx
    GROUP BY p.idx
    ORDER BY p.reg_date DESC
    LIMIT ?
  `;

  try {
    const [rows] = await pool.query(query, [userIdx, count]);
    return rows;
  } catch (error) {
    console.log(error)
    throw new Error(`selRecentPosts 호출 에러`);
  }
};


export const selRecentNotices = async ({count=3}) => {
  const query = `
    SELECT *,
    FROM notice
    WHERE use_flag =0
    ORDER BY reg_date DESC
    limit ?
  `;
  try {
    const [rows] = await pool.query(query, [count]);
    return rows[0];
  } catch (error) {
    throw new Error(`selRecentNotice 호출 에러`);
  }
};
