"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { fetchNoticeList } from "@/src/lib/notice/noticeApi";
import classes from "./MainRecentNotices.module.css";

const MainRecentNotices = () => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const loadData = async () => {
      try {
        const result = await fetchNoticeList({ count: 3 });
        setData(result); // 데이터 설정
        setLoaded(true); // 로딩 완료
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("데이터를 불러오는 데 실패했습니다.");
      }
    };

    loadData();
  }, []);

  const moveNoticeHandler = (idx) => {
    router.push(`/notice?active=${idx}`);
  }

  return (
    <table>
      <colgroup>
        <col style={{ width: "100px" }} />
        <col style={{ width: "auto" }} />
        <col style={{ width: "100px" }} />
      </colgroup>
      <thead>
        <tr>
          <th>구분</th>
          <th>내용</th>
          <th>작성일자</th>
        </tr>
      </thead>
      <tbody>
        {error && (
          <>
            <tr>
              <td colSpan="3" rowSpan="3" style={{ textAlign: "center" }}>
                오류가 발생했습니다.
              </td>
            </tr>
            <tr></tr>
            <tr></tr>
          </>
        )}
        {!error && !loaded && (
          <>
            <tr>
              <td colSpan="3" rowSpan="3" style={{ textAlign: "center" }}>
                데이터 불러오는 중입니다.
              </td>
            </tr>
            <tr></tr>
            <tr></tr>
          </>
        )}
        {!error && loaded && data.length === 0 && (
          <>
            <tr>
              <td colSpan="3" rowSpan="3" style={{ textAlign: "center" }}>
                데이터가 존재하지 않습니다.
              </td>
            </tr>
            <tr></tr>
            <tr></tr>
          </>
        )}
        {data.map((item, index) => (
          <tr key={item.idx}
            onClick={()=>moveNoticeHandler(item.idx)}
            className={classes['cursor-row']}
          >
            <td>
              <span className={classes["type"]}>{item.type}</span>
            </td>
            <td>{item.title}</td>
            <td className={classes["date"]}>{item.reg_date}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default MainRecentNotices;
