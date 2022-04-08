import constants from './MeetingRoom.Constants';
import Errors from '../../components/Error/error';
import {getSocket} from '../rootSocket';
import meetingRoomSocket from './MeetingRoom.Socket';
import chatComponentService from './components/ChatComponent/ChatComponent.Service';

const actions = {
  handleSetMyInfo: (data) => async (dispatch) => {
    try {
      dispatch({
        type: constants.CHANGE_SET_MY_INFO,
        payload: data,
      });
    } catch (error) {
      Errors.handle(error);
      dispatch({
        type: constants.CHANGE_SET_MY_INFO_ERROR,
      });
    }
  },
  handleSetUserType: (data) => async (dispatch) => {
    try {
      if (data.init) {
        let params = {
          usr_id: localStorage.getItem('usr_id'),
          userId: JSON.parse(localStorage.getItem('asauth')).userInfoToken.userId,
          data: data.userType,
        };
        console.log(params);
        await chatComponentService.updateUserAuth(params);
      }
      dispatch({
        type: constants.SET_USER_TYPE,
        payload: data,
      });
    } catch (error) {
      Errors.handle(error);
      dispatch({
        type: constants.SET_USER_TYPE_ERROR,
      });
    }
  },
  handleSaveRemoteStreams: (data) => async (dispatch) => {
    try {
      dispatch({
        type: constants.SET_REMOTESTREAMS,
        payload: data,
      });
    } catch (error) {
      Errors.handle(error);
      dispatch({
        type: constants.SET_REMOTESTREAMS_ERROR,
      });
    }
  },
  handleSetRoomInfo: (data) => async (dispatch) => {
    try {
      dispatch({
        type: constants.SET_ROOM_INFO,
        payload: {roomInfo: data},
      });
    } catch (error) {
      Errors.handle(error);
      dispatch({
        type: constants.SET_ROOM_INFO_ERROR,
      });
    }
  },
  handleChangeListUserBadNetwork: (data) => async (dispatch) => {
    try {
      dispatch({
        type: constants.CHANGE_LIST_USER_BAD_NETWORK,
        payload: {type: data.type, data: data.data},
      });
    } catch (error) {
      Errors.handle(error);
      dispatch({
        type: constants.CHANGE_LIST_USER_BAD_NETWORK_ERROR,
      });
    }
  },
  handleCreateLocalStream: (localStream) => async (dispatch) => {
    try {
      dispatch({
        type: constants.CREATE_LOCALSTREAM,
        payload: {localStream: localStream},
      });
    } catch (error) {
      Errors.handle(error);
      dispatch({
        type: constants.CREATE_LOCALSTREAM_ERROR,
      });
    }
  },
  handleChangeMicAllUserState: (status) => async (dispatch) => {
    try {
      dispatch({
        type: constants.CHANGE_MIC_ALL_USER_STATE,
        payload: status,
      });
    } catch (error) {
      Errors.handle(error);
      dispatch({
        type: constants.CHANGE_MIC_ALL_USER_STATE_ERROR,
      });
    }
  },
  handleFixVideo: (data) => async (dispatch) => {
    try {
      dispatch({
        type: constants.CHANGE_FIX_VIDEO,
        payload: data,
      });
    } catch (error) {
      Errors.handle(error);
      dispatch({
        type: constants.CHANGE_FIX_VIDEO_ERROR,
      });
    }
  },
  handleSetPeerConnections: (data) => async (dispatch) => {
    try {
      dispatch({
        type: constants.SET_PEER_CONNECTIONS,
        payload: data,
      });
    } catch (error) {
      Errors.handle(error);
      dispatch({
        type: constants.SET_PEER_CONNECTIONS_ERROR,
      });
    }
  },
  handleSetListUserByUserRoom: (data) => async (dispatch) => {
    try {
      dispatch({
        type: constants.SET_LIST_USER_BY_USERROOM,
        payload: data,
      });
    } catch (error) {
      Errors.handle(error);
      dispatch({
        type: constants.SET_LIST_USER_BY_USERROOM_ERROR,
      });
    }
  },
  handleSetRoomRecordInfo: (data) => async (dispatch) => {
    try {
      console.log(data);
      dispatch({
        type: constants.SET_ROOMRECORD_INFO,
        payload: data,
      });
    } catch (error) {
      Errors.handle(error);
      dispatch({
        type: constants.SET_ROOMRECORD_INFO_ERROR,
      });
    }
  },
};
export default actions;
