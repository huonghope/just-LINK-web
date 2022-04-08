import {createSelector} from 'reselect';

const selectRaw = (state) => state.userListComponent;

const fixUser = createSelector(
    [selectRaw],
    (userListComponent) => userListComponent.fixUser,
);
const selectors = {
  fixUser,
};

export default selectors;

