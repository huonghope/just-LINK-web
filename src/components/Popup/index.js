import React, {useEffect} from 'react';
import styled from 'styled-components';
import {render} from 'react-dom';
import './style.scss';
import svgIcons from '../../constants/svgIcon';

function Popup({content}) {
  const modal = (
    <WrapperPopup>
      <div className="container-popup">
        <i className="clear-icon" onClick={(e) => closeEvent(e)}>
          {<svgIcons.close />}
        </i>
        <h3 className="container-alert__title">
          {content}
        </h3>
      </div>
    </WrapperPopup>
  );

  setTimeout(() => {
    closeEvent();
  }, 2 * 1000);

  const divContainer = document.createElement('div');
  document.body.appendChild(divContainer);

  function closeEvent(e) {
    divContainer.removeEventListener('keydown', closeEvent);
    removeDom();
  }
  function removeDom() {
    try {
      document.body.removeChild(divContainer);
    } catch (error) {
      // console.log(error);
    }
  }
  render(modal, divContainer);
}
const WrapperPopup = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  // background: rgba(0, 0, 0, 0.5);
  z-index: 100;
`;
export default Popup;
