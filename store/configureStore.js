import {applyMiddleware, createStore} from 'redux';
import thunk from 'redux-thunk';
import {composeWithDevTools} from 'redux-devtools-extension';
import {persistStore, persistReducer} from 'redux-persist';
import AsyncStorage from '@react-native-community/async-storage';

import {createReducerManager} from './reducerManager';
import auth from './auth';
import workOrder from './workOrder';
import form from './form';
import currentLocation from './currentLocation';
import dashboard from './dashboard';
import workOrderForOffline from './workOrderForOffline';

const authPersistConfig = {
  key: 'auth',
  storage: AsyncStorage,
};

const dashboardPersistConfig = {
  key: 'dashboard',
  storage: AsyncStorage,
};

const workOrderPersistConfig = {
  key: 'workOrder',
  storage: AsyncStorage,
};

const formPersistConfig = {
  key: 'form',
  storage: AsyncStorage,
};

const currentLocationPersistConfig = {
  key: 'currentLocation',
  storage: AsyncStorage,
};

const initialReducers = {
  auth: persistReducer(authPersistConfig, auth),
  workOrder: persistReducer(workOrderPersistConfig, workOrder),
  form: persistReducer(formPersistConfig, form),
  dashboard: persistReducer(dashboardPersistConfig, dashboard),
  currentLocation: persistReducer(
    currentLocationPersistConfig,
    currentLocation,
  ),
  workOrderForOffline,
};
const reducerManager = createReducerManager(initialReducers);

const store = createStore(
  reducerManager.reduce,
  {},
  composeWithDevTools(applyMiddleware(thunk)),
);

store.reducerManager = reducerManager;

export const persistor = persistStore(store);

export default store;
