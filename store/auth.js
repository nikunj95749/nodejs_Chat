import produce from 'immer';

const SET_AUTH_TOKEN = 'SET_AUTH_TOKEN';
const REMOVE_AUTH_TOKEN = 'REMOVE_AUTH_TOKEN';
const USER_DETAILS = 'USER_DETAILS';

const initialState = {
  authToken: '',
  userDetails: {},
};

// reducer
export default (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case SET_AUTH_TOKEN:
        draft.authToken = action.payload;
        break;
      case USER_DETAILS:
        draft.userDetails = action.payload;
        break;
      case REMOVE_AUTH_TOKEN:
        draft.authToken = '';
        break;
    }
  });

export const setAuthTokenAction = (value = '') => ({
  type: SET_AUTH_TOKEN,
  payload: value,
});

export const setUserDetailsAction = (value = {}) => ({
  type: USER_DETAILS,
  payload: value,
});

export const removeAuthTokenAction = () => ({
  type: REMOVE_AUTH_TOKEN,
});
