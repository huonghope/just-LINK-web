import React, {useState} from 'react';
import styled from 'styled-components';
import {render} from 'react-dom';
import svgIcons from '../../../constants/svgIcon';
import './style.scss';

function FormAlert({title, handleClickAccept, handleClickReject, btnAccept = '확인', btnReject = '취소'}) {
  let usernameInput = '';
  const modal = (
    <WrapperAlert>
      <div className="container-form-alert">
        <i className="clear-icon" onClick={(e) => closeEvent(e)}>
          <svgIcons.close />
        </i>

        <h3 className="container-form-alert__title">{title}</h3>

        <input
          className="container-form-alert__input"
          type="text"
          autoComplete="off"
          onChange={(e) => usernameInput = e.target.value}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              handleClickAccept(usernameInput);
              closeEvent();
            }
          }}
        />

        <div className="container-form-alert__btn">
          <button
            className="container-form-alert__btn--cancel"
            onClick={() => {
              handleClickReject();
              closeEvent();
            }}
          >
            {btnReject}
          </button>
          <button
            className="container-form-alert__btn--accept"
            onClick={() => {
              handleClickAccept(usernameInput);
              closeEvent();
            }}
          >
            {btnAccept}
          </button>
        </div>
      </div>
    </WrapperAlert>
  );

  const divContainer = document.createElement('div');
  document.body.appendChild(divContainer);

  function closeEvent(e) {
    divContainer.removeEventListener('keydown', closeEvent);
    removeDom();
  }

  function removeDom() {
    document.body.removeChild(divContainer);
  }

  render(modal, divContainer);
}

const WrapperAlert = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 100;
`;

export default FormAlert;
