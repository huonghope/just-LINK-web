import {createSelector} from 'reselect';

const selectRaw = (state) => state.chat;

const selectDirectMessageToUser = createSelector(
    [selectRaw],
    (chat) => chat.directMessageToUser,
);

const selectNumberOfNewMessages = createSelector(
    [selectRaw],
    (chat) => chat.numberOfNewMessages,
);

const selectCurrentChattingState = createSelector(
    [selectRaw],
    (chat) => chat.chattingState,
);

const selectDisableChatUser = createSelector(
    [selectRaw],
    (chat) => chat.disableChatUser,
);

const selectDisableAllChat = createSelector(
    [selectRaw],
    (chat) => chat.disableAllChat,
);
const selectors = {
  selectNumberOfNewMessages,
  selectDirectMessageToUser,
  selectCurrentChattingState,
  selectDisableChatUser,
  selectDisableAllChat,
};

export default selectors;
