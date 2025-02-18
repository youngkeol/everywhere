import React from 'react';
import classes from './find.module.css'
const FindPage = () => {
  return (
    <div className={classes['find-content-box']}>
      <div className={classes['find-header']}>
        <span><i></i></span>
        <h2>아이디ㅂ</h2>
      </div>
      <div className={classes['find-body']}>
        <h3 className={classes['find-tit']}>
        가입하신 이메일을 입력하시면 아이디/패스워드 메일을 발송해드립니다.
        </h3>
      </div>
      <div className={classes['find-footer']}>

      </div>
    </div>
  );
};

export default FindPage;