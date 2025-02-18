"use client";
import { fetchRecentPosts } from "@/src/lib/main/mainApi";
import React, { useState, useEffect } from "react";
import classes from "./MainRecentPosts.module.css";

const MainRecentPosts = ({openDetailPlace}) => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        const result = await fetchRecentPosts({ count: 3 });
        setData(result); // 데이터 설정
        setLoaded(true); // 로딩 완료
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("데이터를 불러오는 데 실패했습니다.");
      }
    };

    loadData();
  }, []);

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <table>
      <colgroup>
        <col style={{ width: "20%" }} />
        <col style={{ width: "40%" }} />
        <col style={{ width: "auto" }} />
      </colgroup>
      <thead>
        <tr>
          <th>제목</th>
          <th>주소</th>
          <th>태그</th>
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
          <tr key={item.idx} className={classes["cursor-row"]}
            onClick={()=>openDetailPlace(item)}
          >
            <td>{item.title}</td>
            <td>{item.address}</td>
            <td>
              {item.tag_names ? (
                item.tag_names.split(",").map((tag, idx) => (
                  <span key={idx} className={classes["tag"]}>
                    {tag}
                  </span>
                ))
              ) : (
                <span className={classes["tag"]}>태그 없음</span>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default MainRecentPosts;
