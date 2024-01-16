import React from 'react';
import {StyleSheet, View} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import DashboardScreen from '../../screens/dashboard/DashboardScreen';
import {BLACK, DARK_GRAY, ORANGE, responsiveScale} from '../../styles';
import EnableDashboard from '../../assets/images/EnableDashboard.svg';
import DisableDashboard from '../../assets/images/DisableDashboard.svg';
import EnablePWO from '../../assets/images/EnablePWO.svg';
import DisablePWO from '../../assets/images/DisablePWO.svg';

import EnableCWO from '../../assets/images/EnableCWO.svg';
import DisableCWO from '../../assets/images/DisableCWO.svg';
import EnableMore from '../../assets/images/EnableMore.svg';
import DisableMore from '../../assets/images/DisableMore.svg';

import EnableTimeSheet from '../../assets/images/EnableTimeSheet.svg';
import DisableTimeSheet from '../../assets/images/DisableTimeSheet.svg';

import {TxtPoppinMedium} from '../../components/text/TxtPoppinMedium';
import TimeSheetScreen from '../../screens/timeSheets/TimeSheetScreen';
import CompletedWorkOrdersScreen from '../../screens/completedWorkOrders/CompletedWorkOrdersScreen';
import PendingWorkOrdersScreen from '../../screens/pendingWorkOrders/PendingWorkOrdersScreen';
import MoreScreen from '../../screens/More/MoreScreen';
import { RFValue } from 'react-native-responsive-fontsize';

const BottomTab = createBottomTabNavigator();

const TabIcon = ({focused, image = <></>, title = ''}) => {
  return (
    <View
      style={{
        height: 90,
        width: 160,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <View style={{height: 40, width: 40, marginTop: 6}}>{image}</View>
      <TxtPoppinMedium
        title={title}
        style={{
          fontSize: RFValue(8),
          marginTop: 5,
          color: focused ? ORANGE : DARK_GRAY,
        }}
      />
    </View>
  );
};

const BottomTabNavigator = () => {
  return (
    <BottomTab.Navigator
      initialRouteName="Dashboard"
      screenOptions={{
        tabBarStyle: {height: 100},
      }}
      tabBarOptions={{
        showIcon: true,
        showLabel: false,
        style: {
          borderTopWidth: 0.5,
        },
      }}>
      <BottomTab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({focused}) => (
            <TabIcon
              focused={focused}
              title={'Dashboard'}
              image={
                focused ? (
                  <EnableDashboard height={'95%'} width={'95%'} />
                ) : (
                  <DisableDashboard height={'95%'} width={'95%'} />
                )
              }
            />
          ),
        }}
      />
      <BottomTab.Screen
        name="TimeSheet"
        component={TimeSheetScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({focused}) => (
            <TabIcon
              focused={focused}
              title={'TimeSheets'}
              image={
                focused ? (
                  <EnableTimeSheet height={'100%'} width={'100%'} />
                ) : (
                  <DisableTimeSheet height={'100%'} width={'100%'} />
                )
              }
            />
          ),
        }}
      />
      <BottomTab.Screen
        name="CompletedWorkOrders"
        component={CompletedWorkOrdersScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({focused}) => (
            <TabIcon 
              focused={focused}
              title={'Completed WO'}
              image={
                focused ? (
                  <EnableCWO height={'100%'} width={'100%'} />
                ) : (
                  <DisableCWO height={'100%'} width={'100%'} />
                )
              }
              
            />
            
          ),
        }}
      />
      <BottomTab.Screen
        name="PendingWorkOrders"
        component={PendingWorkOrdersScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({focused}) => (
            <TabIcon
              focused={focused}
              title={'Pending WO'}
              image={
                focused ? (
                  <EnablePWO height={'100%'} width={'100%'} />
                ) : (
                  <DisablePWO height={'100%'} width={'100%'} />
                )
              }
            />
          ),
          tabBarLabel:{},
          tabBarLabelStyle:{fontSize:10}
        }}
      />

      <BottomTab.Screen
        name="MoreScreen"
        component={MoreScreen}
        options={{
          headerShown: false,
          tabBarIcon: ({focused}) => (
            <TabIcon
              focused={focused}
              title={'More'}
              image={
                focused ? (
                  <EnableMore height={'100%'} width={'100%'} />
                ) : (
                  <DisableMore height={'100%'} width={'100%'} />
                )
              }
            />
          ),
        }}
      />
    </BottomTab.Navigator>
  );
};

export default BottomTabNavigator;

const styles = StyleSheet.create({
  pinkIndicatorChat: {
    borderRadius: 50,
    height: 8,
    position: 'absolute',
    right: -10,
    top: -2,
    width: 8,
  },
});
