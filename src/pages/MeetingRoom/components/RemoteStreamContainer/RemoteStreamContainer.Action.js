import constants from './RemoteStreamContainer.Constants';
import Errors from '../../../../components/Error/error';

// unuse
const actions = {
  saveListUser: (data) => (dispatch) => {
    try {
      dispatch({
        type: constants.SET_LIST_USER,
        payload: {listUser: data},
      });
    } catch (error) {
      Errors.handle(error);
    }
  },
};
export default actions;
