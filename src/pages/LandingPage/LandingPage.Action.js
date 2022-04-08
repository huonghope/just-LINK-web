import constants from './LandingPage.Constants';
import Error from '../../components/Error/error';

const actions = {
  setCurrentVideoId: (selectedVideo) => async (dispatch) => {
    try {
      dispatch({
        type: constants.SET_CURRENT_VIDEO,
        payload: selectedVideo,
      });
    } catch (error) {
      Error.handle(error);
    }
  },
  setListVideoInput: (listVideoInput) => async (dispatch) => {
    try {
      dispatch({
        type: constants.SET_LIST_VIDEO,
        payload: listVideoInput,
      });
    } catch (error) {
      Error.handle(error);
    }
  },
  setCurrentAudioId: (selectedAudio) => async (dispatch) => {
    try {
      dispatch({
        type: constants.SET_CURRENT_AUDIO,
        payload: selectedAudio,
      });
    } catch (error) {
      Error.handle(error);
    }
  },
  setListAudioInput: (listAudioInput) => async (dispatch) => {
    try {
      dispatch({
        type: constants.SET_LIST_AUDIO,
        payload: {listAudioInput: listAudioInput},
      });
    } catch (error) {
      Error.handle(error);
    }
  },
  setDevices: (listDetectAudioInput, selectedAudioInput, listDetectVideoInput, selectedVideoInput) => async (dispatch) => {
    try {
      dispatch({
        type: constants.SET_LIST_DEVICES,
        payload: {listDetectAudioInput, selectedAudioInput, listDetectVideoInput, selectedVideoInput},
      });
    } catch (error) {
      Error.handle(error);
    }
  },
};
export default actions;
