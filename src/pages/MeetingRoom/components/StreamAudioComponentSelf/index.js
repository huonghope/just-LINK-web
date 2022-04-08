import React, {Component, useState, useEffect} from 'react';
import {connect, useSelector} from 'react-redux';
import {bindActionCreators} from 'redux';

import {getSocket} from '../../../rootSocket';
import userSelectors from '../../../../features/UserFeature/selector';

import tabComponentSelector from '../TabComponent/TabComponent.Selector';

import meetingRoomSelect from '../../MeetingRoom.Selector';

import userSelect from '../../../../features/UserFeature/selector';
/**
 * @ComponentDescription
 * RemoteStreamContainerAudio 컴포넌트 받은 audio의 track를 출력함
 * componentDidMount():
 *  audioTrack를 props부터 받아서 출력함
 *  자기stream라면 오디오의 값을 설정함
 * componentWillReceveProps():
 *  새로운 사람이 들어가면 이 컴포넌트를 통해서 출력함
 */
class StreamAudioComponentSelf extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    if (this.props.audioTrack) {
      const {audioTrack} = this.props;
      let audioStream = new MediaStream();
      audioStream.addTrack(audioTrack);
      this.audio.srcObject = audioStream;
    }
    // 처음에 자기 audio 상태를 설정
    if (this.props.isSelfStream) {
      const {micState} = this.props;
      const stream = this.audio.srcObject.getTracks().filter((track) => track.kind === 'audio');
      if (stream.length !== 0) {
        stream[0].enabled = micState;
      }
    }
  }
  componentWillReceiveProps(nextProps) {
    // Audio-track 출력함
    if (this.props.audioType === 'localAudio' && this.props.audioTrack !== nextProps.audioTrack)
    {
      const {audioTrack} = this.props;
      let audioStream = new MediaStream();
      audioStream.addTrack(audioTrack);
      this.audio.srcObject = audioStream;
    }

    // 현재 유저
    // 자기 오디오 off/on 상태를 변경할떄
    if (this.props.currentUser && nextProps.userInfo &&
      this.props.currentUser.user_idx === nextProps.userInfo.user_idx &&
      this.props.micState !== nextProps.micState) {
      try {
        const stream = this.audio.srcObject.getTracks().filter((track) => track.kind === 'audio');
        const {micState} = nextProps;
        if (stream.length !== 0) {
          stream[0].enabled = micState;
        }
      } catch (error) {
        alert('음성 변경 오류 발생');
      }
    }
  }

  render() {
    const {audioTrack} = this.props;
    return (
      <div className="audio audio-self">
        <audio
          ref={(ref) => this.audio = ref}
          autoPlay
          muted={true}
        >
        </audio>
        {
          audioTrack &&
          <SoundMeter
            startMeasuring={true}
            audioTrack={audioTrack}
          />
        }
      </div>
    );
  }
}
function SoundMeter({startMeasuring, audioTrack}) {
  window.audioMeterTmp = 0;
  const [audioMeter, setAudioMeter] = useState(0);
  const currentUser = useSelector(userSelectors.selectCurrentUser);
  const roomReconrdInfo = useSelector(meetingRoomSelect.selectRoomRecordInfo);

  let interval = null;

  useEffect(() => {
    if (!roomReconrdInfo) {return null;}

    let speakingFlag = false;
    let speakingFlagSend = false;
    interval = setInterval(() => {
      let audioMeterTemp = window.audioMeterTmp.toFixed(2) * 25;
      let data = {
        userId: currentUser && currentUser.user_idx,
        remoteSocketId: getSocket().id,
      };
      if (audioMeterTemp >= 0.5 && !speakingFlagSend) {
        speakingFlagSend = true;
        speakingFlag = false;
        if (roomReconrdInfo !== null) {
          data.recordInfo = roomReconrdInfo;
        }
        data.status = true;
        getSocket().emit('alert-speaking', (data));
      } else if (audioMeterTemp <= 0.5 && !speakingFlag) {
        speakingFlag = true;
        speakingFlagSend = false;

        data.status = false;
        getSocket().emit('alert-speaking', (data));
      }
      setAudioMeter(audioMeterTemp);
    }, 200);

    return () => clearInterval(interval);
  }, [roomReconrdInfo]);

  useEffect(() => {
    // Reference:
    // https://github.com/webrtc/samples/blob/gh-pages/src/content/getusermedia/volume/js/soundmeter.js
    // const shareStream = new MediaStream([audio.getTracks()[0], stream.getTracks()[0]]);
    try {
      let audioStream = new MediaStream();
      audioStream.addTrack(audioTrack);

      let context = new AudioContext();
      let script = context.createScriptProcessor(2048, 1, 1);
      let mic = context.createMediaStreamSource(audioStream);
      mic.connect(script);
      script.connect(context.destination);

      script.onaudioprocess = (event) => {
        const input = event.inputBuffer.getChannelData(0);
        let sum = 0.0;
        for (let i = 0; i < input.length; ++i) {
          sum += Math.pow(input[i], 2);
        }
        window.audioMeterTmp = Math.sqrt(sum / input.length);
      };
    } catch (e) {
      console.error(e);
    }
  }, [audioTrack]);

  return (
    <div>
      {/* Audio { ' '} */}
      <meter
        className={startMeasuring ? 'sound-meter sound-meter-on' : 'sound-meter sound-meter-off'}
        high="0.25"
        max="1"
        value={startMeasuring ? audioMeter : ''}
      />
    </div>
  );
}

// 스토어에서 데이터 가져와서 연결
const mapStateToProps = (state) => ({
  currentUser: userSelect.selectCurrentUser(state),
  micState: tabComponentSelector.getMicState(state),

});

function mapDispatchToProps(dispatch) {
  let actions = bindActionCreators({StreamAudioComponentSelf});
  return {...actions, dispatch};
}

export default connect(mapStateToProps, mapDispatchToProps)(StreamAudioComponentSelf);
