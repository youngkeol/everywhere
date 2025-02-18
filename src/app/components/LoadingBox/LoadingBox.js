import React from 'react';
import { MoonLoader } from "react-spinners";
import classes from './LoadingBox.module.css';

const LoadingBox = ({height, title}) => {
  return (
    <div className={classes['loading-box']} style={{ height }}>
      <div className={classes['loading-center']}>
        <MoonLoader
          color="rgb(101,180,140)"
          cssOverride={{ margin: "0px auto" }}
          loading
          size={61}
          speedMultiplier={1}
        />
        <p className={classes['loading-info']}>{title}</p>
      </div>
  </div>
  );
};

export default LoadingBox;