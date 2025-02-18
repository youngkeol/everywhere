"use client";
import classes from "./home.module.css";
import MainBanner from "../components/main/MainBanner/MainBanner";
import Table from "../components/UI/Table";
import MainRecentPosts from "../components/main/MainRecentPosts/MainRecentPosts";
import MainRecentNotices from "../components/main/MainRecentNotices/MainRecentNotices";
import MainMap from "../components/main/MainMap/MainMap";
import { useState } from "react";
import ModalBox from "../components/UI/ModalBox";
import DetailModal from "../components/DetailModal/DetailModal";

export default function Home() {
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selDetailData, setSelDetailData] = useState();
  const openPlaceDetailHandler = (place) => {
    setSelDetailData(place);
    setIsDetailOpen(true)
  }
  const closePlaceDetailHandler = () => {
    setSelDetailData([]);
    setIsDetailOpen(false)
  }
  return (
    <>
      {isDetailOpen && (
        <ModalBox>
          <DetailModal 
            selDetailData={selDetailData}
            closeModalHandler={closePlaceDetailHandler}
            type={'private'}
          />
        </ModalBox>
      )}

      <div className={classes["main-box-wrapper"]}>
        {/* introduce-box */}
        <div className={classes["introduce-box"]}>
          <h2 className={classes["introduce-tit"]}>
            일상의 특별함을 공유하는 공간<span>이곳저곳</span>
            <span>에 오신걸 환영합니다.</span>
          </h2>
          <p className={classes["introduce-con"]}>
            나만의 매력적인 장소를 기록해 보세요.
          </p>
        </div>
        {/* //introduce-box */}

        {/* banner-box */}
        <div className={classes["banner-box"]}>
          <MainBanner />
        </div>
        {/* //banner-box */}

        {/* recent-box */}
        <div className={classes["recent-box"]}>
          <h3 className={classes["tit"]}>최근 등록 목록</h3>
          <Table>
            <MainRecentPosts 
              openDetailPlace = {openPlaceDetailHandler}
            />
          </Table>
        </div>
        {/* //recent-box */}

        {/* notice-box */}
        <div className={classes["notice-box"]}>
          <h3 className={classes["tit"]}>최근 공지사항</h3>
          <Table>
            <MainRecentNotices />
          </Table>
        </div>
        {/* //notice-box */}

        {/* map-box */}
        <div className={classes["map-box"]}>
          <h3 className={classes["tit"]}>나의 지도</h3>
          <MainMap 
            openDetailPlace = {openPlaceDetailHandler}
          />
        </div>
        {/* //map-box */}
      </div>
    </>
  );
}
