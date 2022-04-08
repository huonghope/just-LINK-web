import constants from './HeadingVideoComponent.Constants';
import Errors from '../../../../components/Error/error';
const actions = {
  // SET MODE
  handleChangeSetMode: (data) => async (dispatch) => {
    try {
      console.log(data);
      dispatch({
        type: constants.CHANGE_SET_MODE,
        payload: data,
      });
    } catch (error) {
      dispatch({
        type: constants.CHANGE_SET_MODE_EROR,
      });
      Errors.handle(error);
    }
  },
};
export default actions;
