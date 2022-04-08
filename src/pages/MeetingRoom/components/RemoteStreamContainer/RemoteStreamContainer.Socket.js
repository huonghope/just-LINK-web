import {getSocket} from '../../../rootSocket';

const remoteStreamContainerSocket = {
  sendToPeer: (messageType, payload, socketID) => {
    getSocket().emit(messageType, {
      socketID,
      payload,
    });
  },
};

export default remoteStreamContainerSocket;
