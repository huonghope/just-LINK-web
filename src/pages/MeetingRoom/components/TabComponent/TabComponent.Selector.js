import {createSelector} from 'reselect';

const selectRaw = (state) => state.tabComponent;

const getShareScreenState = createSelector(
    [selectRaw],
    (tabComponent) => tabComponent.shareScreenState,
);
const getMicAllUserState = createSelector(
    [selectRaw],
    (tabComponent) => tabComponent.muteAllUserState,
);

const getShowListUserState = createSelector(
    [selectRaw],
    (tabComponent) => tabComponent.showListUserState,
);

const getShowChatState = createSelector(
    [selectRaw],
    (tabComponent) => tabComponent.showChatState,
);

const getMicState = createSelector(
    [selectRaw],
    (tabComponent) => tabComponent.micState,
);

const getCamState = createSelector(
    [selectRaw],
    (tabComponent) => tabComponent.camState,
);

const getRecordState = createSelector(
    [selectRaw],
    (tabComponent) => tabComponent.recordState,
);
const getWhiteBoardState = createSelector(
    [selectRaw],
    (tabComponent) => tabComponent.showWhiteBoard,
);


const selectors = {
  getShareScreenState,
  getMicAllUserState,
  getShowListUserState,
  getShowChatState,
  getMicState,
  getCamState,
  getRecordState,
  getWhiteBoardState,
};

export default selectors;

