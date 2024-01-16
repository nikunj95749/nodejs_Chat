import React, { useEffect, useState } from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {
  CardStyleInterpolators,
  createStackNavigator,
} from '@react-navigation/stack';



import BottomTabNavigator from './BottomTabNavigator';
import FolderDetailScreen from '../../screens/dashboard/FolderDetailScreen';
import TimeSheetScreen from '../../screens/forms/MasterForm';
import Viewer from '../../components/viewer';
import MasterForm from '../../screens/forms/MasterForm';
import SummaryList from '../../screens/addSummary/SummaryList';
import AddSummaryScreen from '../../screens/addSummary/AddSummaryScreen';
import WorkOrderReport from '../../screens/reports/WorkOrderReport';
import AsyncStorage from '@react-native-community/async-storage';
import { getUserCredentials, setAuthToken, setUserDetails } from '../../helpers/auth';
import { setAuthTokenAction, setUserDetailsAction } from '../../../store/auth';
import HtmlViewerScreen from '../../screens/htmlViewer/HtmlViewerScreen';
import { signIn } from '../../resources/baseServices/auth';
import { useDispatch } from 'react-redux';
import { ActivityIndicator, View } from 'react-native';

const AppStack = createStackNavigator();
const ModalStack = createStackNavigator();

const ModalStackNavigator = ({navigation}) => {
  return (
    <AppStack.Navigator
      initialRouteName={'BottomTabNavigator'}
      // headerMode="none"
      screenOptions={{
        headerShown: false,
        gestureEnabled: true,
        swipeEnabled: true,
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
      }}>
      <AppStack.Screen
        name="BottomTabNavigator"
        component={BottomTabNavigator}
        screenOptions={{
          headerShown: false,
        }}
        // headerMode="none"
      />
      <AppStack.Screen
        name="FolderDetailScreen"
        component={FolderDetailScreen}
        screenOptions={{
          headerShown: false,
        }}
        // headerMode="none"
      />
      <AppStack.Screen
        name="TimeSheetScreen"
        component={TimeSheetScreen}
        screenOptions={{
          headerShown: false,
        }}
        // headerMode="none"
      />
      <AppStack.Screen
        name="SummaryList"
        component={SummaryList}
        screenOptions={{
          headerShown: false,
        }}
        // headerMode="none"
      />
        <AppStack.Screen
        name="AddSummaryScreen"
        component={AddSummaryScreen}
        screenOptions={{
          headerShown: false,
        }}
        // headerMode="none"
      />
      

      <AppStack.Screen
        name="viewer"
        component={Viewer}
        // headerMode="none"
        options={{headerShown: false}}
      />

      <AppStack.Screen
        name="MasterForm"
        component={MasterForm}
        // headerMode="none"
        options={{headerShown: false}}
      />
       <AppStack.Screen
        name="WorkOrderReport"
        component={WorkOrderReport}
        // headerMode="none"
        options={{headerShown: false}}
      />
       <AppStack.Screen
        name="HtmlViewerScreen"
        component={HtmlViewerScreen}
        // headerMode="none"
        options={{headerShown: false}}
      />
    </AppStack.Navigator>
  );
};

const AppNavigator = () => {

  const [isInitializing, setIsInitializing] = useState(true);

  const ONE_DAY_IN_MILLISECONDS = 24 * 60 * 60 * 1000;
  const dispatch = useDispatch();

  async function isFunctionAllowed() {
    try {
      // Retrieve the stored timestamp from AsyncStorage
      const lastExecutionTimestamp = await AsyncStorage.getItem('lastExecutionTimestamp');
  
      // If the timestamp doesn't exist or is more than a day old, allow the function to execute
      if (!lastExecutionTimestamp || Date.now() - parseInt(lastExecutionTimestamp, 10) > ONE_DAY_IN_MILLISECONDS) {
        return true;
      }
  
      // Function not allowed to execute
      return false;
    } catch (error) {
      console.error('Error reading from AsyncStorage:', error);
      // Handle the error accordingly
      return false;
    }
  }
  
  async function executeOnceADayFunction() {
    try {
      // Check if the function is allowed to execute
      const isAllowed = await isFunctionAllowed();
  
      if (isAllowed) {
        await AsyncStorage.setItem('lastExecutionTimestamp', Date.now().toString());
        // Your logic for the function goes here
        const gresUserCredentials = await getUserCredentials();
        const txtEmail = JSON.parse(gresUserCredentials)?.email;
        const txtPassword = JSON.parse(gresUserCredentials)?.password;
        const data = {
          username: txtEmail,
          password: txtPassword,
          email: txtEmail,
        };
        
        const res = await signIn(data);
        console.log(res.data.data);
        if (res?.data?.data) {
          setUserDetails(JSON.stringify(res?.data?.data));
          setAuthToken(res?.data?.data?.authToken);
          

          dispatch(setUserDetailsAction(res?.data?.data));
          dispatch(setAuthTokenAction(res?.data?.data?.authToken));
        } 
        setIsInitializing(false)
        // Update the timestamp in AsyncStorage to mark the last execution time
        
      } else {
        setIsInitializing(false)
        console.log('Function already executed today. Skipping.');
      }
    } catch (error) {
      setIsInitializing(false)
      console.error('Error executing the function:', error);
      // Handle the error accordingly
    }
  }

  useEffect(()=>{
    executeOnceADayFunction();
  },[]);

  if (isInitializing) {
    return (
      <View style={{
        alignItems: 'center',
        flex: 1,
        justifyContent: 'center',
      }}>
        <ActivityIndicator size="large"  />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <ModalStack.Navigator
       screenOptions={{
        headerShown: false,
      }}
        // headerMode="none"
        initialRouteName="Main">
        <ModalStack.Screen name="Main" component={ModalStackNavigator} />
      </ModalStack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
