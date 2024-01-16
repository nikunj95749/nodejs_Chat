import React from 'react';
import {StyleSheet, View, StatusBar} from 'react-native';
import {Provider} from 'react-redux';
import Navigation from './src/navigation';
import store, { persistor } from './store/configureStore';
import {MenuProvider} from 'react-native-popup-menu';
import FlashMessage from 'react-native-flash-message';
import SyncOfflineLoader from './src/components/SyncOfflineLoader';
import { PersistGate } from 'redux-persist/integration/react';

const App = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
      <MenuProvider>
        <View style={styles.container}>
          <StatusBar barStyle="dark-content" />
          <Navigation />
        </View>
      </MenuProvider>
      <FlashMessage position="top" />
      <SyncOfflineLoader/>
      </PersistGate>
    </Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    // backgroundColor: WHITE,
    flex: 1,
    position: 'relative',
  },
});

export default App;
