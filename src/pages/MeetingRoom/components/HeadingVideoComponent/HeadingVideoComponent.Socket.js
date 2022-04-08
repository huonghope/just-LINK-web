
import getSocket from '../../../rootSocket';

const headingVideoComponentSocket = {
  sendToPeer: (messageType, payload, socketID) => {
    getSocket().emit(messageType, {
      socketID,
      payload,
    });
  },
  emitSomething: (payload) => { // template
    getSocket().emit('something', payload);
  },
};

export default headingVideoComponentSocket;
