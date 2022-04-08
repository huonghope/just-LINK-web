import api from '../../apis/axios';

const services = {
  getCurrent: async (params) => {
    const response = await api.get(`/user/current`, {params});
    return response;
  },
};

export default services;
