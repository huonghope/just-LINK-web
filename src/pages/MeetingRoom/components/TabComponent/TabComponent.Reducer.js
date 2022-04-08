import produce from 'immer';
import constants from './TabComponent.Constants';

// default true
const initialState = {
  shareScreenState: false,
  showListUserState: false,
  showWhiteBoard: false,
  showChatState: false,
  micState: false,
  camState: true,
  recordState: false,
};

export const tabComponentReducer =(state = initialState, {type, payload}) =>
  produce(state, (draft) => {
    switch (type) {
      // 화면공유
      case constants.CHANGE_SHARE_SCREEN_STATE:
        if (payload.status === undefined) {
          draft.shareScreenState = !draft.shareScreenState;
        } else {
          draft.shareScreenState = payload.status;
        }
        break;
      case constants.CHANGE_SHARE_SCREEN_STATE_ERROR:
        draft.showListUserState = undefined;
        break;
      // 유저리스트 출력 상태
      case constants.CHANGE_SHOW_LIST_USER_STATE:
        if (payload.status === undefined) {
          draft.showListUserState = !draft.showListUserState;
        } else {
          draft.showListUserState = payload.status;
        }
        break;
      case constants.CHANGE_SHOW_LIST_USER_STATE_ERROR:
        draft.showListUserState = undefined;
        break;
      // 채팅 컴포넌트 출력 상태
      case constants.CHANGE_SHOW_CHAT_STATE:
        draft.showChatState = payload.status;
        break;
      case constants.CHANGE_SHOW_CHAT_STATE_ERROR:
        draft.showChatState = null;
        break;
      // 캠버스
      case constants.CHANGE_SHOW_WHITEBOARD:
        draft.showWhiteBoard = payload.status;
        break;
      case constants.CHANGE_SHOW_WHITEBOARD_ERROR:
        draft.showWhiteBoard = null;
        break;
      // 본인 마이크 상태
      case constants.CHANGE_MIC_STATE:
        if (payload.status === undefined) {
          draft.micState = !draft.micState;
        } else {
          draft.micState = payload.status;
        }
        break;
      case constants.CHANGE_MIC_STATE_ERROR:
        draft.micState = undefined;
        break;
      // 본인 카메라 상태
      case constants.CHANGE_CAM_STATE:
        if (payload.status === undefined) {
          draft.camState = !draft.camState;
        } else {
          draft.camState = payload.status;
        }
        break;
      case constants.CHANGE_CAM_STATE_ERROR:
        draft.camState = undefined;
        break;
      // 녹화상태
      case constants.CHANGE_RECORD_STATE:
        draft.recordState = payload.status;
        break;
      case constants.CHANGE_RECORD_STATE_ERROR:
        draft.recordState = undefined;
        break;
      default:
        return state;
    }
  });
export default tabComponentReducer;

