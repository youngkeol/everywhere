import React from "react";
import classes from "./Accordion.module.css";

const Accordion = ({ noticeList, selType, selConIdxArr, conClick }) => {
  return (
    <div className={`${classes["accordion-content"]}`}>
      <div className={`${classes["accordion-box"]}`}>
        <ul>
          {noticeList
            .filter((notice) => selType === 0 || notice.type_idx == selType)
            .map((notice) => {
              return (
                <li
                  className={
                    selConIdxArr.includes(notice.idx)
                      ? `${classes.active}`
                      : `${classes["accordion-row"]}`
                  }
                  key={notice.idx}
                  onClick={() => conClick(notice.idx)}
                >
                  <dl>
                    <dt className={`${classes["accordion-tit"]}`}>
                      <ol>
                        <li>
                          <span className={`${classes["accordion-type"]}`}>
                            {notice.type}
                          </span>
                        </li>
                        <li> {notice.title}</li>
                        <li>{notice.reg_date}</li>
                        <li>
                          <i
                            className={`${classes["accordion-more"]} ${
                              selConIdxArr.includes(notice.idx)
                                ? "xi-minus-min"
                                : "xi-plus-min"
                            }`}
                          ></i>
                        </li>
                      </ol>
                    </dt>

                    <dd
                      className={`${classes["accordion-con"]}`}
                      dangerouslySetInnerHTML={{ __html: notice.contents }}
                    />
                    {/*                     
                    <dd className={`${classes["accordion-con"]}`}>
                      {notice.contents}
                    </dd> 
                    */}
                  </dl>
                </li>
              );
            })}
        </ul>
      </div>
    </div>
  );
};

export default Accordion;
