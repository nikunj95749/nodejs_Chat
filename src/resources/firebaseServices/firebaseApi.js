import { callFBApi } from '../base/apiDriver';

export const callFbGet = (url, params = {}) =>
  callFBApi(url, {
    method: 'GET',
    params,
  });

export const callFbPost = (url, data) =>
  callFBApi(url, {
    method: 'POST',
    data: data,
  });

export const callFbPut = (url, data = {}) =>
  callFBApi(url, {
    method: 'PUT',
    data: data,
  });

export const callFbDelete = url => callFBApi(url, { method: 'DELETE' });
