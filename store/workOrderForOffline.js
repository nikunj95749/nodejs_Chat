import produce from 'immer';

const SET_PENDING_WORK_ORDER_LIST_FOR_OFFLINE =
  'SET_PENDING_WORK_ORDER_LIST_FOR_OFFLINE';

const SET_REFRESHED_OFFLINE_DATA = 'SET_REFRESHED_OFFLINE_DATA';
const SET_INTERNET_AVAILABLE = 'SET_INTERNET_AVAILABLE';

const SET_COUNT_OFFLINE_DATA = 'SET_COUNT_OFFLINE_DATA';
const SET_IS_TAP_SYNCH_BUTTON = 'SET_IS_TAP_SYNCH_BUTTON';
const SET_CLEAR_OFFLINE_WO = 'SET_CLEAR_OFFLINE_WO';

const SET_TOTAL_COUNT_OFFLINE_DATA = 'SET_TOTAL_COUNT_OFFLINE_DATA';

const initialState = {
  pendingworkOrderListForOffline: [],
  isRefreshed: false,
  isTapSynchButton:false,
  internetAvailable: false,
  countOfflineData: 0,
  totalCountOfflineData: 0,
};

// reducer
export default (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case SET_PENDING_WORK_ORDER_LIST_FOR_OFFLINE:
        draft.pendingworkOrderListForOffline = action.payload;
        break;

      case SET_REFRESHED_OFFLINE_DATA:
        draft.isRefreshed = !draft.isRefreshed;
        break;
      case SET_INTERNET_AVAILABLE:
        draft.internetAvailable = action.payload;
        break;
      case SET_COUNT_OFFLINE_DATA:
        draft.countOfflineData = action.payload;
        break;
      case SET_TOTAL_COUNT_OFFLINE_DATA:
        draft.totalCountOfflineData = action.payload;
        break;

      case SET_IS_TAP_SYNCH_BUTTON:
        draft.isTapSynchButton = action.payload;
        break;
        
      case SET_CLEAR_OFFLINE_WO:
        draft.pendingworkOrderListForOffline = [];
        draft.isRefreshed = false;
        draft.isTapSynchButton = false;
        draft.internetAvailable = false;
        draft.countOfflineData = 0;
        draft.totalCountOfflineData = 0;
        break;
    }
  });

export const setPendingWorkOrderListForOffline = (value = []) => ({
  type: SET_PENDING_WORK_ORDER_LIST_FOR_OFFLINE,
  payload: value,
});

export const setInternetAvailability = (value = false) => ({
  type: SET_INTERNET_AVAILABLE,
  payload: value,
});

export const setIsTapSynchButton = (value = false) => ({
  type: SET_IS_TAP_SYNCH_BUTTON,
  payload: value,
});

export const setCountOfflineData = (value = 0) => ({
  type: SET_COUNT_OFFLINE_DATA,
  payload: value,
});

export const setTotalCountOfflineData = (value = 0) => ({
  type: SET_TOTAL_COUNT_OFFLINE_DATA,
  payload: value,
});

export const setRefreshedOfflineData = () => ({
  type: SET_REFRESHED_OFFLINE_DATA,
});

export const setOfflineWo = () => ({
  type: SET_CLEAR_OFFLINE_WO,
});
