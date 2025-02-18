"use client";
import { useState, useEffect, useRef } from "react";
import { Map, MapMarker } from "react-kakao-maps-sdk";

export default function KakaoMap({ lat, lng, address }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const mapRef = useRef(null); // Map 객체를 참조하기 위한 ref

  useEffect(() => {
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
  }, []);

  // lat, lng 값이 변경될 때 지도의 중심을 업데이트
  useEffect(() => {
    if (isLoaded && mapRef.current) {
      mapRef.current.setCenter(new window.kakao.maps.LatLng(lat, lng));
    }
  }, [lat, lng, isLoaded]);

  if (!isLoaded) {
    return <div>지도 불러오는 중...</div>;
  }

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <Map
        center={{ lat: lat, lng: lng }}
        style={{ width: "100%", height: "100%" }}
        level={3} // 확대/축소 수준
        onCreate={(map) => {
          map.relayout(); // 지도 크기 재설정
        }}
      >
        <MapMarker
          position={{ lat: lat, lng: lng }}
          image={{
            src: "/images/common/marker.png", // 사용자 정의 마커 이미지 경로
            size: { width: 30, height: 30 }, // 마커 이미지 크기
            //options: { offset: { x: 15, y: 30 } }, // 마커 중심점 위치 조정
          }}
        ></MapMarker>
      </Map>
    </div>
  );
}
