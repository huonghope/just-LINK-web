import React, {useEffect, useState, useRef} from 'react';
import {useTranslation} from 'react-i18next';
import Icon from '../../../../constants/icons';
import {CSSTransition} from 'react-transition-group';
import './style.scss';
import moment from 'moment';
import chatComponentSocket from './ChatComponent.Socket';
import chatComponentService from './ChatComponent.Service';
import MeetingRoomAction from '../../../MeetingRoom/MeetingRoom.Action';
import {getSocket} from '../../../rootSocket';

import roomSelector from '../../MeetingRoom.Selector';
import remoteStreamContainerSelector from '../RemoteStreamContainer/RemoteStreamContainer.Selector';
import remoteStreamContainer from '../RemoteStreamContainer/RemoteStreamContainer.Socket';
import {useDispatch, useSelector} from 'react-redux';
import chatAction from './ChatComponent.Action';
import chatSelector from './ChatComponent.Selector';
import {isMobile} from 'react-device-detect';
import userSelectors from '../../../../features/UserFeature/selector';

import tabComponentAction from '../TabComponent/TabComponent.Action';
import tabComponentSelector from '../TabComponent/TabComponent.Selector';

import {connect} from 'react-redux';
import remoteStreamSelector from '../RemoteStreamContainer/RemoteStreamContainer.Selector';

import AssignmentIcon from '@material-ui/icons/Assignment';
import CalendarTodayIcon from '@material-ui/icons/CalendarToday';
import MailOutlineIcon from '@material-ui/icons/MailOutline';
import AttachFileIcon from '@material-ui/icons/AttachFile';
import Avatar from '@material-ui/core/Avatar';
import CloseIcon from '@material-ui/icons/Close';
import 'react-circular-progressbar/dist/styles.css';
import FileComponent from './components/FileComponent';
import svgIcons from '../../../../constants/svgIcon';
import utils from '../../../../constants/utils';
import userUtils from '../../../../features/UserFeature/utils';

moment.locale('ko');
require('moment-timezone');
moment.tz.setDefault('Asia/Seoul');

function ChatComponent(props) {
  const {t, i18n} = useTranslation();

  const listUser = useSelector(remoteStreamContainerSelector.getListUser); // 현재 유저 목록
  const showChatState = useSelector(tabComponentSelector.getShowChatState); // 현재 유저 목록
  const directMessageToUser = useSelector(
      chatSelector.selectDirectMessageToUser,
  );
  const currentUser = useSelector(userSelectors.selectCurrentUser);

  let newMessageCounter = 0;
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [disableChatUser, setDisableChatUser] = useState([]); // 채팅 금지 여부?
  const [allDisable, setAllDisable] = useState(false); // 모든 유저 채팅 금지
  const [boxedListUser, setBoxedListUser] = useState(false);
  const [disableChatInput, setDisableChatInput] = useState(false);
  const [imageZoom, setImageZoom] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');
  const [showList, setShowList] = useState(false);
  const [showUserList, setShowUserList] = useState(false);
  const [chatContentHeight, setChatContentHeight] = useState(0.8);
  const [chatFormHeight, setChatFormHeight] = useState(0.14);
  const [textareaHeight, setTextareaHeight] = useState(22);

  const textareaRef = useRef(null);

  const dispatch = useDispatch();

  const [loading, setLoading] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(true);
  const [error, setError] = useState({title: '', content: ''});

  // 현재 채팅 스크롤을 아래 끝으로 내리기
  const scrollToBottom = () => {
    const chat = document.getElementById('chatList');
    if (chat) {
      chat.scrollTop = '1000000'; // 스크롤 되는 높이 설정?
      setTimeout(() => {
        setLoadingMessages(false);
      }, 1 * 1000);
    }
  };

  // 전체 메시지의 데이트 가지고 옴
  useEffect(() => {
    let fetchMessages = async () => {
      try {
        let params = {
          userRoomId: userUtils.getUserRoomId(),
        };
        const listMessage = await chatComponentService.getListMessageByUserId(
            params,
        );
        const {result} = listMessage;
        if (result) {
          setMessages(listMessage.data);
          setLoading(false);
        } else {
          setLoading(true);
          setError({
            title: '전체 메시지 출력 오류',
            content: '전체 메시지 API를 호출 시 Server 오류 발생함',
          });
        }
      } catch (error) {
        setLoading(true);
        setError({
          title: '전체 메시지 출력 오류',
          content: '전체 메시지 API를 호출 시 Client 오류 발생함',
        });
      }
    };
    fetchMessages();

    // TODO 체크 필요함
    if (showChatState) {
      dispatch(chatAction.incrementNumberOfNewMessages(0));
    }
  }, [showChatState]);

  const [usernameString, setUsernameString] = useState('');
  const [userNumber, setUserNumber] = useState(1);
  const [opacity, setOpacity] = useState(1.0);
  const [inputBackground, setInputBackground] = useState(
      'linear-gradient(to right, #9198b1 0%, #9198b1 50%, #e6ebee 80%, #e6ebee 100%)',
  );

  useEffect(() => {
    const listUserFromRemoteStream = [];
    const {remoteStreams} = props;
    remoteStreams.map((remote) => {
      let userInfoFromRemote = {};
      userInfoFromRemote = remote.userInfo;
      listUserFromRemoteStream.push(userInfoFromRemote);
    });

    let usernameStringTmp = '';
    listUserFromRemoteStream.forEach((obj) => {
      usernameStringTmp += obj.user_name + ',';
    });
    setUsernameString(
        usernameStringTmp.substring(0, usernameStringTmp.length - 1),
    );
    setUserNumber(listUserFromRemoteStream.length);
    scrollToBottom();
  }, [props]);

  useEffect(() => {
    if (textareaRef) {
      textareaRef.current.focus();
    }
    // 사용자에게 경고 메시지 띄우기
    getSocket().on('alert-user-warning', (data) => {
      let newMessage = data;
      setMessages((prevState) => [...prevState, newMessage]);
      scrollToBottom();
    });

    // 특정 사용자가 채팅 금지되었다고 알리기
    getSocket().on('alert_user_disable_chat', (data) => {
      let newMessage = data;
      setMessages((prevState) => [...prevState, newMessage]);
      scrollToBottom();
    });

    // 파일 보냈을 때 이도 메시지 리스트에 추가
    getSocket().on('res-sent-files', (data) => {
      let newMessage = data;
      setMessages((prevState) => [...prevState, newMessage]);
      scrollToBottom();
    });

    getSocket().on('res-sent-message', (data) => {
      let newMessage = data;
      // const {sender} = data;
      // const {uid} = sender;
      // const {user_idx} = currentUser;
      // console.log(showChatState);
      // if (!showChatState && (parseInt(uid) !== parseInt(user_idx))) {
      //   console.log('aaa');
      //   dispatch(chatAction.changeNumberOfNewMessages(++newMessageCounter));
      // }
      setMessages((prevState) => [...prevState, newMessage]);
      scrollToBottom();
    });

    // 특정 유저에게 채팅 금지 액션이 발생하도록 하는 이벤트
    getSocket().on('action_user_disable_chat', (data) => {
      setDisableChatInput((prevState) => !prevState);
      dispatch(chatAction.chattingStateChange(disableChatInput));
    });
  }, []);

  // TODO utils로 변경함
  const getToken = () => {
    const {userInfoToken} = JSON.parse(localStorage.getItem('asauth'));
    return userInfoToken;
  };

  // TODO utils로 변경함
  const userRoomId = () => {
    return JSON.parse(localStorage.getItem('usr_id'));
  };

  // TODO utils로 변경함
  const userName = () => {
    return JSON.parse(localStorage.getItem('asauth')).userInfoToken.userName;
  };

  // 채팅 전송 버튼 함수
  const handleSubmit = (event) => {
    if (message === '') return;

    // Prevent screen refresh
    event.preventDefault();

    const payload = {
      type: 'text',
      message: {
        sender: {
          uid: getToken().userId,
          username: userName(),
          user_type: props.userType,
        },
        receiver: {},
        data: {text: message},
      },
    };

    // Direct message to specific user
    if (directMessageToUser) {
      payload.message.receiver = {
        uid: directMessageToUser.user_idx,
        username: directMessageToUser.user_name,
        socket_id: directMessageToUser.socket_id,
      };
    }

    chatComponentSocket.emitSentMessage(payload);
    setMessage('');
    scrollToBottom();
  };

  // ! 사용되지 않을 것으로 파악됨
  // TODO 체크할 필요함
  const handleSelectImage = (url) => {
    setSelectedImage(url);
    setImageZoom(true);
  };

  const FileComponentCaller = (type, resData) => {
    return <FileComponent type={type} resData={resData} />;
  };

  /**
   * 각 메시지유형에 따라 맞는 출려형태를 매핑함
   * 즉, 각 메시지를 타입에 맞는 채팅 컴포넌트로 제작해줌
   * @param {*} userType
   * @param {*} data
   */
  const renderMessage = (userType, data) => {
    // 데이터에서 메시지 타입 가져오기
    const {type} = data;
    let msgDiv;
    if (type === 'test_Concentration') {
      return;
    }
    // 타입에 따라
    switch (type) {
      case 'text': // 텍스트면
        msgDiv = MessageComponent(userType, data);
        break;
      case 'file': // 파일이면
        msgDiv = FileComponentCaller(userType, data);
        break;
      case 'test-concentration-fail':
      case 'disable-chat':
      case 'kick-user':
      case 'user-warning':
        msgDiv = WarningMessComponent(userType, data);
        break;
      case 'image-message':
        msgDiv = ImageComponent(userType, data, handleSelectImage);
        break;
      default:
        // !Error
        // msgDiv = ImageComponent(userType, data)
        break;
    }

    return <li className={userType}>{msgDiv}</li>;
  };

  // 파일 업데이트
  const handleValueFile = (e) => {
    // const { name, size, type } = e.target.files[0];
    let params = {
      userRoomId: userRoomId(),
    };
    const {size, type} = e.target.files[0];
    if (size / 1000000 < 100) {
      if (
        type === 'image/png' ||
        type === 'image/jpg' ||
        type === 'image/jpeg' ||
        type === 'application/pdf' ||
        type ===
          'application/vnd.openxmlformats-officedocument.presentationml.presentation'
      ) {
        let data = new FormData();
        data.append('file', e.target.files[0]);
        data.append('params', JSON.stringify(params));
        chatComponentService.upFile(data).catch((e) => {
          // TODO 오류체크함
          console.log(' e --', e);
        });
      } else {
        console.log('File type', type);
        alert(t('mainPage.chatingComponent.errorMessage.fileUpdateError'));
      }
    } else {
      console.log('파일 업데이트 시 용량 초과');
      alert(t('mainPage.chatingComponent.errorMessage.fileUpdateLimitError'));
    }
  };

  // 파일을 업데이트
  const handleClickUpFile = () => {
    // 채팅 금지된 사용자는 이용 불가
    if (!disableChatInput) {
      // 임시 input 엘리먼트 생성
      const upFile = document.createElement('input');
      // 타입은 파일 올리는 걸로
      upFile.setAttribute('type', 'file');
      // name 속성은 file
      upFile.setAttribute('name', 'file');
      // 보이지는 않게
      upFile.setAttribute('style', 'display: none');
      // body에 추가
      document.body.appendChild(upFile);
      // 클릭하여 파일 고르게 하기
      upFile.click();
      // 파일이 선택되면 작동하는 콜백 함수 선택
      upFile.onchange = handleValueFile;
    } else {
      alert('채팅 금지되어 있는 상태입니다.');
    }
  };

  // ! 아마 쓰이지 않을 것으로 예상
  // 카메라클릭하여 이미지 업데이트
  const handleClickCameraOn = () => {
    const upImage = document.createElement('input');
    upImage.setAttribute('type', 'file');
    upImage.setAttribute('name', 'file');
    upImage.setAttribute('accept', 'image/*');
    upImage.setAttribute('style', 'display: none');
    document.body.appendChild(upImage);
    upImage.click();
    upImage.onchange = handleValueFile;
  };

  // 유저별로 채팅금지
  // TODO 체크할 필요함
  const handleOffChatForUser = (user_idx, socketId, status) => {
    const tempDisableChatUser = disableChatUser;
    // 있는지 없는지 확인하여 추가함
    let filter = tempDisableChatUser.find((e) => e.user_idx === user_idx);
    if (filter) {
      filter = tempDisableChatUser.filter((e) => e.user_idx !== user_idx);
      setDisableChatUser(filter);
    } else {
      setDisableChatUser([...disableChatUser, {user_idx}]);
    }

    setBoxedListUser(!boxedListUser);
    let payload = {
      status: status,
      remoteSocketId: socketId,
      userId: user_idx,
    };
    dispatch(chatAction.disableChatUser(payload));
    chatComponentSocket.emitDisableUserChat(payload);
  };

  // TODO 체크할 필요함
  const handleOffChatAllUser = () => {
    let payload = {
      remoteSocketId: 'all',
    };
    setAllDisable(!allDisable);
    setBoxedListUser(!boxedListUser);
    if (allDisable) {
      let tempUser = [{user_idx: '0'}]; // trick
      setDisableChatUser(tempUser);
    } else {
      setDisableChatUser(listUser);
    }
    dispatch(chatAction.disableAllChatting(true));
    chatComponentSocket.emitDisableUserChat(payload);
  };

  const showEnlargedImage = (data) => {
    return (
      <img
        src={data}
        style={{
          backgroundColor: 'black',
          position: 'relative',
          zIndex: 100,
          display: 'block',
          cursor: 'pointer',
          marginLeft: 'auto',
          marginRight: 'auto',
          padding: 20,
          borderRadius: 20,
        }}
        alt="up-img"
        onClick={() => setImageZoom(false)}
      />
    );
  };

  // TODO: Need to fix the expandable textarea
  const autoExpand = (field) => {
    // Reset field height
    field.style.height = 'inherit';

    // Get the computed styles for the element
    const computed = window.getComputedStyle(field);

    // Calculate the height
    const height =
      parseInt(computed.getPropertyValue('border-top-width'), 10) +
      parseInt(computed.getPropertyValue('padding-top'), 10) +
      field.scrollHeight +
      parseInt(computed.getPropertyValue('padding-bottom'), 10) +
      parseInt(computed.getPropertyValue('border-bottom-width'), 10);

    field.style.height = height + 'px';

    if (height > textareaHeight) {
      setChatFormHeight(chatFormHeight + 0.02);
      setChatContentHeight(chatContentHeight - 0.02);
      setTextareaHeight(height);
    }
    if (height < textareaHeight) {
      if (chatFormHeight > 0.14) {
        setChatFormHeight(chatFormHeight - 0.02);
        setChatContentHeight(chatContentHeight + 0.02);
      }
      setTextareaHeight(height);
    }
    if (message === '') {
      setChatFormHeight(0.14);
      setChatContentHeight(0.8);
    }
  };

  const handleChangeShowChatState = () => {
    let showChatStateConverse = !showChatState;
    dispatch(
        tabComponentAction.handleChangeShowChatState(showChatStateConverse),
    );
  };

  if (!showChatState) return '';

  return (
    <div className="chat__component" style={{opacity: opacity}}>
      {imageZoom && showEnlargedImage(selectedImage)}
      <div className="chat-top">
        <div className="user">
          <div className="username-string">{usernameString}</div>
          <div className="user-number">{userNumber}</div>
        </div>

        <div className="toolbar">
          <div className="chat-opacity-bar">
            <input
              type="range"
              min={0.2}
              max={1}
              step={0.02}
              value={opacity}
              id="my-input"
              style={{background: inputBackground}}
              onChange={(event) => {
                setOpacity(event.target.valueAsNumber);
                const value =
                  ((event.target.valueAsNumber - 0.2) / (1 - 0.2)) * 100;
                setInputBackground(
                    'linear-gradient(to right, #9198b1 0%, #9198b1 ' +
                    value +
                    '%, #e6ebee ' +
                    value +
                    '%, #e6ebee 100%)',
                );
              }}
            />
          </div>
          <div
            className="chat-room-collapse"
            onClick={() => handleChangeShowChatState()}
          >
            {<svgIcons.close />}
          </div>
        </div>
      </div>
      <div
        className="chat-content"
        style={{height: chatContentHeight * 100 + '%'}}
      >
        <ul
          className="chat-rows"
          id="chatList"
          style={loadingMessages ? {opacity: '0'} : {display: '1'}}
        >
          {messages.map((data, idx) => (
            <div key={idx}>
              {
                // 보낸 사람인지 아닌지 체크
                getToken().userId === data.sender.uid ?
                  renderMessage('self', data) :
                  renderMessage('other', data)
              }
            </div>
          ))}
        </ul>
      </div>
      <div className="chat-form" style={{height: chatFormHeight * 100 + '%'}}>
        {directMessageToUser !== null && (
          <div className="chat-direct-message">
            Sending direct message to @{directMessageToUser.user_name}
            <CloseIcon
              style={{
                height: '20px',
                width: '20px',
                fill: 'orange',
                margin: '-5px',
                cursor: 'pointer',
              }}
              onClick={() => {
                dispatch(chatAction.changeDirectMessageToUser(null));
              }}
            />
          </div>
        )}
        <form
          onSubmit={handleSubmit}
          className="form-container"
          style={disableChatInput ? {background: '#d7cedc'} : {}}
        >
          <textarea
            ref={textareaRef}
            placeholder={
              disableChatInput ?
                t('mainPage.chatingComponent.disablePlaceholder') :
                t('mainPage.chatingComponent.enablePlaceholder')
            }
            onChange={(event) => {
              autoExpand(event.target);
              setMessage(event.target.value);
            }}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                handleSubmit(e);
                e.preventDefault();
              }
            }}
            value={message}
            readOnly={disableChatInput}
            style={disableChatInput ? {background: '#d7cedc'} : {}}
          />

          <div className="line-break" />

          <div className="footer-icon">
            <div className="footer-icon-left">
              {/* <AssignmentIcon
                style={{fill: '#9198b1'}}
              /> */}
              <svgIcons.cal
                onClick={() => alert(t('common.developpingMessage'))}
              />
              <svgIcons.mail
                onClick={() => alert(t('common.developpingMessage'))}
              />
            </div>
            <div className="footer-icon-right">
              <span
                onClick={() => {
                  handleClickUpFile();
                }}
              >
                <svgIcons.file />
              </span>
              {/* <AttachFileIcon
                onClick={() => {handleClickUpFile();}}
                style={{transform: 'rotate(45deg)', fill: '#9ba1b9', cursor: 'pointer'}}
              /> */}
              <button disabled={disableChatInput}>전송</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

/**
 * @param {*} type : 자기또는 다름 유저
 * @param {*} message : message 데이터
 */
const MessageComponent = (type, resData) => {
  const {data, sender, receiver} = resData;
  const isDirect = receiver && receiver.uid !== null;
  const myUid = JSON.parse(localStorage.getItem('asauth')).userInfoToken.userId;

  return (
    // Needs refactoring
    <div className="msg-type">
      {type === 'self' ? (
        isDirect && sender.uid === myUid ? (
          <>
            <div className="msg-type__direct">
              <span style={{fontWeight: '900'}}>{receiver.username}</span>
              님에게 보낸 메시지
            </div>

            <div className="msg-type__message-info">
              <div className="msg-type__info">
                <span className="msg-type__time">
                  {handleTimestamp(moment(data.timestamp).format('LT'))}
                </span>
              </div>
              <div
                className="msg-type__message"
                style={{border: '2px solid #f75320'}}
              >
                <p>{data.message}</p>
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="msg-type__message-info">
              <div className="msg-type__info">
                <span className="msg-type__time">
                  {handleTimestamp(moment(data.timestamp).format('LT'))}
                </span>
              </div>

              <div className="msg-type__message">
                <p>{data.message}</p>
              </div>
            </div>
          </>
        )
      ) : null}
      {type === 'other' ? (
        isDirect ? (
          receiver.uid === myUid ? (
            <>
              <div className="msg-type__avatar">
                <Avatar
                  style={{backgroundColor: '#c0ccda', color: '#f6f7f9'}}
                >
                  {handleUsername(sender.username)}
                </Avatar>
              </div>

              <div className="msg-type__right">
                <div className="msg-type__direct">
                  <span style={{fontWeight: '900'}}>{sender.username}</span>
                  님이 보낸 메시지
                </div>

                <div className="msg-type__message-info">
                  <div
                    className="msg-type__message"
                    style={{
                      border: '2px solid #f75320',
                      backgroundColor: '#ffffff',
                    }}
                  >
                    <p>{data.message}</p>
                  </div>

                  <div className="msg-type__info">
                    <span className="msg-type__time">
                      {handleTimestamp(moment(data.timestamp).format('LT'))}
                    </span>
                  </div>
                </div>
              </div>
            </>
          ) : null
        ) : (
          <>
            <div className="msg-type__avatar">
              <Avatar
                style={{
                  backgroundColor:
                    sender.user_type === 1 ? '#027ff3' : '#c0ccda',
                  color: '#ffffff',
                  fontSize: '18px',
                  borderWidth: '2px',
                  borderStyle: 'solid',
                  borderColor: sender.user_type === 0 ? '#c0ccda' : '#027ff3',
                }}
              >
                {handleUsername(sender.username)}
              </Avatar>
            </div>

            <div className="msg-type__message">
              <p>{data.message}</p>
            </div>

            <div className="msg-type__info">
              <span className="msg-type__time">
                {handleTimestamp(moment(data.timestamp).format('LT'))}
              </span>
            </div>
          </>
        )
      ) : null}
    </div>
  );
};

const WarningMessComponent = (type, resData) => {
  let {type: requestType, sender, data} = resData;
  let footerText = ' 메시지 전송되었습니다';
  switch (requestType.trim()) {
    case 'test-concentration-fail':
      footerText = '집중도 테스트를 실패하였습니다.';
      break;
    case 'disable-chat':
      footerText = '채팅 금지/허용 되었습니다.';
      break;
    case 'user-warning':
      footerText = '경고 받았습니다.';
      break;
    case 'kick-user':
      footerText = '이/가 강퇴되었습니다.';
    default:
      break;
  }
  const messageInfo = sender.username + ' ' + footerText;
  let msgDiv = (
    <div className="msg-request">
      <div className="msg-request__heading">
        <div className="msg-request__warning">
          <p>{messageInfo}</p>
          <span>{moment(data.timestamp).format('LT')}</span>
        </div>
      </div>
    </div>
  );
  return msgDiv;
};

// 일반 구현을 안 됨
const ImageComponent = (type, resData, handleSelectImage) => {
  // !나중에 추가함
  let msgDiv = (
    <div className="msg-row">
      <p>{resData.sender.username}</p>
      <img
        onClick={() => {
          // setImageZoom(true)
          handleSelectImage(resData.data);
        }}
        className="img-message"
        style={{
          width: 200,
          // height: 100
          cursor: 'pointer',
        }}
        alt="update img"
        src={resData.data}
      />
    </div>
  );

  return msgDiv;
};

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
    } else if (nameLength === 3) {
      return name.substring(1);
    } else {
      return name[0];
    }
  }
  // English name
  else {
    return nameArray[0][0] + nameArray[1][0];
  }
};

const handleTimestamp = (timestamp) => {
  const ltArray = timestamp.split(' ');
  ltArray[1] === 'AM' ? (ltArray[1] = '오전') : (ltArray[1] = '오후');
  return ltArray[1] + '\n' + ltArray[0];
};

export default ChatComponent;
