import produce from 'immer';
import constants from './MeetingRoom.Constants';

const initialState = {
  myInfo: {},
  micAllUserState: false,
  localStream: null,
  userType: 0,
  roomInfo: null,
  fixVideo: {
    status: false,
    userInfo: {},
  },
  listUserBadNetwork: [],
  peerConnections: {},
  listUserByUserRoom: [],
  remoteStreams: [],
  roomRecordInfo: null,
};

export const roomReducer =(state = initialState, {type, payload}) =>
  produce(state, (draft) => {
    switch (type) {
      // 본인 정보를 저장함
      case constants.CHANGE_SET_MY_INFO:
        draft.myInfo = payload;
        break;
      case constants.CHANGE_SET_MY_INFO_ERROR:
        draft.myInfo = undefined;
      // 전체 음성 상태
      case constants.CHANGE_MIC_ALL_USER_STATE:
        draft.micAllUserState = payload.micAllUserState;
        break;
      case constants.CREATE_LOCALSTREAM_ERROR:
        draft.micAllUserState = undefined;
        break;
      // 로컬 스트림
      case constants.CREATE_LOCALSTREAM:
        draft.localStream = payload.localStream;
        break;
      case constants.CREATE_LOCALSTREAM_ERROR:
        draft.localStream = undefined;
        break;
      // 유저 타입
      case constants.SET_USER_TYPE:
        draft.userType = payload.userType;
        break;
      case constants.SET_USER_TYPE_ERROR:
        draft.userType = payload.userType;
        break;
      // 방의 정보
      case constants.SET_ROOM_INFO:
        draft.roomInfo = payload.roomInfo;
        break;
      case constants.SET_ROOM_INFO_ERROR:
        draft.roomInfo = undefined;
        break;
      // 화면공유
      case constants.CHANGE_SHARE_SCREEN_STATE:
        draft.shareScreen = payload.status;
        break;
      // 네트워크상태가 안 좋은 유저 리스트
      case constants.CHANGE_LIST_USER_BAD_NETWORK:
        let {type, data} = payload;
        let listUserBadNetworkTemp = [];
        if (type === 'add') { // 이미 존재하지 않면 추가함
          let existsUser = state.listUserBadNetwork.find((user) => user.user_idx === data.user_idx);
          if (existsUser === undefined) {
            listUserBadNetworkTemp = [...state.listUserBadNetwork, data];
            draft.listUserBadNetwork = listUserBadNetworkTemp;
          }
          break;
        } else if (type === 'remove') { // 존재하면 삭제
          let existsUser = state.listUserBadNetwork.find((user) => user.user_idx === data.user_idx);
          if (existsUser !== undefined) {
            listUserBadNetworkTemp = state.listUserBadNetwork.filter((user) => user.user_idx !== data.user_idx);
            draft.listUserBadNetwork = listUserBadNetworkTemp;
          }
          break;
        } else {
          break;
        }
      case constants.CHANGE_LIST_USER_BAD_NETWORK_ERROR:
        draft.listUserBadNetwork = [];
        break;
      // 현재 Peer Connections 객체
      case constants.SET_PEER_CONNECTIONS:
        draft.peerConnections = payload;
        break;
      case constants.SET_PEER_CONNECTIONS_ERROR:
        draft.peerConnections = undefined;
        break;
      // 유저 리스트 by 유저룸
      case constants.SET_LIST_USER_BY_USERROOM:
        draft.listUserByUserRoom = payload;
        break;
      case constants.SET_LIST_USER_BY_USERROOM_ERROR:
        draft.listUserByUserRoom = undefined;
        break;
      // 녹화정보 저장함
      case constants.SET_ROOMRECORD_INFO:
        draft.roomRecordInfo = payload;
        break;
      case constants.SET_ROOMRECORD_INFO_ERROR:
        draft.roomRecordInfo = undefined;
        break;
      case constants.MUTE_ALL_MIC:
        draft.muteAllMic = payload;
        break;
      case constants.FIX_VIDEO:
        draft.fixVideo = payload;
        break;
      case constants.SET_REMOTESTREAMS:
        draft.remoteStreams = payload;
        break;
      case constants.SET_REMOTESTREAMS_ERROR:
        draft.remoteStreams = undefined;
        break;
      default:
        return state;
    }
  });
export default roomReducer;

