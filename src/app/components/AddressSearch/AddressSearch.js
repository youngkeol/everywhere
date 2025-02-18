"use client";

import React, { useState } from "react";
import { useDaumPostcodePopup } from "react-daum-postcode";
import classes from "./AddressSearch.module.css";

const AddressSearch = ({ address, chageAddressHandler }) => {
  const postcodeScriptUrl =
    "https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js";
  const open = useDaumPostcodePopup(postcodeScriptUrl);

  const handleComplete = (data) => {
    let fullAddress = data.address;
    let extraAddress = "";
    let localAddress = data.sido + " " + data.sigungu;

    if (data.addressType === "R") {
      if (data.bname !== "") {
        extraAddress += data.bname;
      }
      if (data.buildingName !== "") {
        extraAddress +=
          extraAddress !== "" ? `, ${data.buildingName}` : data.buildingName;
      }
      fullAddress = fullAddress.replace(localAddress, "");
      fullAddress += extraAddress !== "" ? ` (${extraAddress})` : "";
    }
    chageAddressHandler(data); // setAddress를 호출하여 부모 컴포넌트의 상태를 업데이트
  };

  const handleClick = () => {
    open({ onComplete: handleComplete });
  };

  const currentAddressClickHandler = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          getAddressFromCoordinates(latitude, longitude);
        },
        (err) => {
          alert("위치 정보를 가져오는 데 실패했습니다. 위치 권한을 확인하세요.");
          console.error(err);
        }
      );
    } else {
      alert("이 브라우저는 위치 정보를 지원하지 않습니다.");
    }
  };

  // 좌표로부터 주소를 가져오는 함수
  const getAddressFromCoordinates = async (latitude, longitude) => {
    try {
      const url = `https://dapi.kakao.com/v2/local/geo/coord2regioncode.json?x=${longitude}&y=${latitude}`;
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `KakaoAK ${process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID}`,
        },
      });

      if (!response.ok) {
        throw new Error(`API 호출 실패: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log(data);
      
      if (data.documents.length > 0) {
        const address = {
          address: data.documents[0].address_name,
          sido: data.documents[0].region_1depth_name,
          lat: data.documents[0].x,
          lng: data.documents[0].y,
        };
        chageAddressHandler(address);
      } else {
        alert("주소를 찾을 수 없습니다.");
      }
    } catch (err) {
      alert("주소를 찾는 도중 오류가 발생했습니다.");
      console.error(err);
    }
  };

  return (
    <>
      <div className={`${classes["address-input-box"]}`}>
        <i className={`xi-search`}></i>
        <input
          placeholder="도로명, 건물명 또는 지번으로 검색"
          onClick={handleClick}
          value={
            address
              ? `${address.address} ${
                  address.buildingName ? `(${address.buildingName})` : ""
                }`
              : "" // address가 없을 때만 빈 문자열로 설정
          }
          readOnly
        />
      </div>
      <div
        type="button"
        className={`${classes["current-position-btn"]}`}
        onClick={currentAddressClickHandler}
      >
        <i className={`xi-my-location`}></i>
        현재 위치 주소 찾기
      </div>
    </>
  );
};

export default AddressSearch;