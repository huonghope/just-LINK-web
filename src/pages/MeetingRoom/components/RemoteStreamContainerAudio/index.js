import React, {Component, useEffect, useState} from 'react';
import {connect, useSelector} from 'react-redux';
import {bindActionCreators} from 'redux';
import styled from 'styled-components';
import './style.scss';
import {getLectureInfo} from '../RemoteStreamContainer/RemoteStreamContainer.Service';
import remoteStreamContainerAction from '../RemoteStreamContainer/RemoteStreamContainer.Action';
import remoteStreamSelector from '../RemoteStreamContainer/RemoteStreamContainer.Selector';

import userSelectors from '../../../../features/UserFeature/selector';
import tabComponentSelect from '../TabComponent/TabComponent.Selector';
import {getSocket} from '../../../rootSocket';
import userUtils from '../../../../features/UserFeature/utils';
import StreamAudioComponentSelf from '../StreamAudioComponentSelf';
import StreamAudioComponentRemote from '../StreamAudioComponentRemote';
class RemoteStreamContainerAudio extends Component {
  constructor(props) {
    super(props);
    this.state = {
      listAudio: [],
      loading: true,
    };
  }

  // RemoteStreamContainer 노출 시 한번 실행함
  componentDidMount() {
    if (this.props.remoteStreams) {
      const fetchAudios = async () => {
        const {rAudios} = await setAudios(this.props.remoteStreams, this.props);
        this.setState({
          listAudio: rAudios,
          loading: false,
        });
      };
      fetchAudios();
    }
  }

  // remoteStreams를 변경 시 실행함
  componentWillReceiveProps(nextProps) {
    if (this.props.remoteStreams !== nextProps.remoteStreams) {
      const fetchAudios = async () => {
        const {rAudios} = await setAudios(nextProps.remoteStreams, this.props);
        this.setState({
          listAudio: rAudios,
          loading: false,
        });
      };
      fetchAudios();
    }
  }

  render() {
    const {listAudio} = this.state;
    return (
      <div className="remote-stream__container-audio">
        <div className="list-audio">
          {listAudio}
        </div>
      </div>
    );
  }
}

// Video개별 Component
// !rVideo.id = socket.id
const AudioItem = ({audioTrack, userInfo}) => {
  const userInfoStore = userUtils.getUserInfo();
  let isSelfStream = userInfo && userInfo.user_idx === userInfoStore.userId;
  if (!isSelfStream) {
    return (
      <StreamAudioComponentRemote
        audioType="remoteAudio"
        audioTrack={audioTrack}
        userInfo={userInfo}
      />
    );
  }
  return <></>;
};

const setAudios = (remoteStreams) => {
  return new Promise((resolve, rej) => {
    try {
      let _rAudios = remoteStreams.map((remoteStream, index) => {
        const _audioTrack = remoteStream.stream.getTracks().filter((track) => track.kind === 'audio');
        const userInfo = remoteStream.userInfo;
        let audio = null;
        audio = _audioTrack.length !== 0 ?
          <AudioItem
            key={index}
            audioTrack={_audioTrack[0]}
            userInfo={userInfo}
          /> : '';
        return audio;
      });
      resolve({
        rAudios: _rAudios,
      });
    } catch (error) {
      console.log(error);
    }
  });
};

const mapStateToProps = (state) => ({
});

function mapDispatchToProps(dispatch) {
  let actions = bindActionCreators({RemoteStreamContainerAudio});
  return {...actions, dispatch};
}

export default connect(mapStateToProps, mapDispatchToProps)(RemoteStreamContainerAudio);
// export default
