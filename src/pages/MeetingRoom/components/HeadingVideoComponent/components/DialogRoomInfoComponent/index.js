import React, {useState, useEffect} from 'react';
import styled from 'styled-components';
import {useTranslation} from 'react-i18next';

import DialogContainer from '../DialogContainer';
import roomSelector from '../../../../MeetingRoom.Selector';
import {useSelector} from 'react-redux';
import svgIcons from '../../../../../../constants/svgIcon';
function DialogRoomInfoComponent({handleClickShowMore, showSplitOption}) {
  const {t, i18n} = useTranslation();
  const [showDialog, setShowDialog] = useState(false);
  const roomInfoStore = useSelector(roomSelector.selectRoomInfo);
  const [roomInfo, setRoomInfo] = useState();
  const [viewPassword, setViewPassword] = useState(false);

  useEffect(() => {
    setRoomInfo(roomInfoStore);
  }, [roomInfoStore]);

  useEffect(() => {
    if (showSplitOption === 'info') {
      setShowDialog(true);
    } else {
      setShowDialog(false);
    }
  }, [showSplitOption]);

  const handleClickShowDialog = () => {
    setShowDialog(!showDialog);
    handleClickShowMore('info');
  };

  const copyLink = () => {
    let dummy = document.createElement('input');
    document.body.appendChild(dummy);
    dummy.value = `${process.env.REACT_APP_DOMAIN}?link=${roomInfo.invite_code}`;
    dummy.select();
    document.execCommand('copy');
    document.body.removeChild(dummy);
    setShowDialog(false);
    alert('링크가 복사되었습니다.');
  };
  return (
    <RoomInfoDiv>
      <div onClick={() => handleClickShowDialog()}>
        <svgIcons.info />
        <span>{t('mainPage.headerComponent.roomInfoContainer.title')}</span>
      </div>
      {
        showDialog &&
        <DialogContainer>
          {
            roomInfo &&
            <RoomInfoDivContent>
              <div>
                <p>{t('mainPage.headerComponent.roomInfoContainer.roomName')}</p>
                <p>{t('mainPage.headerComponent.roomInfoContainer.rommPassword')}</p>
                <p>{t('mainPage.headerComponent.roomInfoContainer.roomlink')}</p>
              </div>
              <div>
                <p>{roomInfo.room_name}</p>
                <p>{!roomInfo.password ? '없음' :
                  <>
                    {viewPassword ? roomInfo.password : '***'}
                    <button onClick={() => setViewPassword(!viewPassword)}>
                      <i className={viewPassword ? 'fa fa-eye' : 'fa fa-eye-slash'} />
                    </button>
                  </>
                }
                </p>
                <p onClick = {() => copyLink()}>{`${process.env.REACT_APP_DOMAIN}?link=${roomInfo.invite_code}`}</p>
              </div>
            </RoomInfoDivContent>
          }
        </DialogContainer>
      }
    </RoomInfoDiv>
  );
}
const RoomInfoDiv = styled.div`
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

const RoomInfoDivContent = styled.div`
  display: flex;
  div:first-child{
    margin-right: 10px;
  }
  div:nth-child(2){
    p{
      font-weight: 100;
      max-width: 200px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      text-align: left;
    }
    button{
      cursor: pointer;
      background: transparent;
      border: none;
      color: white;
      margin-left: 5px;
    }
  }
  p{
    width: max-content;
    font-size: 14px;
  }

`;
DialogRoomInfoComponent.propTypes = {

};

export default DialogRoomInfoComponent;

