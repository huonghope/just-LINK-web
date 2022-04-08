
import {getSocket} from '../../../rootSocket';

const tabComponent = {
  sendToPeer: (messageType, payload, socketID) => {
    getSocket().emit(messageType, {
      socketID,
      payload,
    });
  },
  emitUserRequestQuestion: (payload) => {
    getSocket().emit('user-request-question', payload);
  },
  emitUserCancelRequestQuestion: (payload) => {
    getSocket().emit('user-cancel-request-question', payload);
  },
  emitUserChangeDeviceStatus: (payload) => {
    getSocket().emit('user-change-device-status', payload);
  },
  emitUserRequestLecOut: (payload) => {
    getSocket().emit('user-request-lecOut', payload);
  },
  emitUserCancelRequestLecOut: (payload) => {
    getSocket().emit('user-cancel-request-lecOut', payload);
  },
  emitHandleStateMicAllStudent: (payload) => {
    getSocket().emit('host-send-mute-mic-all', payload);
  },
};

export default tabComponent;
