import {createSelector} from 'reselect';

const selectRaw = (state) => state.remoteStream;
const getListUser = createSelector(
    [selectRaw],
    (remoteStream) => remoteStream.listUser,
);

const selectors = {
  getListUser,
};

export default selectors;

