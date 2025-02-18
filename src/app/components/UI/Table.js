import React from 'react';
import classes from './Table.module.css';


const Table = ({children}) => {
  return (
    <div className={classes['table-box']}>
        {children}
    </div>
  );
};

export default Table;