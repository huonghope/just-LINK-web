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

  const listUser = useSelector(remoteStreamContainerSelector.getListUser); // ?????? ?????? ??????
  const showChatState = useSelector(tabComponentSelector.getShowChatState); // ?????? ?????? ??????
  const directMessageToUser = useSelector(
      chatSelector.selectDirectMessageToUser,
  );
  const currentUser = useSelector(userSelectors.selectCurrentUser);

  let newMessageCounter = 0;
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [disableChatUser, setDisableChatUser] = useState([]); // ?????? ?????? ???????
  const [allDisable, setAllDisable] = useState(false); // ?????? ?????? ?????? ??????
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

  // ?????? ?????? ???????????? ?????? ????????? ?????????
  const scrollToBottom = () => {
    const chat = document.getElementById('chatList');
    if (chat) {
      chat.scrollTop = '1000000'; // ????????? ?????? ?????? ???????
      setTimeout(() => {
        setLoadingMessages(false);
      }, 1 * 1000);
    }
  };

  // ?????? ???????????? ????????? ????????? ???
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
            title: '?????? ????????? ?????? ??????',
            content: '?????? ????????? API??? ?????? ??? Server ?????? ?????????',
          });
        }
      } catch (error) {
        setLoading(true);
        setError({
          title: '?????? ????????? ?????? ??????',
          content: '?????? ????????? API??? ?????? ??? Client ?????? ?????????',
        });
      }
    };
    fetchMessages();

    // TODO ?????? ?????????
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
    // ??????????????? ?????? ????????? ?????????
    getSocket().on('alert-user-warning', (data) => {
      let newMessage = data;
      setMessages((prevState) => [...prevState, newMessage]);
      scrollToBottom();
    });

    // ?????? ???????????? ?????? ?????????????????? ?????????
    getSocket().on('alert_user_disable_chat', (data) => {
      let newMessage = data;
      setMessages((prevState) => [...prevState, newMessage]);
      scrollToBottom();
    });

    // ?????? ????????? ??? ?????? ????????? ???????????? ??????
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

    // ?????? ???????????? ?????? ?????? ????????? ??????????????? ?????? ?????????
    getSocket().on('action_user_disable_chat', (data) => {
      setDisableChatInput((prevState) => !prevState);
      dispatch(chatAction.chattingStateChange(disableChatInput));
    });
  }, []);

  // TODO utils??? ?????????
  const getToken = () => {
    const {userInfoToken} = JSON.parse(localStorage.getItem('asauth'));
    return userInfoToken;
  };

  // TODO utils??? ?????????
  const userRoomId = () => {
    return JSON.parse(localStorage.getItem('usr_id'));
  };

  // TODO utils??? ?????????
  const userName = () => {
    return JSON.parse(localStorage.getItem('asauth')).userInfoToken.userName;
  };

  // ?????? ?????? ?????? ??????
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

  // ! ???????????? ?????? ????????? ?????????
  // TODO ????????? ?????????
  const handleSelectImage = (url) => {
    setSelectedImage(url);
    setImageZoom(true);
  };

  const FileComponentCaller = (type, resData) => {
    return <FileComponent type={type} resData={resData} />;
  };

  /**
   * ??? ?????????????????? ?????? ?????? ??????????????? ?????????
   * ???, ??? ???????????? ????????? ?????? ?????? ??????????????? ????????????
   * @param {*} userType
   * @param {*} data
   */
  const renderMessage = (userType, data) => {
    // ??????????????? ????????? ?????? ????????????
    const {type} = data;
    let msgDiv;
    if (type === 'test_Concentration') {
      return;
    }
    // ????????? ??????
    switch (type) {
      case 'text': // ????????????
        msgDiv = MessageComponent(userType, data);
        break;
      case 'file': // ????????????
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

  // ?????? ????????????
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
          // TODO ???????????????
          console.log(' e --', e);
        });
      } else {
        console.log('File type', type);
        alert(t('mainPage.chatingComponent.errorMessage.fileUpdateError'));
      }
    } else {
      console.log('?????? ???????????? ??? ?????? ??????');
      alert(t('mainPage.chatingComponent.errorMessage.fileUpdateLimitError'));
    }
  };

  // ????????? ????????????
  const handleClickUpFile = () => {
    // ?????? ????????? ???????????? ?????? ??????
    if (!disableChatInput) {
      // ?????? input ???????????? ??????
      const upFile = document.createElement('input');
      // ????????? ?????? ????????? ??????
      upFile.setAttribute('type', 'file');
      // name ????????? file
      upFile.setAttribute('name', 'file');
      // ???????????? ??????
      upFile.setAttribute('style', 'display: none');
      // body??? ??????
      document.body.appendChild(upFile);
      // ???????????? ?????? ????????? ??????
      upFile.click();
      // ????????? ???????????? ???????????? ?????? ?????? ??????
      upFile.onchange = handleValueFile;
    } else {
      alert('?????? ???????????? ?????? ???????????????.');
    }
  };

  // ! ?????? ????????? ?????? ????????? ??????
  // ????????????????????? ????????? ????????????
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

  // ???????????? ????????????
  // TODO ????????? ?????????
  const handleOffChatForUser = (user_idx, socketId, status) => {
    const tempDisableChatUser = disableChatUser;
    // ????????? ????????? ???????????? ?????????
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

  // TODO ????????? ?????????
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
                // ?????? ???????????? ????????? ??????
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
              <button disabled={disableChatInput}>??????</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

/**
 * @param {*} type : ???????????? ?????? ??????
 * @param {*} message : message ?????????
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
              ????????? ?????? ?????????
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
                  ?????? ?????? ?????????
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
  let footerText = ' ????????? ?????????????????????';
  switch (requestType.trim()) {
    case 'test-concentration-fail':
      footerText = '????????? ???????????? ?????????????????????.';
      break;
    case 'disable-chat':
      footerText = '?????? ??????/?????? ???????????????.';
      break;
    case 'user-warning':
      footerText = '?????? ???????????????.';
      break;
    case 'kick-user':
      footerText = '???/??? ?????????????????????.';
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

// ?????? ????????? ??? ???
const ImageComponent = (type, resData, handleSelectImage) => {
  // !????????? ?????????
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
  ltArray[1] === 'AM' ? (ltArray[1] = '??????') : (ltArray[1] = '??????');
  return ltArray[1] + '\n' + ltArray[0];
};

export default ChatComponent;
