import constants from './ChatComponent.Constants';
import produce from 'immer';

const initialState = {
  chattingState: false,
  disableChatUser: [],
  disableAllChat: false,
  numberOfNewMessages: 0,
  directMessageToUser: null,
};

const chatReducer = (state = initialState, {type, payload}) =>
  produce(state, (draft) => {
    switch (type) {
      case constants.DIRECT_MESSAGE_TO_USER:
        draft.directMessageToUser = payload;
        break;
      case constants.NUMBER_OF_NEW_MESSAGES:
        draft.numberOfNewMessages = payload;
        break;
      case constants.INCREMENT_NEW_MESSAGES:
        let prevNumber = 0;
        if (payload === undefined) {
          // 하나씩 증가함
          prevNumber = state.numberOfNewMessages;
          draft.numberOfNewMessages = ++prevNumber;
        } else {
          // reset
          draft.numberOfNewMessages = prevNumber;
        }
        break;
      case constants.CHAT_STATE_CHANGE:
        draft.chattingState = payload.state;
        break;
      case constants.DISABLE_CHAT_USER:
        let existsUser = state.disableChatUser.filter(
            (item) => item.userId === payload.userId,
        );
        if (existsUser.length === 0) {
          draft.disableChatUser.push(payload);
        } else {
          let mapUser = state.disableChatUser.map((item) =>
            item.userId === payload.userId ? payload : item,
          );
          draft.disableChatUser = mapUser;
        }
        break;
      case constants.DISABLE_ALL_CHAT:
        draft.disableAllChat = !draft.disableAllChat;
        break;
      default:
        break;
    }
  });

export default chatReducer;
