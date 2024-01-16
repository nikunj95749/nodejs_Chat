import {callApiGet, callApiPost} from './baseApi';
import API from '../../constants/baseApi';

// export const signUp = (data = {}) => callApiPost({ url: API.SIGN_UP, data });
export const signIn = (data = {}) => callApiPost({url: API.SIGN_IN, data});

export const addVersionInfo = (userId = '', data = {}) =>
  callApiPost({url: `${API.APP_VERSION_INFO}${userId}`, data});

export const forgotPassword = (data = {}) =>
  callApiPost({url: API.FORGOT_PASSWORD, data});

export const getCurrentAppVersion = () =>
  callApiGet({url: API.GET_APP_VERSION});
