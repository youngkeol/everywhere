"use client";
import React, { useState, useEffect } from "react";

const MainTable = ({ columns, fetchData, rows }) => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true); // 로딩 시작
      try {
        const result = await fetchData({ count: rows });
        console.log("Fetched data:", result);
        setData(result);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("데이터를 불러오는 데 실패했습니다.");
      } finally {
        setLoading(false); // 로딩 종료
      }
    };

    loadData();
  }, [fetchData, rows]);

  if (loading) {
    return <div>로딩 중...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }



  const renderCellContent = (item, column) => {
    const value = item[column.conName];
  
    if (column.conType === "date") {
      // 날짜 형식 렌더링
      return new Date(value).toLocaleDateString();
    }
  
    if (column.conType === "html") {
      // HTML 렌더링
      return <div dangerouslySetInnerHTML={{ __html: value }} />;
    }
  
    if (column.conType === "arr" && value != null) {
      // 배열 데이터 렌더링
      let arrValue = value.split(",");
      return arrValue.map((el, idx) => <span key={idx}>{el}</span>);
    }
  
    // 기본 텍스트 렌더링
    return value;
  };

  return (
    <div>
      <table>
        <colgroup>
          {columns.map((col, index) => (
            <col key={index} style={{ width: col.width }} />
          ))}
        </colgroup>
        <thead>
          <tr>
            {columns.map((col, index) => (
              <th key={index}>{col.title || `컬럼 ${index + 1}`}</th> // title이 없으면 기본값 표시
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.idx}>
              {columns.map((col, colIndex) => (
                <td key={colIndex}>{renderCellContent(item, col)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MainTable;
