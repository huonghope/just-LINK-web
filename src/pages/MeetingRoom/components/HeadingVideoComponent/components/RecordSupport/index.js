import React from 'react';
import {useTranslation} from 'react-i18next';
import styled from 'styled-components';
import svgIcons from '../../../../../../constants/svgIcon';
import RecordAlert from '../../../../../../components/RecordAlert';

function RecordSupport(props) {
  const {t, i18n} = useTranslation();

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
  const handleRecording = async () => {
    RecordAlert();
  };

  return (
    <RecordDiv onClick={() => handleRecording()}>
      <div>
        <svgIcons.recOn />
        <span>{t('mainPage.headerComponent.recordSupport.title')}</span>
      </div>
    </RecordDiv>
  );
}

const RecordDiv = styled.div`
  position: relative;
  > div {
    display: flex;
    flex-direction: row;
    align-items: center;
    cursor: pointer;
    span {
      margin-left: 5px;
    }
  }
`;

export default RecordSupport;
