import React from "react";
import classes from "./SelFilterBox.module.css";

const SelFilterBox = ({
  regionList,
  selRegions,
  tagList,
  selTags,
  filterResetHandler,
  tagClickHandler,
  regionClickHandler,
}) => {
  const filterRegions = regionList.filter((region) => {
    return selRegions.includes(region.idx);
  });

  const filterTags = tagList.filter((tag) => {
    return selTags.includes(tag.idx);
  });

  return (
    <div className={`${classes["sel-filter-box"]}`}>
      <ul>
        {filterRegions && filterRegions.length > 0 ? (
          filterRegions.map((region) => {
            return (
              <li
                className={`${classes["sel-filter"]}`}
                key={region.idx}
                onClick={() => regionClickHandler(region.idx)}
              >
                <span>{region.type}</span>
                <button className={`${classes["close-btn"]}`}>
                  <i className={`xi-close-min`} />
                </button>
              </li>
            );
          })
        ) : (
          <li className={`${classes["sel-filter"]} ${classes["sel-default-filter"]} `}>
            <span>지역 전체</span>
          </li>
        )}
        <li className={`${classes["sel-filter-dash"]}`}></li>
        {filterTags && filterTags.length > 0 ? (
          filterTags.map((tag) => {
            return (
              <li
                className={`${classes["sel-filter"]}`}
                key={tag.idx}
                onClick={() => tagClickHandler(tag.idx)}
              >
                <span>{tag.type}</span>
                <button className={`${classes["close-btn"]}`}>
                  <i className={`xi-close-min`} />
                </button>
              </li>
            );
          })
        ) : (
          <li className={`${classes["sel-filter"]} ${classes["sel-default-filter"]}`}>
            <span>태그 전체</span>
          </li>
        )}

        <li
          className={`${classes["sel-filter"]} ${classes["reset-btn-box"]}`}
          onClick={filterResetHandler}
        >
          <span>필터 초기화</span>
          <button className={`${classes["reset-btn"]}`}>
            <i className={`xi-redo xi-rotate-180`} />
          </button>
        </li>
      </ul>
    </div>
  );
};

export default SelFilterBox;
