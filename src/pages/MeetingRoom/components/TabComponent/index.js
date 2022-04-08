import React, {useState, useEffect} from 'react';
import {useDispatch, useSelector, connect} from 'react-redux';
import {useTranslation} from 'react-i18next';
import {getSocket} from '../../../rootSocket';
import './style.scss';

import userSelector from '../../../../features/UserFeature/selector';

import tabComponentAction from './TabComponent.Action';
import tabComponentSelector from './TabComponent.Selector';
import tabComponentSocket from './TabComponent.Socket';

import chatComponentSelector from '../ChatComponent/ChatComponent.Selector';

import remoteStreamSelector from '../RemoteStreamContainer/RemoteStreamContainer.Selector';

import svgIcons from '../../../../constants/svgIcon';

function TabComponent({handleOutRoom, handleScreenModeMain, handleStopSharingScreen, handleWhiteBoard, isGuestSharingScreen, remoteStreams}) {
  const dispatch = useDispatch();
  const {t, i18n} = useTranslation();
  const [windowSize, setWindowSize] = useState(false);
  const [whiteBoard, setWhiteBoard] = useState(false);
  const [showTask, setShowTask] = useState(true);

  // const remoteStreams = useSelector(meetingRoomSelect.selectRemoteStreams);
  const myInfo = useSelector(userSelector.selectCurrentUser);
  const shareScreen = useSelector(tabComponentSelector.getShareScreenState);
  const showListUserState = useSelector(tabComponentSelector.getShowListUserState);
  const showWhiteBoard = useSelector(tabComponentSelector.getWhiteBoardState);
  const showChatState = useSelector(tabComponentSelector.getShowChatState);
  const micState = useSelector(tabComponentSelector.getMicState);
  const camState = useSelector(tabComponentSelector.getCamState);
  const numberOfNewMessages = useSelector(chatComponentSelector.selectNumberOfNewMessages);

  // const listUser = useSelector(remoteStreamSelector.selectRemoteStreams);
  const [newMessages, setNewMessages] = useState();

  useEffect(() => {
    if (windowSize) {
      setNewMessages(numberOfNewMessages);
    }
  }, [numberOfNewMessages]);

  useEffect(() => {
    setWhiteBoard(shareScreen);
  }, [shareScreen]);

  // 마이크 이벤트
  const handleChangeMicState = () => {
    try {
      // 음성 이벤트를 처리함
      let micStateValue = !micState;
      let params = {
        status: micStateValue,
        type: 'mic',
      };
      tabComponentSocket.emitUserChangeDeviceStatus(params);
      dispatch(tabComponentAction.handleChangeMicState(micStateValue));
    } catch (e) {
      console.log('some is wrong using handleMicState!');
    }
  };

  // 카메라 이벤트
  const handleChangeCamState = () => {
    try {
      let camStateValue = !camState;
      let params = {
        status: camStateValue,
        type: 'cam',
      };
      tabComponentSocket.emitUserChangeDeviceStatus(params);
      dispatch(tabComponentAction.handleChangeCamState(camStateValue));
    } catch (e) {
      console.log('some is wrong using handleCamState!');
    }
  };

  // 화면 공유 이벤트
  const handleShareScreen = () => {
    try {
      if (myInfo !== undefined) {
        const {user_tp, host_user} = myInfo;
        if (user_tp === 'T' || user_tp === 'I' || host_user === 1 || host_user === 2) {
          if (!shareScreen) {
            handleScreenModeMain();
            // dispatch(tabComponentAction.handleChangeShareScreenState(true));
          } else {
            handleStopSharingScreen();
            dispatch(tabComponentAction.handleChangeShareScreenState(false));
          }
        } else {
          alert('해당기능 사용 권한이 없습니다.');
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  // 캔버스 이벤트
  const handleClickWhiteBoard = () => {
    const {user_tp, host_user} = myInfo;
    if (user_tp === 'T' || user_tp === 'I' || host_user === 1 || host_user === 2) {
      handleWhiteBoard();
    } else {
      alert('해당기능 사용 권한이 없습니다.');
    }
  };

  // 챗팅
  const handleChangeShowChatState = () => {
    let showChatStateConverse = !showChatState;
    dispatch(tabComponentAction.handleChangeShowChatState(showChatStateConverse));
  };

  // 유저 리스트
  const handleChangeShowListUserState = () => {
    let showUserStateConverse = !showListUserState;
    dispatch(tabComponentAction.handleChangeShowListUserState(showUserStateConverse));
  };

  const userListLength = () => {
    let length = 0;
    remoteStreams.length !== 0 && remoteStreams.map((user) => {
      if (user.type !== 'screen-share') {
        length++;
      }
    });
    return length;
  };
  return (
    <div className="task-controller" style={showTask ? {} : {justifyContent: 'flex-end'}}>
      <div className="task-container" style={showTask ? {} : {width: 'auto'}}>
        <div className="heading-col">
          {
            showTask &&
              <ul>
                {/* 마이크 */}
                <li onClick={() => handleChangeMicState()}>
                  { micState ? <svgIcons.micOn className='mic-svg' /> : <svgIcons.micOff className='mic-svg' /> }
                  <span>{t('mainPage.tabComponent.mic.title')}</span>
                </li>
                {/* 카메라 */}
                <li onClick={() => handleChangeCamState()}>
                  { camState ? <svgIcons.camOn className='cam-svg'/> : <svgIcons.camOff className='cam-svg' /> }
                  <span>{t('mainPage.tabComponent.camera.title')}</span>
                  {/* <span>카메라 &nbsp;&nbsp;<svgIcons.arrowMoreUp /></span> */}
                </li>

                {/* 화면공유 */}
                <li className="btn-white" onClick={() => handleShareScreen()}>
                  {
                    shareScreen ? <svgIcons.screenShare className='share-screen-svg' /> : <svgIcons.screenShare className='share-screen-svg'/>
                  }
                  <span>{shareScreen ? t('mainPage.tabComponent.screenShareOption.disable') : t('mainPage.tabComponent.screenShareOption.enable')}</span>
                </li>

                {/* 컨버스 */}
                {
                  ((myInfo !== undefined && myInfo !== null) && (myInfo.user_tp === 'T' || myInfo.user_tp === 'I')) &&
                  <li className="btn-white" onClick={() => handleClickWhiteBoard()}>
                    {
                      shareScreen ? <svgIcons.draw className='whiteboard-svg' /> : <svgIcons.draw className='whiteboard-svg'/>
                    }
                    <span>{showWhiteBoard ? t('mainPage.tabComponent.whiteBoardOption.disable') : t('mainPage.tabComponent.whiteBoardOption.enable') }</span>
                  </li>
                }

                {/* 챗팅 */}
                <li className="btn-white" onClick={() => handleChangeShowChatState()}>
                  <svgIcons.chat className ='chat-svg'/>
                  <span>{t('mainPage.tabComponent.chating.title')}</span>
                  {
                    numberOfNewMessages !== 0 &&
                    <>
                      <span className="badge-chat">{numberOfNewMessages}</span>
                      <span className="badge-chat-hidden">안 읽는 메시지</span>
                    </>
                  }
                </li>

                {/* 참가자 리스트 */}
                <li className="btn-white" onClick={() => handleChangeShowListUserState()}>
                  <svgIcons.people className='list-user' />
                  <span>{t('mainPage.tabComponent.participant.title')}{remoteStreams.length !== 0 && ` ( ${userListLength()} )`}</span>
                </li>
              </ul>
          }
          <div className="task-view" onClick={() => setShowTask(!showTask)}>
            {showTask ? <svgIcons.arrowMenuClose/> : <svgIcons.arrowMenuView />}
          </div>
        </div>
      </div>
      <div className="room-out-btn" onClick={() => handleOutRoom()}>
        <svgIcons.icLogOut />
        <p>{t('mainPage.tabComponent.end.title')}</p>
      </div>
    </div>
  );
}

export default TabComponent;
