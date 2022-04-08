import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {useTranslation} from 'react-i18next';
import './style.scss';

import userSelector from '../../features/UserFeature/selector';

import meetingRoomAction from '../MeetingRoom/MeetingRoom.Action';
// import meetingRoomSelector from '../MeetingRoom/MeetingRoom.Selector';

import services from '../../features/UserFeature/service';
// import chatService from '../MeetingRoom/components/ChatComponent/ChatComponent.Service';

import landingPageService from './LandingPage.Service';
import landingPageAction from './LandingPage.Action';

import Loading from '../../components/Loading/WrapperLoading';
import LocalVideo from './components/LocalVideo';
import SoundMeter from './components/SoundMeter';
import {configSocket, getSocket} from '../rootSocket';

import {isMobile} from 'react-device-detect';
import userUtils from '../../features/UserFeature/utils';
// import adapter from 'webrtc-adapter';

function LandingPage(props) {
  const {t, i18n} = useTranslation();

  const [localStream, setLocalStream] = useState(null);

  const [audioInput, setAudioInput] = useState({value: '', text: ''});
  const [audioStream, setAudioStream] = useState(
      new AudioContext().createMediaStreamDestination().stream,
  );
  const [videoInput, setVideoInput] = useState({value: '', text: ''});

  const [loading, setLoading] = useState(true);
  const [listAudioInput, setListAudioInput] = useState([]);
  const [listVideoInput, setListVideoInput] = useState([]);

  const [userInfo, setUserInfo] = useState({});

  const [response, setResponse] = useState('');
  const [password, setPassword] = useState(null);
  const [viewPassword, setViewPassword] = useState(false);
  const [userNickName, setUserNickName] = useState(null);
  const [clicked, setClicked] = useState(false);

  const [camChecked, setCamChecked] = useState(true);
  const [micChecked, setMicChecked] = useState(false);

  const dispatch = useDispatch();
  const currentUser = useSelector(userSelector.selectCurrentUser);

  useEffect(() => {
    const checkConnecting = async () => {
      let userRoomId = JSON.parse(localStorage.getItem('usr_id'));
      let params = {
        userRoomId,
      };
      const res = await services.checkConnecting(params);
      const {data} = res;
      const {connecting} = data;
      if (connecting) {
        if (getSocket() != null) {
          socketDisconnect();
          window.location.reload();
        }
      }
    };
    init();
  }, []);

  useEffect(() => {
    if (currentUser) {
      setUserInfo(currentUser);
      setUserNickName(currentUser.user_name);
    }
  }, [currentUser]);

  function gotDevices(deviceInfos) {
    let listDetectVideoInput = [];
    let listDetectAudioInput = [];
    let selectedAudioInput = {value: '', text: ''};
    let selectedVideoInput = {value: '', text: ''};
    for (let i = 0; i !== deviceInfos.length; ++i) {
      const deviceInfo = deviceInfos[i];
      if (deviceInfo.kind === 'audioinput') {
        const option = {
          value: deviceInfo.deviceId,
          text: deviceInfo.label || `microphone`,
        };
        listDetectAudioInput.push(option);
        let storeSelectAudioInput = localStorage.getItem('audioInputDeviceId');

        // 저장한거 없거나 select 선택안함
        if (!storeSelectAudioInput && !selectedAudioInput.value) {
          localStorage.setItem('audioInputDeviceId', option.value);
          selectedAudioInput = option;
        } else if (storeSelectAudioInput === option.value) {
          selectedAudioInput = option;
        }
      } else if (deviceInfo.kind === 'audiooutput') {
      } else if (deviceInfo.kind === 'videoinput') {
        const option = {
          value: deviceInfo.deviceId,
          text: deviceInfo.label || `camera`,
        };
        listDetectVideoInput.push(option);
        let storeSelectVideoInput = localStorage.getItem('videoInputDeviceId');

        // 저장한거 없거나 select 선택안함
        // ! 다만, 문제가 만약에서 첫번째 카메라가 다른 시스템에서 사용하고 있으면 경고
        if (!storeSelectVideoInput && !selectedVideoInput.value) {
          localStorage.setItem('videoInputDeviceId', option.value);
          selectedVideoInput = option;
          init(true);
        } else if (storeSelectVideoInput === option.value) {
          selectedVideoInput = option;
          init(true);
        }
      } else {
      }
    }
    // State 값을 설정함
    setListAudioInput(listDetectAudioInput);
    setAudioInput(selectedAudioInput);
    setListVideoInput(listDetectVideoInput);
    setVideoInput(selectedVideoInput);

    // Redux에서 저장함
    dispatch(
        landingPageAction.setDevices(
            listDetectAudioInput,
            selectedAudioInput,
            listDetectVideoInput,
            selectedVideoInput,
        ),
    );
  }

  function handleError(error) {
    // alert('선택된 카메라가 다른 앱플리케이션에서 사용하고 있습니다. 다른 카메라를 선택해주시 기바랍니다.');
    console.log(
        'navigator.MediaDevices.getUserMedia error: ',
        error.message,
        error.name,
    );
  }

  function gotStream(stream, isHandleChange) {
    if (window.stream) {
      window.stream.getTracks().forEach((track) => {
        track.stop();
      });
    }
    setLoading(false);
    window.stream = stream;
    if (isHandleChange) {
      dispatch(meetingRoomAction.handleCreateLocalStream(stream));
      setLocalStream(stream);
    }
    return navigator.mediaDevices.enumerateDevices();
  }

  /**
   *
   * @param {*} isHandleChange: 지정하는 값으로 stream를 생성하거나 아니면 default 카메라를 선택해서 stream를 생성함
   * 먼저 만약에 현재 페이지에서 stream를 있으면 모는 중지를 시키함
   * 특정한 videoId 및 audio Id를 가지고 stream를 생성함
   */
  function init(isHandleChange) {
    if (window.stream) {
      window.stream.getTracks().forEach((track) => {
        track.stop();
      });
    }
    let videoSource = localStorage.getItem('videoInputDeviceId') ?
      localStorage.getItem('videoInputDeviceId') :
      videoInput.value;
    let audioSource = localStorage.getItem('audioInputDeviceId') ?
      localStorage.getItem('audioInputDeviceId') :
      audioInput.value;
    let iOS = navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform);

    // console.log(audioSource);
    const constraints = {
      audio: {
        deviceId: audioSource ? {exact: audioSource} : undefined,
        sampleRate: 44000,
        sampleSize: 16,
        chanelCount: 2,
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
      },
      // audio: false,
      video: {
        deviceId: videoSource ? {exact: videoSource} : undefined,
        facingMode: isMobile ? (iOS ? 'environment' : null) : null,
        frameRate: {
          min: 10,
          ideal: 15,
          max: 20,
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
      },
    };
    if (isHandleChange) {
      // 저장되고 있는 카메라 id로 stream를 생성하여 local stream로 출력함
      navigator.mediaDevices
          .getUserMedia(constraints)
          .then((stream) => gotStream(stream, isHandleChange))
          .catch(handleError);
    } else {
      // Devices 리스트를 체크하기 위한 default로 stream를 생성함
      navigator.mediaDevices
          .getUserMedia({video: true, audio: true})
          .then((stream) => gotStream(stream, isHandleChange))
          .then(gotDevices)
          .catch(handleError);
    }
  }
  async function getAudioStream(deviceId = null) {
    let constraints;

    if (deviceId) {
      constraints = {
        audio: {deviceId: {exact: deviceId}},
        video: false,
      };
    } else {
      constraints = {
        audio: {
          deviceId: audioInput.value ? {exact: audioInput.value} : undefined,
        },
        video: false,
      };
    }
    const stream = await navigator.mediaDevices
        .getUserMedia(constraints)
        .catch((e) => handleError(e));
    setAudioStream(stream);
  }

  // audio 교체하는 이벤트
  const handleChangeAudio = (deviceId) => {
    setLoading(true);
    localStorage.setItem('audioInputDeviceId', deviceId);
    const deviceTemp = listAudioInput.filter((dev) => dev.value === deviceId)[0];
    getAudioStream(deviceTemp.value);
    setAudioInput(deviceTemp);
    // init(true);
    setLoading(false);
  };

  // 마이크를 on/off 선택시
  const handleChangeMicStatus = (value) => {
    if (value) {
      const deviceId = audioInput.value;
      getAudioStream(deviceId);
      setMicChecked(value);
    } else {
      getAudioStream();
      setMicChecked(value);
    }
  };

  // video를 교체하는 이벤트
  const handleChangeVideo = (deviceId) => {
    setLoading(true);
    localStorage.setItem('videoInputDeviceId', deviceId);
    const deviceTemp = listVideoInput.filter((dev) => dev.value === deviceId)[0];
    setVideoInput(deviceTemp);
    init(true);
    setLoading(false);
  };

  /**
   * 룸을 참여하는 버튼 클릭 이벤트
   * =  선생님
   * 비밀번호를 입력하면 해당 룸을 비밀번호를 설정함
   * 기존 이름 및 닉네님이 다른 경우엔 이름을 업데이트 (이름 중복 체크할 필요없음)
   * = 학생
   * 해당 비밀번호를 체크함 있으면 입력한 후에 다시 체크함
   * 기존 이름 및 닉네님이 다른 경우엔 이름을 업데이트 (이름 중복 체크할 필요함)
   */
  const handleJoin = async () => {
    const redirect_key = localStorage.getItem('redirect_key');
    const sl_idx = localStorage.getItem('sl_idx');
    const link = localStorage.getItem('link');
    const {userId: user_idx} = userUtils.getUserInfo();

    const params = {
      lec_idx: sl_idx,
      redirect_key,
      isMobile,
      user_idx,
      link,
    };

    const response = await landingPageService.fetJoinRoom(params);
    const {result} = response;
    if (!result) return;
    const {usr_id, room} = response.data;

    localStorage.setItem('usr_id', usr_id);
    localStorage.setItem(
        'roomInfo',
        JSON.stringify({id: room.id, room_name: room.room_name}),
    );

    configSocket();

    getSocket().emit('connection-web-rtc', {}, function(error, message) {
      try {
        if (!error) {
          const {userTp} = userUtils.getUserInfo();
          if (userTp === 'T' || userTp === 'I') {
            JoinWithHost(room.room_name);
          } else if (userTp === 'S') {
            JoinWithGuest(room.room_name);
          } else {
            alert('해당 유저형 접근 못합니다.');
          }
        } else {
          alert(error);
        }
      } catch (error) {
        console.log(error);
      }
    });
  };

  const JoinWithHost = async (room_name) => {
    try {
      const lengthAudioDetected = listAudioInput.length;
      const lengthVideoDetected = listVideoInput.length;
      if (lengthAudioDetected === 0 && lengthVideoDetected === 0) {
        alert('카메라 및 마이크 인식된 기계가 없으니 입장 불가능합니다');
        return;
      }
      const userRoomId = localStorage.getItem('usr_id');

      if (!userRoomId) return;
      let params = {
        password,
        usr_id: userRoomId,
        micChecked,
        camChecked,
        nickname: userNickName,
      };
      const response = await landingPageService.setUpRoomForHost(params);
      const {result, message} = response;

      if (result && message === '룸의 세팅 성공함') {
        const {userId: user_idx} = userUtils.getUserInfo();
        props.history.push(`/meeting/open?room=${room_name}&user=${user_idx}`);
      } else if (!result && message === '룸의 세팅 시 오류 발생함') {
        alert('해당 룸의 설정 시 오류를 발행하니, 다시 접속해두세요.');
        return;
      } else {
        alert('예상할 수 없는 오류를 발생합니다. 관리자한테 문의해주세요.');
        return;
      }
    } catch (error) {
      alert('예상할 수 없는 오류를 발생합니다. 관리자한테 문의해주세요.');
      console.log(error);
      return;
    }
  };
  const JoinWithGuest = (room_name) => {
    try {
      const userRoomId = localStorage.getItem('usr_id');

      if (!userRoomId) return;
      if (getSocket() !== null) {
        getSocket().emit(
            'student-ask-to-join',
            {
              username: userNickName,
              password: password,
            },
            function(err, success) {
              if (err) {
                alert(
                    '입장 요청 보내 시 오류를 발생합니다. 관리자한테 문의해주세요.',
                );
                console.log(err);
              }
            },
        );

        getSocket().on('student-ask-to-join-result', async (data) => {
          const {result, message} = data;
          setClicked(true);
          // 룸을 참여 요청성공합니다.
          if (result && message === 'submit-send-success') {
            setResponse(t('landingPage.joinRoomRequestMessage.submitAlert'));
          } else if (message === 'get-host-error') {
            setResponse(t('landingPage.joinRoomRequestMessage.getHostError'));
          } else if (message === 'offline') {
            setResponse(t('landingPage.joinRoomRequestMessage.offlineMes'));
          } else if (message === 'error-pwd') {
            setResponse(
                t('landingPage.joinRoomRequestMessage.passwordErrorMes'),
            );
          } else if (message === 'not-exists') {
            setResponse(t('landingPage.joinRoomRequestMessage.notExistsMes'));
          } else if (result && message === 'deny') {
            setResponse(t('landingPage.joinRoomRequestMessage.deny'));
          } else if (result && message === 'admit') {
            let params = {
              usr_id: userRoomId,
              micChecked,
              camChecked,
              nickname: userNickName,
            };
            const response = await landingPageService.setUpRoomForHost(params);
            const {result: reselSetUpAPI, message: messageSetUpAPI} = response;
            if (reselSetUpAPI && messageSetUpAPI === '룸의 세팅 성공함') {
              const {userId: user_idx} = userUtils.getUserInfo();
              props.history.push(
                  `/meeting/open?room=${room_name}&user=${user_idx}`,
              );
            } else if (
              !reselSetUpAPI &&
              messageSetUpAPI === '룸의 세팅 시 오류 발생함'
            ) {
              alert(i('landingPage.joinRoomRequestMessage.roomSettingError'));
              return;
            } else {
              alert(i('landingPage.joinRoomRequestMessage.error'));
              return;
            }
          }
        });
      } else {
        alert(i('landingPage.joinRoomRequestMessage.socketConnectError'));
        return;
      }
    } catch (error) {
      alert(i('landingPage.joinRoomRequestMessage.error'));
      console.log(error);
      return;
    }
  };
  if (!currentUser) return <Loading type={'bars'} color={'white'} />;
  return (
    <div className="landing-page">
      <div className="landing-content">
        <p className="landing-title">{t('landingPage.title')}</p>

        <div className="landing-camera">
          <div className="landing-subtitle-button">
            <p className="landing-subtitle">{t('landingPage.cameraLabel')}</p>
            <div className="landing-radio-button">
              <input
                type="radio"
                id={camChecked ? 'cam-on' : 'off-input'}
                name="cam"
                onClick={() => {
                  setCamChecked(true);
                }}
                checked={camChecked}
              />
              <div
                style={{
                  marginRight: '12px',
                  color: camChecked ? '#188af4' : '#c4cfdc',
                }}
              >
                {t('landingPage.cameraOption.0')}
              </div>
              <input
                type="radio"
                id={!camChecked ? 'cam-off' : 'off-input'}
                name="cam"
                onClick={() => {
                  setCamChecked(false);
                }}
                checked={!camChecked}
                onChange={() => {}}
              />
              <div style={{color: !camChecked ? '#188af4' : '#c4cfdc'}}>
                {t('landingPage.cameraOption.1')}
              </div>
            </div>
          </div>

          <div className="landing-select">
            {camChecked && listVideoInput.length !== 0 ? (
              <select
                value={videoInput.value}
                onChange={(e) => handleChangeVideo(e.target.value)}
              >
                {listVideoInput.map((input, idx) => (
                  <option key={idx} value={input.value}>
                    {input.text}
                  </option>
                ))}
              </select>
            ) : (
              <select style={{color: '#9aa1b8'}}>
                <option key={'null'} selected disabled hidden>
                  {t('landingPage.cameraDetectionNone')}
                </option>
              </select>
            )}
          </div>

          <div className="landing-local-video">
            {!loading && camChecked ? (
              <LocalVideo stream={localStream} />
            ) : (
              <Loading
                className="loading"
                color={'black'}
                style={{background: 'black'}}
              />
            )}
          </div>
        </div>

        <div className="landing-microphone">
          <div className="landing-subtitle-button">
            <p className="landing-subtitle">{t('landingPage.micLabel')}</p>
            <div className="landing-radio-button">
              <input
                type="radio"
                id={micChecked ? 'mic-on' : 'off-input'}
                name="mic"
                onClick={() => handleChangeMicStatus(true)}
                checked={micChecked}
                onChange={() => {}}
              />
              <div
                style={{
                  marginRight: '12px',
                  color: micChecked ? '#188af4' : '#c4cfdc',
                }}
              >
                {t('landingPage.micOption.0')}
              </div>
              <input
                type="radio"
                id={!micChecked ? 'mic-off' : 'off-input'}
                name="mic"
                onClick={() => handleChangeMicStatus(false)}
                checked={!micChecked}
                onChange={() => {}}
              />
              <div style={{color: !micChecked ? '#188af4' : '#c4cfdc'}}>
                {t('landingPage.micOption.1')}
              </div>
            </div>
          </div>

          <div className="landing-select">
            {micChecked && listAudioInput.length !== 0 ? (
              <select
                value={audioInput.value}
                onChange={(e) => handleChangeAudio(e.target.value)}
              >
                {listAudioInput.map((audio, idx) => (
                  <option key={idx} value={audio.value}>
                    {audio.text}
                  </option>
                ))}
              </select>
            ) : (
              <select style={{color: '#9aa1b8'}}>
                <option key={'null'} selected disabled hidden>
                  {t('landingPage.micDetectionNone')}
                </option>
              </select>
            )}
          </div>
          <div className="landing-sound-meter">
            <SoundMeter
              className="landing-sound-meter"
              audioStream={audioStream}
              startMeasuring={micChecked}
            />
          </div>
        </div>

        <div className="landing-username-password">
          <div className="landing-username">
            <p className="landing-subtitle">{t('landingPage.nickNameLabel')}</p>
            <div className="landing-input">
              <input
                type="text"
                maxLength="45"
                onChange={(e) => setUserNickName(e.target.value)}
                value={userNickName}
              />
            </div>
          </div>

          {/* <div className="landing-password">
            <p className="landing-subtitle">
              {t('landingPage.passwordLabel')}
              <span style={{fontWeight: '300'}}>
                ({t('landingPage.passWarning')})
              </span>
            </p>
            <div className="landing-input password-input">
              <input
                type={viewPassword ? 'text' : 'password'}
                maxLength="45"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
              />
              <button onClick={() => setViewPassword(!viewPassword)}>
                <i className={viewPassword ? 'fa fa-eye' : 'fa fa-eye-slash'} />
              </button>
            </div>
          </div> */}
        </div>

        {!clicked ? (
          <div className="landing-join">
            <button
              className="button-cancel"
              onClick={() => {
                let win = window.open('', '_self');
                win.close();
              }}
            >
              {t('landingPage.buttonList.0')}
            </button>
            <button
              className="button-join"
              onClick={() => {
                handleJoin();
              }}
              disabled={loading}
            >
              {t('landingPage.buttonList.1')}
            </button>
          </div>
        ) : (
          <h2 className="landing-text">{response}</h2>
        )}
      </div>
    </div>
  );
}

export default LandingPage;
