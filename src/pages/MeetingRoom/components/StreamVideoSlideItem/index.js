import React, {Component, useState, useEffect} from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import './style.scss';


class StreamVideoSlideItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      videoVisible: true,
    };
  }

  componentDidMount() {
    if (this.props.rVideoTrack) {
      const {rVideoTrack} = this.props;
      let videoStream = new MediaStream();
      videoStream.addTrack(rVideoTrack);
      this.video.srcObject = videoStream;
    }
  }

  // 그후에 다른 사람의 Stream를 Render
  // 전단해주는 Stream는 값이 있을떄
  componentWillReceiveProps(nextProps) {
    if ((this.props.videoType === 'slideVideo') &&
    this.props.rVideoTrack !== nextProps.rVideoTrack) {
      const {rVideoTrack} = nextProps;
      let videoStream = new MediaStream();
      videoStream.addTrack(rVideoTrack);
      this.video.srcObject = videoStream;
    }
  }

  render() {
    return (
      <>
        <video
          muted={this.props.muted}
          autoPlay
          style={{
            visibility: this.state.videoVisible ? 'visible' : 'hidden',
            ...this.props.videoStyles,
          }}
          ref={(ref) => {
            this.video = ref;
          }}
        />
      </>
    );
  }
}


// 스토어에서 데이터 가져와서 연결
const mapStateToProps = (state) => ({
});

function mapDispatchToProps(dispatch) {
  let actions = bindActionCreators({StreamVideoSlideItem});
  return {...actions, dispatch};
}

export default connect(mapStateToProps, mapDispatchToProps)(StreamVideoSlideItem);
