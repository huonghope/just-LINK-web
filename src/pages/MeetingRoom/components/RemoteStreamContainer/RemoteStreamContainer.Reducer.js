import produce from 'immer';
import constants from './RemoteStreamContainer.Constants';

const initialState = {
  listUser: [],
};

export const remoteReducer =(state = initialState, {type, payload}) =>
  produce(state, (draft) => {
    switch (type) {
      case constants.SET_LIST_USER: // List user by userroom 테이블
        draft.listUser = payload.listUser;
        break;
      default:
        return state;
    }
  });
export default remoteReducer;

