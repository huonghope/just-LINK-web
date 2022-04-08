import axios from '../../../../apis/axios';

const chatService = {
  getListUser: async () => {
    const response = await axios.get('/getuser');
    return response;
  },
  upFile: async (params) => {
    const response = await axios.post('/room/upfile', params);
    return response;
  },
  getListMessageByUserId: async (params) => {
    const response = await axios.get('/chat', {params});
    return response;
  },
  getRoomInfo: async (params) => {
    const response = await axios.get(`/room/getinfo`, {params});
    return response;
  },
  getUserDeivceInfo: async (params) => {
    const response = await axios.get(`/room/getuserdeviceinfo`, {params});
    return response;
  },
  getMuteAllMicForRoom: async (params) => {
    const response = await axios.get(`/room/getmuteallmicforroom`, {params});
    return response;
  },
  getTurnOffAllCamForRoom: async (params) => {
    const response = await axios.get(`/room/get-turn-off-all-cam-for-room`, {params});
    return response;
  },
  setMuteAllMicForRoom: async (params) => {
    const response = await axios.post(`/room/setmuteallmicforroom`, params);
    return response;
  },
  setTurnOffAllCamForRoom: async (params) => {
    const response = await axios.post(`/room/set-turn-off-all-cam-for-room`, params);
    return response;
  },
  updateUserAuth: async (params) => {
    const response = await axios.post(`/room/update-user-auth`, params);
    return response;
  },
};

export default chatService;
