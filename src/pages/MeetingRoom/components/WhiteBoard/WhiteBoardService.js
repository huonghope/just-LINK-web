import axios from '../../../../apis/axios';

const whiteBoardService = {
  upFile: async (params) => {
    const response = await axios.post('/whiteboard/upfile', params);
    return response;
  },
};
export default whiteBoardService;
