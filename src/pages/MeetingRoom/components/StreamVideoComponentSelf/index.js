import React, {Component, useState, useEffect} from 'react';
import {withTranslation} from 'react-i18next';
import {bindActionCreators} from 'redux';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import {connect} from 'react-redux';
import './style.scss';
import {getSocket} from '../../../rootSocket';

import meetingRoomSelector from '../../MeetingRoom.Selector';

import chatComponentSelector from '../ChatComponent/ChatComponent.Selector';

import tabComponentSelector from '../TabComponent/TabComponent.Selector';

import userSelect from '../../../../features/UserFeature/selector';

import FormAlert from '../../../../components/Alert/FormAlert';
import svgIcons from '../../../../constants/svgIcon';
import Icon from '../../../../constants/icons';

/**
 * @ComponentDescription
 * 자기 stream를 출력하기 위한
 * componentDidMount():
 *  videoTrack를 props부터 받아서 출력함
 *  카메라의 상태의 지정한 값을 설정함
 *  유저이름을 설정해서 출력함
 *
 * componentWillReceiveProps():
 *  videoTrack를 props부터 받아서 출력함
 *  카메라를 변경할때 마다 icon 변경함
 *  마이크를 변경할때 icon를 변경함
 */
class StreamVideoComponentSelf extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      showDropDownList: false,
      userName: '',
    };
  }
  componentDidMount() {
    if (this.props.rVideoTrack) {
      const {rVideoTrack} = this.props;
      let videoStream = new MediaStream();
      videoStream.addTrack(rVideoTrack);
      this.video.srcObject = videoStream;
    }

    if (this.props.videoType === 'localVideo') {
      const {camState} = this.props;
      const stream = this.video.srcObject.getTracks().filter((track) => track.kind === 'video');
      if (stream.length !== 0) {
        stream[0].enabled = camState;
      }

      getSocket().on('my-update-username', (data) => {
        const {newName, remoteSocketId} = data;
        if (getSocket().id === remoteSocketId) {
          this.setState({
            userName: newName,
          });
        }
      });
    }

    if (this.props.userInfo) {
      const {nickname, user_name} = this.props.userInfo;
      let userName = nickname ? nickname : user_name;
      this.setState({
        userName: userName,
      });
    }
  }


  componentWillReceiveProps(nextProps) {
    if ((this.props.videoType === 'localVideo') &&
    this.props.rVideoTrack !== nextProps.rVideoTrack) {
      const {rVideoTrack} = nextProps;
      let videoStream = new MediaStream();
      videoStream.addTrack(rVideoTrack);
      this.video.srcObject = videoStream;
    }

    // 카메라를 변경할 떄
    if ((this.props.videoType === 'localVideo') &&
    this.props.camState !== nextProps.camState &&
    this.video
    ) {
      const {camState} = nextProps;
      const stream = this.video.srcObject.getTracks().filter((track) => track.kind === 'video');
      if (stream.length !== 0) {
        stream[0].enabled = camState;
      }
    }
  }

  render() {
    const {videoType, camState, micState} = this.props;
    const {showDropDownList, userName} = this.state;
    const {t} = this.props;

    return (
      <div className="video-item-self video-item" id ="local-video-item" >
        <video
          muted={true}
          autoPlay
          ref={(ref) => {
            this.video = ref;
          }}
          style={camState ? {} : {display: 'none'}}
        />
        <img style={camState ? {display: 'none'} : {}} src={Icon.videoOffImage} className="temp-image"/>
        {
          videoType === 'localVideo' && (
            <div className="stream-info">
              <ul>
                <li>{ micState ? <svgIcons.micOn />: <svgIcons.micOff/>}</li>
                <li>{ userName }</li>
                <li><MoreVertIcon
                  style={{fill: '#ffffff', marginTop: '2px', cursor: 'pointer'}}
                  onClick={() => {
                    this.setState({showDropDownList: !showDropDownList});
                  }}
                />
                {
                  showDropDownList &&
                  <div className="video-more-options-list">
                    <ul>
                      <li onClick={() => {
                        this.setState({showDropDownList: !showDropDownList});
                        FormAlert({
                          title: '사용하실 닉네임을 입력해주세요.',
                          handleClickAccept: (newUsername) => {
                            console.log(newUsername);
                            const data = {
                              username: newUsername,
                            };
                            console.log(getSocket());
                            console.log(getSocket().id);
                            getSocket().emit('update-username', data);
                          },
                          handleClickReject: () => {},
                        });
                      }}
                      >{t('mainPage.videoComponent.functionList.changeNickName')}</li>
                    </ul>
                  </div>
                }
                </li>
              </ul>
            </div>
          )
        }
      </div>
    );
  }
}

// 스토어에서 데이터 가져와서 연결
const mapStateToProps = (state) => ({
  camState: tabComponentSelector.getCamState(state),
  micState: tabComponentSelector.getMicState(state),

  // Host인지 구분한 변수
  userType: meetingRoomSelector.selectUserType(state),

  // 채팅상태를 구분한 변수
  disableAllChat: chatComponentSelector.selectDisableAllChat(state),
  disableChatUser: chatComponentSelector.selectDisableChatUser(state),
  currentUser: userSelect.selectCurrentUser(state),

  // 네트워크 상태가 안 좋은 유저 리스트
  listUserBadNetwork: meetingRoomSelector.selectListUserBadNetwork(state),
});

function mapDispatchToProps(dispatch) {
  let actions = bindActionCreators({StreamVideoComponentSelf});
  return {...actions, dispatch};
}

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation()(StreamVideoComponentSelf));
