import axios from '../../../../apis/axios';

export const userCamStatus = async (params) => {
  const response = await axios.post('/room/cam-status', params );
  return response;
};

export const userMicStatus = async (params) => {
  const response = await axios.post('/room/mic-status', params );
  return response;
};

