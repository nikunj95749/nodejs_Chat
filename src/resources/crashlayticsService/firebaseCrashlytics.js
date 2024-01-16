import crashlytics from '@react-native-firebase/crashlytics';

export const sendRecordError = error => {
  crashlytics().recordError(error);
};
