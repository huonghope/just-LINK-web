import constants from './ChatComponent.Constants';
import Errors from '../../../../components/Error/error';

const actions = {
  changeDirectMessageToUser: (data) => async (dispatch) => {
    try {
      dispatch({
        type: constants.DIRECT_MESSAGE_TO_USER,
        payload: data,
      });
    } catch (error) {
      Errors.handle(error);
    }
  },
  changeNumberOfNewMessages: (data) => async (dispatch) => {
    try {
      dispatch({
        type: constants.NUMBER_OF_NEW_MESSAGES,
        payload: data,
      });
    } catch (error) {
      Errors.handle(error);
    }
  },
  incrementNumberOfNewMessages: (data) => async (dispatch) => {
    try {
      dispatch({
        type: constants.INCREMENT_NEW_MESSAGES,
        payload: data,
      });
    } catch (error) {
      Errors.handle(error);
    }
  },
  chattingStateChange: (data) => async (dispatch) => {
    try {
      dispatch({
        type: constants.CHAT_STATE_CHANGE,
        payload: {state: data},
      });
    } catch (error) {
      Errors.handle(error);
    }
  },
  disableChatUser: (data) => (dispatch) => {
    try {
      dispatch({
        type: constants.DISABLE_CHAT_USER,
        payload: data,
      });
    } catch (error) {
      Errors.handle(error);
    }
  },
  disableAllChatting: (data) => async (dispatch) => {
    try {
      dispatch({
        type: constants.DISABLE_ALL_CHAT,
        payload: {state: data},
      });
    } catch (error) {
      Errors.handle(error);
    }
  },
};
export default actions;
