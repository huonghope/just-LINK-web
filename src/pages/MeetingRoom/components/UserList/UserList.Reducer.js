import produce from 'immer';
import constants from './UserList.Constants';

const initialState = {
  fixUser: null,
};
export const userListComponentRedux =(state = initialState, {type, payload}) =>
  produce(state, (draft) => {
    switch (type) {
      // 해당 유저를 고정하기
      case constants.SET_FIX_USER:
        draft.fixUser = payload.data;
        break;
      case constants.SET_FIX_USER_ERROR:
        draft.fixUser = undefined;
        break;
      default:
        return state;
    }
  });
export default userListComponentRedux;

