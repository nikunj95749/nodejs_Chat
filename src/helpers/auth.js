import AsyncStorage from '@react-native-community/async-storage';
import { logError } from './logging';

const TOKEN_KEY = '@auth_token';
const USER_DETAILS = '@user_details';
const REMEMBER_USER_CREDENTIALS = '@remember_user_credentials';
const USER_CREDENTIALS = '@user_credentials';

export const setAuthToken = async (value = '') => {
  try {
    await AsyncStorage.setItem(TOKEN_KEY, value);
  } catch (err) {
    logError(err, '[setAuthToken] AsyncStorage Error');
  }
};

export const getAuthToken = async () => {
  try {
    return await AsyncStorage.getItem(TOKEN_KEY);
  } catch (err) {
    logError(err, '[getAuthToken] AsyncStorage Error');

    return null;
  }
};

export const setUserDetails = async (value = '') => {
  try {
    await AsyncStorage.setItem(USER_DETAILS, value);
  } catch (err) {
    logError(err, '[setAuthToken] AsyncStorage Error');
  }
};

export const getUserDetails = async () => {
  try {
    return await AsyncStorage.getItem(USER_DETAILS);
  } catch (err) {
    logError(err, '[getAuthToken] AsyncStorage Error');

    return null;
  }
};

export const setRememberUserCredentials = async (value = '') => {
  try {
    await AsyncStorage.setItem(REMEMBER_USER_CREDENTIALS, value);
  } catch (err) {
    logError(err, '[setAuthToken] AsyncStorage Error');
  }
};

export const getRememberUserCredentials = async () => {
  try {
    return await AsyncStorage.getItem(REMEMBER_USER_CREDENTIALS);
  } catch (err) {
    logError(err, '[getAuthToken] AsyncStorage Error');

    return null;
  }
};

export const setUserCredentials = async (value = '') => {
  try {
    await AsyncStorage.setItem(USER_CREDENTIALS, value);
  } catch (err) {
    logError(err, '[setUserCredentials] AsyncStorage Error');
  }
};

export const getUserCredentials = async () => {
  try {
    return await AsyncStorage.getItem(USER_CREDENTIALS);
  } catch (err) {
    logError(err, '[getUserCredentials] AsyncStorage Error');

    return null;
  }
};


export const removeAuthToken = async () => {
  try {
    await AsyncStorage.removeItem(TOKEN_KEY);
  } catch (err) {
    logError(err, '[removeAuthToken] AsyncStorage Error');
  }
};

// eslint-disable-next-line require-await
export const clearAsyncStorage = async () => {
  try {
    AsyncStorage.clear();
  } catch (err) {
    logError(err, '[clearStorage] AsyncStorage Error');
  }
};

export const authHeader = async () => {
  const token = await getAuthToken();

  return token ? { Authorization: `Bearer ${token}` } : {};
};
