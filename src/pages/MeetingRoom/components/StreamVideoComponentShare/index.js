import React, {Component, useState, useEffect} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import './style.scss';

class StreamVideoComponentShare extends Component {
  constructor(props) {
    super(props);
    this.state = {
      videoVisible: 'visible',
    };
  }

  // 처음에 한번만 했음 - 보인인 경우에는 this.props.videoStream를 전달을 안 되어서 거의 의미가 없음
  // Remote Stream를 이용함 - Left에서 Stream를 존재해서 전달하니까 바로반응
  componentDidMount() {
    if (this.props.rVideoTrack) {
      try {
        const {rVideoTrack} = this.props;
        let videoStream = new MediaStream();
        videoStream.addTrack(rVideoTrack);
        this.video.srcObject = videoStream;
      } catch (error) {
        console.log(error);
      }
    }
  }
  // 그후에 다른 사람의 Stream를 Render
  // 전단해주는 Stream는 값이 있을떄
  componentWillReceiveProps(nextProps) {
    if ((this.props.videoType === 'shareVideo') &&
    this.props.rVideoTrack !== nextProps.rVideoTrack) {
      const {rVideoTrack} = nextProps;
      let videoStream = new MediaStream();
      videoStream.addTrack(rVideoTrack);
      this.video.srcObject = videoStream;
    }
  }

  render() {
    const {userInfo} = this.props;
    return (
      <div className="video-item-share video-item">
        <video
          autoPlay
          style={{
            visibility: this.state.videoVisible ? 'visible' : 'hidden',
            ...this.props.videoStyles,
          }}
          ref={(ref) => {
            this.video = ref;
          }}
        />
        <div className="stream-info">
          <ul>
            <li>{userInfo.nickname ? userInfo.nickname : userInfo.username}님  화면 공유중</li>
          </ul>
        </div>
      </div>
    );
  }
}

// 스토어에서 데이터 가져와서 연결
const mapStateToProps = (state) => ({
});

function mapDispatchToProps(dispatch) {
  let actions = bindActionCreators({StreamVideoComponentShare});
  return {...actions, dispatch};
}

export default connect(mapStateToProps, mapDispatchToProps)(StreamVideoComponentShare);
