import produce from 'immer';

const SET_DASHBOARD_DATA = 'SET_DASHBOARD_DATA';
const SET_FOLDER_DATA = 'SET_FOLDER_DATA';

const SET_DASHBOARD_EMPTY = 'SET_DASHBOARD_EMPTY';
const SET_LATE_N_LOCK = 'SET_LATE_N_LOCK';

const initialState = {
  dashBoardData: {
    PendingWO: 0,
    CompletedWO: 0,
    CancelledWO: 0,
    MyReports: 0,
    lateAndLockWO: 0,
  },
  arrFolders: [],
};

// reducer
export default (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case SET_DASHBOARD_DATA:
        draft.dashBoardData ={...draft.dashBoardData, ...action.payload} ;
        break;
      case SET_LATE_N_LOCK:
        draft.dashBoardData = {...draft.dashBoardData, lateAndLockWO:  action.payload};
        break;
      case SET_FOLDER_DATA:
        draft.arrFolders = action.payload;
        break;
      case SET_DASHBOARD_EMPTY:
        return initialState;
        break;
    }
  });

export const setDashBoardDetails = (value = {}) => ({
  type: SET_DASHBOARD_DATA,
  payload: value,
});

export const setLateAndLockWO = (value = 0) => ({
  type: SET_LATE_N_LOCK,
  payload: value,
});

export const setFolderDetails = (value = []) => ({
  type: SET_FOLDER_DATA,
  payload: value,
});

export const setDashboardEmpty = () => ({
  type: SET_DASHBOARD_EMPTY,
});
