import React, {Component} from 'react';
import {bindActionCreators, useDispatch, useSelector} from 'redux';
import {withTranslation} from 'react-i18next';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import {CSSTransition} from 'react-transition-group';
import _, {constant} from 'lodash';
import moment from 'moment';
import {toast, ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import './style.scss';
import Alert from '../../components/Alert';
import Popup from '../../components/Popup';
import {configSocket, getSocket} from '../rootSocket';

import userSelector from '../../features/UserFeature/selector';
import userService from '../../features/UserFeature/service';
import userAction from '../../features/UserFeature/actions';

import meetingRoomSocket from './MeetingRoom.Socket';
import meetingRoomAction from './MeetingRoom.Action';
import meetingRoomSelect from './MeetingRoom.Selector';
import {getAllUserByUserRoom, setRoomRecord, setSaveRecordData, checkTimeforRoom, setTimeRoomWithTime, setTimeRoomWithValue} from './MeetingRoom.Service';
import {getRoomInfo} from './MeetingRoom.Service';

// import landing page: landingPageAction
import landingPageAction from '../LandingPage/LandingPage.Action';

// import remoteStream component
import remoteStreamSelector from './components/RemoteStreamContainer/RemoteStreamContainer.Selector';
import remoteStreamAction from './components/RemoteStreamContainer/RemoteStreamContainer.Action';
import RemoteStreamContainer from './components/RemoteStreamContainer';

// import tabComponent
import tabComponentAction from './components/TabComponent/TabComponent.Action';
import tabComponentSelector from './components/TabComponent/TabComponent.Selector';
import TabComponent from './components/TabComponent';

// import heading component
import HeadingVideoComponent from './components/HeadingVideoComponent';
import headingVideoComponentSelect from './components/HeadingVideoComponent/HeadingVideoComponent.Selector';

// import chatting component
import ChatComponent from './components/ChatComponent';

import RemoteStreamContainerShare from './components/RemoteStreamContainerShare';
import {getInformationRoom} from './components/RemoteStreamContainer/RemoteStreamContainer.Service';

// import socket config
import {configSocketShare, getSocketShare} from '../rootSocket';

// import component alpha (UI)
import UserList from './components/UserList';
import WrapperLoading from '../../components/Loading/WrapperLoading';
import WhiteBoard from './components/WhiteBoard';
import RemoteStreamContainerAudio from './components/RemoteStreamContainerAudio';


import chatComponentSocket from './components/ChatComponent/ChatComponent.Socket';
import chatComponentAction from './components/ChatComponent/ChatComponent.Action';
import landingPageSelector from '../LandingPage/LandingPage.Selector';

import {defineValueMode} from '../../constants/ruleDisplay';
import Errors from '../../components/Error/error';
import utils from '../../constants/utils';
import userUtils from '../../features/UserFeature/utils';


// import component beta (UX)
import services from '../../features/UserFeature/service';
import {isMobile} from 'react-device-detect';
import AlertTime from '../../components/AlertTimeRoom';

let constraintsHost = {
  audio: {
    sampleRate: 44000,
    sampleSize: 16,
    chanelCount: 2,
    echoCancellation: true,
    noiseSuppression: true,
    autoGainControl: true,
  },
  video: {
    frameRate: {
      min: 10, ideal: 15, max: 20,
    },
    width: {
      min: 640,
      ideal: 1280,
      max: 1280,
    },
    height: {
      min: 480,
      ideal: 720,
      max: 720,
    },
    facingMode: 'environment',
  },
};

let constraintsGuest = {
  audio: {
    sampleSize: 8,
    echoCancellation: false,
  },
  video: {
    frameRate: 15,
    width: {
      min: 640,
      ideal: 1280,
      max: 1280,
    },
    height: {
      min: 480,
      ideal: 720,
      max: 720,
    },
  },
};

let intervalMonitoringOnline = null;
let intervalMonitoringOffer = null;
class MeetingRoom extends Component {
  constructor(props) {
    super(props);

    this.state = {

      localStream: null,
      remoteStreams: [],
      // remoteStreams: [
      //   {
      //     id: 'student1',
      //     name: '1',
      //   }, {
      //     id: 'student2',
      //     name: '2',
      //   },
      //   {
      //     id: 'student3',
      //     name: '3',
      //   }, {
      //     id: 'student4',
      //     name: '4',
      //   },
      //   {
      //     id: 'student5',
      //     name: '5',
      //   }, {
      //     id: 'student6',
      //     name: '6',
      //   },
      //   {
      //     id: 'student7',
      //     name: '7',
      //   },
      //   {
      //     id: 'student7',
      //     name: '8',
      //   },
      //   {
      //     id: 'student7',
      //     name: '9',
      //   },
      // ],
      remoteStreamsTemp: [],
      peerConnections: {},

      mediaRecorder: null,
      sdpData: null,
      peerCount: 0,
      recorder: null,
      modeType: '2x2',

      pc_config: {
        'iceServers': [
          {url: 'stun:stun01.sipphone.com'},
          {url: 'stun:stun.ekiga.net'},
          {url: 'stun:stun.fwdnet.net'},
          {url: 'stun:stun.ideasip.com'},
          {url: 'stun:stun.iptel.org'},
          {url: 'stun:stun.rixtelecom.se'},
          {url: 'stun:stun.schlund.de'},
          {url: 'stun:stun.l.google.com:19302'},
          {url: 'stun:stun1.l.google.com:19302'},
          {url: 'stun:stun2.l.google.com:19302'},
          {url: 'stun:stun3.l.google.com:19302'},
          {url: 'stun:stun4.l.google.com:19302'},
          {url: 'stun:stunserver.org'},
          {url: 'stun:stun.softjoys.com'},
          {url: 'stun:stun.voiparound.com'},
          {url: 'stun:stun.voipbuster.com'},
          {url: 'stun:stun.voipstunt.com'},
          {url: 'stun:stun.voxgratia.org'},
          {url: 'stun:stun.xten.com'},
          {
            url: 'turn:lpturn.eny.li:5000?transport=tcp',
            credential: 'plass12345',
            username: 'plass',
          },
          {
            url: 'turn:lpturn.eny.li:5000?transport=udp',
            credential: 'plass12345',
            username: 'plass',
          },
        ],
      },

      sdpConstraints: {
        optional: [{
          VoiceActivityDetection: false,
        }],
        mandatory: {
          OfferToReceiveAudio: true,
          OfferToReceiveVideo: true,
          googEchoCancellation: true,
        },
      },

      isMainRoom: false,

      recordedBlobs: [],

      isGuestSharingScreen: false,
      guestShareScreen: {},
      shareScreen: false,
      userShareScreenId: null,

      disconnected: false,

      fullScreen: false,
      paintScreen: false,
      enableRecord: false,
      roomRecordInfo: null,

      startTime: null,
      errorDevice: false,
      chatAutoFocus: false,

      renderRemoteStreams: [],
      isRemoteExistRenderRemoteStreams: false,

      prevListRemoteStreams: [],
      nextListRemoteStreams: [],
      currentPage: 1,
      handleSlideRemoteBtn: false,

      shareScreenStream: null,
      timeRoom: 0,
    };
  }
  // !ONE FIRST TIMES
  /**
   * componentDidMount 정의함
   * - getSocket(): 웹 RTC연결하기 위한 Socket
   *  만역에 존재하 지않으면 생성함
   *
   * - getSocket() 이벤트:
   * + connect: 성공적으로 연결함
   * + join-room: 룸을 참여함
   * + connection-success: 연결 성공함
   *
   *
   */
  componentDidMount() {
    // 안 보이는 사람을 stream를 다시 수정
    // ! 문제임
    if (!getSocket()) {
      configSocket();
      // 연결한 후에 웹 RTC를 정보를 업데이트함
      getSocket().on('connect', () => {
        getSocket().emit('connection-web-rtc', {}, function(error, message) {
          if (error) {
            alert('web-rtc 연결 시 오류 발생합니다.');
            return;
          }
          getSocket().emit('join-room');
        });
      });
    } else {
      getSocket().emit('connection-web-rtc', {}, function(error, message) {
        if (error) {
          alert('web-rtc 연결 시 오류 발생합니다.');
          return;
        }
        getSocket().emit('join-room');
      });
    }

    const {remoteStreams} = this.state;
    this.setState({
      renderRemoteStreams: remoteStreams.slice(0, 4),
      nextListRemoteStreams: remoteStreams.slice(4, remoteStreams.length),
    });

    getSocket().on('connection-success', async (data) => {
      const params = {
        userRoomId: userUtils.getUserRoomId(),
      };
      const getRoomInfoRes = await getRoomInfo(params);
      const {data: roomInfo} = getRoomInfoRes;
      this.props.dispatch(meetingRoomAction.handleSetRoomInfo(roomInfo));
      navigator.mediaDevices
          .enumerateDevices()
          .then(this.gotDevicesAndCreateStream).catch((e) => console.log(e));


      const response = await setTimeRoomWithTime(params);
      const {message, result} = response;
      if (!result) {
        alert(message);
        window.location.href = 'http://just-link.us/';
      }
      this.socketListenerEventToWebRTC();
      this.socketListenerEventRequestToRoom();
      this.socketListenerEventToPeerDisconnected();
      this.socketListenerEventToEventBitrate();
      this.socketListenerEventToEventScreenShare();
      this.socketListenerEventToEventVideoSlide();
      this.socketListenerEventToChatting();
    });

    // 다름 사람 유저 네임을 수정 시
    getSocket().on('update-username', (data) => {
      try {
        const {newName, remoteSocketId, userId} = data;
        const {remoteStreamsProps, listUser} = this.props;
        let remoteStreamsPropsTemp = remoteStreamsProps;
        const remoteStreamsPropsUpdate = remoteStreamsPropsTemp.map((user) => {
          if (user.userInfo.user_idx === userId) {
            let userTemp = user.userInfo;
            let userObject = {...userTemp, nickname: newName};
            let userTempReturn = {id: user.id, name: user.name, stream: user.stream, userInfo: userObject};
            return userTempReturn;
          } else {
            return user;
          }
        });
        this.props.dispatch(meetingRoomAction.handleSaveRemoteStreams(remoteStreamsPropsUpdate));
        this.setState({
          remoteStreams: remoteStreamsPropsUpdate,
        });
      } catch (error) {
        console.log(error);
      }
    });

    // 자기한테 유저 이름 수정 시
    getSocket().on('my-update-username', (data) => {
      try {
        const {newName, remoteSocketId, userId} = data;
        const {remoteStreamsProps, listUser} = this.props;
        let remoteStreamsPropsTemp = remoteStreamsProps;
        const remoteStreamsPropsUpdate = remoteStreamsPropsTemp.map((user) => {
          if (user.userInfo.user_idx === userId) {
            let userTemp = user.userInfo;
            let userObject = {...userTemp, nickname: newName};
            let userTempReturn = {id: user.id, name: user.name, stream: user.stream, userInfo: userObject};
            return userTempReturn;
          } else {
            return user;
          }
        });
        const {myInfo} = this.props;
        const myInfoUpdate = {...myInfo, nickname: newName};
        this.props.dispatch(userAction.setCurrentUser(myInfoUpdate));
        this.props.dispatch(meetingRoomAction.handleSaveRemoteStreams(remoteStreamsPropsUpdate));

        const {renderRemoteStreams, nextListRemoteStreams, prevListRemoteStreams} = this.state;
        const renderRemoteStreamsTemp = renderRemoteStreams.map((stream) =>
          stream.id === remoteSocketId ?
            {...stream, userInfo: {...stream.userInfo, nickname: newName}} :
              stream,
        );

        const nextListRemoteStreamsTemp = nextListRemoteStreams.map((stream) =>
          stream.id === remoteSocketId ?
            {...stream, userInfo: {...stream.userInfo, nickname: newName}} :
              stream,
        );

        const prevListRemoteStreamsTemp = prevListRemoteStreams.map((stream) =>
          stream.id === remoteSocketId ?
            {...stream, userInfo: {...stream.userInfo, nickname: newName}} :
              stream,
        );

        this.setState({
          renderRemoteStreams: renderRemoteStreamsTemp,
          nextListRemoteStreams: nextListRemoteStreamsTemp,
          prevListRemoteStreams: prevListRemoteStreamsTemp,
          remoteStreams: remoteStreamsPropsUpdate,
        });
      } catch (error) {
        console.log(error);
      }
    });

    // // 다시 불러할 필요없음
    // let fetchCurrentUser = async () => {
    //   try {
    //     let params = {
    //       userRoomId: this.userRoomId(),
    //     };
    //     const response = await services.getCurrent(params);
    //     const {data} = response;
    //     if (data !== null) {
    //       this.props.dispatch(meetingRoomAction.handleSetMyInfo(data));
    //       this.props.dispatch(meetingRoomAction.handleSetUserType({userType: (data.user_tp === 'T' || data.user_tp === 'I') ? 1 : 0}));
    //       this.setState({
    //         isMainRoom: data.user_tp === 'T' || data.user_tp === 'I',
    //         currentUser: data,
    //       });
    //       params = {
    //         userRoomId: this.userRoomId(),
    //       };
    //       const getRoomInfoRes = await getRoomInfo(params);
    //       const {data: roomInfo} = getRoomInfoRes;
    //       this.props.dispatch(meetingRoomAction.handleSetRoomInfo(roomInfo));
    //     }
    //   } catch (error) {
    //     alert('유저 정보를 가지고 올떄 오류를 발생했습니다.');
    //   }
    // };

    // fetchCurrentUser();


    // // 애매함
    // getSocket().on('user-role', (data) => {
    //   const {userRole} = data;
    //   this.props.dispatch(meetingRoomAction.handleSetUserType({userType: (userRole ? 1 : 0), init: true}));
    //   this.setState({
    //     isMainRoom: userRole,
    //   });
    // });
  }

  componentWillReceiveProps(nextProps) {
    // ! 아무것도 처리하지 않음
    if (this.props.listUser.length !== 0 && (nextProps.listUser !== this.props.listUser)) {
      let prevUserIdList = this.props.listUser;
      let currUserIdList = nextProps.listUser;
      // if (!_.isEqual(prevUserIdList, currUserIdList)) {
      if (Object.keys(prevUserIdList).length < Object.keys(currUserIdList).length) {
        const comparer = (otherArray) => {
          return function(current) {
            return otherArray.filter(function(other) {
              return other.user_idx == current.user_idx;
            }).length == 0;
          };
        };
        const diff = currUserIdList.filter(comparer(prevUserIdList))[0];
        let checkExist = this.state.remoteStreams.filter((remote) => remote.userInfo && (remote.userInfo.user_idx === diff.user_idx));
        if (checkExist.length === 0) {
          // toast.info(diff.user_name + '님 이 참가하였습니다.', toastOption);
        }
      }
    }
    if (this.props.modeType !== nextProps.modeType && ( nextProps.modeType === '3x3' || nextProps.modeType === '4x4' )) {
      const {remoteStreams} = this.state;
      meetingRoomSocket.sendToPeer('edit-stream-slide', {
        remoteStreams: remoteStreams,
        type: 'up',
        streamType: 'device',
      });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    try {
      const {
        remoteStreams,
        renderRemoteStreams,
        handleSlideRemoteBtn,
        nextListRemoteStreams,
        prevListRemoteStreams,
        isRemoteExistRenderRemoteStreams,
      } = this.state;
      const {
        remoteStreams: prevRemoteStreams,
        renderRemoteStreams: prevRenderRemoteStreams,
        handleSlideRemoteBtn: prevHandleSlideRemoteBtn,
        isRemoteExistRenderRemoteStreams: prevIsRemoteExistRenderRemoteStreams,
      } = prevState;

      // ! 화면중지 구분해야함
      // userRoom의 유저 리스트를 저장할 필요함
      if (remoteStreams !== prevRemoteStreams) {
        // 새로 들어온 사람이 분리
        const diffRemoteStream = remoteStreams.filter(utils.comparerArrayWithId(prevRemoteStreams));

        // 만약에 새로 들어온 사람이 없으면 return
        if (diffRemoteStream.length === 0 ) return;
        const {userInfo} = diffRemoteStream[0];

        // 만약에서 현재 local에 있는 사람이랑 새로 들어온 사람이 같으면
        const userInfoLocalStorage = userUtils.getUserInfo();
        if (remoteStreams.length !== 1 && userInfoLocalStorage.userId === userInfo.user_idx) return;

        // 새로 들어온사람이 메시지를 출력함
        if (diffRemoteStream[0].userInfo.user_idx !== userInfoLocalStorage.userId )
        {
          Popup({content: `${diffRemoteStream[0].userInfo.user_name}님이 참가하였습니다.`});
        }

        // 현재룸에 들어가는사람이 비교함
        const fetchListUserByUserRoom = async () => {
          let params = {
            userRoomId: userUtils.getUserRoomId(),
          };
          const response = await getAllUserByUserRoom(params);
          const {data} = response;
          const comparer = (otherArray) => {
            return function(current) {
              return otherArray.filter(function(other) {
                return other.userInfo.user_idx === current.user_idx;
              }).length == 1;
            };
          };

          // 디비에서 가지고 오는 데이트를 비교하면 유저 리스트를 저정함
          const listUser = data.filter(comparer(remoteStreams));
          this.props.dispatch(meetingRoomAction.handleSetListUserByUserRoom(listUser));
          this.props.dispatch(meetingRoomAction.handleSaveRemoteStreams(remoteStreams));
        };
        fetchListUserByUserRoom();
      }


      /**
       * @description 연결되고 있는 remoteStream를 변경할 떄 마다
       */
      if (remoteStreams !== prevRemoteStreams) {
        /**
         * 만약 전체 stream의 사이즈가 4보다 크면
         * -- Method 1
         * 새로 들어온 사람이 있는 경우에는
         * 만약에서 현재 출력페이지에서 길이 3인경우에는 renderRemote 추가함
         *
         */
        if (remoteStreams.length > 4) {
          const diffRemoteStream = remoteStreams.filter(utils.comparerArrayWithId(prevRemoteStreams));
          // 새로운 사람이 들어감
          if (diffRemoteStream.length !== 0) {
            const lengthRenderRemoteStream = renderRemoteStreams.length;
            // 현 출력페이지에서 만약에 3명이 있으면 한명이 추가함
            // render 리스트에서 추가함
            if (lengthRenderRemoteStream === 3) {
              this.setState((prevState) => {
                return {
                  renderRemoteStreams: [...prevState.renderRemoteStreams, diffRemoteStream[0]],
                };
              });
            } else { // 그렇지 않은 경우에는 nextListRemote에서 추가함
              let nextListRemoteStreamsTemp = nextListRemoteStreams;
              nextListRemoteStreamsTemp.push(diffRemoteStream[0]);
              this.setState({
                nextListRemoteStreams: nextListRemoteStreamsTemp,
              });
              meetingRoomSocket.sendToPeer('edit-stream-slide', {
                remoteStreams: nextListRemoteStreamsTemp,
                type: 'down',
                streamType: 'device',
              });
            }
          }
        } else {
          // 그렇지 않은 경우에는 출력 페이지를 잘라서 저장함
          // 처음에 들어갔을 떄 자름
          let renderRemoteStreamsTemp = remoteStreams.slice(0, 4);
          this.setState({
            renderRemoteStreams: renderRemoteStreamsTemp,
          });
        }
      }


      // ! PreV 또는 Next btn 이벤트
      // 출력 stream 값들이 설정한 후에 stream를 조절함
      // renderRemote 출력 stream의 해상도를 올림 또는 안 보이는학생이 내림
      if ((handleSlideRemoteBtn !== prevHandleSlideRemoteBtn) && (renderRemoteStreams !== prevRenderRemoteStreams)) {
        const diffUp = renderRemoteStreams;
        if (diffUp.length !== 0) {
          meetingRoomSocket.sendToPeer('edit-stream-slide', {
            remoteStreams: diffUp,
            type: 'up',
            streamType: 'device',
          });
        }
        // ! 다른유저는 해상도 낮고 있지만, 또 다시 요청함
        const diffDown = remoteStreams.filter(utils.comparerArrayWithId(renderRemoteStreams));
        if (diffDown.length !== 0) {
          meetingRoomSocket.sendToPeer('edit-stream-slide', {
            remoteStreams: diffDown,
            type: 'down',
            streamType: 'device',
          });
        }
      }

      // ! 현재 출력되고 있는 페이지에서 나갈 사람이 있을때
      if (isRemoteExistRenderRemoteStreams !== prevIsRemoteExistRenderRemoteStreams &&
        renderRemoteStreams.length !== prevRenderRemoteStreams.length &&
        isRemoteExistRenderRemoteStreams ) {
        let addRenderRemoteStream = [];
        let renderRemoteStreamsTemp = [];
        let nextListRemoteStreamsTemp = nextListRemoteStreams;

        // ! 다시 확인할 필요함
        /**
         * @description 만약에 앞에 stream가 존재하면 하나를 빼고 출력 stream에서 추가함
         */
        if (nextListRemoteStreams.length !== 0) {
          addRenderRemoteStream = nextListRemoteStreams[0];
          nextListRemoteStreamsTemp = nextListRemoteStreams.slice(1, nextListRemoteStreams.length);
          renderRemoteStreamsTemp = [...renderRemoteStreams, addRenderRemoteStream];
          this.setState({
            nextListRemoteStreams: nextListRemoteStreamsTemp,
            renderRemoteStreams: renderRemoteStreamsTemp,
            isRemoteExistRenderRemoteStreams: false,
          });

          /**
           * @description 만약에 앞stream 리스트에서 stream가 존해하면 하나 뺴서 출력stream에서 추가함
           *
          */
        } else if (prevListRemoteStreams.length !== 0) {
          let valuesMode = defineValueMode.filter((item) => item.sizeName === '2x2')[0];
          let addRenderRemoteStream = prevListRemoteStreams.slice(prevListRemoteStreams.length - 2, prevListRemoteStreams.length); // 뒤stream 리스트를 2 원소를 가짐
          let prevListRemoteStreamsTemp = prevListRemoteStreams.slice(0, prevListRemoteStreams.length - 2); // 뒤stream를 가진 stream를 제거함
          let k = 0;
          // ! 체그함
          // render stream에서 추가함
          for (let i = 0; i < valuesMode.vol.volLimit; i += valuesMode.vol.volIncrease) {
            if (addRenderRemoteStream[k] && renderRemoteStreams[k]) {
              renderRemoteStreamsTemp.push(addRenderRemoteStream[k]); // 뒤stream를 뺀 stream를 출력 stream를 저장함
              renderRemoteStreamsTemp.push(renderRemoteStreams[k]); // 뒤stream를 뺀 stream를 출력 stream를 저장함
            } else if (renderRemoteStreams[k]) {
              renderRemoteStreamsTemp.push(renderRemoteStreams[k]);
            }
            k++;
          }
          // 맨 마지막 페이지에서 3명만 보다가 한명이 나갔을때
          this.setState((prevState) => {
            return {
              renderRemoteStreams: renderRemoteStreamsTemp,
              prevListRemoteStreams: prevListRemoteStreamsTemp,
              currentPage: prevState.currentPage - 1,
            };
          });
        } else {
          console.log('stream 화면을 마핑할 때 예상하지 못한 예외처리 발생합니다');
        }

        const diffUp = renderRemoteStreamsTemp;
        if (diffUp.length !== 0) {
          meetingRoomSocket.sendToPeer('edit-stream-slide', {
            remoteStreams: diffUp,
            type: 'up',
            streamType: 'device',
          });
        }

        const diffDown = remoteStreams.filter(utils.comparerArrayWithId(renderRemoteStreamsTemp));
        if (diffDown.length !== 0) {
          meetingRoomSocket.sendToPeer('edit-stream-slide', {
            remoteStreams: diffDown,
            type: 'down',
            streamType: 'device',
          });
        }
      }
    } catch (error) {
      Errors.showErrorMessage(error);
    }

    // 어떤 카마라인지
    if (this.props.currentVideo !== prevProps.currentVideo) {
      const updateVideoId = this.props.currentVideo;
      if (updateVideoId === null || updateVideoId === undefined) return;
      // localStorage.setItem('videoInputDeviceId', updateVideoId);
      // const deviceTemp = listVideoInput.filter((dev) => dev.value === updateVideoId)[0];
      // this.setState({videoInput: deviceTemp});
      // this.getStream(true);
      // this.getLocalStream();
    }

    if (this.props.fixVideo !== prevProps.fixVideo) {
      const {remoteStreams} = this.state;
      const {status, userInfo} = this.props.fixVideo;
      if (status) {
        const fixRemote = remoteStreams.filter((value) => value.userInfo.user_idx === userInfo.user_idx);
        const notFixRemote = remoteStreams.filter((value) => value.userInfo.user_idx !== userInfo.user_idx);
        let newRemoteStreamArray = [...fixRemote, ...notFixRemote];
        this.setState({
          remoteStreams: newRemoteStreamArray,
        });
      }
    }
  }

  componentWillUnmount() {
    clearInterval(intervalMonitoringOffer);
    clearInterval(intervalMonitoringOnline);
    this.setState({
      disconnected: true,
    });
  }
  /**
   * ======================================================================================================
   * ======================================================================================================
   * START: Stream 생성시 Controller 코드
   * ======================================================================================================
   * ======================================================================================================
   */

  /**
   * stream를 생성 성공함
   * @stream stream
   *  */
  handleSuccess = async (stream, isLocalStream, changeStream) => {
    // ! 체크할 필요함
    if (isLocalStream && !this.state.localStream) {
      if (this.state.remoteStreams.length === 0) {
        let params = {
          userRoomId: window.localStorage.getItem('usr_id'),
        };
        let response = await userService.getCurrent(params);
        const {result, data} = response;
        if (result) {
          this.props.dispatch(userAction.setCurrentUser(data));

          const localRemoteStreamTemp = {
            id: getSocket().id,
            name: getSocket().id,
            stream: stream,
            userInfo: data,
            type: 'screen-self',
          };
          this.setState({
            remoteStreams: [localRemoteStreamTemp],
            loading: false,
            localStream: stream,
          });
          meetingRoomSocket.sendToPeer('onlinePeers', null, {local: getSocket().id});

          const {cam_status, mic_status} = data;
          this.props.dispatch(tabComponentAction.handleChangeCamState(Number(cam_status)));
          this.props.dispatch(tabComponentAction.handleChangeMicState(Number(mic_status)));
        }
      }
    }

    // ! 카메라를 변경시
    // try {
    //   const audioTrack = stream.getAudioTracks()[0];
    //   const videoTrack = stream.getVideoTracks()[0];
    //   Object.values(this.state.peerConnections).forEach((pc) => {
    //     const sender = pc.getSenders().find((s) => {
    //       return s.track.kind === audioTrack.kind;
    //     });
    //     if (sender) {
    //       sender.replaceTrack(audioTrack);
    //     }
    //   });
    //   Object.values(this.state.peerConnections).forEach((pc) => {
    //     const sender = pc.getSenders().find((s) => {
    //       return s.track.kind === videoTrack.kind;
    //     });
    //     if (sender) {
    //       sender.replaceTrack(videoTrack);
    //     }
    //   });
    // } catch (e) {
    //   console.log(e);
    // }
  }

  handleError = (error) => {
    console.log(error);
    if (error) {
      this.setState({
        errorDevice: true,
      });
    }
    if (error.name === 'ConstraintNotSatisfiedError') {
      // console.log(`The resolution is not supported by your device.`)
    } else if (error.name === 'PermissionDeniedError') {
      // console.log(
      //   "Permissions have not been granted to use your camera and " +
      //   "microphone, you need to allow the page access to your devices in " +
      //   "order for the demo to work."
      // )
    }
  }


  gotDevices = (deviceInfos) => {
    let listDetectAudioInput = [];
    let listDetectVideoInput = [];
    let selectedAudioInput = {value: '', text: ''};
    let selectedVideoInput = {value: '', text: ''};

    for (let i = 0; i !== deviceInfos.length; ++i) {
      const deviceInfo = deviceInfos[i];
      if (deviceInfo.kind === 'audioinput') {
        const option = {
          value: deviceInfo.deviceId,
          text: deviceInfo.label || `audio`,
        };
        listDetectAudioInput.push(option);
        let storeSelectAudioInput = localStorage.getItem('audioInputDeviceId');
        if (!storeSelectAudioInput && !selectedAudioInput.value) {
          localStorage.setItem('audioInputDeviceId', option.value);
          selectedAudioInput = option;
        } else if (storeSelectAudioInput === option.value) {
          selectedAudioInput = option;}
      } else if (deviceInfo.kind === 'videoinput') {
        const option = {
          value: deviceInfo.deviceId,
          text: deviceInfo.label || `camera`,
        };
        listDetectVideoInput.push(option);
        let storeSelectVideoInput = localStorage.getItem('videoInputDeviceId');
        if (!storeSelectVideoInput && !selectedVideoInput.value) {
          localStorage.setItem('videoInputDeviceId', option.value);
          selectedVideoInput = option;
        } else if (storeSelectVideoInput === option.value) {
          selectedVideoInput = option;
        }
      } else {}
    }

    this.props.dispatch(landingPageAction.setDevices(listDetectAudioInput, selectedAudioInput, listDetectVideoInput, selectedVideoInput));
    return {
      audio: selectedAudioInput,
      video: selectedVideoInput,
    };
  }
  /**
   * devices 리스트 체크함
   * @listDetectAudioInput audio 인식되는 리스트
   * @listDetectVideoInput video 인식되는 리스트
   * @selectedAudioInput 선택된 마이크
   * @selectedVideoInput 선택된 카마레
   *
   * 설정 페이지에서 stream를 가지고 와서 localStream를 설정
   * 그러지 않으면 (새로고침) 기계를 다시 인식하고 저장함
   * Redux에서 저장한 값이 있으면 가지고 와서 저장함
   * 그렇지 않으면 다시 각 기계를 인식함
   *  */
  gotDevicesAndCreateStream = async (deviceInfos) => {
    const {localStream} = this.props;
    if (localStream) {
      this.handleSuccess(localStream, true);
    } else {
      let storeSelectAudioInput = localStorage.getItem('audioInputDeviceId');
      let storeSelectVideoInput = localStorage.getItem('videoInputDeviceId');

      let selectedAudioInput = {value: '', text: ''};
      let selectedVideoInput = {value: '', text: ''};

      // 일단 이렇게 함
      if (storeSelectAudioInput && storeSelectVideoInput) {
        selectedAudioInput.value = storeSelectAudioInput;
        selectedVideoInput.value = storeSelectVideoInput;

        setTimeout(() => {
          let {audio, video} = this.gotDevices(deviceInfos);
          selectedAudioInput = audio;
          selectedVideoInput = video;
        }, 3 * 1000);
      } else {
        let {audio, video} = this.gotDevices(deviceInfos);
        selectedAudioInput = audio;
        selectedVideoInput = video;
      }


      // / Stream를 생성함
      let constraints = {
        audio: null,
        video: null,
      };

      let audioAvailable = null;
      let videoAvailable = null;

      await navigator.mediaDevices.getUserMedia({audio: true})
          .then(() => audioAvailable = true)
          .catch(() => audioAvailable = false);

      await navigator.mediaDevices.getUserMedia({video: true})
          .then(() => videoAvailable = true)
          .catch((e) => videoAvailable = false);

      /**
       * 강사의 화면 해상도: 1280 * 720 (HD)
       */
      const {userTp} = userUtils.getUserInfo();
      if (userTp === 'T' || userTp === 'I') {
        // ===========================================================//
        // ============================= 강사 =========================//
        // ===========================================================//
        if (!audioAvailable) {
          constraints.audio = false;
        } else {
          constraints.audio = constraintsHost.audio;
          constraints.audio.deviceId = selectedAudioInput.value ? {exact: selectedAudioInput.value} : undefined;
        }

        if (!videoAvailable) {
          constraints.video = false;
        } else {
          constraints.video = constraintsHost.video;
          constraints.video.deviceId = selectedVideoInput.value ? {exact: selectedVideoInput.value} : undefined;
        }
        navigator.mediaDevices.getUserMedia(constraints)
            .then((stream) => this.handleSuccess(stream, true))
            .catch((e) => this.handleError(e));
        // ===========================================================//
        // ===========================================================//
        // ===========================================================//
      } else {
        // ===========================================================//
        // ============================= 학생 =========================//
        // ===========================================================//
        if (!audioAvailable) {
          constraints.audio = false;
        } else {
          constraints.audio = constraintsGuest.audio;
          constraints.audio.deviceId = selectedAudioInput.value ? {exact: selectedAudioInput.value} : undefined;
        }
        if (!videoAvailable) {
          // 카메라가 없으면
          const audioStream = await navigator.mediaDevices.getUserMedia(constraints).catch((e) => this.handleError(e));
          let canvasStream = document.createElement('canvas').captureStream();
          if (audioStream) {
            let audioTrack = audioStream.getTracks().filter(function(track) {
              return track.kind === 'audio';
            })[0];
            canvasStream.addTrack(audioTrack);
          }
          this.handleSuccess(canvasStream, true);
          return;
        } else {
          constraints.video = constraintsGuest.video;
          constraints.video.deviceId = selectedVideoInput.value ? {exact: selectedVideoInput.value} : undefined;
        }
        // ! 문젳 체크함
        navigator.mediaDevices.getUserMedia(constraints)
            .then((stream) => this.handleSuccess(stream, true))
            .catch((e) => {
              // OBS 카메라인 경우
              if (videoAvailable) {
                let constraints = {
                  video: true,
                  audio: true,
                };
                console.log('해당 카메라가 해상도를 도달하지 못합니다.', e);
                navigator.mediaDevices.getUserMedia(constraints).then((stream) => this.handleSuccess(stream, true));
              } else {
                this.handleError(e);
              }
            });
        // ===========================================================//
        // ===========================================================//
        // ===========================================================//
      }
    }
  };

  createPeerConnection = async ({socketID, userInfo, type}, callback) => {
    try {
      let pc = new RTCPeerConnection(this.state.pc_config);

      // console.log('pc', pc);

      const {connectionState, iceConnectionState, iceGatheringState} = pc;

      // console.log(pc.connectionState, pc.iceConnectionState, pc.iceGatheringState);
      // if (!(connectionState === 'connected' && iceConnectionState === 'connected' && iceGatheringState === 'complete')) {
      // }
      const peerConnections = {
        ...this.state.peerConnections,
        [socketID]: pc,
      };

      this.props.dispatch(meetingRoomAction.handleSetPeerConnections(peerConnections));
      this.setState({peerConnections});

      pc.onicecandidate = (e) => {
        if (e.candidate) {
          meetingRoomSocket.sendToPeer('candidate', e.candidate, {
            local: getSocket().id,
            remote: socketID,
            streamType: 'device',
          });
        }
      };
      pc.oniceconnectionstatechange = (e) => {
        const {connectionState, iceConnectionState, iceGatheringState} = e.currentTarget;
        // console.log(connectionState, iceConnectionState, iceGatheringState);
      };
      pc.ontrack = (e) => {
        let _remoteStream = null;
        let remoteStreams = this.state.remoteStreams;
        let remoteVideo = {};

        const rVideos = this.state.remoteStreams.filter((stream) => stream.id === socketID);
        if (rVideos.length) {
          _remoteStream = rVideos[0].stream;
          _remoteStream.addTrack(e.track, _remoteStream);

          remoteVideo = {
            ...rVideos[0],
            stream: _remoteStream,
          };
          remoteStreams = this.state.remoteStreams.map((_remoteVideo) => {
            return _remoteVideo.id === remoteVideo.id && remoteVideo || _remoteVideo;
          });
        } else {
          // 3. if not, then create new stream and add track
          _remoteStream = new MediaStream();
          _remoteStream.addTrack(e.track, _remoteStream);
          if (type === 'share-screen') {
            remoteVideo = {
              id: socketID,
              name: socketID,
              stream: _remoteStream,
              userInfo,
              type: 'screen-share',
            };
          } else {
            remoteVideo = {
              id: socketID,
              name: socketID,
              stream: _remoteStream,
              userInfo,
              type: 'screen-user',
            };
          }
          remoteStreams = [...this.state.remoteStreams, remoteVideo];
        }
        this.setState({
          remoteStreams,
        });
      };

      pc.close = () => { };

      // ! 일단 화면 공유했을때
      if (type === 'share-screen') {
        let emptyMediaStream = document.createElement('canvas').captureStream();
        emptyMediaStream.getTracks().forEach((track) => {
          try {
            pc.addTrack(track, emptyMediaStream);
          } catch (error) {
            Errors.showErrorMessage(error);
          }
        });
      } else {
        const {localStream} = this.state;
        if (localStream) {
          localStream.getTracks().forEach((track) => {
            try {
              pc.addTrack(track, localStream);
            } catch (error) {
              Errors.showErrorMessage(error);
            }
          });
        } else {
          Errors.showErrorMessage('peer Connection 만들었을때 localStream Null');
        }
      }
      callback(pc);
    } catch (e) {
      Errors.showErrorMessage('Something went wrong! pc not created!!', e);
      callback(null);
    }
  }

  // WebRTC 연경하기 위한 socket 리스닝 이벤트
  socketListenerEventToWebRTC = () => {
    /**
     * 새로 PC가 들어갔으면 처리하는 이벤트
     * 서버에서 받은 Socket_ID를 연결함
     * 동시 2PC를 실행함
     * - 상대방 보내는 정보를 파약함
     * !학생 화면에서 모리터링 이벤트 - (먼저 Peer객체 만들어서 연결하는사람)
     */
    // ! userInfo null bug
    getSocket().on('online-peer', ({socketID, userInfo}) => {
      // console.log('on line', socketID, userInfo);
      // console.warn('====on line======================', socketID, userInfo);
      if (!userInfo || !socketID) return;
      // ! 버그함
      try {
        const dispatch = this.props.dispatch;
        this.createPeerConnection({socketID, userInfo}, (peerConnection) => {
          if (peerConnection) {
            let receiverVideo = peerConnection.getReceivers()[1];
            let senderVideo = peerConnection.getSenders()[1];
            // ! 화면 공유 햇때 없음
            // console.log('========receiver========', receiverVideo);
            // console.log('========sender========', senderVideo);
            // console.log('========sender========', this.state.remoteStreams);

            // if (!receiverVideo && !senderVideo)
            // {
            //   return;
            // }

            let lastResult;
            let lastResultSender;
            let countZero = 0;
            let alertFlag = false;
            let monitorTime = 100;
            const dispatch = this.props.dispatch;
            // !버그가 있음
            // console.log('i cam connect', socket, userInfo);
            intervalMonitoringOnline = setInterval(() => {
              const {connectionState, iceConnectionState, iceGatheringState} = peerConnection;
              if (connectionState === 'connected' && iceConnectionState === 'connected' && iceGatheringState === 'complete') {
                // - 상대방 보내는 정보를 파약함
                // 0 - Video, 1 - Audio
                try {
                  senderVideo.getStats(null).then((stats) => {
                    stats.forEach((report) => {
                      let bytes;
                      if (report.type === 'outbound-rtp') {
                        try {
                          if (report.isRemote) {
                            return;
                          }
                          if (lastResultSender && lastResultSender.has(report.id)) {
                            bytes = report.bytesSent;
                            let currentBytes = ((8 * (bytes - lastResultSender.get(report.id).bytesSent)) / 1000 ) / monitorTime;
                            console.log('send', currentBytes, userInfo.user_idx);
                            if (currentBytes === 0) {
                              console.error('====================보내는 데이터가 0 입니다. ================');
                            }
                          }
                        } catch (error) {
                          console.log(error);
                        }
                      }
                    });
                    lastResultSender = stats;
                  });

                  receiverVideo.getStats(null).then((stats) => {
                    stats.forEach((report) => {
                      let bytes;
                      if (report.type === 'inbound-rtp') {
                        if (report.isRemote) {
                          return;
                        }
                        if (lastResult && lastResult.has(report.id)) {
                          bytes = report.bytesReceived;
                          let currentBytes = ((8 * (bytes - lastResult.get(report.id).bytesReceived)) / 1000 ) / monitorTime;
                          console.log('revice', currentBytes);
                          // if (currentBytes <= 100) {
                          //   let params = {
                          //     type: 'add',
                          //     data: userInfo,
                          //   };
                          //   dispatch(meetingRoomAction.handleChangeListUserBadNetwork(params));
                          // // getSocket().emit('alert-bitrate-user', {remoteSocketId: socketID});
                          // } else if (currentBytes >= 100) {
                          //   let params = {
                          //     type: 'remove',
                          //     data: userInfo,
                          //   };
                          //   dispatch(meetingRoomAction.handleChangeListUserBadNetwork(params));
                          // }
                          if (bytes === 0) {
                            countZero++;
                          }
                          // if (countZero === 5 && !alertFlag) {
                          //   alertFlag = true;
                          //   const {peerConnections} = this.state;
                          //   let peerConnection = peerConnections[socketID];
                          //   if (peerConnection) {
                          //     getSocket().emit('alert-connection-fail', {remoteSocketId: socketID});
                          //   }
                          // }
                          // console.log('Cal num of packets and append to chart: ', packets - lastResult.get(report.id).packetsSent);
                          console.log('====================Monitor End ================');
                        }
                      }
                    });
                    lastResult = stats;
                  });
                } catch (error) {
                  console.log(error);
                }
              } else {
                console.log('====================Clear Monitor with ================', userInfo.user_name);
                clearInterval(intervalMonitoringOnline);
              }
              // let connectionState = peerConnection.connectionState;
              // if (connectionState === 'disconnected') {
              //   console.log('====================Clear Monitor with ================', userInfo.user_name);
              //   clearInterval(intervalMonitoringOnline);
              // }
            }, monitorTime * 1000);

            // 받은 Stream의 길이 2가 아닌 video또는 audio가 하나가 없음
            // TODO 추가 처리할 필요함
            if (peerConnection.getReceivers().length !== 2) {
              // getSocket().emit('alert-connection-fail', {remoteSocketId: socketID});
            }
            // 받은 Stream가 video 기 없음
            // TODO 추가 처리할 필요함

            peerConnection.createOffer(this.state.sdpConstraints).then((sdp) => {
              peerConnection.setLocalDescription(sdp);
              meetingRoomSocket.sendToPeer('offer', sdp, {
                local: getSocket().id,
                remote: socketID,
              });
            }).then(() => { })
                .catch((error) => console.log('Failed to set session description: ' + error.toString()));
          }
        });
      } catch (error) {
        console.log('Online API 오류');
      }
    });

    /**
     * B PC부터 보내는 sdp 정보를 A PC에서 받아서 처리하는 이벤트
     * !강사 화면에서 모리터링 이벤트 - (다른 사람의 요청을 받아서 실행함)
     * 일단 stream나  화면공유 구분해서 만약에 화면공유한 stream라면 빈 stream를 전달함
     */
    getSocket().on('offer', (data) => {
      // console.warn('====Offer======================, data');
      const {socketID, userInfo, type} = data;
      if (!userInfo || !socketID) return;
      this.createPeerConnection({socketID, userInfo, type}, (peerConnection) => {
        try {
          if (peerConnection) {
            const {remoteStreams, peerConnections} = this.state;


            // console.log(peerConnection.getReceivers());
            // console.log(peerConnection.getSenders());

            let receiverVideo = peerConnection.getReceivers()[1];
            let senderVideo = peerConnection.getSenders()[1];

            // console.log(receiverVideo);
            // console.log(senderVideo);

            if (receiverVideo === undefined || senderVideo === undefined) {
              receiverVideo = peerConnection.getReceivers()[0];
              senderVideo = peerConnection.getSenders()[0];
            }

            // ! 화면 공유 했을때 외예 처리함
            /**
             * video (sharascreen) : peerConnection.getReceivers()[0] //음성이 없으니 video의 인덱스가 0임
             * video (canvas) : peerConnection.getSenders()[0]
             *
             */
            // console.log('========receiver========', peerConnection.getReceivers()[0]);
            // console.log('========sender========', peerConnection.getSenders()[0]);

            // !버그가 있음
            // if (!receiverVideo && !senderVideo)
            // {
            //   return;
            // }

            let lastResult;
            let lastResultSender;
            let countZero = 0;
            let alertFlag = false;
            let monitorTime = 100;
            const dispatch = this.props.dispatch;

            // console.log('i cam connect', socket, userInfo);
            intervalMonitoringOffer = setInterval(() => {
              // - 상대방 보내는 정보를 파약함
              // 0 - Video, 1 - Audio

              // console.log(receiverVideo);
              // console.log(senderVideo);

              const {connectionState, iceConnectionState, iceGatheringState} = peerConnection;
              if (connectionState === 'connected' && iceConnectionState === 'connected' && iceGatheringState === 'complete') {
                try {
                  senderVideo.getStats(null).then((stats) => {
                    stats.forEach((report) => {
                      let bytes;
                      let packets;
                      if (report.type === 'outbound-rtp') {
                        try {
                          if (report.isRemote) {
                            return;
                          }
                          if (lastResultSender && lastResultSender.has(report.id)) {
                            bytes = report.bytesSent;
                            let currentBytes = ((8 * (bytes - lastResultSender.get(report.id).bytesSent)) / 1000 ) / monitorTime;
                            // packets = report.packetsSent;
                            // console.log(`==================== User Info ================`);
                            // console.log(userInfo);
                            // console.log(`==================== [Online = Sender] Monitor Start with user : ${userInfo.user_name} ================`);
                            // console.log(`bitrate: ${currentBytes} Kbps`);
                            // console.log('====================Monitor End ================');
                            // if (currentBytes === 0) {
                            //   console.error('====================보내는 데이터가 0 입니다. ================');
                            // }
                          }
                        } catch (error) {
                          console.log(error);
                        }
                      }
                    });
                    lastResultSender = stats;
                  });

                  receiverVideo.getStats(null).then((stats) => {
                    stats.forEach((report) => {
                      let bytes;
                      if (report.type === 'inbound-rtp') {
                        if (report.isRemote) {
                          return;
                        }
                        if (lastResult && lastResult.has(report.id)) {
                          bytes = report.bytesReceived;
                          let currentBytes = ((8 * (bytes - lastResult.get(report.id).bytesReceived)) / 1000 ) / monitorTime;
                          // packets = report.packetsSent;
                          // if (currentBytes <= 100) {
                          //   let params = {
                          //     type: 'add',
                          //     data: userInfo,
                          //   };
                          //   dispatch(meetingRoomAction.handleChangeListUserBadNetwork(params));
                          //   // getSocket().emit('alert-bitrate-user', {remoteSocketId: socketID});
                          // } else if (currentBytes >= 100) {
                          //   let params = {
                          //     type: 'remove',
                          //     data: userInfo,
                          //   };
                          //   dispatch(meetingRoomAction.handleChangeListUserBadNetwork(params));
                          // }
                          if (bytes === 0) {
                            countZero++;
                          }
                          // if (countZero === 5 && !alertFlag) {
                          //   alertFlag = true;
                          //   const {peerConnections} = this.state;
                          //   let peerConnection = peerConnections[socketID];
                          //   if (peerConnection) {
                          //     getSocket().emit('alert-connection-fail', {remoteSocketId: socketID});
                          //   }
                          // }
                          // console.log('Cal num of packets and append to chart: ', packets - lastResult.get(report.id).packetsSent);
                          // console.log('====================Monitor End ================');
                        }
                      }
                    });
                    lastResult = stats;
                  });
                } catch (error) {
                  console.log(error);
                }
              } else {
                // console.log('====================Clear Monitor with ================', userInfo.user_name);
                clearInterval(intervalMonitoringOffer);
              }
            }, monitorTime * 1000);
            // 받은 Stream의 길이 2가 아닌 video또는 audio가 하나가 없음
            // TODO 추가 처리할 필요함
            if (peerConnection.getReceivers().length !== 2) {
              // getSocket().emit('alert-connection-fail', {remoteSocketId: socketID});
            }

            // 받은 Stream가 video 기 없음
            // TODO 추가 처리할 필요함
            if (!receiverVideo) {

            }
            // 강사화면부터 학생화면을 sdp를 얼마나 주고싶으면 설정
            data.sdp.sdp = data.sdp.sdp.replace(/m=video (.*)\r\nc=IN (.*)\r\n/, 'm=video $1\r\nc=IN $2\r\nb=AS:2000\r\n');
            data.sdp.sdp = data.sdp.sdp.replace(/m=audio (.*)\r\nc=IN (.*)\r\n/, 'm=audio $1\r\nc=IN $2\r\nb=AS:2000\r\n');

            peerConnection.setRemoteDescription(new RTCSessionDescription(data.sdp)).then(
                () => {
                  peerConnection.createAnswer(this.state.sdpConstraints).then((sdp) => {
                    peerConnection.setLocalDescription(sdp);
                    meetingRoomSocket.sendToPeer('answer', sdp, {
                      local: getSocket().id,
                      remote: socketID,
                      streamType: 'device',
                      userId: userUtils.getUserInfo().userId,
                    });
                  });
                },
            ).catch((e) => {
              peerConnection.close();
              // const {remoteStreams} = this.state;
              const remoteStreamsTemp = remoteStreams.filter(
                  (stream) => stream.id !== data.socketID,
              );
              const peerConnectionsTemp = Object.keys(peerConnections).reduce((accumulator, key) => {
                // Copy all except emoji
                if (key !== data.socketID) {
                  accumulator[key] = peerConnections[key];
                }
                return accumulator;
              }, {});
              this.setState((prevState) => {
                return {
                  remoteStreams: remoteStreamsTemp,
                  peerConnections: peerConnectionsTemp,
                };});
              this.props.dispatch(meetingRoomAction.handleSetPeerConnections(peerConnections));
              console.log(e);
            });
          }
        } catch (error) {
          console.log(error);
          return;
        }
      });
    });

    /**
     *
     * A부터 받은 answer를 B PC에서 처리하는 이벤트
     * Audio 및 Video를 B PC에서 원하는 sdp값을 설정해서 A PC를 전달해줌
     *
     */
    getSocket().on('answer', (data) => {
      const {peerConnections, remoteStreams} = this.state;
      let peerConnection = peerConnections[data.socketID];
      if (peerConnection) {
        const {connectionState, iceConnectionState, signalingState} = peerConnection;
        data.sdp.sdp = data.sdp.sdp.replace(/m=video (.*)\r\nc=IN (.*)\r\n/, 'm=video $1\r\nc=IN $2\r\nb=AS:2000\r\n');
        data.sdp.sdp = data.sdp.sdp.replace(/m=audio (.*)\r\nc=IN (.*)\r\n/, 'm=audio $1\r\nc=IN $2\r\nb=AS:2000\r\n');

        if (signalingState === 'stable') {

        } else if (signalingState === 'have-remote-offer') {

        }

        peerConnection.setRemoteDescription(
            new RTCSessionDescription(data.sdp),
        ).then(() => { }).catch((e) => {
          peerConnection.close();
          const remoteStreamsTemp = remoteStreams.filter(
              (stream) => stream.id !== data.socketID,
          );
          const peerConnectionsTemp = Object.keys(peerConnections).reduce((accumulator, key) => {
            if (key !== data.socketID) {
              accumulator[key] = peerConnections[key];
            }
            return accumulator;
          }, {});

          this.setState((prevState) => {
            return {
              remoteStreams: remoteStreamsTemp,
              peerConnections: peerConnectionsTemp,
            };
          });
          this.props.dispatch(meetingRoomAction.handleSetPeerConnections(peerConnections));
          console.error(e);
        });
        // }
      }
    });

    getSocket().on('candidate', (data) => {
      const pc = this.state.peerConnections[data.socketID];
      if (pc && new RTCIceCandidate(data.candidate)) {
        pc.addIceCandidate(new RTCIceCandidate(data.candidate));
      }
    });
  }
  socketListenerEventToEventVideoSlide = () => {
    getSocket().on('alert-edit-stream-slide-rel', ({type, socketID}) => {
      try {
        const {peerConnections} = this.state;
        let peerConnection = peerConnections[socketID];

        if (peerConnection) {
          try {
            // console.log('re connect - check');
            let signalingState = peerConnection.signalingState; // have-remote-offer or stable
            let data = peerConnection.currentRemoteDescription;

            // console.log(socketID, peerConnection);
            if (!data) return;
            // type에 따라 Sdp 데이터 수정함
            if (type === 'up') {
              data.sdp = data.sdp.replace(/m=video (.*)\r\nc=IN (.*)\r\nb=AS:.*\r\n/, 'm=video $1\r\nc=IN $2\r\nb=AS:2000\r\n');
            } else if (type === 'down') {
              data.sdp = data.sdp.replace(/m=video (.*)\r\nc=IN (.*)\r\nb=AS:.*\r\n/, 'm=video $1\r\nc=IN $2\r\nb=AS:1\r\n');
            } else {
              console.log('해당 요청이 존재하지 않음');
              return;
            }
            // signalingState에 따라 Sdp 수정된 부분을 적용함
            // ! Debug
            if (signalingState === 'stable') {
              peerConnection.createOffer().then((offer) => {
                peerConnection.setLocalDescription(offer).then(() => console.log('success')).catch((error) => console.log(error));
              })
                  .then(() => {
                    peerConnection.setRemoteDescription(
                        new RTCSessionDescription(data),
                    ).then(() => { }).catch((e) => console.log(e));
                  });
            }
            else if (signalingState === 'have-remote-offer') {
              peerConnection.setRemoteDescription(new RTCSessionDescription(data)).then(() => { }).catch((e) => console.log(e));
            } else {
              console.warn('signalingState 예외', signalingState);
            }
          } catch (error) {
            console.log(error);
            alert('해상도 값을 조절 오류');
          }
        } else {
          console.error('PC객체 조회시 존재하지 않음 오류', socketID);
        }
      } catch (error) {
        alert('Peer Connection 객체 출력 오류');
        console.error(error);
      }
    });
  }
  socketListenerEventToEventBitrate = () => {
    getSocket().on('alert-bitrate', ({remoteSocketId}) => {
      const {peerConnections} = this.state;
      let peerConnection = peerConnections[remoteSocketId];
      console.log('======================= 해상도 올리는 요청임 ========================');
      if (peerConnection) {
        console.log('======================= I reconnect with user', peerConnection);
        try {
          let signalingState = peerConnection.signalingState; // have-remote-offer or stable
          let data = peerConnection.currentRemoteDescription;
          if (!data) return;
          data.sdp = data.sdp.replace(/m=video (.*)\r\nc=IN (.*)\r\nb=AS:.*\r\n/, 'm=video $1\r\nc=IN $2\r\nb=AS:2000\r\n');
          // signalingState에 따라 Sdp 수정된 부분을 적용함
          if (signalingState === 'have-remote-offer') {
            peerConnection.setRemoteDescription(new RTCSessionDescription(data)).then(() => {console.log('해상도 올리는 요청 성공함');}).catch((e) => console.log(e));
          } else if (signalingState === 'stable') {
            peerConnection.createOffer().then((offer) => peerConnection.setLocalDescription(offer)).then(() => {
              peerConnection.setRemoteDescription(
                  new RTCSessionDescription(data),
              ).then(() => {console.log('해상도 올리는 요청 성공함');}).catch((e) => console.log(e));
            });
          } else {
            console.warn('signalingState 예외', signalingState);
          }
        } catch (error) {
          console.log(error);
        }
      }
    });

    getSocket().on('alert-connection-fail-user', ({remoteSocketId}) => {
      // alert('Bit 값을 통해서 연결 실패 판단됩니다.');
      const {peerConnections} = this.state;
      let peerConnection = peerConnections[remoteSocketId];
      console.log('======================= I reconnect with Peer Connection', peerConnection);
      console.log('======================= I reconnect with peerConnections', peerConnections);
      console.log('======================= I reconnect with Peer Connection', remoteSocketId);
      if (peerConnection) {
        try {
          let signalingState = peerConnection.signalingState; // have-remote-offer or stable
          let data = peerConnection.currentRemoteDescription;
          if (!data) return;
          data.sdp = data.sdp.replace(/m=video (.*)\r\nc=IN (.*)\r\nb=AS:.*\r\n/, 'm=video $1\r\nc=IN $2\r\nb=AS:2000\r\n');
          // signalingState에 따라 Sdp 수정된 부분을 적용함
          if (signalingState === 'have-remote-offer') {
            peerConnection.setRemoteDescription(new RTCSessionDescription(data)).then(() => { }).catch((e) => console.log(e));
          } else if (signalingState === 'stable') {
            peerConnection.createOffer().then((offer) => peerConnection.setLocalDescription(offer)).then(() => {
              peerConnection.setRemoteDescription(
                  new RTCSessionDescription(data),
              ).then(() => { }).catch((e) => console.log(e));
            });
          } else {
            console.warn('signalingState 예외', signalingState);
          }
        } catch (error) {
          console.log(error);
        }
      }
    });
  }
  socketListenerEventToEventScreenShare = () => {
    // 화면공유를 stream를 출력함
    getSocket().on('alert-other-user-share-screen', async ({status, remoteSocketId}) => {
      try {
        const {remoteStreams} = this.state;
        // 화면공유 시작함
        if (status) {
          const shareStream = remoteStreams.find((stream) => stream.id === remoteSocketId);
          this.setState({
            isGuestSharingScreen: status,
            guestShareScreen: shareStream,
          });
        } else {
          this.setState({
            isGuestSharingScreen: status,
          });
        }
      } catch (error) {
        console.log(error);
      }
    });
    // 다른 사람한테 알려주고, bitrate가 낮음
    getSocket().on('alert-other-user-share-screen-change-bitrate', async ({status, remoteSocketId}) => {
      try {
        const {peerConnections} = this.state;
        let peerConnection = peerConnections[remoteSocketId];
        if (peerConnection) {
          try {
            let signalingState = peerConnection.signalingState; // have-remote-offer or stable
            let data = peerConnection.currentRemoteDescription;
            if (!data) return;

            if (status) {
              console.log('화면공유 시작함', remoteSocketId);
              data.sdp = data.sdp.replace(/m=video (.*)\r\nc=IN (.*)\r\nb=AS:.*\r\n/, 'm=video $1\r\nc=IN $2\r\nb=AS:100\r\n');
            } else {
              console.log('화면공유 중지함', remoteSocketId);
              data.sdp = data.sdp.replace(/m=video (.*)\r\nc=IN (.*)\r\nb=AS:.*\r\n/, 'm=video $1\r\nc=IN $2\r\nb=AS:2000\r\n');
            }
            // signalingState에 따라 Sdp 수정된 부분을 적용함
            if (signalingState === 'have-remote-offer') {
              peerConnection.setRemoteDescription(new RTCSessionDescription(data)).then(() => {
                // console.log('변경 성공', signalingState, data.sdp);
              }).catch((e) => console.log(e));
            } else if (signalingState === 'stable') {
              peerConnection.createOffer().then((offer) => peerConnection.setLocalDescription(offer)).then(() => {
                peerConnection.setRemoteDescription(
                    new RTCSessionDescription(data),
                ).then(() => {
                  // console.log('변경 성공', signalingState, data.sdp);
                }).catch((e) => console.log(e));
              });
            } else {
              console.warn('signalingState 예외', signalingState);
            }
          } catch (error) {
            console.log(error);
          }
        }
      } catch (error) {
        console.log(error);
      }
    });

    getSocket().on('alert-share-screen', async ({remoteId, shareScreenState}) => {
      const {sdpData, peerConnections} = this.state;
      let pc = null;
      let data = sdpData;
      if (shareScreen && sdpData) {
        // 화면 공유했을때
        data.sdp.sdp = data.sdp.sdp.replace(/m=video (.*)\r\nc=IN (.*)\r\nb=AS:.*\r\n/, 'm=video $1\r\nc=IN $2\r\n'); // remove
        if (0 <= peerCount && peerCount <= 10) {
          data.sdp.sdp = data.sdp.sdp.replace(/m=video (.*)\r\nc=IN (.*)\r\n/, 'm=video $1\r\nc=IN $2\r\nb=AS:500\r\n'); // update
        } else if (11 <= peerCount && peerCount <= 20) {
          data.sdp.sdp = data.sdp.sdp.replace(/m=video (.*)\r\nc=IN (.*)\r\n/, 'm=video $1\r\nc=IN $2\r\nb=AS:400\r\n');
        } else {
          data.sdp.sdp = data.sdp.sdp.replace(/m=video (.*)\r\nc=IN (.*)\r\n/, 'm=video $1\r\nc=IN $2\r\nb=AS:200\r\n');
        }
        // console.log("down sdp", data);
        pc = peerConnections[sdpData.socketID];
        if (pc) {
          pc.createOffer().then((offer) => pc.setLocalDescription(offer))
              .then(() => {
                pc.setRemoteDescription(
                    new RTCSessionDescription(data.sdp),
                ).then(() => { }).catch((e) => console.log(e));
              });
        }
      } else {
        // 화면공유 취소
        pc = peerConnections[sdpData.socketID];
        data.sdp.sdp = data.sdp.sdp.replace(/m=video (.*)\r\nc=IN (.*)\r\nb=AS:.*\r\n/, 'm=video $1\r\nc=IN $2\r\n'); // remove
        data.sdp.sdp = data.sdp.sdp.replace(/m=video (.*)\r\nc=IN (.*)\r\n/, 'm=video $1\r\nc=IN $2\r\nb=AS:750\r\n'); // update
        if (pc) {
          pc.createOffer().then((offer) => pc.setLocalDescription(offer))
              .then(() => {
                pc.setRemoteDescription(
                    new RTCSessionDescription(data.sdp),
                ).then(() => { }).catch((e) => console.log(e));
              });
        }
      }
    });
    // 유저를 정보를 업데이트 시 유저 정보를 다시 불러야됨
    getSocket().on('alert-update-user-auth', async (data) => {
      const toastOption = {
        position: 'top-right',
        autoClose: 2000,
        hideProgressBar: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      };

      let text;
      const {value} = data;
      if (value === 1) {
        text = <div>오너가 되었습니다.<br />(모든 기능 사용 가능)</div>;
      } else if (value === 2) {
        text = <div>호스트가 되었습니다.<br />(화면 공유, 화이트 보드 사용 가능)</div>;
      } else if (value === 0) {
        text = <div>권환이 회수되었습니다.</div>;
      }
      toast.info(text, toastOption);
      // const {currentUser} = this.props;
      // console.log(currentUser);
      // const currentUserTemp = {...currentUser, host_user: data.value};
      // console.log(currentUserTemp);
      let params = {
        userRoomId: window.localStorage.getItem('usr_id'),
      };
      let response = await userService.getCurrent(params);
      const {result, data: userInfo} = response;
      if (result) {
        this.props.dispatch(userAction.setCurrentUser(userInfo));
      }
    });
  }
  socketListenerEventToPeerDisconnected = () => {
    getSocket().on('peer-disconnected', (data) => {
      try {
        const {peerConnections, remoteStreams, renderRemoteStreams, prevListRemoteStreams, nextListRemoteStreams} = this.state;
        if (peerConnections[data.socketID]) {
          peerConnections[data.socketID].close();
          const disConnectUser = remoteStreams.filter(
              (stream) => stream.id === data.socketID,
          );
          if (disConnectUser.length !== 0) {
            const {type} = disConnectUser[0];
            if (type !== 'screen-share') {
              Popup({content: `${disConnectUser[0].userInfo.user_name}님이 퇴장하였습니다.`});
            }
          }
          // ! underfined error

          const peerConnectionsTemp = Object.keys(peerConnections).reduce((accumulator, key) => {
            if (key !== data.socketID) {
              accumulator[key] = peerConnections[key];
            }
            return accumulator;
          }, {});

          this.props.dispatch(meetingRoomAction.handleSetPeerConnections(peerConnectionsTemp));

          // 연결되고 있는 stream를 제거
          const remoteStreamsTemp = remoteStreams.filter(
              (stream) => stream.id !== data.socketID,
          );
          // 출력되고 있는 stream를 제거
          let isRemoteExistRenderRemoteStreamsFlag = false;
          const renderRemoteStreamsTemp = renderRemoteStreams.filter(
              (stream) => {
                if (stream.id !== data.socketID) {
                  return true;
                } else {
                  isRemoteExistRenderRemoteStreamsFlag = true;
                  return false;
                }
              },
          );
          // 뒤stream를 삭제함
          const prevListRemoteStreamsTemp = prevListRemoteStreams.filter(
              (stream) => stream.id !== data.socketID,
          );
          // 앞stream를 삭제함
          const nextListRemoteStreamsTemp = nextListRemoteStreams.filter(
              (stream) => stream.id !== data.socketID,
          );
          this.setState((prevState) => {
            return {
              peerConnections: peerConnectionsTemp,
              remoteStreams: remoteStreamsTemp,
              loading: false,
              renderRemoteStreams: renderRemoteStreamsTemp,
              prevListRemoteStreams: prevListRemoteStreamsTemp,
              nextListRemoteStreams: nextListRemoteStreamsTemp,
              isRemoteExistRenderRemoteStreams: isRemoteExistRenderRemoteStreamsFlag,
            };
          });
          this.props.dispatch(meetingRoomAction.handleSaveRemoteStreams(remoteStreamsTemp));

          if (disConnectUser.length !== 0) {
            // ! userInfo debug
            // toast.info(disConnectUser[0].userInfo.user_name + '님 이 퇴장하였습니다.', toastOption);
            this.stopTracks(disConnectUser[0].stream);
          }
        } else {
          console.log('=================peer disconnect error==================');
        }
      } catch (error) {
        console.log(error);
      }
    });

    // 호스트부터 종료 이벤트를 받아서 종료
    getSocket().on('alert-room-end', (data) => {
      try {
        const {userId, remoteSocketId} = data;
        const {remoteStreams} = this.state;
        const disConnectUser = remoteStreams.filter(
            (stream) => stream.id === remoteSocketId,
        );

        if (disConnectUser.length !== 0) {
          const {userInfo} = disConnectUser[0];
          if (userInfo.user_tp === 'T' || userInfo.user_tp === 'I') {
            setTimeout(() => {
              this.props.history('http://just-link.us/');
              // this.props.history.goBack();
            }, 1 * 1000);
          }
        }
      } catch (error) {
        console.log(error);
      }
    });
  }
  socketListenerEventRequestToRoom = () => {
    // getSocket().on('update-username', (data) => {
    //   try {
    //     console.log('update user');
    //     const {newName, remoteSocketId, userId} = data;
    //     const {remoteStreamsProps, listUser} = this.props;
    //     let remoteStreamsPropsTemp = remoteStreamsProps;
    //     const remoteStreamsPropsUpdate = remoteStreamsPropsTemp.map((user) => {
    //       if (user.userInfo.user_idx === userId) {
    //         let userTemp = user.userInfo;
    //         let userObject = {...userTemp, nickname: newName};
    //         let userTempReturn = {id: user.id, name: user.name, stream: user.stream, userInfo: userObject};
    //         return userTempReturn;
    //       } else {
    //         return user;
    //       }
    //     });
    //     console.log(remoteStreamsPropsUpdate);
    //     this.setState({
    //       remoteStreams: remoteStreamsPropsUpdate,
    //     });
    //     this.props.dispatch(meetingRoomAction.handleSaveRemoteStreams(remoteStreamsPropsUpdate));
    //   } catch (error) {
    //     console.log(error);
    //   }
    // });

    // 강사인 경우에는
    // ! 애매함
    const userInfo = userUtils.getUserInfo();
    if (userInfo.userTp === 'T' || userInfo.userTp === 'I') {
      getSocket().on('student-ask-to-join', (data) => {
        const {username} = data;
        Alert({
          title: '회의 참가 요청',
          content: `${username}님 이 참가를 요청했습니다.`,
          btnAccept: '수락',
          btnReject: '거절',
          handleClickAccept: () => {
            data.result = 'admit';
            getSocket().emit('student-ask-to-join-result', (data));
          },
          handleClickReject: () => {
            data.result = 'deny';
            getSocket().emit('student-ask-to-join-result', (data));
          },
        });
      });
    }
    // 어떤 사람이 카메라 또는 오디오의 값을 변경할때 정보를 다시 불러서 remote 리스트 및 user 리스트를 다시 업데이트함
    // update remoteStream, nextListStream, preListStream
    // console.log(getSocket());
    getSocket().on('alert-user-change-device', (data) => {
      let params = {
        usr_id: userUtils.getUserRoomId(),
      };
      let deviceStatusChangeUser = data;
      getInformationRoom(params).then((res) => {
        const {data, result} = res;
        if (result) {
          const {remoteStreamsProps, listUser} = this.props;
          let remoteStreamsPropsTemp = remoteStreamsProps;
          const remoteStreamsPropsUpdate = remoteStreamsPropsTemp.map((user) => {
            let userInfo = data.find((_user) => _user.user_idx === user.userInfo.user_idx);
            let userTemp = {id: user.id, name: user.name, stream: user.stream, userInfo};
            return userTemp;
          });
          this.props.dispatch(meetingRoomAction.handleSaveRemoteStreams(remoteStreamsPropsUpdate));
          const {remoteStreams, nextListRemoteStreams, prevListRemoteStreams, renderRemoteStreams} = this.state;
          let flagExist = false;
          let deviceUpdate = {};
          const {type, status, userId} = deviceStatusChangeUser;
          if (type === 'mic') {
            deviceUpdate = {
              mic_status: Number(status),
            };
          } else if (type === 'cam') {
            deviceUpdate = {
              cam_status: Number(status),
            };
          }

          // Update user for list
          const remoteStreamsUpdate = remoteStreams.map((user) => {
            let userTemp = null;
            if (user.userInfo.user_idx === userId) {
              userTemp = {...user, userInfo: {...user.userInfo, ...deviceUpdate}};
            } else {
              userTemp = user;
            }
            return userTemp;
          });

          const nextListRemoteStreamsUpdate = nextListRemoteStreams.map((user) => {
            let userTemp = null;
            if (user.userInfo.user_idx === userId) {
              userTemp = {...user, userInfo: {...user.userInfo, ...deviceUpdate}};
            } else {
              userTemp = user;
            }
            return userTemp;
          });

          const prevListRemoteStreamsUpdate = prevListRemoteStreams.map((user) => {
            let userTemp = null;
            if (user.userInfo.user_idx === userId) {
              userTemp = {...user, userInfo: {...user.userInfo, ...deviceUpdate}};
            } else {
              userTemp = user;
            }
            return userTemp;
          });


          const renderRemoteStreamsUpdate = renderRemoteStreams.map((user) => {
            let userTemp = null;
            if (user.userInfo.user_idx === userId) {
              userTemp = {...user, userInfo: {...user.userInfo, ...deviceUpdate}};
            } else {
              userTemp = user;
            }
            return userTemp;
          });

          // console.log(renderRemoteStreamsUpdate);
          // console.log(remoteStreamsUpdate);
          // console.log(nextListRemoteStreamsUpdate);
          // console.log(prevListRemoteStreamsUpdate);

          this.setState({
            remoteStreams: remoteStreamsUpdate,
            nextListRemoteStreams: nextListRemoteStreamsUpdate,
            prevListRemoteStreams: prevListRemoteStreamsUpdate,
            renderRemoteStreams: renderRemoteStreamsUpdate,
          });

          // const listUserTemp = listUser;
          // const listUserUpdate = listUserTemp.map((user) => {
          //   const newUpdateUser = data.find((_user) => _user.user_idx === user.user_idx);
          //   return newUpdateUser;
          // });
          // this.props.dispatch(remoteStreamAction.saveListUser(listUserUpdate));
        }
      }).catch((e) => console.log(e));
    });
    getSocket().on('request-device', (data) => {
      let content;
      const {type, changeState} = data;
      if (type === 'mic') {
        const {micState} = this.props;
        if (micState !== changeState) {
          content = changeState ? '호스트가 마이크 켜기를 요청했습니다.' : '호스트가 마이크 끄기를 요청했습니다.';
          Alert({
            title: '장치 요청',
            content: content,
            btnAccept: '수락',
            btnReject: '거절',
            handleClickAccept: () => {
              let payload = {
                type,
                status: changeState,
              };
              chatComponentSocket.emitUpdateUserStatus(payload);
              this.props.dispatch(tabComponentAction.handleChangeMicState(changeState));
            },
            handleClickReject: () => { },
          });
        }
      } else if (type === 'cam') {
        const {camState} = this.props;
        if (camState !== changeState) {
          content = changeState ? '호스트가 카메라 켜기를 요청했습니다.' : '호스트가 카메라 끄기를 요청했습니다.';
          Alert({
            title: '장치 요청',
            content: content,
            btnAccept: '수락',
            btnReject: '거절',
            handleClickAccept: () => {
              let payload = {
                type,
                status: changeState,
              };
              chatComponentSocket.emitUpdateUserStatus(payload);
              this.props.dispatch(tabComponentAction.handleChangeCamState(changeState));
            },
            handleClickReject: () => { },
          });
        }
      }
    });

    getSocket().on('alert-user-room-record', ({data}) => {
      const {data: roomReconrdInfo, type} = data;
      if (type === 'start') {
        this.props.dispatch(meetingRoomAction.handleSetRoomRecordInfo(roomReconrdInfo));
        this.setState({
          roomRecordInfo: roomReconrdInfo,
        });
      } else if (type === 'end') {
        this.props.dispatch(meetingRoomAction.handleSetRoomRecordInfo(null));
        this.setState({
          roomRecordInfo: null,
        });
      }
    });

    getSocket().on('user-kick', (data) => {
      this.setState({
        disconnected: true,
      });
      this.props.history.goBack();
    });

    getSocket().on('alert-time-room', (data) => {
      const {level, time} = data;
      if (level === 1 || level === 2) {
        AlertTime({type: 'fix-time', time: time});
      } else if (level === 3) {
        AlertTime({type: 'count-time', handleDownAllTime: () => {
          window.location.href = 'http://just-link.us/';
          return null;
        }});
      } else if (level === 4) {
        window.location.href = 'http://just-link.us/';
        return null;
      }
    });
  }
  // 채팅 socket 이벤트 처리 추가함
  socketListenerEventToChatting = () => {
    getSocket().on('res-sent-files', (data) => {
      if (!this.props.showChatState) {
        this.props.dispatch(chatComponentAction.incrementNumberOfNewMessages());
      }
    });
    getSocket().on('res-sent-message', (data) => {
      if (!this.props.showChatState) {
        this.props.dispatch(chatComponentAction.incrementNumberOfNewMessages());
      }
    });
  }

  // !다른 학생도 나가는 건가?
  handleOutRoom = () => {
    const {remoteStreams} = this.state;
    const {myInfo} = this.props;
    const {t} = this.props;
    if (myInfo.user_tp === 'T' || myInfo.user_tp === 'I') {
      if (remoteStreams.length !== 0) {
        Alert({
          title: t('mainPage.tabComponent.end.questionMesTitle'),
          content: t('mainPage.tabComponent.end.questionMesWarning'),
          handleClickAccept: () => {
            getSocket().emit('room-end');
            this.setState({
              disconnected: true,
            });
          },
          handleClickReject: () => { },
        });
      } else {
        Alert({
          title: t('mainPage.tabComponent.end.questionMesTitle'),
          handleClickAccept: () => {
            this.setState({
              disconnected: true,
            });
          },
          handleClickReject: () => { },
        });
      }
    } else {
      Alert({
        title: t('mainPage.tabComponent.end.questionMesTitle'),
        handleClickAccept: () => {
          this.setState({
            disconnected: true,
          });
        },
        handleClickReject: () => { },
      });
    }
  }

  stopTracks = (stream) => {
    stream.getTracks().forEach((track) => track.stop());
  }

  handleWindowSize = () => {
    this.setState({
      fullScreen: !this.state.fullScreen,
    });
  }

  calSleepTime = (peerCount) => {
    if (0 <= peerCount && peerCount <= 5) {
      return 0.5;
    }
    else if (6 <= peerCount && peerCount <= 10) {
      return 1;
    }
    else if (11 <= peerCount && peerCount <= 20) {
      return 1.5;
    }
    else {
      return 2;
    }
  }

  createPeerConnectionShare = async ({socketID, userInfo, stream}, callback) => {
    try {
      let pc = new RTCPeerConnection(this.state.pc_config);

      // peer 객체 배열에 다가 저장함
      const peerConnections = {
        ...this.state.peerConnections,
        [socketID]: pc,
      };

      this.setState({
        peerConnections,
      });

      pc.onicecandidate = (e) => {
        if (e.candidate) {
          meetingRoomSocket.sendToPeerForSocketShare('candidate', e.candidate, {
            local: getSocketShare().id,
            remote: socketID,
            streamType: 'screen',
          });
        }
      };
      pc.oniceconnectionstatechange = (e) => {
        // console.log(e.connectionState + 'width socket Id' + e.connectionState + userInfo.user_idx);
      };

      // 웹 RTC를 이미 stream를 연결했으니 추가로 remote stream에서 추가할 필요없음
      pc.ontrack = (e) => {};

      pc.close = () => {};

      if (stream) {
        stream.getTracks().forEach((track) => {
          try {
            pc.addTrack(track, stream);
          } catch (error) {
            console.log(error);
          }
        });
      }
      callback(pc);
    } catch (e) {
      // console.log("Something went wrong! pc not created!!", e)
      callback(null);
    }
  }

  // 화면공유 이벤트
  // video parameters: width, height, frameRate, aspecRatio
  handleScreenModeMain = async () => {
    try {
      let videoConstraints = {
        video: {
          cursor: 'always',
          frameRate: 45,
          logicalSurface: true,
          width: {ideal: 1920},
          height: {ideal: 1080},
        },
        // audio: true,
      };
      const stream = await navigator.mediaDevices.getDisplayMedia(videoConstraints);
      const shareStream = stream;

      const {myInfo} = this.props; // 수정 안함
      console.log(myInfo);
      const remoteStreamTemp = {
        id: 'share-screen',
        name: 'share-screen',
        stream: shareStream,
        userInfo: myInfo,
      };

      this.setState((prevState) => {
        return {
          isGuestSharingScreen: true,
          // remoteStreams: [...prevState.remoteStreams, remoteStreamTemp],
          guestShareScreen: remoteStreamTemp,
        };
      });
      this.props.dispatch(tabComponentAction.handleChangeShareScreenState(true));

      // meetingRoomSocket.sendToPeer('user-share-screen', {status: true});
      // ! 일반 쉬는시간을 걸러, 다만 체크할 필요함
      await configSocketShare();
      getSocketShare().on('connect', () => {
        getSocketShare().emit('user-add-stream', {}, function(status, message) {
          if (message === 'successful') {
            getSocketShare().emit('onlinePeers-share-screen', {socketID: {local: getSocketShare().id}});
          } else if (message === 'error') {
            alert('화면공유 실패합니다.');
          } else {
            alert('화면공유 시 예상하지 못한 오류 발생합니다.');
          }
        });
        getSocketShare().on('online-peer', ({socketID, userInfo}) => {
          try {
            console.log('=======================ONLINE-PEER=======================');
            this.createPeerConnectionShare({socketID, userInfo, stream: shareStream}, (pc) => {
              if (pc) {
                pc.createOffer(this.state.sdpConstraints).then((sdp) => {
                  pc.setLocalDescription(sdp);
                  meetingRoomSocket.sendToPeer('offer', sdp, {
                    local: getSocketShare().id,
                    remote: socketID,
                    type: 'share-screen',
                  });
                }).then(() => { })
                    .catch((error) => console.log('Failed to set session description: ' + error.toString()));
              }
            });
          } catch (error) {
            console.log('Online API 오류');
          }
        });
        getSocketShare().on('offer', (data) => {
          const {socketID, userInfo, type} = data;
          if (!userInfo || !socketID) return;
          try {
            this.createPeerConnectionShare({socketID, userInfo, stream: shareStream}, (pc) => {
              pc.setRemoteDescription(new RTCSessionDescription(data.sdp)).then(
                  () => {
                    pc.createAnswer(this.state.sdpConstraints).then((sdp) => {
                      pc.setLocalDescription(sdp);
                      meetingRoomSocket.sendToPeer('answer', sdp, {
                        local: getSocketShare().id,
                        remote: socketID,
                        streamType: 'screen',
                        userId: userUtils.getUserInfo().userId,
                      });
                    });
                  },
              );
            });
          } catch (error) {
            console.log(error);
          }
        });
        getSocketShare().on('answer', (data) => {
          try {
            let peerConnection = this.state.peerConnections[data.socketID];
            if (peerConnection) {
              const {connectionState, iceConnectionState} = peerConnection;
              peerConnection.setRemoteDescription(
                  new RTCSessionDescription(data.sdp),
              ).then(() => { }).catch((e) => {
                console.log(e);
              });
            }
          } catch (error) {
            console.log(error);
          }
        });
        getSocketShare().on('candidate', (data) => {
          const pc = this.state.peerConnections[data.socketID];
          if (pc && new RTCIceCandidate(data.candidate)) {
            pc.addIceCandidate(new RTCIceCandidate(data.candidate));
          }
        });
      });


      setTimeout(() => {
        getSocketShare().emit('alert-other-user-share-screen', {status: true});
      }, 4000);


      let videoTrack = stream.getVideoTracks()[0];
      videoTrack.onended = () => {
        getSocketShare().emit('alert-other-user-share-screen', {status: false});
        this.props.dispatch(tabComponentAction.handleChangeShareScreenState(false));
        this.setState({
          isGuestSharingScreen: false,
        });
        getSocketShare().close();
      };
      return 0;
    } catch (err) {
      console.error('Error: ' + err);
    }
  }
  /**
   *
   * 화면공유시 Peer를 하나 만들어 모든 사람한테 연결함
   * 연결 성공시 화면 공유 출력함
   *
   */
  handleStopSharingScreen = () => {
    try {
      const {isGuestSharingScreen} = this.state;
      if (!isGuestSharingScreen) {
        alert('공유되는 화면이 없습니다.');
        return;
      }

      if (getSocketShare()) {
        getSocketShare().emit('alert-other-user-share-screen', {status: false});
        const {guestShareScreen} = this.state;
        guestShareScreen.stream.getTracks().forEach((track) => {
          track.stop();
        });
        this.setState({
          isGuestSharingScreen: false,
        });
        getSocketShare().close();
      } else {
        alert('화면공유의 socket오류를 발생합니다.');
      }
    } catch (error) {
      console.log(error);
    }
  }
  // ! 옭겨야 됨
  handleWhiteBoard = () => {
    const {isGuestSharingScreen, paintScreen} = this.state;

    if (!isGuestSharingScreen && !paintScreen) {
      this.handleScreenModeMain();
    } else if (isGuestSharingScreen && paintScreen) {
      this.handleStopSharingScreen();
    }
    this.props.dispatch(tabComponentAction.handChangeWhiteBoard(!paintScreen));
    this.setState({paintScreen: !paintScreen});
  }

  getEmptyMediaStream = () => {
    return document.createElement('canvas').captureStream();
  }

  /**
   * 앞페이지를 넘어가는 버튼을 클릭함
   * @valueMode 모드 사이 (우선 2x2 사이즈)
   * @renderRemoteStream 현재 화면에서 출력 stream
   * @prevListRemoteStream 현재 화면에서 출력 stream 과 전체 stream 보다 뒤 stream 리스트
   * @nextListRemoteStream 현재 화면에서 출력 stream 과 전체 stream 보다 앞 stream 리스트
   * @remoteStreams 전체 stream
   */
  handleClickPrevBtn = () => {
    const {renderRemoteStreams, remoteStreams, prevListRemoteStreams, nextListRemoteStreams} = this.state;

    // 현재 연결되어 있는 stream를 4보다 작거나 앞에 stream를 아무것도 저장하지 않을때 버튼 클릭 이벤트 무시함
    if (remoteStreams.length <= 4 || prevListRemoteStreams.length === 0) return 0;

    let valuesMode = defineValueMode.filter((item) => item.sizeName === '2x2')[0];


    let nextListRemoteStreamsTemp = nextListRemoteStreams;
    let addRenderRemoteStream = prevListRemoteStreams.slice(prevListRemoteStreams.length - 2, prevListRemoteStreams.length); // 뒤stream부터 리스트를 2 원소를 가짐
    let prevListRemoteStreamsTemp = prevListRemoteStreams.slice(0, prevListRemoteStreams.length - 2); // 뒤stream를 가진 stream를 제거함
    let renderRemoteStreamsTemp = [];
    let k = 0;

    /**
     * 현재 출력stream를 row형태로 for문 돌림
     * 각 row 첫원소는 뒤 stream에서 뺀 원소 하고 기존 출력 stream를 첫운소를 추가함
     * 뺸원소를 앞 stream에서 추가함
     * ! 예외:
     * 뒤 stream원소를 하나만 존재하는 경우에는
     */
    if (addRenderRemoteStream.length === 1) { // 일단
      let addStreamFromNextList = nextListRemoteStreams[0]; // ! 체크할 필요함
      let addNextListRemoteStreamTemp = [];
      // 먼저 row (행)으로 stream를 리스트 값이 계산
      for (let i = 0; i < valuesMode.row.rowLimit; i += valuesMode.row.rowIncrease) {
        if (addRenderRemoteStream[k]) {
          renderRemoteStreamsTemp.push(addRenderRemoteStream[k]); // 뒤stream를 뺀 stream를 출력 stream를 저장함
        }
        k++;

        // col (열)으로 stream를 리스트 값이 계산
        for (let j = i; j < i + valuesMode.col.colLimit; j++) {
          if (j + 1 >= i + valuesMode.row.rowIncrease && renderRemoteStreams[j] && renderRemoteStreams[j] !== addStreamFromNextList) {
            addNextListRemoteStreamTemp.push(renderRemoteStreams[j]); // 앞에 stream를 추가함
          } else if (renderRemoteStreams[j]) {
            renderRemoteStreamsTemp.push(renderRemoteStreams[j]); // 출력 stream에서 추가함
          }
        }
      }
      renderRemoteStreamsTemp.push(addStreamFromNextList);
      nextListRemoteStreamsTemp = [...addNextListRemoteStreamTemp, ...nextListRemoteStreams];
    } else {
      let addNextListRemoteStreamTemp = [];
      for (let i = 0; i < valuesMode.row.rowLimit; i += valuesMode.row.rowIncrease) {
        renderRemoteStreamsTemp.push(addRenderRemoteStream[k++]); // 뒤stream를 뺀 stream를 출력 stream를 저장함
        for (let j = i; j < i + valuesMode.col.colLimit; j++) {
          if ((j + 1 >= i + valuesMode.row.rowIncrease) && renderRemoteStreams[j]) {
            addNextListRemoteStreamTemp.push(renderRemoteStreams[j]); // 앞에 stream를 추가함
          } else if (renderRemoteStreams[j]) {
            renderRemoteStreamsTemp.push(renderRemoteStreams[j]); // 출력 stream에서 추가함
          }
        }
      }
      nextListRemoteStreamsTemp = [...addNextListRemoteStreamTemp, ...nextListRemoteStreams];
    }
    this.setState((prevState) => {
      return {
        currentPage: prevState.currentPage - 1,
        renderRemoteStreams: renderRemoteStreamsTemp,
        prevListRemoteStreams: prevListRemoteStreamsTemp,
        nextListRemoteStreams: nextListRemoteStreamsTemp,
        handleSlideRemoteBtn: !prevState.handleSlideRemoteBtn,
      };
    });
  };

  /**
   * 앞페이지를 넘어가는 버튼을 클릭함
   * @valueMode 모드 사이 (우선 2x2 사이즈)
   * @renderRemoteStream 현재 화면에서 출력 stream
   * @prevListRemoteStream 현재 화면에서 출력 stream 과 전체 stream 보다 뒤 stream 리스트
   * @nextListRemoteStream 현재 화면에서 출력 stream 과 전체 stream 보다 앞 stream 리스트
   * @remoteStreams 전체 stream
   */
  handleClickNextBtn = () => {
    const {renderRemoteStreams, remoteStreams, prevListRemoteStreams, nextListRemoteStreams} = this.state;

    // 현재 연결되어 있는 stream를 4보다 작거나 앞에 stream를 아무것도 저장하지 않을때 버튼 클릭 이벤트 무시함
    if (remoteStreams.length <= 4 || nextListRemoteStreams.length === 0) return 0;

    let valuesMode = defineValueMode.filter((item) => item.sizeName === '2x2')[0];
    let prevListRemoteStreamsTemp = prevListRemoteStreams;
    let addRenderRemoteStream = nextListRemoteStreams.slice(0, 2); // 앞stream 리스트를 2 원소를 가짐
    let nextListRemoteStreamsTemp = nextListRemoteStreams.slice(2, nextListRemoteStreams.length); // 앞stream를 가진 stream를 제거함
    let renderRemoteStreamsTemp = [];
    let k = 0;

    /**
     * 현재 출력stream를 row형태로 for문 돌림
     * 각 row 첫원소를 뒤 stream를 저장함 그렇지 않으면 출력steam 리스트에서 추가함
     */
    for (let i = 0; i < valuesMode.row.rowLimit; i += valuesMode.row.rowIncrease) {
      for (let j = i; j < i + valuesMode.col.colLimit; j++) {
        if (i === j) {
          prevListRemoteStreamsTemp.push(renderRemoteStreams[j]); // 뒤stream 리스트에서 추가함
        } else {
          renderRemoteStreamsTemp.push(renderRemoteStreams[j]);
        }
      }

      // 앞 stream를 뺸 원소를 출력 stream를 추가함
      if (addRenderRemoteStream[k]) {
        renderRemoteStreamsTemp.push(addRenderRemoteStream[k]);
      }
      k = k + 1;
    }
    // 현재 페이지, 출력 stream, 앞 stream, 뒤 stream 및 클릭 이벤트를 다시 설정함
    this.setState((prevState) => {
      return {
        currentPage: prevState.currentPage + 1,
        renderRemoteStreams: renderRemoteStreamsTemp,
        prevListRemoteStreams: prevListRemoteStreamsTemp,
        nextListRemoteStreams: nextListRemoteStreamsTemp,
        handleSlideRemoteBtn: !prevState.handleSlideRemoteBtn,
      };
    });
  };

  // ! 테스트 용도
  handleRemote = (action) => {
    const {userName, remoteStreams, renderRemoteStreams, prevListRemoteStreams, nextListRemoteStreams} = this.state;
    let remoteStreamsTemp = remoteStreams;

    // remove one stream
    if (action === 'remove') {
      remoteStreamsTemp = remoteStreamsTemp.filter((remote) => remote.name !== userName);

      let prevTemp = prevListRemoteStreams.filter((remote) => remote.name !== userName);
      let nextTemp = nextListRemoteStreams.filter((remote) => remote.name !== userName);

      // 출력되고 있는 stream를 제거
      let isRemoteExistRenderRemoteStreamsFlag = false;
      const renderRemoteStreamsTemp = renderRemoteStreams.filter(
          (stream) => {
            if (stream.name !== userName) {
              return true;
            } else {
              isRemoteExistRenderRemoteStreamsFlag = true;
              return false;
            }
          },
      );

      this.setState({
        remoteStreams: remoteStreamsTemp,
        renderRemoteStreams: renderRemoteStreamsTemp,
        prevListRemoteStreams: prevTemp,
        nextListRemoteStreams: nextTemp,
        isRemoteExistRenderRemoteStreams: isRemoteExistRenderRemoteStreamsFlag,
      });
    } else if (action === 'add') { // add one stream
      remoteStreamsTemp = [...remoteStreams, {
        id: `student${userName}`,
        name: userName,
      }];
      this.setState({
        remoteStreams: remoteStreamsTemp,
      });
    }
  }

  hanelStartRoomTime = async () => {
    const params = {
      userRoomId: userUtils.getUserRoomId(),
    };
    // const response = await setTimeRoomWithValue(params);
    const response = await setTimeRoomWithTime(params);
    const {message, result} = response;
    if (!result) {
      alert(message);
      return;
    }
  }

  render() {
    const {
      disconnected,
      localStream,
      peerConnections,
      remoteStreams,
      isMainRoom,
      showUserList,
      showChatWindow,
      chatAutoFocus,
      loading,
      errorDevice,
      paintScreen,
      guestShareScreen,
      isGuestSharingScreen,
      currentPage,
      renderRemoteStreams,
      prevListRemoteStreams,
      nextListRemoteStreams,
    } = this.state;

    const {showChatState, showListUserState, modeType} = this.props;

    if (errorDevice) {
      console.log('카메라를 찾지 못합니다. 새로고침을 한번 하세요.');
      // return;
    }

    if (disconnected) {
      try {
        // disconnect socket
        getSocket().close();
        // stop local audio & video tracks
        this.stopTracks(localStream);

        // stop all remote audio & video tracks
        remoteStreams.forEach((rVideo) => this.stopTracks(rVideo.stream));

        peerConnections &&
          Object.values(peerConnections).forEach((pc) => pc.close());
        this.props.history.push('/meeting');
        window.location.reload();
        // window.open('', '_self', '');
        // window.close();
      } catch (error) {
        window.close();
      }
    }
    let disabledNextRemoteBtn = nextListRemoteStreams.length === 0 ? true : false;
    let disablePrevRemoteBtn = currentPage === 1 ? true : false;
    let modeDefault = modeType === '2x2' ? true : false;
    return (
      <div className={!isMobile ? 'meeting-room' : 'meeting-room__mobile'}>
        <div className="test-ads" style={{position: 'fixed', left: '200px', zIndex: '9999', display: 'none'}}>
          <div>
            <input type="text" onChange={(e) => this.setState({userName: e.target.value})} />
            <button onClick={() => this.handleRemote('add')}>Add</button>
          </div>
          <input type="text" onChange={(e) => this.setState({userName: e.target.value})} />
          <button onClick={() => this.handleRemote('remove')}>Remove</button>
        </div>
        <div style={{position: 'fixed', background: 'blue', color: 'white', zIndex: '99', display: 'none', left: '500px'}}>
          <div>
            =RM=
            <ul >
              {
                remoteStreams.length !== 0 && remoteStreams.map((remote) => <li>{remote && remote.userInfo.user_idx}</li>)
              }
            </ul>
          </div>
          <div>
            PL=
            <ul >
              {
                prevListRemoteStreams.length !== 0 && prevListRemoteStreams.map((remote) => <li>{remote && remote.userInfo.user_idx}</li>)
              }
            </ul>
          </div>
          <div>
            NL=
            <ul >
              {
                nextListRemoteStreams.length !== 0 && nextListRemoteStreams.map((remote) => <li>{remote && remote.userInfo.user_idx}</li>)
              }
            </ul>
          </div>
          <div>
            RD=
            <ul >
              {
                renderRemoteStreams.length !== 0 && renderRemoteStreams.map((remote) => <li>{remote && remote.userInfo.user_idx}</li>)
              }
            </ul>
          </div>
        </div>
        <div style={{position: 'fixed', left: 100, display: 'none'}}>
          <input type="input" onChange={(e) => this.setState({timeRoom: e.target.value})}/>
          <button onClick={() => this.hanelStartRoomTime()}>Start</button>
        </div>
        <div style={{position: 'fixed'}}>
          <RemoteStreamContainerAudio
            remoteStreams={remoteStreams}
          />
        </div>
        <div className="heading-task">
          {
            !loading ?
              <HeadingVideoComponent/> :
              <WrapperLoading type={'bars'} color={'black'} />
          }
        </div>

        <CSSTransition
          in={showListUserState}
          timeout={240}
          classNames='user-list-slide'
          unmountOnExit
        >
          <div
            className="user-list"
            style={{right: showChatState ? '325px' : 0}}
          >
            <UserList
              shareScreenStream={guestShareScreen}
              remoteStreams={remoteStreams}
            />
          </div>
        </CSSTransition>

        <CSSTransition
          in={showChatState}
          timeout={240}
          classNames='chat-slide'
          onEntered={() => {this.setState({chatAutoFocus: true});}}
          onExited={() => {this.setState({chatAutoFocus: false});}}
          unmountOnExit
        >
          <div className="chatting">
            <ChatComponent
              remoteStreams={remoteStreams}
              isMainRoom={isMainRoom}
              autoFocus={chatAutoFocus}
            />
          </div>
        </CSSTransition>
        {
          (!paintScreen && !isGuestSharingScreen) &&
          <button onClick={() => this.handleClickNextBtn()} className="btn-logo test-btn btn-next"
            disabled={disabledNextRemoteBtn} style={disabledNextRemoteBtn ? {background: '#ccc'} : {}}>
            {'>'}
          </button>
        }
        <div className="remote-stream">
          {
            !loading ?
              paintScreen ?
                <WhiteBoard /> :
                (isGuestSharingScreen && guestShareScreen) ?
                  <RemoteStreamContainerShare
                    shareScreenStream={guestShareScreen}
                    remoteStreams={remoteStreams}
                  /> :
                    <RemoteStreamContainer
                      remoteStreamsTemp={remoteStreams}
                      remoteStreams={modeDefault ? renderRemoteStreams : remoteStreams}
                    /> :
              <WrapperLoading type={'bars'} color={'white'} />
          }
        </div>
        {
          (!paintScreen && !isGuestSharingScreen) &&
          <button onClick={() => this.handleClickPrevBtn()} className="btn-logo test-btn btn-pre"
            disabled={disablePrevRemoteBtn}
            style={disablePrevRemoteBtn ? {background: '#ccc'} : {}}
          >
            {'<'}
          </button>
        }

        <div className="footer-task">
          <TabComponent
            handleScreamRecording={this.handleScreamRecording}
            handleStopSharingScreen={this.handleStopSharingScreen}
            handleScreenModeMain={this.handleScreenModeMain}
            handleWhiteBoard={this.handleWhiteBoard}
            showUserList={() => this.setState({showUserList: !showUserList})}
            showChatWindow={() => this.setState({showChatWindow: !showChatWindow})}
            handleOutRoom={this.handleOutRoom}
            isGuestSharingScreen={isGuestSharingScreen}
            remoteStreams={remoteStreams}
          />
        </div>

        <div style={{height: '3vh', background: 'black'}}></div>
        <ToastContainer
          position="top-right"
          autoClose={2000}
          hideProgressBar
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  myInfo: userSelector.selectCurrentUser(state),

  modeType: headingVideoComponentSelect.getModeType(state),

  currentAudio: landingPageSelector.selectCurrentAudio(state),
  listAudioInput: landingPageSelector.selectListAudioInput(state),
  currentVideo: landingPageSelector.selectCurrentVideo(state),
  listVideoInput: landingPageSelector.selectListVideoInput(state),

  localStream: meetingRoomSelect.getLocalStream(state),
  userType: meetingRoomSelect.selectUserType(state),
  fixVideo: meetingRoomSelect.selectFixVideo(state),
  listUserBadNetwork: meetingRoomSelect.selectListUserBadNetwork(state),
  remoteStreamsProps: meetingRoomSelect.selectRemoteStreams(state),
  roomInfoStore: meetingRoomSelect.selectRoomInfo(state),

  listUser: remoteStreamSelector.getListUser(state),

  micState: tabComponentSelector.getMicState(state),
  camState: tabComponentSelector.getCamState(state),
  showChatState: tabComponentSelector.getShowChatState(state),
  showListUserState: tabComponentSelector.getShowListUserState(state),
});

function mapDispatchToProps(dispatch) {
  let actions = bindActionCreators({MeetingRoom});
  return {...actions, dispatch};
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(withTranslation()(MeetingRoom)));
