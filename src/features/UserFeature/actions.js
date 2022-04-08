import * as constants from './constants';
import Errors from '../../components/Error/error';
import services from './service';

// const messageCreateSuccess = "Create successfully";
// const messageDeleteSuccess = "Delete successfully";

const actions = {
  setCurrentUser: (data) => async (dispatch) => {
    try {
      dispatch({
        type: constants.SET_CURRENT_USER,
      });
      dispatch({
        type: constants.SET_CURRENT_USER,
        payload: data,
      });
    } catch (error) {
      Errors.handle(error);
      dispatch({
        type: constants.SET_CURRENT_USER_ERROR,
      });
    }
  },

};
export default actions;
