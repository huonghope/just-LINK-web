import React, {useState, useEffect} from 'react';
import {useTranslation} from 'react-i18next';
import {useDispatch, useSelector} from 'react-redux';
import styled from 'styled-components';

import DialogContainer from '../DialogContainer';
import svgIcons from '../../../../../../constants/svgIcon';

import headingVideoComponentAction from '../../HeadingVideoComponent.Action';
import headingVideoComponentSelector from '../../HeadingVideoComponent.Selector';

import meetingRoomSelect from '../../../../MeetingRoom.Selector';

function DialogMode({handleClickShowMore, showSplitOption}) {
  const {t, i18n} = useTranslation();
  const [showDialog, setShowDialog] = useState(false);
  const modeType = useSelector(headingVideoComponentSelector.getModeType);
  const remoteStreams = useSelector(meetingRoomSelect.selectRemoteStreams);

  const dispatch = useDispatch();
  useEffect(() => {
    if (showSplitOption === 'mode') {
      setShowDialog(true);
    } else {
      setShowDialog(false);
    }
  }, [showSplitOption]);

  const handleClickShowDialog = () => {
    setShowDialog(!showDialog);
    handleClickShowMore('mode');
  };

  const handleSetMode = (type) => {
    handleClickShowDialog();
    if (!type) return;
    if (modeType === type ) return;

    if (disable33ModeButton || disable43ModeButton) {
      dispatch(headingVideoComponentAction.handleChangeSetMode(type));
    } else {
      alert(t('mainPage.headerComponent.roomModeContainer.disableMessage'));
      return;
    }
  };

  let disable33ModeButton = remoteStreams.length > 4 && remoteStreams.length <= 9;
  let disable43ModeButton = remoteStreams.length > 9 && remoteStreams.length <= 16;

  return (
    <DialogModeDiv>
      <div onClick={() => handleClickShowDialog()}>
        <svgIcons.modeDivision />
        <span>{t('mainPage.headerComponent.roomModeContainer.title')}</span>
      </div>
      {
        showDialog &&
        <DialogContainer diaLogStyled={{transform: `translateX(-80%) translateY(20px)`}} >
          {
            <DialogModeOptionDiv>
              <ul>
                <li className={modeType === '2x2' ? 'mode-active' : ''} onClick={() => handleSetMode('2x2')}>
                  <input type="radio" checked ={ modeType === '2x2'} name="mode-selct"/>
                  <label>2x2</label>
                </li>
                <li className={modeType === '3x3' ? 'mode-active' : ''} checked={disable33ModeButton} onClick={() => handleSetMode('3x3')}>
                  <input type="radio" checked ={ modeType === '3x3'} name="mode-selct"/>
                  <label>3x3</label>
                </li>
                <li className={modeType === '4x4' ? 'mode-active' : ''} checked={disable43ModeButton} onClick={() => handleSetMode('4x4')}>
                  <input type="radio" checked ={ modeType === '4x4'} name="mode-selct"/>
                  <label>4x4</label>
                </li>
              </ul>
            </DialogModeOptionDiv>
          }
        </DialogContainer>
      }
    </DialogModeDiv>
  );
}
const DialogModeDiv = styled.div`
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

const DialogModeOptionDiv = styled.div`
  display: flex;
  div:first-child{
    margin-right: 10px;
  }
  ul {
    display: flex;
    flex-direction: row;
    li {
      display: flex;
      align-items: center;
      justify-content: center;

      flex-direction: column;

      border-radius: 2px;
      width: 50px;
      height: 30px;

    
      margin: 10px 20px;
      [type="radio"]:checked,
      [type="radio"]:not(:checked) {
          position: absolute;
          left: -9999px;
      }
      [type="radio"]:checked + label,
      [type="radio"]:not(:checked) + label
      {
          position: relative;
          padding-left: 28px;
          cursor: pointer;
          line-height: 20px;
          display: inline-block;
          color: #ccc;
      }
      [type="radio"]:checked + label:before,
      [type="radio"]:not(:checked) + label:before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          width: 18px;
          height: 18px;
          border: 1px solid #ddd;
          border-radius: 100%;
          background: #fff;
      }
      [type="radio"]:checked + label:after,
      [type="radio"]:not(:checked) + label:after {
          content: '';
          width: 12px;
          height: 12px;
          background: #037FF3;
          position: absolute;
          top: 4px;
          left: 4px;
          border-radius: 100%;
          -webkit-transition: all 0.2s ease;
          transition: all 0.2s ease;
      }
      [type="radio"]:not(:checked) + label:after {
          opacity: 0;
          -webkit-transform: scale(0);
          transform: scale(0);
      }
      [type="radio"]:checked + label:after {
          opacity: 1;
          -webkit-transform: scale(1);
          transform: scale(1);
      }

    }
    .mode-active label {
      color: white !important;
    }
  }
`;

export default DialogMode;
