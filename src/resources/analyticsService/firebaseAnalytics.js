import analytics from '@react-native-firebase/analytics';
import { GA_TAGS } from '../../constants/gaTags';
import { logError } from '../../helpers/logging';

/* AUTH ANALYTIC EVENTS */
export const sendLoginEvent = async (eventParams = {}) => {
  try {
    await analytics().logEvent('login', eventParams);
  } catch (err) {
    logError(err, '[firebaseAnalytics] sendLoginEvent');
  }
};

export const sendSignUpEvent = async (eventParams = {}) => {
  try {
    await analytics().logEvent('sign_up', eventParams);
  } catch (err) {
    logError(err, '[firebaseAnalytics] sendSignUpEvent');
  }
};

/* MATCHING ANALYTICAL EVENTS */
export const sendNextConnectionEvent = async () => {
  try {
    await analytics().logEvent('button_next');
  } catch (err) {
    logError(err, '[firebaseAnalytics] sendNextConnectionEvent');
  }
};

export const sendConnectEvent = async (eventParams = {}) => {
  try {
    await analytics().logEvent('button_connect', eventParams);
  } catch (err) {
    logError(err, '[firebaseAnalytics] sendConnectEvent');
  }
};

export const sendViewConnectionEvent = async (eventParams = {}) => {
  try {
    await analytics().logEvent('view_profile', eventParams);
  } catch (err) {
    logError(err, '[firebaseAnalytics] sendConnectEvent');
  }
};

/* CHAT ANALYTICAL EVENTS */
export const sendCommunitySpacesEvent = async (eventParams = {}) => {
  try {
    await analytics().logEvent('join_group', eventParams);
  } catch (err) {
    logError(err, '[firebaseAnalytics] sendConnectEvent');
  }
};

/* DASHBOARD ANALYTICS */
export const sendSearchEvent = async (eventParams = {}) => {
  try {
    await analytics().logEvent('search', eventParams);
  } catch (err) {
    logError(err, '[firebaseAnalytics] sendConnectEvent');
  }
};

/* COMMON EVENTS */
export const sendEvent = async (eventTag = '') => {
  try {
    await analytics().logEvent(eventTag);
  } catch (err) {
    logError(err, '[firebaseAnalytics] sendEvent', eventTag);
  }
};

export const sendBuildProfileSuccessEvent = async () => {
  await sendEvent(GA_TAGS.USERNAME_SUCCESS);
  await sendEvent(GA_TAGS.BIRTHDATE_SUCCESS);
  await sendEvent(GA_TAGS.QUESTIONS_SUCCESS);
  await sendEvent(GA_TAGS.NAME_SUCCESS);
  await sendEvent(GA_TAGS.PRONOUNS_SUCCESS);
  await sendEvent(GA_TAGS.GENDER_IDENTITY_SUCCESS);
  await sendEvent(GA_TAGS.LOCATION_SUCCESS);
  await sendEvent(GA_TAGS.BIO_SUCCESS);
  await sendEvent(GA_TAGS.ANSWERS_LATER_TAP);
};
