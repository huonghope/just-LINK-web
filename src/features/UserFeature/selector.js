import {createSelector} from 'reselect';

const selectRaw = (state) => state.user;


const selectDataLoading = createSelector([selectRaw], (user) => user.dataLoading);

const selectErrorMessage = createSelector([selectRaw], (user) => user.error);

const selectCurrentUser = createSelector([selectRaw], (user) => user.current);

const selectors = {
  selectDataLoading,
  selectErrorMessage,
  selectCurrentUser,
};

export default selectors;
