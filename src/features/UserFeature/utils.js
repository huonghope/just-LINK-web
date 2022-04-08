const userUtils = {
  getAsAuth: () => {
    let asAuth = window.localStorage.getItem('asauth');
    if (asAuth === undefined || asAuth === null) {
      return null;
    }
    return JSON.parse(asAuth);
  },
  getToken: () => {
    let asAuth = window.localStorage.getItem('asauth');
    if (asAuth === undefined || asAuth === null) {
      return null;
    }
    const {token} = JSON.parse(asAuth);
    return token;
  },
  /**
   *
   * userId: 1
   * userName: "김선생"
   * userTp: "T"
   */
  getUserInfo: () => {
    let asAuth = window.localStorage.getItem('asauth');
    if (asAuth === undefined || asAuth === null) {
      return null;
    }
    const {userInfoToken} = JSON.parse(asAuth);
    return userInfoToken;
  },
  getUserRoomId: () => {
    let userRoomId = window.localStorage.getItem('usr_id');
    if (userRoomId === undefined || userRoomId === null) {
      return null;
    }
    return JSON.parse(userRoomId);
  },
};

export default userUtils;
