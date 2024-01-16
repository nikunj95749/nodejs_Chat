import {callApiPost} from './baseApi';
import API from '../../constants/baseApi';

// export const signUp = (data = {}) => callApiPost({ url: API.SIGN_UP, data });
export const getWorkOrdersAPI = (data = {}) =>
  callApiPost({url: API.GET_WORK_ORDERS, data});

export const createNUpdateTimeSheetAPI = (data = {}) =>
  callApiPost({url: API.CREATE_UPDATE_TIMESHEET, data});

export const getTimeSheetListAPI = (data = {}) =>
  callApiPost({url: API.GET_TIME_SHEET_LIST, data});

export const deleteTimeSheetAPI = (data = {}) =>
  callApiPost({url: API.DELETE_TIME_SHEET, data});
