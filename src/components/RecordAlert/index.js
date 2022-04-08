import React from 'react';
import styled from 'styled-components';
import {render} from 'react-dom';
import './style.scss';
import svgIcons from '../../constants/svgIcon';

function RecordAlert() {
  const handleRunGuide = () => {
    window.open(`http://just-link.us/web/info.php`);
  };
  const handleSetupGuide = () => {
    window.open(`http://just-link.us/web/info.php`);
  };

  function detectExtension(extensionId, callback) {
    let img = new Image();
    img.src =
      'chrome-extension://' +
      extensionId +
      '/assets/images/hide-cursoractive.svg';
    img.onload = function() {
      callback(true);
    };
    img.onerror = function() {
      callback(false);
    };
  }
  const handleInstallGuide = () => {
    const extensionId = 'kbbdabhdfibnancpjfhlkhafgdilcnji';
    detectExtension(extensionId, (result) => {
      if (result) {
        alert('녹화 플러그인 설치되어 있으니 확장 프로그램 댑에서 실행해주세요.');
      } else {
        if (window.confirm('녹화 플러그인 설치가 필요합니다. \r\n 확인을 누르면 설치페이지로 이동합니다.'))
        {
          window.open(`https://chrome.google.com/webstore/detail/screenity-screen-recorder/${extensionId}`);
        } else {
          return null;
        }
      }
    });
  };
  const modal = (
    <WrapperAlert>
      <div className="container-alert">
        <i className="clear-icon" onClick={(e) => closeEvent(e)}>
          {<svgIcons.close />}
        </i>
        <h3 className="container-alert__title">안내페이지로 이동합니다</h3>
        <div className="container-alert__btn1">
          <button
            className="container-alert__btn--cancel"
            onClick={() => {
              handleRunGuide();
            }}
          > 실행안내
          </button>

          <button
            className="container-alert__btn--accept"
            onClick={() => {
              handleSetupGuide();
            }}
          >
            설치안내
          </button>
        </div>
        <div className="container-alert__btn2">
          <button
            className="container-alert__btn--cancel"
            onClick={() => {
              handleInstallGuide();
            }}
          >
          설치페이지 이동하기
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
export default RecordAlert;
