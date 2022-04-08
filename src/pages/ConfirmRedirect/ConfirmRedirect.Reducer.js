import produce from 'immer';
import constants from './ConfirmRedirect.Constants';

const initialState = {
  userInfo: {},
};

export const landingPageReducer =(state = initialState, {type, payload}) =>
  produce(state, (draft) => {
    switch (type) {
      case constants.SET_USER_INFO:
        draft.userInfo = payload.data;
        break;
      case constants.SET_USER_INFO_ERROR:
        draft.userInfo = null;
        break;
      default:
        return state;
    }
  });
export default landingPageReducer;

