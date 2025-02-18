// // /lib/db.js
// import mysql from 'mysql2/promise';

// export async function connectToDatabase() {
//   const connection = await mysql.createConnection({
//     host: process.env.DB_HOST,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_NAME,
//     port: process.env.DB_PORT,
//   });
//   return connection;
// }

import { createPool } from "mysql2/promise";



const registerService = (name, initFn) => {
  if (process.env.NODE_ENV === "development") {
    if (!(name in global)) {
      global[name] = initFn();
    }
    return global[name];
  }
  return initFn();
};

// `pool` 생성
export const pool = registerService("pool", () =>
  createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    waitForConnections: true, // 커넥션 풀이 가득 차면 대기
    connectionLimit: 50, // 풀에서 사용할 수 있는 최대 커넥션 수
    queueLimit: 0, // 대기 큐의 최대 크기 (0은 무제한)
    connectTimeout: 10000, // 연결 타임아웃 (밀리초)
  })
);

let activeConnections = 0; // 활성화된 커넥션 수 추적

// 커넥션 획득
pool
  .getConnection()
  .then(async (connection) => {
    try {
      activeConnections++;
      console.log(`Database connected. Active connections: ${activeConnections}`);

      // 여기서 DB 작업을 진행
      // 예: const [rows] = await connection.query('SELECT * FROM users');
      // 필요한 DB 작업을 여기에 넣습니다.
    } catch (err) {
      console.error("Error during DB operation:", err);
    } finally {
      // 커넥션을 반환
      activeConnections--;
      connection.release();
      console.log(`Connection released. Active connections: ${activeConnections}`);
    }
  })
  .catch((err) => {
    console.error("Database connection failed:", err);
  });