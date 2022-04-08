import axios from '../../apis/axios';

export const getUserRole = async (params) => {
  const response = await axios.get('/user/profile', {params});
  return response;
};
export const getRoomInfo = async (params) => {
  const response = await axios.get('/room', {params});
  return response;
};
export const getUserInfoBySocketId = async (params) => {
  const response = await axios.get('/room/user-socket-id', {params});
  return response;
};

export const getAllUserByUserRoom = async (params) => {
  const response = await axios.get('/room/all-user', {params});
  return response;
};

export const setRoomRecord = async (params) => {
  const response = await axios.post('/room/room-record', params);
  return response;
};
export const setTimeRoomWithValue = async (params) => {
  const response = await axios.post('/room/time-room', params);
  return response;
};

export const setTimeRoomWithTime = async (params) => {
  const response = await axios.post('/room/calculat-time', params);
  return response;
};

export const setSaveRecordData = async (params) => {
  const response = await axios.post('/room/save-record', params);
  return response;
};

export const checkTimeforRoom = async (params) => {
  const response = await axios.post('/room/check-time', params);
  return response;
};


