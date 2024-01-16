import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {
  CardStyleInterpolators,
  createStackNavigator,
} from '@react-navigation/stack';
import SignInScreen from '../../screens/auth/SignInScreen';

const AuthStack = createStackNavigator();
const ModalStack = createStackNavigator();

const ModalStackNavigator = () => {

  return (
    <AuthStack.Navigator
      initialRouteName="SignIn"
      // headerMode="none"
      screenOptions={{
        headerShown: false,
        gestureEnabled: false,
        swipeEnabled: false,
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      }}>
      <AuthStack.Screen name="SignIn" component={SignInScreen} />
    </AuthStack.Navigator>
  );
};

const AuthNavigator = () => {
  return (
    <NavigationContainer>
      <ModalStack.Navigator
        // headerMode="none"
        screenOptions={{
          headerShown: false,
        }}
        initialRouteName="Main">
        <ModalStack.Screen name="Main" component={ModalStackNavigator} />
      </ModalStack.Navigator>
    </NavigationContainer>
  );
};

export default AuthNavigator;
