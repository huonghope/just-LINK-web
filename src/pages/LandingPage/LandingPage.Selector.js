import {createSelector} from 'reselect';

const selectRaw = (state) => state.landingPage;

const selectCurrentVideo = createSelector(
    [selectRaw],
    (landingPage) => landingPage.currentVideoId,
);

const selectListVideoInput = createSelector(
    [selectRaw],
    (landingPage) => landingPage.listVideoInput,
);

const selectCurrentAudio = createSelector(
    [selectRaw],
    (landingPage) => landingPage.currentAudioId,
);

const selectListAudioInput = createSelector(
    [selectRaw],
    (landingPage) => landingPage.listAudioInput,
);
const selectors = {
  selectCurrentVideo,
  selectListVideoInput,
  selectCurrentAudio,
  selectListAudioInput,
};

export default selectors;
