import {getSocket} from '../../../rootSocket';

const ChatComponentSocket = {
  emitSentMessage: (payload) => {
    getSocket().emit('sent-message', payload);
  },
  emitSendDirectMessage: (payload) => {
    getSocket().emit('send-direct-message', payload);
  },
  emitDisableUserChat: (payload) => {
    getSocket().emit('host-req-user-disable-chat', payload);
  },
  emitEnableUserChat: (payload) => {
    getSocket().emit('host-req-user-enable-chat', payload);
  },
  emitUpdateUserStatus: (payload) => {
    getSocket().emit('user-change-device-status', payload);
  },
  emitRequestDevice: (payload) => {
    getSocket().emit('request-device', payload);
  },
  emitUpdateMuteAllMic: (payload) => {
    getSocket().emit('update-mute-all-mic', payload);
  },
  emitHandleUserAuth: (payload) => {
    getSocket().emit('update-user-auth', payload);
  },
  emitHandleUserKick: (payload) => {
    getSocket().emit('user-kick', payload);
  },
};
export default ChatComponentSocket;
