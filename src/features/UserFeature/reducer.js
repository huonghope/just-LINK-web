import * as constants from './constants';
import produce from 'immer';
const initialState = {
  dataLoading: false,
  error: null,
  current: null,
};

const userReducer = (state = initialState, {type, payload}) =>
  produce(state, (draft) => {
    switch (type) {
      case constants.USER_GET_CURRENT_START:
        draft.dataLoading = payload;
        break;
      case constants.SET_CURRENT_USER:
        draft.current = payload;
        break;
      case constants.SET_CURRENT_USER_ERROR:
        draft.error = payload;
        break;
      default:
        break;
    }
  });

export default userReducer;
