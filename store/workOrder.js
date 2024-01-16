import produce from 'immer';

const SET_WORK_ORDER_LIST = 'SET_WORK_ORDER_LIST';
const UPDATE_WORK_ORDER_LIST = 'UPDATE_WORK_ORDER_LIST';

const SET_ALL_FORM_IDS = 'SET_ALL_FORM_IDS';
const SET_LOADING_WORK_ORDER = 'SET_LOADING_WORK_ORDER';

const SET_WO = 'SET_WO';

const initialState = {
  workOrderList: [],
  isLoadingWorkOrder: false,
  pendingworkOrderList: [],
  completedworkOrderList: [],
  arrAllFormIds: [],
};

// reducer
export default (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case SET_WORK_ORDER_LIST:
        // New
        // InProgress
        // Completed
        // ReSubmitted
        // Cancelled
        // Reviewed
        let completedWO = [...action.payload]?.filter((item) => {
          return (
            item?.SubStatus === 'Completed' || item?.SubStatus === 'Reviewed'
          );
        });
        let pendingWO = [...action.payload]?.filter(
          (item) =>
            item?.SubStatus === 'New' ||
            item?.SubStatus === 'InProgress' ||
            item?.SubStatus === 'ReSubmitted'
            //  ||
            // item?.SubStatus === 'Cancelled',
        );

        draft.pendingworkOrderList = pendingWO;
        draft.completedworkOrderList = completedWO;
        draft.workOrderList = action.payload;
        break;
      case UPDATE_WORK_ORDER_LIST:
        let updatedWoList = [...draft.workOrderList]?.map((obj) => {
          if (obj?.Id === action.payload?.Id) {
            return action.payload;
          }
          return obj;
        });

        let completedWOList = [...updatedWoList]?.filter(
          (item) =>
            item?.SubStatus === 'Completed' || item?.SubStatus === 'Reviewed',
        );

        let pendingWOList = [...updatedWoList]?.filter(
          (item) =>
            item?.SubStatus === 'New' ||
            item?.SubStatus === 'InProgress' ||
            item?.SubStatus === 'ReSubmitted'
            //  ||
            // item?.SubStatus === 'Cancelled',
        );
        draft.pendingworkOrderList = pendingWOList;
        draft.completedworkOrderList = completedWOList;
        draft.workOrderList = updatedWoList;
        break;

      case SET_ALL_FORM_IDS:
        draft.arrAllFormIds = action.payload;
        break;
      case SET_LOADING_WORK_ORDER:
        draft.isLoadingWorkOrder = action.payload;
        break;

        case SET_WO:
        return initialState;
        break;
    }
  });

export const setWorkOrderList = (value = []) => ({
  type: SET_WORK_ORDER_LIST,
  payload: value,
});

export const updateWorkOrderList = (value = {}) => ({
  type: UPDATE_WORK_ORDER_LIST,
  payload: value,
});

export const setLoadingWorkOrder = (value = false) => ({
  type: SET_LOADING_WORK_ORDER,
  payload: value,
});

export const setAllFormIds = (value = []) => ({
  type: SET_ALL_FORM_IDS,
  payload: value,
});

export const setWoEmpty = () => ({
  type: SET_WO,
});
