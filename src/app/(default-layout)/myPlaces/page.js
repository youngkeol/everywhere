"use client";
import React, { useEffect, useState, useRef } from "react";
import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock";

import {
  fetchNoticeList,
  fetchNoticeTypeList,
} from "@/src/lib/notice/noticeApi";
import MenuFilter from "@/src/app/components/MenuFilter/MenuFilter";
import Accordion from "@/src/app/components/Accordion/Accordion";
import LoadingBox from "@/src/app/components/LoadingBox/LoadingBox";
import FilterBox from "../../components/UI/FilterBox";
import SlideFilter from "../../components/SlideFilter/SlideFilter";
import classes from "./myPlaces.module.css";
import SelFilterBox from "../../components/SelFilterBox/SelFilterBox";
import PlacesBox from "../../components/PlacesBox/PlacesBox";
import ModalBox from "../../components/UI/ModalBox";
import AddModal from "../../components/AddModal/AddModal";

import { fetchAreaList, fetchMyPlaces } from "@/src/lib/myPlaces/myPlacesApi";
import DetailModal from "../../components/DetailModal/DetailModal";

const MyPlacesPage = () => {
  const [regionList, setRegionList] = useState([]);
  const [selRegions, setSelRegions] = useState([]);
  const [tagList, setTagList] = useState([]);
  const [selTags, setSelTags] = useState([]);
  const [myPlaces, setMyPlaces] = useState(0);

  const [isLoaded, setIsLoaded] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selDetailData, setSelDetailData] = useState();
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const addModalRef = useRef(null); // 모달 요소 참조 생성
  const detailModalRef = useRef(null); // 모달 요소 참조 생성
  const inputRef = useRef(null); // input 요소 참조 생성

  useEffect(() => {
    const loadData = async () => {
      try {
        //메뉴, 글 목록 가져오기
        const areaList = await fetchAreaList();

        const modifiedArray = areaList.map((item) => ({
          idx: item.idx,
          type: item.name,
        }));
        setRegionList(modifiedArray);

        //글 목록 에서 태그 추출
        const myPlaces = await fetchMyPlaces();
        setMyPlaces(myPlaces);

        // tag_name 값을 분리하고 null을 제외하여 중복 없는 타입 목록 생성
        const uniqueTags = [
          ...new Set(
            myPlaces
              .filter((place) => place.tag_names !== null) // null 제외
              .flatMap((place) => place.tag_names.split(",")) // ','로 분리
          ),
        ];

        // tagList 배열 생성
        const tagList = uniqueTags.map((type, index) => ({
          idx: index + 1, // idx는 1부터 시작
          type: type,
        }));

        setTagList(tagList);

        setIsLoaded(true);
      } catch (error) {
        console.log(error);
      }
    };

    loadData();
  }, []);

  // useEffect(() => {
  //   const modalElement = addModalRef.current; //
  //   console.log(addModalRef.current);
  //   console.log(detailModalRef.current);
  //   console.log(modalElement);
  //   const bodyElement = document.body; // body 요소 선택
  //   if (isModalOpen || isDetailOpen) {
  //     bodyElement.style.overflow = "hidden"; // 스크롤을 없애는 부분
  //   } else {
  //     bodyElement.style.overflow = "auto"; // 원래 상태로 돌아가는 부분

  //   return () => {
  //     bodyElement.style.overflow = "auto"; // 원래 상태로 돌아가는 부분
  //   };
  // }, [isModalOpen, isDetailOpen]);

  const regionClickHandler = (regionId) => {
    setSelRegions((prevRegions) => {
      if (prevRegions.includes(regionId)) {
        return prevRegions.filter((t) => t !== regionId);
      } else {
        return [...prevRegions, regionId];
      }
    });
  };

  const tagClickHandler = (tag) => {
    setSelTags((prevTags) => {
      if (prevTags.includes(tag)) {
        return prevTags.filter((t) => t !== tag);
      } else {
        return [...prevTags, tag];
      }
    });
  };

  //등록하기 클릭 시 등록 팝업 열기
  const openModalHandler = (e) => {
    setIsModalOpen(true);
  };
  //console.log(modalIs)
  const closeModalHandler = (e) => {
    setIsModalOpen(false);
    setIsDetailOpen(false);
  };

  const filterResetHandler = () => {
    setSelRegions([]);
    setSelTags([]);
  };

  const openMyPlaceDetailHandler = (item) => {
    setIsDetailOpen(true);
    setSelDetailData(item);
  };

  return (
    <>
      {isDetailOpen && (
        <ModalBox>
          <DetailModal
            selDetailData={selDetailData}
            closeModalHandler={closeModalHandler}
            type={"private"}
          />
        </ModalBox>
      )}
      {isModalOpen && (
        <ModalBox ref={addModalRef}>
          <AddModal closeModalHandler={closeModalHandler} />
        </ModalBox>
      )}

      {isLoaded ? (
        <div className={`${classes["places-wrap"]}`}>
          <FilterBox title={`지역 선택`}>
            <SlideFilter
              typeList={regionList}
              selTypes={selRegions}
              typeClick={regionClickHandler}
              infinite={false}
              prevArrow={false}
              nextArrow={true}
            />
          </FilterBox>
          {tagList.length > 0 && (
            <FilterBox title={`태그 선택`}>
              <SlideFilter
                typeList={tagList}
                selTypes={selTags}
                typeClick={tagClickHandler}
                infinite={false}
                prevArrow={false}
                nextArrow={true}
              />
            </FilterBox>
          )}
          <span className={`${classes["divide-line"]}`}></span>
          <SelFilterBox
            regionList={regionList}
            selRegions={selRegions}
            regionClickHandler={regionClickHandler}
            tagList={tagList}
            selTags={selTags}
            tagClickHandler={tagClickHandler}
            filterResetHandler={filterResetHandler}
          />
          <span className={`${classes["divide-line"]}`}></span>
          <div className={`${classes["add-btn-box"]}`}>
            <button onClick={openModalHandler}>
              <span className={`hidden`}>등록하기</span>
              <i className={`xi-border-color`}></i>
            </button>
            {/* <Button
              title ={`등록하기`}
              size ={`big`}
         
              /> */}
          </div>

          <PlacesBox
            myPlaces={myPlaces}
            selRegions={selRegions}
            tagList={tagList}
            selTags={selTags}
            openModalHandler={openModalHandler}
            openMyPlaceDetailHandler={openMyPlaceDetailHandler}
          />
        </div>
      ) : (
        <LoadingBox title={`데이터를 불러오는 중입니다.`} height={`500px`} />
      )}
    </>
  );
};

export default MyPlacesPage;
