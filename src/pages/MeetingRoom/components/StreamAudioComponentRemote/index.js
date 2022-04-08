import React, {Component} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
/**
 * @ComponentDescription
 * RemoteStreamContainerAudio 컴포넌트 받은 audio의 track를 출력함
 * componentDidMount():
 *  audioTrack를 props부터 받아서 출력함
 *  자기stream라면 오디오의 값을 설정함
 * componentWillReceveProps():
 *  새로운 사람이 들어가면 이 컴포넌트를 통해서 출력함
 */
class StreamAudioComponentRemote extends Component {
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
  }

  componentWillReceiveProps(nextProps) {
    // Audio-track 출력함
    if (this.props.audioType === 'remoteAudio' && this.props.audioTrack !== nextProps.audioTrack)
    {
      const {audioTrack} = this.props;
      let audioStream = new MediaStream();
      audioStream.addTrack(audioTrack);
      this.audio.srcObject = audioStream;
    }
  }

  render() {
    return (
      <div className="audio">
        <audio
          ref={(ref) => this.audio = ref}
          autoPlay
          muted={false}
        >
        </audio>
      </div>
    );
  }
}
// 스토어에서 데이터 가져와서 연결
const mapStateToProps = (state) => ({});

function mapDispatchToProps(dispatch) {
  let actions = bindActionCreators({StreamAudioComponentRemote});
  return {...actions, dispatch};
}

export default connect(mapStateToProps, mapDispatchToProps)(StreamAudioComponentRemote);
