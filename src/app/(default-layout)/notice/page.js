"use client";
import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  fetchNoticeList,
  fetchNoticeTypeList,
} from "@/src/lib/notice/noticeApi";
import MenuFilter from "@/src/app/components/MenuFilter/MenuFilter";
import Accordion from "@/src/app/components/Accordion/Accordion";
import LoadingBox from "@/src/app/components/LoadingBox/LoadingBox";

// Suspense로 감싸는 컴포넌트
const NoticePageContent = () => {
  const [noticeTypeList, setNoticeTypeList] = useState([]);
  const [noticeList, setNoticeList] = useState([]); // 기본값으로 빈 배열 설정
  const [selType, setSelType] = useState(0);
  const [selConIdxArr, setSelConIdxArr] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    const loadNoticeList = async () => {
      try {
        // type 가져오기
        const noticeTypeRes = await fetchNoticeTypeList();
        setNoticeTypeList(noticeTypeRes);

        // 데이터 가져오기
        const noticeListRes = await fetchNoticeList();
        setNoticeList(noticeListRes);

        setIsLoaded(true);

        const active = searchParams.get("active");
        if (active) {
          setSelConIdxArr([...selConIdxArr, Number(active)]);
        }
      } catch (error) {
        throw new Error("notice 데이터 호출 실패");
      }
    };
    loadNoticeList();
  }, [searchParams]); // selConIdxArr도 의존성에 포함

  // 타입(필터) 클릭, typeIdx가 0이면 전체 선택
  const typeClickHandler = (typeIdx) => {
    setSelType(typeIdx);
    setSelConIdxArr([]);
  };

  // 컨텐츠 클릭
  const conClcikHandler = (noticeIdx) => {
    if (selConIdxArr.includes(noticeIdx)) {
      setSelConIdxArr((prev) => prev.filter((item) => item !== noticeIdx));
    } else {
      setSelConIdxArr((prev) => [...prev, noticeIdx]);
    }
  };

  return (
    <>
      {isLoaded ? (
        <>
          {/* menu-filter-box */}
          <MenuFilter
            typeList={noticeTypeList}
            selType={selType}
            typeClick={typeClickHandler}
            showAll
          />
          {/* //menu-filter-box */}

          {/* accordion-content */}
          <Accordion
            noticeList={noticeList}
            selType={selType}
            selConIdxArr={selConIdxArr}
            conClick={conClcikHandler}
          />
          {/* //accordion-content */}
        </>
      ) : (
        <LoadingBox title={`데이터를 불러오는 중입니다.`} height={`500px`} />
      )}
    </>
  );
};

// Suspense로 감싸서 사용
const NoticePage = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <NoticePageContent />
  </Suspense>
);

export default NoticePage;