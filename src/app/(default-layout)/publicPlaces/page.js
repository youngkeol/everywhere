"use client";
import React, { useEffect, useState, useRef } from "react";
import LoadingBox from "@/src/app/components/LoadingBox/LoadingBox";
import { fetchAreaList, fetchMyPlaces } from "@/src/lib/myPlaces/myPlacesApi";
import CustomSelect from "../../components/CustomSelect/CustomSelect";
import classes from "./publicPlaces.module.css";
import PublicPlacesBox from "../../components/PublicPlacesBox/PublicPlacesBox";
import ModalBox from "../../components/UI/ModalBox";
import DetailModal from "../../components/DetailModal/DetailModal";
const PublicPlacesPage = () => {
  const [isLoaded, setIsLoaded] = useState(false);

  const [regionList, setRegionList] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState("");
  const [selDetailData, setSelDetailData] = useState();
  const [isDetailOpen, setIsDetailOpen] = useState(false);

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

        setIsLoaded(true);
      } catch (error) {
        console.log(error);
      }
    };

    loadData();
  }, []);
  const selectedHandler = ({ idx, type }) => {
    setSelectedRegion({ idx, type });
  };
  const closeModalHandler = (e) => {
    setIsDetailOpen(false);
  };
  const openPublicPlaceDetailHandler = (item) => {
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
          />
        </ModalBox>
      )}

      {isLoaded ? (
        <>
          <div className={classes["search-box"]}>
            <div>다른 사람들이 공개한,</div>
            <div>
              <CustomSelect
                selectedValue={selectedRegion}
                selectedHandler={selectedHandler}
                options={regionList}
              />
              을 알려드릴게요
            </div>
          </div>
          <PublicPlacesBox
            selectedValue={selectedRegion}
            openPublicPlaceDetailHandler={openPublicPlaceDetailHandler}
          />
        </>
      ) : (
        <LoadingBox title={`데이터를 불러오는 중입니다.`} height={`500px`} />
      )}
    </>
  );
};

export default PublicPlacesPage;
