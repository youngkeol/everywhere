import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import { useMediaQuery } from "react-responsive";
import classes from "./SlideFilter.module.css";
import { PrevArrow, NextArrow } from "./Arrow";
import "slick-carousel/slick/slick.css";

const SlideFilter = ({
  typeList,
  selTypes,
  typeClick,
  showAll,
  infinite,
  prevArrow,
  nextArrow,
}) => {
  //const isSmallScreen = useMediaQuery({ query: "(max-width: 1280px)" });
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    // 컴포넌트가 클라이언트에서만 렌더링되도록 설정
    setIsClient(true);
  }, []);


  const settings = {
    dots: false,
    infinite: infinite,
    speed: 300,
    //slidesToShow: 7,
    slidesToScroll: 1,
    initialSlide: 0,
    variableWidth: true,
    easing: "ease", // 부드러운 애니메이션 효과
    swipeToSlide: true,
    prevArrow: prevArrow ? <PrevArrow /> : false, // 조건에 따라 이전 버튼 표시/숨기기
    nextArrow: nextArrow ? <NextArrow /> : false, // 조건에 따라 다음 버튼 표시/숨기기
    //className: `${classes['slide-filter-cover']}`
  };

  // 클라이언트에서만 렌더링되도록 하기 위해 isClient 체크
  if (!isClient) {
    return null;
  }

  return (
    <div
      className={`${classes["slide-filter-box"]} ${
        prevArrow ? classes["has-prev-arrow"] : ""
      } ${nextArrow ? classes["has-next-arrow"] : ""}`}
    >
      <Slider className={`${classes["item-box"]}`} {...settings} inert>
        {showAll && (
          <div
            onClick={() => typeClick(0)}
            className={
              selTypes.length === 0
                ? `${classes.ac} ${classes.item}`
                : `${classes.item}`
            }
            style={{ margin: "0 10px !important" }}
          >
            전체
          </div>
        )}

        {typeList.map((item) => {
          return (
            <div
              key={item.idx}
              className={
                selTypes.includes(item.idx)
                  ? `${classes.ac} ${classes.item}`
                  : `${classes.item}`
              }
              onClick={() => {
                typeClick(item.idx);
              }}
              style={{ margin: "0 10px !important", textAlign: "center" }}
            >
              {item.type}
            </div>
          );
        })}
      </Slider>
    </div>
  );
};

export default SlideFilter;
