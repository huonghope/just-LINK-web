import io from 'socket.io-client';
import {isAuthenticated} from '../routes/permissionChecker';
const endpoint = process.env.REACT_APP_SERVER_SOCKET;

const onConnected = () => {
  console.log('socket: connected - Welcome to page');
};

const onDisconnect = () => {
  console.log('socket: disconnect');
};

// 일반 연결 socket
let socket = null;
export const configSocket = () => {
  try {
    socket = io.connect(endpoint, {
      path: `/io/webrtc`,
      query: {
        token: isAuthenticated(),
        userRoomId: localStorage.getItem('usr_id') ? localStorage.getItem('usr_id') : null,
      },
    });
    socket.on('connect', onConnected);
    socket.on('disconnect', onDisconnect);
  } catch (error) {
    console.log(error);
  }
  return socket;
};

export const socketDisconnect = () => {
  socket.disconnect();
};

export const getSocket = () => {
  return socket;
};

// 화면공유 했 을떄 Socket를 추가함
let socketShare = null;
export const configSocketShare = async () => {
  console.log('create socket');
  socketShare = io.connect(endpoint, {
    path: `/io/webrtc`,
    query: {
      token: isAuthenticated(),
      userRoomId: localStorage.getItem('usr_id') ? localStorage.getItem('usr_id') : null,
    },
  });

  socketShare.on('connect', onConnected);
  socketShare.on('disconnect', onDisconnect);

  return socketShare;
};
export const socketDisconnectShare = () => {
  socketShare.disconnect();
};

export function getSocketShare() {
  return socketShare;
}
