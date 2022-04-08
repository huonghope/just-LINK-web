import produce from 'immer';
import constants from './HeadingVideoComponent.Constants';

// default true
const initialState = {
  mode: '2x2', // 모델 모드 값
};

export const headingVideoComponentReducer =(state = initialState, {type, payload}) =>
  produce(state, (draft) => {
    switch (type) {
      case constants.CHANGE_SET_MODE:
        draft.mode = payload;
        break;
      case constants.CHANGE_SET_MODE_ERROR:
        draft.mode = null;
        break;
      default:
        return state;
    }
  });
export default headingVideoComponentReducer;

