import React from "react";
import classes from "./PlacesBox.module.css";
import Image from "next/image";
import defaultImg from "@/public/images/common/default_img.png";

const PlacesBox = ({ myPlaces, selRegions, tagList, selTags, openModalHandler, openMyPlaceDetailHandler}) => {
  // 필터링 함수
  const filterMyPlaces = (myPlaces, selRegions, tagList, selTags) => {
    return myPlaces.filter(place => {
      // 조건 1: selRegions와 selTags 모두 없을 때, 모든 데이터 출력
      if (selRegions.length === 0 && selTags.length === 0) {
        return true;
      }

      // 조건 2: selRegions만 있을 때, region_idx만 필터링
      const regionFilter = selRegions.length > 0
        ? selRegions.includes(place.region_idx)
        : true;

      // 조건 3: selTags만 있을 때, tag_names만 필터링
      const tagFilter = selTags.length > 0
        ? place.tag_names
          ? place.tag_names.split(",").some(tag =>
              selTags.includes(tagList.find(item => item.type === tag)?.idx)
            )
          : false // tag_names가 없으면 해당 항목을 제외
        : true;

      // 조건 4: selRegions와 selTags 모두 있을 때, 두 조건을 모두 만족하는 항목만 필터링
      return (selRegions.length > 0 && selTags.length > 0)
        ? (regionFilter && tagFilter) // 둘 다 있을 때는 모두 만족해야 함
        : regionFilter && tagFilter; // 하나라도 있을 때는 해당 조건만 필터링
    });
  };


  // 필터링된 myPlaces
  const filteredMyPlaces = filterMyPlaces(myPlaces, selRegions, tagList, selTags);

  return (
    <div className={`${classes["places-box"]}`}>
      <ul>
        {filteredMyPlaces.map((item) => {
          const imagePath = item.image_paths?.split(",")[0]; // 'upload/...'로 시작하는 경로

          const relativePath = imagePath?.startsWith("upload/")
            ? imagePath // 'upload/'로 시작하는 경로는 그대로 사용
            : imagePath?.replace(/^.*\/upload\//, "/upload/");

          const encodedPath = relativePath
            ? encodeURIComponent(relativePath)
            : "";

          return (
            <li className={`${classes["place-item"]}`} key={item.idx}
              onClick={()=> {openMyPlaceDetailHandler(item)}}
            >
              <div
                className={`${classes["place-item-img-box"]}`}
                style={{ position: "relative" }}
              >
                {encodedPath && encodedPath.length > 0 ? (
                  <Image
                    className={`${classes["place-item-img"]}`}
                    src={`/api/images?filename=${imagePath}`}
                    alt="Protected Image"
                    fill
                    sizes="100%"
                  />
                ) : (
                  <Image
                    className={`${classes["place-item-default-img"]}`}
                    src={defaultImg}
                    alt="default Image"
                  />
                )}
              </div>
              <div className={`${classes["place-item-con-box"]}`}>
                <h3 className={`${classes["place-item-title"]}`}>
                  {item.title}
                </h3>
                <p className={`${classes["place-item-address"]}`}>
                  {item.address}
                </p>
                {item.tag_names && (
                  <div className={`${classes["place-item-tags"]}`}>
                    {item.tag_names.split(",").map((tag, index) => {
                      return <span key={index}>&#35;{tag}</span>;
                    })}
                  </div>
                )}
              </div>
            </li>
          );
        })}
        {filteredMyPlaces.length <1 && 
          <li className={`${classes["place-item-empty"]}`}
            onClick={openModalHandler}
          >
            나의 장소가 존재하지 않습니다.<br/>
            지역을 추가해주세요.
          </li>
        }
      </ul>
    </div>
  );
};

export default PlacesBox;