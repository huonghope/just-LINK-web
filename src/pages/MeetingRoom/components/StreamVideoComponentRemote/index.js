import React, {Component, useState, useEffect, useRef} from 'react';
import {useTranslation} from 'react-i18next';
import {connect, useSelector} from 'react-redux';
import {bindActionCreators, compose} from 'redux';
import {useDispatch} from 'react-redux';
import {getSocket} from '../../../rootSocket';
import {getInformationRoom} from '../RemoteStreamContainer/RemoteStreamContainer.Service';
import './style.scss';


import tabComponentSelector from '../TabComponent/TabComponent.Selector';
import tabComponentAction from '../TabComponent/TabComponent.Action';


import meetingRoomSelector from '../../MeetingRoom.Selector';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Alert from '../../../../components/Alert';
import userSelect from '../../../../features/UserFeature/selector';
import userAction from '../../../../features/UserFeature/actions';

import chatComponentService from '../ChatComponent/ChatComponent.Service';
import chatComponentAction from '../ChatComponent/ChatComponent.Action';
import ChatComponentSocket from '../ChatComponent/ChatComponent.Socket';
import chatComponentSelector from '../ChatComponent/ChatComponent.Selector';

import FormAlert from '../../../../components/Alert/FormAlert';
import meetingRoomAction from '../../MeetingRoom.Action';
import svgIcons from '../../../../constants/svgIcon';
import Icon from '../../../../constants/icons';
import utils from '../../../../constants/utils';
import userUtils from '../../../../features/UserFeature/utils';

class StreamVideoComponentRemote extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      remoteCamStatus: true,
      showDropDownList: false,

      isSpeaking: false,
    };
  }
  componentDidMount() {
    if (this.props.rVideoTrack && this.video) {
      const {rVideoTrack} = this.props;
      let videoStream = new MediaStream();
      videoStream.addTrack(rVideoTrack);
      this.video.srcObject = videoStream;
    }

    if (this.props.userInfo) {
      const {cam_status} = this.props.userInfo;
      if (cam_status !== undefined) {
        this.setState({
          remoteCamStatus: Number(cam_status),
        });
      }
    }

    getSocket().on('alert-user-change-device-status', (data) => {
      const {type, status, userId} = data;
      const {userInfo} = this.props;
      if (userId === userInfo.user_idx) {
        if (type === 'cam') {
          this.setState({
            remoteCamStatus: status,
          });
        }
      }
    });
    getSocket().on('alert-user-speaking', (data) => {
      const {userId, remoteSocketId, status} = data;
      const {userInfo} = this.props;
      if (userId === userInfo.user_idx ) {
        this.setState({
          isSpeaking: status,
        });
      }
    });
  }
  componentDidUpdate(prevProps, prevState) { }

  componentWillReceiveProps(nextProps) {
    // 연결된 stream를 출력함
    if ((this.props.videoType === 'remoteVideo') && this.props.rVideoTrack !== nextProps.rVideoTrack && this.video) {
      const {rVideoTrack} = nextProps;
      let videoStream = new MediaStream();
      videoStream.addTrack(rVideoTrack);
      this.video.srcObject = videoStream;
    }

    // 네트워크의 상태가 안 좋을때
    if (nextProps.listUserBadNetwork !== this.props.listUserBadNetwork ) {
      const {listUserBadNetwork} = nextProps;
      let filter = listUserBadNetwork.find((item) => (item.user_idx === this.props.userInfo.user_idx));
      if (filter !== undefined) {
        this.setState({
          remoteCamStatus: false,
        });
      } else {
        this.setState({
          remoteCamStatus: true,
        });
      }
    }
    // 네트워크의 상태가 안 좋을때
    // !  체크함
    if ((this.props.videoType === 'remoteVideo') && nextProps.userInfo && nextProps.userInfo !== this.props.userInfo ) {
      const {cam_status} = nextProps.userInfo;
      if (cam_status !== undefined) {
        this.setState({
          remoteCamStatus: Number(cam_status),
        });
      }
    }
  }

  render() {
    const {remoteCamStatus, isSpeaking} = this.state;
    const {videoType, currentUser, userInfo, socketId} = this.props;
    return (
      <div className="video-item-remote video-item" id={isSpeaking ? 'video-item-border' : 'video-item'}>
        <video
          autoPlay
          ref={(ref) => {
            this.video = ref;
          }}
          muted={true}
          style={remoteCamStatus ? {} : {display: 'none'}}
        />
        <img style={remoteCamStatus ?{display: 'none'} : {}} src={Icon.videoOffImage} className="temp-image"/>
        {
          <StateList
            localUserInfo={currentUser}
            userInfo={userInfo}
            socketId={socketId}
          />
        }
      </div>
    );
  }
}

// remote Peer들을 위한 것
function StateList({localUserInfo, userInfo, socketId}) {
  const ref = useRef();
  const {t, i18n} = useTranslation();
  const [mic, setMic] = useState(true);
  const [userInfoState, setUserInfoState] = useState(null);
  const [userName, setUSerName] = useState('');
  const [showDropDownList, setShowDropDownList] = useState(false);

  const [sendBitRate, setSendBitRate] = useState(0);
  const [receiverBitRate, setReceiverBitRate] = useState(0);
  const peerConnections = useSelector(meetingRoomSelector.selectPeerConnections);
  const remoteStreamsProps = useSelector(meetingRoomSelector.selectRemoteStreams);
  const dispatch = useDispatch();

  useEffect(() => {
    if (userInfo) {
      const {mic_status, nickname, user_name} = userInfo;
      setMic(Number(mic_status));
      let userNameTemp = nickname ? nickname : user_name;
      setUserInfoState(userInfo);
      setUSerName(userNameTemp);
      getSocket().on('alert-user-change-device-status', (data) => {
        const {type, status, userId} = data;
        if (userId && userId === userInfo.user_idx) {
          if (type === 'mic') {
            setMic(status);
          }
        }
      });
      getSocket().on('update-username', (data) => {
        const {newName, remoteSocketId} = data;
        if (socketId === remoteSocketId) {
          setUSerName(newName);
        }
      });
    }
    return () => {
      try {
        getSocket().off('alert-user-change-device-status');
        getSocket().off('update-username');
      } catch (error) {
        console.log(error);
      }
    };
  }, [userInfo]);
  // 해당 유저의 연결 상태를 출력함
  useEffect(() => {
    let interval = null;
    let lastResultReceiver;
    let lastResultSender;
    let monitorTime = 1;

    interval = window.setInterval(function() {
      const peerConnection = peerConnections[socketId];
      if (peerConnection) {
        const {connectionState, iceConnectionState, iceGatheringState} = peerConnection;
        if (connectionState === 'connected' && iceConnectionState === 'connected' && iceGatheringState === 'complete') {
          let receiversVideo = peerConnection.getReceivers()[1];
          let senderVideo = peerConnection.getSenders()[1];

          if (receiversVideo === undefined || senderVideo === undefined) {
            receiversVideo = peerConnection.getReceivers()[0];
            senderVideo = peerConnection.getSenders()[0];
          }
          // console.log(peerConnection.getReceivers()[0]);
          // console.log(peerConnection.getSenders());
          try {
            senderVideo.getStats(null).then((stats) => {
              stats.forEach((report) => {
                let bytes;
                if (report.type === 'outbound-rtp') {
                  if (report.isRemote) {
                    return;
                  }
                  if (lastResultSender && lastResultSender.has(report.id)) {
                    bytes = report.bytesSent;
                    let currentKbps = ((8 * (bytes - lastResultSender.get(report.id).bytesSent)) / 1000 ) / monitorTime;
                    // console.log('bytes ================', lastResultSender.get(report.id).bytesSent);
                    let currentMbps = (currentKbps / 1000).toFixed(2);
                    // console.log(lastResultSender.get(report.id).bytesSent);
                    let bitrate = currentMbps >= 1 ? `${currentMbps}Mbps` : `${currentKbps}Kpbs`;
                    setSendBitRate(bitrate);
                  }
                }
              });
              lastResultSender = stats;
            });

            receiversVideo.getStats(null).then((stats) => {
              let bytes;
              stats.forEach((report) => {
                if (report.type === 'inbound-rtp') {
                  if (report.isRemote) {
                    return;
                  }
                  if (lastResultReceiver && lastResultReceiver.has(report.id)) {
                    bytes = report.bytesReceived;
                    // console.log(bytes);
                    let currentKbps = ((8 * (bytes - lastResultReceiver.get(report.id).bytesReceived)) / 1000 ) / monitorTime;
                    let currentMbps = (currentKbps / 1000).toFixed(2);
                    let bitrate = currentMbps >= 1 ? `${currentMbps}Mbps` : `${currentKbps}Kpbs`;
                    setReceiverBitRate(bitrate);
                  }
                }
              });
              lastResultReceiver = stats;
            });
          } catch (error) {
          }
        }
      }
    }, monitorTime * 1000);

    return () => clearInterval(interval);
  }, [peerConnections, userInfo]);

  const handleUserKick = () => {
    const payload = {
      remoteSocketId: socketId,
    };
    ChatComponentSocket.emitHandleUserKick(payload);
  };

  const handleResolution = (userInfo, type) => {
    if (userInfo) {
      getSocket().emit('edit-stream-slide-user', {userInfo, type});
      setShowDropDownList(!showDropDownList);
    }
  };

  useEffect(() => {
    const checkIfClickedOutside = (e) => {
      if (showDropDownList && ref.current && !ref.current.contains(e.target)) {
        setShowDropDownList(false);
      }
    };
    document.addEventListener('mousedown', checkIfClickedOutside);
    return () => {
      document.removeEventListener('mousedown', checkIfClickedOutside);
    };
  }, [showDropDownList]);


  return (
    <div className="stream-info" ref={ref}>
      <ul>
        <li>
          {
            mic ? <svgIcons.micOn />: <svgIcons.micOff/>
          }
        </li>
        <li><p>{userName}</p></li>
        {/* <li>
          <p>S <i className="fa fa-arrow-up"/> {sendBitRate}</p>
        </li>
        <li>
          <p>R <i className="fa fa-arrow-down"/> {receiverBitRate}</p>
        </li> */}
        <li>
          <MoreVertIcon
            style={{fill: '#ffffff', marginTop: '2px', cursor: 'pointer'}}
            onClick={() => setShowDropDownList(!showDropDownList)}
          />
          {
            showDropDownList &&
              <div className="video-more-options-list" >
                <ul>
                  <li onClick={() => handleResolution(userInfo, 'up')}>{t('mainPage.videoComponent.functionList.upResoluation')}</li>
                  {/* <li onClick={() => handleResolution(userInfo, 'up')}>해상도 조절 높음</li> */}
                  {/* <li onClick={() => handleResolution(userInfo, 'down')}>해상도 조절 내림</li> */}
                  {/* <li onClick={() => {
                    setShowDropDownList(!showDropDownList);
                    handleClickFixVideo(userInfo);
                  }}>고정하기</li> */}
                  <li
                    onClick={() => {
                      setShowDropDownList(!showDropDownList);
                      dispatch(tabComponentAction.handleChangeShowChatState(true));
                      dispatch(chatComponentAction.changeDirectMessageToUser(userInfo));
                    }}
                  >
                    {t('mainPage.videoComponent.functionList.directMessage')}
                  </li>
                  {
                    localUserInfo.user_tp !== 'S' &&
                      <li onClick={() => {setShowDropDownList(!showDropDownList); alert('개발 체크하는중입니다.');}}>{t('mainPage.videoComponent.functionList.shareHost')}</li>
                  }
                  {
                    localUserInfo.user_tp !== 'S' &&
                      <li
                        onClick={() => {
                          setShowDropDownList(!showDropDownList);
                          Alert({
                            title: `${userInfo.user_name}님 강퇴시키기`,
                            btnAccept: '확인',
                            btnReject: '취소',
                            handleClickAccept: () => {
                              handleUserKick();
                            },
                            handleClickReject: () => {},
                          });
                        }}
                      >
                        {t('mainPage.videoComponent.functionList.requestLeave')}
                      </li>
                  }
                </ul>
              </div>
          }
        </li>
      </ul>
    </div>
  );
}
// 스토어에서 데이터 가져와서 연결
const mapStateToProps = (state) => ({
  disableChatUser: chatComponentSelector.selectDisableChatUser(state),
  currentUser: userSelect.selectCurrentUser(state),

  // 네트워크 상태가 안 좋은 유저 리스트
  listUserBadNetwork: meetingRoomSelector.selectListUserBadNetwork(state),
  peerConnections: meetingRoomSelector.selectPeerConnections(state),
});

function mapDispatchToProps(dispatch) {
  let actions = bindActionCreators({StreamVideoComponentRemote});
  return {...actions, dispatch};
}

export default connect(mapStateToProps, mapDispatchToProps)(StreamVideoComponentRemote);
