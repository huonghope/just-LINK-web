import constants from './UserList.Constants';
import Errors from '../../../../components/Error/error';

const actions = {
  // 본인 카메라 상태를 변경 이벤트
  handleFixUser: (data) => async (dispatch) => {
    try {
      dispatch({
        type: constants.SET_FIX_USER,
        payload: data,
      });
    } catch (error) {
      Errors.handle(error);
      dispatch({
        type: constants.SET_FIX_USER_ERROR,
      });
    }
  },
};
export default actions;
