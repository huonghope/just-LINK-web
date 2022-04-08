import React, {useEffect, useState} from 'react';
import './style.scss';

function List(props) {
  const {
    callback,
    show,
    icon,
    category,
    text,
    hover,
  } = props;
  const newClass = 'dropup-content-'+ category;
  const newContainerClass = 'list-container-'+ category;

  return (
    <>
      {icon && <img onClick={() =>{callback();}} src={icon} alt="list" />}
      {text && <p onClick={()=>{callback();}}>{text}</p>}
      {
        !hover ?
        <div className={newContainerClass}>
          <div className={newClass} style={show?{display: 'block'}:{display: 'none'}}>
            {props.children}
          </div>
        </div> :
        <div className={newContainerClass}>
          <div className={newClass}>
            {props.children}
          </div>
        </div>
      }
    </>
  );
}

export default List;
