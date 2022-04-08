import axios from '../../apis/axios';

const landingPageService = {
  setUpRoomForHost: async (params) => {
    const response = await axios.post('/room/setup-basic-host', params);
    return response;
  },
  updatePassword: async (params) => {
    const response = await axios.post('/room/update-password', params);
    return response;
  },
  updateNickName: async (params) => {
    const response = await axios.post('/room/update-nickname', params);
    return response;
  },
  fetJoinRoom: async (params) => {
    const response = await axios.post('/room', params);
    return response;
  },
};

export default landingPageService;
