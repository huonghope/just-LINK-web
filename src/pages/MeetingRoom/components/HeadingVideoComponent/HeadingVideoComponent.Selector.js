import {createSelector} from 'reselect';
const selectRaw = (state) => state.headingVideoComponent;
const getModeType = createSelector(
    [selectRaw],
    (headingVideoComponent) => headingVideoComponent.mode,
);

const selectors = {
  getModeType,
};

export default selectors;

