import React, { useEffect, useState } from "react";
import classes from "./MainMap.module.css";
import { fetchMyPlaces } from "@/src/lib/myPlaces/myPlacesApi";
import LoadingBox from "../../LoadingBox/LoadingBox";
import {
  Map,
  MapMarker,
  MarkerClusterer,
  CustomOverlayMap,
} from "react-kakao-maps-sdk";

const MainMap = ({openDetailPlace}) => {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hoveredMarker, setHoveredMarker] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const result = await fetchMyPlaces();
        setData(result);

        if (!window.kakao) {
          // 카카오 지도 SDK 로드
          const kakaoMapScript = document.createElement("script");
          kakaoMapScript.async = false;
          kakaoMapScript.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_MAP_KEY}&autoload=false&libraries=services,clusterer`;
          document.head.appendChild(kakaoMapScript);

          kakaoMapScript.addEventListener("load", () => {
            window.kakao.maps.load(() => {
              setIsLoaded(true);
            });
          });
        } else {
          // 이미 로드된 경우
          window.kakao.maps.load(() => {
            setIsLoaded(true);
          });
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("데이터를 불러오는 데 실패했습니다.");
      }
    };
    loadData();
  }, []);

  const handleMarkerHover = (post) => {
    setHoveredMarker({ ...post, yAnchor: 1 }); // 마커 위에 마우스를 올리면 해당 마커 데이터 설정
  };

  const handleMarkerOut = () => {
    setHoveredMarker(null); // 마우스가 마커에서 떠나면 상태 초기화
  };

  return (
    <div id="main-map" className={classes["map"]}>
      {!isLoaded && (
        <LoadingBox height={"100%"} title="데이터를 불러오는 중입니다." />
      )}
      {error && (
        <LoadingBox
          height={"100%"}
          title="데이터를 불러오는 데 실패했습니다."
        />
      )}
      {isLoaded && (
        <Map
          center={{
            // 지도의 중심좌표
            lat: 36.2683,
            lng: 127.6358,
          }}
          style={{ width: "100%", height: "100%" }}
          level={13} // 확대/축소 수준
          onCreate={(map) => {
            map.relayout(); // 지도 크기 재설정
          }}
        >
          <MarkerClusterer
            averageCenter={true} // 클러스터에 포함된 마커들의 평균 위치를 클러스터 마커 위치로 설정
            minLevel={4} // 클러스터 할 최소 지도 레벨
            styles={[
              {
                // calculator 각 사이 값 마다 적용될 스타일을 지정한다
                width: "30px",
                height: "30px",
                lineHeight: "1.8",
                background: "rgba(105, 180, 152, 1)",
                borderRadius: "100%",
                color: "#fff",
                textAlign: "center",
                fontWeight: "bold",
                fontSize: "14px",
                border: "3px solid #3f846a",
              },
            ]}
          >
            {data &&
              data.map((post) => (
                <MapMarker
                  key={post.idx}
                  position={{
                    lat: parseFloat(post.lat),
                    lng: parseFloat(post.lng),
                  }}
                  image={{
                    src: "/images/common/marker.png", // 사용자 정의 마커 이미지 경로
                    size: { width: 30, height: 30 }, // 마커 이미지 크기
                    // options: { offset: { x: 15, y: 30 } }, // 마커 중심점 위치 조정
                  }}
                  onMouseOver={() => handleMarkerHover(post)}
                  onMouseOut={handleMarkerOut}
                  onClick={()=> openDetailPlace(post)}
                ></MapMarker>
              ))}
          </MarkerClusterer>
          {hoveredMarker && (
            <CustomOverlayMap
              position={{
                lat: parseFloat(hoveredMarker.lat),
                lng: parseFloat(hoveredMarker.lng),
              }}
              xAnchor={0.5}
              yAnchor={1.4}
            >
              <div className={classes["customoverlay"]}>
                <div className={classes["customoverlay-tit"]}>
                  {hoveredMarker.title}
                </div>
                <div className={classes["customoverlay-address"]}>
                  {hoveredMarker.address}
                </div>
                {hoveredMarker.tag_names && (
                  <ul className={classes["customoverlay-tags"]}>
                    {hoveredMarker.tag_names.split(",").map((tag, index) => (
                      <li key={index}>{tag.trim()}</li> // trim()으로 공백 제거
                    ))}
                  </ul>
                )}
              </div>
            </CustomOverlayMap>
          )}
        </Map>
      )}
    </div>
  );
};

export default MainMap;
