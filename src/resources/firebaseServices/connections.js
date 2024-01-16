/* eslint-disable require-await */
import FB_API from '../../constants/firebaseApi';
import { callFbPost } from './firebaseApi';

export const initNewThread = async ({
  current_user_id = '',
  requested_user_id = '',
  thread_id,
}) =>
  callFbPost(FB_API.INIT_NEW_THREAD, {
    current_user_id,
    requested_user_id,
    thread_id,
  });
