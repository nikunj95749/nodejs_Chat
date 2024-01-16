import auth from '@react-native-firebase/auth';

export const fbLogIn = (customToken = '') =>
  auth().signInWithCustomToken(customToken);

export const fbLogOut = () => auth().signOut();
