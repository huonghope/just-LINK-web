import produce from 'immer';
import constants from './LandingPage.Constants';

/**
 *currentVideoId: {}
 */
const initialState = {
  currentAudio: {},
  listAudioInput: [],
  currentVideo: {},
  listVideoInput: [],
};

export const landingPageReducer =(state = initialState, {type, payload}) =>
  produce(state, (draft) => {
    switch (type) {
      case constants.SET_CURRENT_AUDIO:
        draft.currentAudio = payload.audio;
        break;
      case constants.SET_LIST_AUDIO:
        draft.listAudioInput = payload.listAudioInput;
        break;
      case constants.SET_CURRENT_VIDEO:
        draft.currentVideo = payload.video;
        break;
      case constants.SET_LIST_VIDEO:
        draft.listVideoInput = payload.listVideoInput;
        break;
      case constants.SET_LIST_DEVICES:
        draft.currentAudio = payload.selectedAudioInput;
        draft.listAudioInput = payload.listDetectAudioInput;
        draft.currentVideo = payload.selectedVideoInput;
        draft.listVideoInput = payload.listDetectVideoInput;
        break;
      default:
        return state;
    }
  });
export default landingPageReducer;

