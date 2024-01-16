import AsyncStorage from '@react-native-community/async-storage';

import {
  BAD_WORDS_STORAGE,
  BAD_WORDS_STORAGE_VERSION,
} from '../../constants/asyncStorageKeys';
import { callApiGet } from '../baseServices/baseApi';
import API from '../../constants/baseApi';

export const setStorageBadWords = async data => {
  try {
    await AsyncStorage.setItem(BAD_WORDS_STORAGE, JSON.stringify(data));
  } catch (err) {
    console.warn(err);
  }
};

export const setStorageBadWordsVersion = async version => {
  try {
    await AsyncStorage.setItem(BAD_WORDS_STORAGE_VERSION, version);
  } catch (err) {
    console.warn(err);
  }
};

export const getBadWords = () => AsyncStorage.getItem(BAD_WORDS_STORAGE);

export const getBadWordsVersion = () =>
  AsyncStorage.getItem(BAD_WORDS_STORAGE_VERSION);

export const fetchBadWords = async () => {
  try {
    const response = await callApiGet({ url: API.GET_BAD_WORDS });
    if (response.data) {
      const listBadWords = response.data.data.map(item => item.word);

      return listBadWords;
    }
  } catch (err) {
    console.warn(err);

    return null;
  }
};
