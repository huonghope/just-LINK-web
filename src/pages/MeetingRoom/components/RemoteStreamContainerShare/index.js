import React, {Component, useState, useEffect} from 'react';
import {connect, useDispatch, useSelector} from 'react-redux';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import {bindActionCreators} from 'redux';
import styled from 'styled-components';
import './style.scss';
import moment from 'moment';

import tabComponentSelector from '../TabComponent/TabComponent.Selector';
import Icon from '../../../../constants/icons';
import StreamVideoSlideItem from '../StreamVideoSlideItem';
import svgIcons from '../../../../constants/svgIcon';
import StreamVideoComponentShare from '../StreamVideoComponentShare';
import Loading from '../../../../components/Loading/';

import userSelect from '../../../../features/UserFeature/selector';
class RemoteStreamContainerShare extends Component {
  constructor(props) {
    super(props);

    this.state = {
      rVideos: [],
      loading: true,

      viewListRemote: true,
      loadingStream: true,
    };
  }
  componentDidMount() {
    const {shareScreenStream} = this.props;
    const fetchVideos = async () => {
      const {rVideos} = await SetVideos(shareScreenStream, this.props);
      this.setState({
        rVideos: rVideos,
        loading: false,
      });
    };
    fetchVideos();
    setTimeout(() => {
      this.setState({
        loadingStream: false,
      });
    }, 1 * 1000);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.shareScreenStream !== nextProps.shareScreenStream) {
      const fetchVideos = async () => {
        const {rVideos} = await SetVideos(nextProps.shareScreenStream, this.props);
        this.setState({
          rVideos: rVideos,
          loading: false,
        });
      };
      fetchVideos();
    }
  }

  handleClickViewListRemote = () => {
    this.setState((prevState) => ({
      viewListRemote: !prevState.viewListRemote,
    }));
  }

  render() {
    const {rVideos, viewListRemote, loadingStream} = this.state;
    const {paintScreen, remoteStreams, shareScreenStream} = this.props;
    if (remoteStreams.length === 0) {
      return (
        <WrapperLoadingDiv className="loading" style={paintScreen ? {display: 'none', background: 'black'} : {background: 'black'}}>
          <div style={{transform: `translateY(${-50}%)`}}>
            <img src={Icon.WaitImage} style={{width: '140px', height: '140px'}} alt="waiting" />
            <p style={{textAlign: 'center', color: 'white'}}>입장을 기다리고 있습니다.</p>
          </div>
        </WrapperLoadingDiv>
      );
    }
    return (
      <div className="remote-stream__container" style={paintScreen ? {display: 'none'} : {}}>
        {
          <div>
            {
              viewListRemote &&
              <div className="remote-list-user">
                < SlideRemoteStream
                  shareScreenStream={shareScreenStream}
                  remoteStreams={remoteStreams}
                />
              </div>
            }
            <button className="view-list-user" onClick={() => this.handleClickViewListRemote()}>
              <svgIcons.cameraPerson />
            </button>
          </div>
        }
        <div className="list-videos">
          {
            loadingStream ?
            <Loading wrapperStyle={{position: 'absolute', zIndex: 999, backgroundColor: 'rgba(225, 225, 225, .3)'}} type={'spokes'} color={'white'} /> :
            <div className={`video-1`}>
              {
                rVideos
              }
            </div>
          }
        </div>
      </div>
    );
  }
}

const SlideRemoteStream = ({remoteStreams, shareScreenStream}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(3);
  const currentUser = useSelector(userSelect.selectCurrentUser);

  const micState = useSelector(tabComponentSelector.getMicState);

  const onClickPrevSlide = () => {
    setCurrentPage(currentPage - 1);
  };

  const onClickNextSlide = () => {
    setCurrentPage(currentPage + 1);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;

  let listRemoteStream = remoteStreams.filter((stream) => ((stream.id !== shareScreenStream.id) && (stream.type !== 'screen-share')));
  const currentItems = listRemoteStream.slice(indexOfFirstItem, indexOfLastItem);
  return (
    <>
      <ul>
        {
          currentItems.length !== 0 && currentItems.map((rVideo, idx) => {
            const _videoTrack = rVideo.stream.getTracks().filter((track) => track.kind === 'video');
            const {userInfo} = rVideo;
            let _rVideos = _videoTrack.length !== 0 ? (
              <li key={idx}>
                <StreamVideoSlideItem
                  videoType="slideVideo"
                  rVideoTrack={_videoTrack[0]}
                  userInfo={rVideo.userInfo}
                />
                {
                  (userInfo.user_idx === currentUser.user_idx) ?
                  <StreamVideoSlideItemInfoSelf userInfo = {userInfo} /> :
                  <StreamVideoSlideItemInfoOther userInfo = {userInfo} />
                }
              </li>
            ) :
              <li key={idx}>
                <img src={Icon.videoOffImage} alt="warning"></img>
              </li>;
            return _rVideos;
          })
        }
      </ul>
      <div className="action-button">
        <button onClick={() => onClickPrevSlide()} disabled={currentPage === 1 ? true : false}> <svgIcons.arrowRight /> </button>
        <button style={{marginLeft: '10px'}} onClick={() => onClickNextSlide()} disabled={(remoteStreams.length / itemsPerPage) >= currentPage ? false : true}> <svgIcons.arrowLeft /> </button>
      </div>
    </>
  );
};
const StreamVideoSlideItemInfoSelf = ({userInfo}) => {
  const micState = useSelector(tabComponentSelector.getMicState);
  return (
    <div className="user-info-video" style={{background: 'rgba(3, 127, 243, 0.9)'}}>
      <ul>
        <li>{micState ? <svgIcons.micOn /> : <svgIcons.micOff/>}</li>
        <li><p>{userInfo.nickname ? userInfo.nickname : userInfo.username}</p></li>
      </ul>
    </div>
  );
};

// ! 마이크를 적용 아직 안 함
const StreamVideoSlideItemInfoOther = ({userInfo}) => {
  // const micState = useSelector(tabComponentSelector.getMicState);
  return (
    <div className="user-info-video" style={{background: 'rgba(3, 127, 243, 0.9)'}}>
      <ul>
        {/* <li>{micState ? <svgIcons.micOn /> : <svgIcons.micOff/>}</li> */}
        <li><p>{userInfo.nickname ? userInfo.nickname : userInfo.username}</p></li>
      </ul>
    </div>
  );
};


// 처음에 들어갈때
const SetVideos = (remoteStreams) => {
  return new Promise((resolve, rej) => {
    try {
      let rVideo = remoteStreams;
      const _videoTrack = rVideo.stream.getTracks().filter((track) => track.kind === 'video');
      let _rVideos = _videoTrack.length !== 0 ? (
        <StreamVideoComponentShare
          videoType="shareVideo"
          rVideoTrack={_videoTrack[0]}
          userInfo={rVideo.userInfo}
        />
      ) : <div>
        <Loading type={'bars'} color={'white'} />
        videoTrack 존재하지 않음
      </div>;
      resolve({
        rVideos: _rVideos,
      });
    } catch (error) {

    }
  });
};


const mapStateToProps = (state) => ({
  currentUser: userSelect.selectCurrentUser(state),
});

function mapDispatchToProps(dispatch) {
  let actions = bindActionCreators({RemoteStreamContainerShare});
  return {...actions, dispatch};
}

const WrapperLoadingDiv = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
`;
export default connect(mapStateToProps, mapDispatchToProps)(RemoteStreamContainerShare);
// export default
