import {getSocket, getSocketShare} from '../rootSocket';

const meetingRoomSocket = {
  sendToPeer: (messageType, payload, socketID) => {
    getSocket().emit(messageType, {
      socketID,
      payload,
    });
  },

  sendToPeerForSocketShare: (messageType, payload, socketID) => {
    getSocketShare().emit(messageType, {
      socketID,
      payload,
    });
  },

};

export default meetingRoomSocket;
