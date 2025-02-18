import { pool } from "@/src/lib/db";

export const selAreaList = async () => {
  const query = `
    SELECT * FROM region
    WHERE use_flag =0;
  `;
  try {
    const [rows] = await pool.query(query);
    return rows;
  } catch (error) {
    throw new Error(`selAreaList 호출 에러`);
  }
};

export const selMyPlaces = async ({ userIdx }) => {
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
    ORDER BY p.reg_date DESC;
  `;
  try {
    const [rows] = await pool.query(query, [userIdx]);
    return rows;
  } catch (error) {
    throw new Error(`selMyPlaces 호출 에러`);
  }
};

export const selRegionIdx = async ({ region }) => {
  console.log("aaa" + region);
  //쿼리 생성
  const query = `
    SELECT * FROM region
    WHERE name = ?
    AND use_flag =0
    limit 1;
  `;

  console.log(query);
  try {
    const [rows] = await pool.query(query, [region]);
    console.log(rows);
    return rows[0];
  } catch (error) {
    console.log(error);
  }
};

export const insPost = async ({
  userIdx,
  regionIdx,
  title,
  contents,
  address,
  address_depth1,
  address_depth2,
  address_depth3,
  jibun_address,
  lat,
  lng,
  open_flag,
}) => {
  //쿼리 생성
  const query = `
    INSERT INTO post (user_idx, region_idx, title, contents, address, address_depth1,address_depth2,address_depth3, jibun_address, lat, lng, open_flag)
    VALUES (?,?,?,?,?,?,?,?,?,?,?,?)
  `;

  console.log(query);
  console.log(
    userIdx,
    regionIdx,
    title,
    contents,
    address,
    address_depth1,

    address_depth2,
    address_depth3,
    jibun_address
  );
  console.log(address_depth3);
  try {
    const [rows] = await pool.query(query, [
      userIdx,
      regionIdx,
      title,
      contents,
      address,
      address_depth1,
      address_depth2,
      address_depth3,
      jibun_address,
      lat,
      lng,
      open_flag,
    ]);
    return rows;
  } catch (error) {
    console.log(error);
  } finally {
  }
};

export const insPostImages = async ({ postIdx, filePathArr }) => {
  let connection; // 트랜잭션을 위한 개별 커넥션

  try {
    // 트랜잭션 시작을 위해 커넥션 가져오기
    connection = await pool.getConnection();

    // 트랜잭션 시작
    await connection.beginTransaction();

    //이미지 저장 쿼리 생성
    const query1 = `
      INSERT INTO image(path)
      VALUE (?)
    `;

    //이미지 글 연결 쿼리 생성
    const query2 = `
      INSERT INTO post_image (post_idx, image_idx)
      VALUE (?,?)
    `;

    const imageIdxArr = [];

    // 1. query1 실행: 이미지 경로 삽입 및 반환된 image_idx 저장
    for (const path of filePathArr) {
      const [result] = await connection.query(query1, [path]);
      imageIdxArr.push(result.insertId); // 삽입된 image_idx 저장
    }

    // 2. query2 실행: post_idx와 image_idx 연결
    for (const imageIdx of imageIdxArr) {
      await connection.query(query2, [postIdx, imageIdx]);
    }

    // 트랜잭션 커밋
    await connection.commit();

    return imageIdxArr;
  } catch (error) {
    console.log(error);
    // 에러 발생 시 트랜잭션 롤백
    if (connection) await connection.rollback();
  } finally {
    if (connection) connection.release();
  }
};

export const insPostTags = async ({ postIdx, tags }) => {
  let connection; // 트랜잭션을 위한 개별 커넥션

  try {
    // 트랜잭션 시작을 위해 커넥션 가져오기
    connection = await pool.getConnection();

    // 트랜잭션 시작
    await connection.beginTransaction();

    //태그 저장 쿼리 생성
    const query1 = `
      INSERT INTO tag(name)
      VALUE (?)
    `;

    //태그 글 연결 쿼리 생성
    const query2 = `
      INSERT INTO post_tag (post_idx, tag_idx)
      VALUE (?,?)
    `;

    const tagIdxArr = [];

    // 1. query1 실행
    for (const tag of tags) {
      const [result] = await connection.query(query1, [tag]);
      tagIdxArr.push(result.insertId); // 삽입된 image_idx 저장
    }

    // 2. query2 실행
    for (const tagIdx of tagIdxArr) {
      await connection.query(query2, [postIdx, tagIdx]);
    }

    // 트랜잭션 커밋
    await connection.commit();

    return tagIdxArr;
  } catch (error) {
    console.log(error);
    // 에러 발생 시 트랜잭션 롤백
    if (connection) await connection.rollback();
  } finally {
    if (connection) connection.release();
  }
};

export const delPost = async ({ postIdx, userIdx }) => {
  //태그 저장 쿼리 생성
  const query = `
   DELETE FROM post
   WHERE idx = ?
   AND user_idx = ?
  `;

  try {
    const [rows] = await pool.query(query, [postIdx, userIdx]);
    return rows;
  } catch (error) {
    console.error("delPost 호출 에러:", error);
    throw new Error(`delPost 호출 에러`);
  }
};
