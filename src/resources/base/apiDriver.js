import axios from 'axios';
import {authHeader, fbAuthHeader} from '../../helpers/auth';
import {configureAxiosParams} from '../../helpers/configureAxios';
import {showMessage} from 'react-native-flash-message';
// Format axios nested params correctly
configureAxiosParams(axios);

export const callApi = async (url, options = {}, customHeaders = {}) => {
  try {
    const headers = await authHeader();
    return await axios.request({
      url,
      headers: {
        ...headers,
        ...customHeaders,
      },
      ...options,
    });
  } catch (error) {
    if (error?.response?.status == 500) {
      showMessage({
        message: 'Failed!',
        description: `Internal server error ${error?.response?.status}`,
        type: 'danger',
      });
    }
    
    throw Error(error)
  }
};

export const callFBApi = async (url, options = {}, customHeaders = {}) => {
  const headers = await fbAuthHeader();

  return axios.request({
    url,
    headers: {
      ...headers,
      ...customHeaders,
    },
    ...options,
  });
};
