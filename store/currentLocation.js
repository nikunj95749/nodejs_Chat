import produce from 'immer';

const SET_CURRENT_LOCATION = 'SET_CURRENT_LOCATION';

const initialState = {
  latitude: '',
  longitude: '',
};

// reducer
export default (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case SET_CURRENT_LOCATION:
        draft.latitude = action.payload?.latitude;
        draft.longitude = action.payload?.longitude;
        break;
    }
  });

export const setCurrentLocationAction = (value = {}) => ({
  type: SET_CURRENT_LOCATION,
  payload: value,
});

