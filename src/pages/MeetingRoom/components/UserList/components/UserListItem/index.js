import React, {useState, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useTranslation} from 'react-i18next';
import {getSocket} from '../../../../../rootSocket';
import './style.scss';


import userSelect from '../../../../../../features/UserFeature/selector';
import ChatComponentSocket from '../../../ChatComponent/ChatComponent.Socket';
import ChatComponentService from '../../../ChatComponent/ChatComponent.Service';
import chatComponentAction from '../../../ChatComponent/ChatComponent.Action';

import tabComponentAction from '../../../TabComponent/TabComponent.Action';

import meetingRoomSelector from '../../../../MeetingRoom.Selector';
import MicIcon from '@material-ui/icons/Mic';
import MicOffIcon from '@material-ui/icons/MicOff';

import VideocamIcon from '@material-ui/icons/Videocam';
import VideocamOffIcon from '@material-ui/icons/VideocamOff';

import MoreVertIcon from '@material-ui/icons/MoreVert';
import Avatar from '@material-ui/core/Avatar';
import chatAction from '../../../ChatComponent/ChatComponent.Action';
import FormAlert from '../../../../../../components/Alert/FormAlert';
import Alert from '../../../../../../components/Alert';
import userUtils from '../../../../../../features/UserFeature/utils';
import Loading from '../../../../../../components/Loading';

const avatarStyle = (userType) => {
  return {
    backgroundColor: userType === 'T' ? '#027ff3' : '#c0ccda',
    color: '#ffffff',
    width: '30px',
    height: '30px',
    fontSize: '13px',
    borderWidth: '2px',
    borderStyle: 'solid',
    borderColor: userType === 'S' ? '#c0ccda' : '#027ff3',
  };
};

function UserListItem(props) {
  const {user: propsUser, handleUserFix, handleClickMoreOption, isShowMoreUser} = props;

  const {t, i18n} = useTranslation();
  const [user, setUser] = useState(propsUser);
  const [showDropDownList, setShowDropDownList] = useState(false);
  const [fixUser, setFixUser] = useState(false);


  const userType = useSelector(meetingRoomSelector.selectUserType);
  const currentUser = useSelector(userSelect.selectCurrentUser);
  const dispatch = useDispatch();
  const userInfo = userUtils.getUserInfo();

  useEffect(() => {
    // 해당 유저가 고정하지 않음
    const {fix} = user;
    if (fix !== undefined) {
      setFixUser(true);
    }
  }, []);

  useEffect(() => {
    setUser(propsUser);
  }, [propsUser]);


  useEffect(() => {
    if (isShowMoreUser === user.user_idx) {
      setShowDropDownList(true);
    } else {
      setShowDropDownList(false);
    }
  }, [isShowMoreUser]);

  const handleUserKick = (remoteSocketId) => {
    const payload = {
      remoteSocketId: remoteSocketId,
    };
    ChatComponentSocket.emitHandleUserKick(payload);
  };

  /**
   *
   * @param {*} user : 이벤트 발생하는 유저
   * 유자 타입을 한번 체크한다, 만약에 현재 유저가 강사라면 요청을 보낼 수 있음,
   * 그렇지 않으면 요청을 보낼 수 없음
   * 또는 클릭한 유저가 현재 유저인지 아닌지 체크함
   */
  const handleMicClick = (user) => {
    if (userInfo &&
      (userInfo.userTp === 'T'|| userInfo.userTp === 'I') &&
      currentUser.user_idx !== user.user_idx)
    {
      const state = user.mic_status ? '끄기' : '켜기';
      Alert({
        title: '장치 요청',
        content: `${user.user_name}에게 마이크 ${state}를 요청하시겠습니까?`,
        btnAccept: '수락',
        btnReject: '거절',
        handleClickAccept: () => {
          handleRequestDevice('mic', user.socket_id, user.mic_status);
        },
        handleClickReject: () => {},
      });
    }
  };

  /**
   *
   * @param {*} user : 이벤트 발생하는 유저
   * 유자 타입을 한번 체크한다, 만약에 현재 유저가 강사라면 요청을 보낼 수 있음,
   * 그렇지 않으면 요청을 보낼 수 없음
   * 또는 클릭한 유저가 현재 유저인지 아닌지 체크함
   */
  const handleCamClick = (user) => {
    if (userInfo &&
      (userInfo.userTp === 'T' || userInfo.userTp === 'I') &&
      currentUser.user_idx !== user.user_idx)
    {
      const state = user.cam_status ? '끄기' : '켜기';
      Alert({
        title: '장치 요청',
        content: `${user.user_name}에게 카메라 ${state}를 요청하시겠습니까?`,
        btnAccept: '수락',
        btnReject: '거절',
        handleClickAccept: () => {
          handleRequestDevice('cam', user.socket_id, user.cam_status);
        },
        handleClickReject: () => {},
      });
    }
  };

  // 기계를 요청함
  const handleRequestDevice = (type, remoteSocketId, currentState) => {
    let payload;
    if (currentState === 1) {
      payload = {
        type: type,
        remoteSocketId: remoteSocketId,
        currentState: true,
      };
    } else if (currentState === 0) {
      payload = {
        type: type,
        remoteSocketId: remoteSocketId,
        currentState: false,
      };
    }
    ChatComponentSocket.emitRequestDevice(payload);
  };

  const handleChangeUserName = () => {
    setShowDropDownList(!showDropDownList);
    FormAlert({
      title: '사용하실 닉네임을 입력해주세요.',
      handleClickAccept: (newUsername) => {
        const data = {
          username: newUsername,
        };
        getSocket().emit('update-username', data);
      },
      handleClickReject: () => { },
    });
  };

  const handleClickUserFix = () => {
    setShowDropDownList(!showDropDownList);
    handleUserFix(true, user.user_idx);
  };


  const handleClickSendMessage = () => {
    setShowDropDownList(!showDropDownList);
    dispatch(tabComponentAction.handleChangeShowChatState(true));
    dispatch(chatComponentAction.changeDirectMessageToUser(user));
  };

  const handleClickChangeHost = async () => {
    try {
      // 클릭 유저가 강사인경우에는, 및 현재 유저가 아님
      if (userInfo && (userInfo.userTp === 'T' || userInfo.userTp === 'I') && currentUser.user_idx !== user.user_idx)
      {
        const {id: usr_id, user_idx: userId, socket_id: remoteSocketId, host_user: currentState} = user;
        const type = 'host';
        try {
          const payload = {
            remoteSocketId,
          };
          const params = {
            usr_id,
            userId,
          };
          // 1 : owner , 2 : host
          if (type === 'owner') {
            if (currentState === 2 || currentState === 0) {
              params.data = 1;
              payload.value = 1;
            } else if (currentState === 1) {
              params.data = 0;
              payload.value = 0;
            }
            // 유저정보를 업데이트
            await ChatComponentService.updateUserAuth(params);
            ChatComponentSocket.emitHandleUserAuth(payload);
          } else if (type === 'host') {
            let userTemp = user;
            if (currentState === 1 || currentState === 0) {
              params.data = 2;
              payload.value = 2;
            } else if (currentState === 2) {
              params.data = 0;
              payload.value = 0;
            }
            userTemp = {...userTemp, host_user: params.data};
            setUser(userTemp);
            await ChatComponentService.updateUserAuth(params);
            ChatComponentSocket.emitHandleUserAuth(payload);
          }
        } catch (error) {
          console.log(error);
        }
      } else {
        alert('호스트만 관한을 넘길 수 있습니다. 다시 확인해주시기 바랍니다.');
      }
      setShowDropDownList(!showDropDownList);
    } catch (error) {
      console.log('유저 관한 넘기 오류');
    }
  };

  const handleClickUserOut = () => {
    setShowDropDownList(!showDropDownList);
    Alert({
      title: `${user.user_name}님 퇴장시키기`,
      btnAccept: '확인',
      btnReject: '취소',
      handleClickAccept: () => {
        handleUserKick(user.socket_id);
      },
      handleClickReject: () => {
      },
    });
  };

  // 이름의 랜덤 함수
  const handleUsername = (username) => {
    const nameArray = username.split(' ').filter((str) => {
      return str !== '';
    });
    // Korean name
    if (nameArray.length === 1) {
      const name = nameArray[0];
      const nameLength = nameArray[0].length;
      if (nameLength === 2) {
        return name;
      }
      else if (nameLength === 3) {
        return name.substring(1);
      }
      else {
        return name[0];
      }
    }
    // English name
    else {
      return nameArray[0][0] + nameArray[1][0];
    }
  };
  const handleClickMore = () => {
    handleClickMoreOption(user.user_idx);
    setShowDropDownList(!showDropDownList);
  };
  if (!user || !currentUser) return <Loading type={'bars'} color={'white'} />;
  return (
    <div className="user-list-item" id={user.user_idx === currentUser.user_idx ? 'my-profile' : 'remote-user-profile'}>
      <div className="user-list-profile">
        <div className="user-list-avatar">
          <Avatar style={avatarStyle(user.user_tp)}>  {handleUsername(user.user_name)}</Avatar>
        </div>
        <div className="user-list-name">{user.nickname ? user.nickname : user.user_name}</div>
      </div>
      <div className="user-list-control">
        <div className="user-list-mic">
          {
              user.mic_status ?
              <MicIcon style={{fill: '#f75320', cursor: 'pointer'}} onClick={() => handleMicClick(user)}/> :
              <MicOffIcon style={{fill: '#9198b1', cursor: 'pointer'}} onClick={() => handleMicClick(user)} />
          }
        </div>
        <div className="user-list-cam">
          {
              user.cam_status ?
              <VideocamIcon style={{fill: '#f75320', cursor: 'pointer'}} onClick={() => handleCamClick(user)}/> :
              <VideocamOffIcon style={{fill: '#9198b1', cursor: 'pointer'}} onClick={() => handleCamClick(user) }/>
          }
        </div>
        <div className="user-list-more" >
          <MoreVertIcon
            style={{fill: '#9198b1', cursor: 'pointer'}}
            onClick={() => handleClickMore()}
          />
          {
            showDropDownList &&
            <div className="user-more-options-list">
              <ul>
                {
                  // 자기한테 이름만 변경할 수 있음
                  user.user_idx === currentUser.user_idx ?
                  <li onClick={() => handleChangeUserName()}>{t('mainPage.userListComponent.userOptionList.nicknameChange')}</li> :
                  // 그렇지 않을 경우에는
                  <>
                    {/* <li onClick={() => handleClickUserFix()}> 고정하기 </li> */}
                    <li onClick={() => handleClickSendMessage()}>{t('mainPage.userListComponent.userOptionList.sendMessage')}</li>
                    {
                      // 현재 유저가 1라면 (즉 호스트 인경우에는)
                      currentUser.user_tp === 'T' &&
                      <>
                        <li onClick={() => handleClickChangeHost()}>
                          {user.host_user !== 2 ? t('mainPage.userListComponent.userOptionList.grantShareScreen') : t('mainPage.userListComponent.userOptionList.cantShareScreen')}
                        </li>
                        <li onClick={() => handleClickUserOut()}> {t('mainPage.userListComponent.userOptionList.requestOutRoom')} </li>
                      </>
                    }
                  </>
                }
              </ul>
            </div>
          }
        </div>
      </div>
    </div>
  );
}

export default UserListItem;
