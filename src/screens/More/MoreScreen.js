/* eslint-disable react-hooks/exhaustive-deps */
import React, {useState} from 'react';
import {StyleSheet, View, ScrollView, Linking, Alert} from 'react-native';

import {useDispatch, useSelector} from 'react-redux';
import {setAuthTokenAction, setUserDetailsAction} from '../../../store/auth';
import {TxtPoppinMedium} from '../../components/text/TxtPoppinMedium';
import TopBar from '../../components/TopBar';
import {setAuthToken, setUserDetails} from '../../helpers/auth';
import {DARK_GRAY_10} from '../../styles';
var pjson = require('./../../../package.json');

import MoreInfoItem from './Components/MoreInfoItem';
import ProfileName from './Components/ProfileName';
import { clearPendingWoTbl } from '../../helpers/sqlQuery';
import { setOfflineWo } from '../../../store/workOrderForOffline';
import { setDashboardEmpty } from '../../../store/dashboard';
import { setFormEmpty } from '../../../store/form';
import { setWoEmpty } from '../../../store/workOrder';
const APPLE_STORE_ID = '1545580135';
const MoreScreen = ({navigation, route}) => {
  const dispatch = useDispatch();
  const userDetails = useSelector((state) => state.auth?.userDetails ?? '');

  const onPressRateUsOrFeedBack = () => {
    openURL(getAppLink());
  };

  const onPressLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
      },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          try {
            setUserDetails();
            setAuthToken();

            dispatch(setUserDetailsAction({}));
            dispatch(setAuthTokenAction(''));
            clearPendingWoTbl();
            dispatch(setOfflineWo());
            dispatch(setDashboardEmpty());
            dispatch(setFormEmpty());
            dispatch(setWoEmpty());
          } catch (err) {
            console.log('erooooorrr logout ', err);
          }
        },
      },
    ]);
  };

  const getAppLink = () => {};

  const contactUsHandler = async () => {
    openURL(
      'https://app.termly.io/document/return-policy/0a7d5b53-7e90-40ff-92e3-fe494e399582',
    );
  };

  const aboutUsHandler = async () => {
    openURL(
      'https://app.termly.io/document/eula/0b2f0ae6-ec91-403d-8259-41344001fe6b',
    );
  };

  const privacyPolicyHandler = async () => {
    openURL(
      'https://app.termly.io/document/privacy-policy/f5258466-f94e-4e40-a14a-6585fe5c0a3d',
    );
  };

  const onPressHelp = async () => {
    openURL(
      'https://app.termly.io/document/terms-of-use-for-website/c21b4ce9-6ee3-43b6-9983-004bcdbfa1a0',
    );
  };

  const addSummaryHandler = async () => {
    navigation.navigate('SummaryList');
  };

  const onPressReport = async () => {
    navigation.navigate('WorkOrderReport');
  };

  const openURL = (url = '') => {
    Linking.openURL(url);
  };

  return (
    <View style={styles.container}>
      <TopBar isShowLeftIcon headingText="More" />
      <ScrollView style={{width: '100%'}}>
        <ProfileName
          title={`${userDetails?.firstName} ${userDetails?.lastName}`}
        />
        <MoreInfoItem title={'Work Order Report'} onPress={onPressReport} />
        <MoreInfoItem title={'Summary List'} onPress={addSummaryHandler} />
        <MoreInfoItem title={'Contact Us'} onPress={contactUsHandler} />

        <MoreInfoItem title={'Terms of Use'} onPress={onPressHelp} />

        <MoreInfoItem title={'About'} onPress={aboutUsHandler} />
        <MoreInfoItem title={'Privacy Policy'} onPress={privacyPolicyHandler} />

        <MoreInfoItem title={'Logout'} onPress={onPressLogout} />
      </ScrollView>
      <TxtPoppinMedium
        style={{
          fontSize: 20,
          textAlign: 'center',
          color: DARK_GRAY_10,
          marginBottom: 20,
        }}
        title={`Version ${pjson.version}`}
      />
    </View>
  );
};

export default MoreScreen;

const styles = StyleSheet.create({
  container: {flex: 1},
});
