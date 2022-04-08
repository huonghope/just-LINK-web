import {createSelector} from 'reselect';

const selectRaw = (state) => state.room;

const getMyInfo = createSelector(
    [selectRaw],
    (room) => room.myInfo,
);
const getLocalStream = createSelector(
    [selectRaw],
    (room) => room.localStream,
);
const selectUserType = createSelector(
    [selectRaw],
    (room) => room.userType,
);
const selectRoomInfo = createSelector(
    [selectRaw],
    (room) => room.roomInfo,
);
const selectListUserBadNetwork = createSelector(
    [selectRaw],
    (room) => room.listUserBadNetwork,
);

const selectMuteAllMic = createSelector(
    [selectRaw],
    (room) => room.muteAllMic,
);

const selectFixVideo = createSelector(
    [selectRaw],
    (room) => room.fixVideo,
);

const selectPeerConnections = createSelector(
    [selectRaw],
    (room) => room.peerConnections,
);

const selectRemoteStreams = createSelector(
    [selectRaw],
    (room) => room.remoteStreams,
);

const selectRoomRecordInfo = createSelector(
    [selectRaw],
    (room) => room.roomRecordInfo,
);
const selectors = {
  getMyInfo,
  getLocalStream,
  selectUserType,
  selectRoomInfo,
  selectMuteAllMic,
  selectFixVideo,
  selectListUserBadNetwork,
  selectPeerConnections,
  selectRemoteStreams,
  selectRoomRecordInfo,
};

export default selectors;
