import { pool } from "@/src/lib/db";

export const selPublicPlaces = async ({ regionIdx }) => {
  let query = `
    SELECT p.*,
      GROUP_CONCAT(i.path) AS image_paths,
      GROUP_CONCAT( DISTINCT t.name) AS tag_names
    FROM (
      SELECT * FROM post
      WHERE use_flag = 0 
      AND open_flag = 1
  `;
  if (regionIdx >=1) {
    query += ` AND region_idx = ?`;
  }

  query += `
    ) p
    LEFT JOIN post_image pi
    ON p.idx = pi.post_idx
    LEFT JOIN image i
    ON pi.image_idx = i.idx
    LEFT JOIN post_tag pt
    ON p.idx = pt.post_idx
    LEFT JOIN tag t
    ON pt.tag_idx = t.idx
  `;

  // regionIdx가 있을 경우 조건 추가, 없으면 바로 GROUP BY로 진행
  if (regionIdx >=1) {
    query += ` WHERE p.region_idx = ?`;
  }

  query += `
      GROUP BY p.idx
     ORDER BY RAND(); 
    `;

  try {
    const [rows] = await pool.query(
      query,
      regionIdx ? [regionIdx, regionIdx] : []
    );


    return rows;
  } catch (error) {
    throw new Error(`selPublicPlaces 호출 에러`);
  }
};
