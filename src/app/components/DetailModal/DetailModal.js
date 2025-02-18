import React, { useEffect } from "react";
import Image from "next/image";
import classes from "./DetailModal.module.css";
import Button from "../UI/Button";
import KakaoMap from "../KakaoMap/KakaoMap";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import { fetchDelPost } from "@/src/lib/myPlaces/myPlacesApi";
const DetailModal = ({ selDetailData, closeModalHandler, type }) => {

  useEffect(()=>{
    const bodyElement = document.body;
      bodyElement.style.overflow = "hidden";
    return () => {
      bodyElement.style.overflow = "auto"; 
    }
  }, [])


  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    slidesPerRow: 1,
    easing: "ease", // 부드러운 애니메이션
    // dots: false, // dot 표시
    // infinite: false, // 무한 스크롤 비활성화
    // speed: 300, // 슬라이드 전환 속도
    // slidesToShow: 1, // 한 번에 하나의 콘텐츠만 표시
    // slidesToScroll: 1, // 한 번에 한 개씩 슬라이드
    // initialSlide: 1, // 첫 번째 슬라이드에서 시작
    // variableWidth: false, // 콘텐츠의 가변 너비
    // easing: "ease", // 부드러운 애니메이션
    // swipeToSlide: true, // 슬라이드를 스와이프할 수 있도록 설정
    // slidesPerRow:1,
    // dots를 커스터마이즈하여 점(dot)으로 표시
    customPaging: function (i) {
      return (
        <div className={classes["slick-dot-item"]}></div> // 활성화된 dot에 스타일 추가
      );
    },
    appendDots: (dots) => {
      return (
        <div>
          <ul className={classes["slick-dots-list"]}>
            {dots.map((dot, index) => {
              // 'slick-active' 클래스가 포함되면 active 스타일 추가
              const isActive = dot.props.className.includes("slick-active");
              return React.cloneElement(dot, {
                className: `${dot.props.className} ${
                  isActive ? classes["slick-dot-item-active"] : ""
                }`, // 활성화된 도트에 추가 스타일
              });
            })}
          </ul>
        </div>
      );
    },
  };


  const delPlaceHandler = async(selDetailData) => {
    const isConfirmed = window.confirm("정말로 삭제하시겠습니까?");

    if (!isConfirmed) {
      return; // 사용자가 취소를 누른 경우 삭제를 중단
    }
    try{

      const response = await fetchDelPost(selDetailData.idx);
      
      if (response.redirectUrl) {
        alert("나의 장소 삭제 성공")
        window.location.href = response.redirectUrl; // 브라우저에서 직접 이동
      } else {
        alert("나의 장소 삭제 실패")
        throw new Error("fetchDelPost 호출 실패");
      }
    } catch(error) {
      alert("나의 장소 삭제 실패(오류 발생)")
    }

  } 

  return (
    <div>
      <div className={`${classes["modal-header"]}`}>
        <h3 className={`${classes["modal-tit"]}`}>{selDetailData.title}</h3>
        <button
          className={`${classes["modal-close-btn"]}`}
          onClick={closeModalHandler}
        >
          <i className={`xi-close-min`}></i>
        </button>
      </div>
      <div className={`${classes["modal-body"]}`}>
        <div className={`${classes["modal-each-con"]}`}>
          <Slider {...settings} inert className={`${classes["modal-slider"]}`}>
            <div className={`${classes["modal-detail-address-box"]}`}>
              <div className={`${classes["modal-detail-map"]}`}>
                <KakaoMap
                  lat={selDetailData.lat}
                  lng={selDetailData.lng}
                  address={selDetailData.address}
                />
              </div>
              <div className={`${classes["modal-detail-address"]}`}>
                {selDetailData.address}
              </div>
            </div>
            {selDetailData.image_paths &&
              selDetailData.image_paths.split(",").map((item, index) => (
                <div
                  className={`${classes["modal-detail-img-box"]}`}
                  key={index}
                >
                  <Image
                    src={`/api/images?filename=${item}`}
                    alt={`${item}`}
                    width={300} // 이미지의 너비
                    height={300} // 이미지의 높이
                    objectFit="contain"
                  />
                </div>
              ))}
          </Slider>
        </div>
        {selDetailData.contents && selDetailData.contents.trim() !== "" && (
          <div className={`${classes["modal-each-con"]}`}>
            <div
              className={`${classes["modal-detail-contents"]}`}
              dangerouslySetInnerHTML={{ __html: selDetailData.contents }}
            />
          </div>
        )}
        {selDetailData.tag_names && (
          <div className={`${classes["modal-each-con"]}`}>
            <ul className={`${classes["modal-detail-tag"]}`}>
              {selDetailData.tag_names.split(",").map((item, index) => (
                <li key={index}>
                  <span>#</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}
        {type && type == "private" && (
          <div className={`${classes["modal-each-con"]}`}>
            <div className={`${classes["modal-detail-open"]}`}>
              {selDetailData.open_flag == 1 ? (
                <>
                  ** 현재 작성된 내용은 <span>공개된 상태로</span> 다른
                  사용자에게 추천되거나 목록에 표시될 수 있습니다
                </>
              ) : (
                <>
                  ** 현재 작성된 내용은 <span>비공개된 상태로</span> 다른
                  사용자에게 표시되지 않습니다.
                </>
              )}
            </div>
          </div>
        )}
      </div>
      {type && type == "private" && (

        <div className={`${classes["modal-footer"]}`}>
        <Button
          title={`삭제하기`}
          size={`big`}
          color={`red`}
          onClick={()=>delPlaceHandler(selDetailData)}
          />
      </div>
        )}
    </div>
  );
};

export default DetailModal;
