import React, { useEffect, useState } from "react";
import { fetchPublicPlaces } from "@/src/lib/publicPlaces/publicPlacesApi";
import LoadingBox from "../LoadingBox/LoadingBox";
import classes from "./PublicPlacesBox.module.css";
import Image from "next/image";
const PublicPlacesBox = ({ selectedValue, openPublicPlaceDetailHandler }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [publicPlaces, setPublicPlaces] = useState([]);
  useEffect(() => {
    const loadData = async () => {
      const publicPlacesData = await fetchPublicPlaces(selectedValue);
      setPublicPlaces(publicPlacesData);
      setIsLoaded(true);
    };
    loadData();
  }, [selectedValue]);

  return (
    <>
      {isLoaded ? (
        <div className={`${classes["places-box"]}`}>
          <ul>
            {publicPlaces.map((item) => {
              const imagePath = item.image_paths?.split(",")[0]; // 'upload/...'로 시작하는 경로

              const relativePath = imagePath?.startsWith("upload/")
                ? imagePath // 'upload/'로 시작하는 경로는 그대로 사용
                : imagePath?.replace(/^.*\/upload\//, "/upload/");

              const encodedPath = relativePath
                ? encodeURIComponent(relativePath)
                : "";

              return (
                <li
                  key={item.idx}
                  className={`${classes["place-item"]}`}
                  onClick={() => {
                    openPublicPlaceDetailHandler(item);
                  }}
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
            {publicPlaces.length < 1 && (
              <li className={`${classes["place-item-empty"]}`}>
                공개 장소가 존재하지 않습니다.
                <br />
                멋진 장소를 공유해주세요.
              </li>
            )}
          </ul>
        </div>
      ) : (
        <LoadingBox title={`데이터를 불러오는 중입니다.`} height={`500px`} />
      )}
    </>
  );
};

export default PublicPlacesBox;
