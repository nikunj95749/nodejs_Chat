import { firestore } from '../../config/firebaseConfig';

export const confirmCurrentThread = async (threadId = '') => {
  const threadRef = firestore().collection('threads').doc(threadId);

  await threadRef.update({ confirmed: true });
};

export const updateThreadVisitedTimestamp = async (
  threadId = '',
  currentUserId,
) => {
  if (!currentUserId) {
    return;
  }

  await firestore()
    .collection('threads')
    .doc(threadId)
    .update({
      [`related_users.${currentUserId}.last_visited`]: firestore.FieldValue.serverTimestamp(),
    });
};

export const userFocusThread = async (threadId = '', currentUserId) => {
  if (!currentUserId) {
    return;
  }
  await firestore()
    .collection('threads')
    .doc(threadId)
    .update({
      [`related_users.${currentUserId}.is_active`]: true,
    });
};

export const userUnfocusedThread = async (threadId = '', currentUserId) => {
  if (!currentUserId) {
    return;
  }
  await firestore()
    .collection('threads')
    .doc(threadId)
    .update({
      [`related_users.${currentUserId}.is_active`]: false,
      [`related_users.${currentUserId}.last_visited`]: firestore.FieldValue.serverTimestamp(),
    });
};

export const updateArchiveThread = async (
  threadId = '',
  isArchived,
  currentUserId,
) => {
  if (!currentUserId) {
    return;
  }
  await firestore()
    .collection('threads')
    .doc(threadId)
    .update({
      [`related_users.${currentUserId}.is_archived`]: isArchived,
    });
};

export const postNewMessage = async (messageObj = {}, threadId = '') => {
  const { _id: messageId } = messageObj;

  const timestamp = firestore.FieldValue.serverTimestamp();

  await firestore()
    .collection('threads')
    .doc(threadId)
    .collection('messages')
    .doc(messageId)
    .set({
      ...messageObj,
      timestamp,
    });

  await firestore()
    .collection('threads')
    .doc(threadId)
    .update({
      last_message: `${
        messageObj.user.name || 'Anonymous'
      }: ${messageObj.text.slice(0, 20)}...`,
      timestamp,
    });
};

export const postNewMessageFromCommunitySpace = async (
  messageObj = {},
  threadId = '',
) => {
  const { _id: messageId } = messageObj;

  const timestamp = firestore.FieldValue.serverTimestamp();

  await firestore()
    .collection('threads')
    .doc(threadId)
    .collection('messages')
    .doc(messageId)
    .set({
      ...messageObj,
      timestamp,
    });

  var docRef = firestore().collection('threads').doc(threadId);

  await docRef.get().then(async doc => {
    if (doc.exists) {
      await firestore()
        .collection('threads')
        .doc(threadId)
        .update({
          last_message: `${
            messageObj.user.name || 'Anonymous'
          }: ${messageObj.text.slice(0, 20)}...`,
          timestamp,
        });
    } else {
      await firestore()
        .collection('threads')
        .doc(threadId)
        .set({
          confirmed: true,
          type: 'community_spaces',
          last_message: `${
            messageObj.user.name || 'Anonymous'
          }: ${messageObj.text.slice(0, 20)}...`,
          timestamp,
        });
    }
  });
};

export const deleteMessage = async (messageId = '', threadId = '') => {
  await firestore()
    .collection('threads')
    .doc(threadId)
    .collection('messages')
    .doc(messageId)
    .delete();

  await firestore()
    .collection('threads')
    .doc(threadId)
    .update({ last_message: '...' });
};

// eslint-disable-next-line require-await
export const deleteThread = async (threadId = '') =>
  firestore().collection('threads').doc(threadId).delete();

export const updateCommunitySpaceTitle = async (threadId = '', title = '') => {
  await firestore().collection('threads').doc(threadId).update({
    title: title,
  });
};
