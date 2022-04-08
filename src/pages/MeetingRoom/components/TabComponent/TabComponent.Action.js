import constants from './TabComponent.Constants';
import Errors from '../../../../components/Error/error';

const actions = {
  // 유저리스트 출력 상태를 변경 이벤트
  handleChangeShareScreenState: (data) => async (dispatch) => {
    try {
      dispatch({
        type: constants.CHANGE_SHARE_SCREEN_STATE,
        payload: {status: data},
      });
    } catch (error) {
      dispatch({
        type: constants.CHANGE_SHARE_SCREEN_STATE_ERROR,
      });
      Errors.handle(error);
    }
  },
  // 유저 리스트
  handleChangeShowListUserState: (data) => async (dispatch) => {
    try {
      dispatch({
        type: constants.CHANGE_SHOW_LIST_USER_STATE,
        payload: {status: data},
      });
    } catch (error) {
      dispatch({
        type: constants.CHANGE_SHOW_LIST_USER_STATE_ERROR,
      });
      Errors.handle(error);
    }
  },
  // 채팅 컴포넌트 출력 상태를 변경 이벤트
  handleChangeShowChatState: (data) => async (dispatch) => {
    try {
      dispatch({
        type: constants.CHANGE_SHOW_CHAT_STATE,
        payload: {status: data},
      });
    } catch (error) {
      dispatch({
        type: constants.CHANGE_SHOW_CHAT_STATE_ERROR,
      });
      Errors.handle(error);
    }
  },

  // 본인 카메라 상태를 변경 이벤트
  handleChangeMicState: (data) => async (dispatch) => {
    try {
      dispatch({
        type: constants.CHANGE_MIC_STATE,
        payload: {status: data},
      });
    } catch (error) {
      dispatch({
        type: constants.CHANGE_MIC_STATE_ERROR,
      });
      Errors.handle(error);
    }
  },

  // 본인 카메라 상태를 변경 이벤트
  handleChangeCamState: (data) => async (dispatch) => {
    try {
      dispatch({
        type: constants.CHANGE_CAM_STATE,
        payload: {status: data},
      });
    } catch (error) {
      Errors.handle(error);
      dispatch({
        type: constants.CHANGE_CAM_STATE_ERROR,
      });
    }
  },

  // 녹화상태
  handleChangeRecordState: (data) => async (dispatch) => {
    try {
      dispatch({
        type: constants.CHANGE_RECORD_STATE,
        payload: {status: data},
      });
    } catch (error) {
      Errors.handle(error);
      dispatch({
        type: constants.CHANGE_RECORD_STATE_ERROR,
      });
    }
  },
  // 캔버스
  handChangeWhiteBoard: (data) => async (dispatch) => {
    try {
      dispatch({
        type: constants.CHANGE_SHOW_WHITEBOARD,
        payload: {status: data},
      });
    } catch (error) {
      Errors.handle(error);
      dispatch({
        type: constants.CHANGE_SHOW_WHITEBOARD_ERROR,
      });
    }
  },
};
export default actions;
