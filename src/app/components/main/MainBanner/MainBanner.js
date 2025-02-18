"use client";
import React, { useEffect, useState } from "react";
import classes from "./MainBanner.module.css";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import { fetchAreaList } from "@/src/lib/myPlaces/myPlacesApi";
import Image from "next/image";
import { useRouter } from "next/navigation";

const MainBanner = () => {
  const [areaList, setAreaList] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const router = useRouter();
  useEffect(() => {
    const loadData = async () => {
      try {
        const areaListData = await fetchAreaList();
        setAreaList(areaListData);
      } catch (error) {
        console.error("Failed to fetch area list:", error);
      } finally {
        setLoaded(true);
      }
    };
    loadData();
  }, []);

  const settings = {
    dots: false,
    infinite: true,
    slidesToScroll: 1,
    initialSlide: 1,
    variableWidth: true,
    easing: "ease",
    swipeToSlide: true,
    autoplay: true,
    speed: 500,
    autoplaySpeed: 3000,
    cssEase: "linear"
  };

  const moveMyplaceHandler = ()=> {
    router.push(`/myPlaces`);
  }

  if (!loaded) {
    return <div></div>;
  }

  return (
    <div className={`${classes["my-swiper"]}`}>
      <Slider className={`${classes["swiper-wrapper"]}`} {...settings} inert>
        {areaList.map((item, index) => (
          <div key={index} className={classes["swiper-slide"]}>
            <div className={classes["banner-box-link"]}
              onClick={moveMyplaceHandler}
            >
              <div className={classes["banner-con"]}>
                <div className={classes["banner-image-box"]}>
                  <Image
                    width={80}
                    height={80}
                    src={`/images/main/banner/${item.eng_name}.png`} // 이미지 URL을 동적으로 처리
                    alt={item.name || "지역"}
                  />
                </div>
                <div className={classes["banner-txt-box"]}>
                  <h3>{item.name || "지역 이름"}</h3>
                  <p>{item.description || "지역 설명"}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default MainBanner;