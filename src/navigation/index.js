import React from 'react';
import {ActivityIndicator, StyleSheet, View} from 'react-native';

import useAuthorizedSession from '../hooks/useAuthorizedSession';
import AppNavigator from './app/AppNavigator';
import AuthNavigator from './auth/AuthNavigator';


const Navigation = () => {
  const [authToken, isInitializing] = useAuthorizedSession();

  if (isInitializing) {
    return (
      <View style={styles.loaderWrap}>
        <ActivityIndicator size="large"  />
      </View>
    );
  }

  return authToken ? <AppNavigator /> : <AuthNavigator />;
};

export default Navigation;

const styles = StyleSheet.create({
  loaderWrap: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
});
