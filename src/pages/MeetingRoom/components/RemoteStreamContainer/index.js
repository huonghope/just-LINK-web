import React, {Component, useState, useEffect} from 'react';
import {connect, useDispatch, useSelector} from 'react-redux';
import {bindActionCreators} from 'redux';
import styled from 'styled-components';
import './style.scss';
import meetingRoomSelect from '../../MeetingRoom.Selector';
import {getSocket} from '../../../rootSocket';
import Icon from '../../../../constants/icons';
import StreamVideoComponentRemote from '../StreamVideoComponentRemote';
import StreamVideoComponentSelf from '../StreamVideoComponentSelf';
import userUtils from '../../../../features/UserFeature/utils';

class RemoteStreamContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      rVideos: [],
      loading: true,
    };
  }

  // RemoteStreamContainer 노출 시 한번 실행함
  componentDidMount() {
    if (getSocket() !== null) {
      const {remoteStreams} = this.props;
      const fetchVideos = async () => {
        const {rVideos} = await SetVideos(remoteStreams);
        this.setState({
          rVideos: rVideos,
          loading: false,
        });
      };
      fetchVideos();
    }
  }

  // remoteStreams를 변경 시 실행함
  componentWillReceiveProps(nextProps) {
    if (this.props.remoteStreams !== nextProps.remoteStreams ||
      this.props.remoteStreamsProps !== nextProps.remoteStreamsProps
    ) {
      const fetchVideos = async () => {
        const remoteStreams = nextProps.remoteStreams;
        const {rVideos} = await SetVideos(remoteStreams);
        this.setState({
          rVideos: rVideos,
          loading: false,
        });
      };
      fetchVideos();
    }
  }

  render() {
    const {paintScreen, remoteStreams} = this.props;
    const {rVideos} = this.state;
    if (remoteStreams.length === 0) {
      return (
        <WrapperLoading className="loading" style={paintScreen ? {display: 'none', background: 'black'} : {background: 'black'}}>
          <div style={{transform: `translateY(${-50}%)`, display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            <img src={Icon.WaitImage} style={{width: '140px', height: '140px'}} alt="waiting" />
            <p style={{textAlign: 'center', color: 'white'}}>입장을 기다리고 있습니다.</p>
          </div>
        </WrapperLoading>
      );
    }
    return (
      <div className="remote-stream__container" style={paintScreen ? {display: 'none'} : {}}>
        <div className="list-videos">
          <div className={`video-${rVideos.length}`}>
            {rVideos}
          </div>
        </div>
      </div>
    );
  }
}

// 자기건인지 상대방인지 구분함
const VideoItem = ({rVideoTrack, userInfo, socketId}) => {
  const userInfoToken = userUtils.getUserInfo();
  let isSelfStream = userInfo && userInfo.user_idx === userInfoToken.userId;
  if (isSelfStream) {
    return (
      <StreamVideoComponentSelf
        videoType="localVideo"
        rVideoTrack={rVideoTrack}
        userInfo={userInfo}
        socketId={socketId}
      />
    );
  } else {
    return <StreamVideoComponentRemote
      videoType="remoteVideo"
      rVideoTrack={rVideoTrack}
      userInfo={userInfo}
      socketId={socketId}
    />;
  }
};
const SetVideos = (remoteStreams) => {
  return new Promise((resolve, rej) => {
    try {
    // !두개 값을 이렇게 하면 될것같음
      // let _filterRemote = remoteStreams;
      let _rVideos = remoteStreams.map((rVideo, index) => {
        const _videoTrack = rVideo.stream.getTracks().filter((track) => track.kind === 'video');
        let video = null;
        video = _videoTrack.length !== 0 ? (
            <VideoItem
              key={index}
              rVideoTrack={_videoTrack[0]}
              userInfo={rVideo.userInfo}
              socketId={rVideo.id}
            />
          ) : <div className="video-item video-stream-single"><img src={Icon.videoOffImage} alt="warning"></img></div>;
        return video;
      });
      resolve({
        rVideos: _rVideos,
      });
    } catch (error) {
      console.log(error);
    }
  });
};

// 체크함
const mapStateToProps = (state) => ({
  remoteStreamsProps: meetingRoomSelect.selectRemoteStreams(state),
});

function mapDispatchToProps(dispatch) {
  let actions = bindActionCreators({RemoteStreamContainer});
  return {...actions, dispatch};
}

const WrapperLoading = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
`;
export default connect(mapStateToProps, mapDispatchToProps)(RemoteStreamContainer);
// export default
