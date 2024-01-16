import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import {
  getUniqueId,
  useDeviceName,
  getIpAddress,
  getBrand,
  getSystemName,
  getSystemVersion,
  getPhoneNumber,
  getCarrier,
} from 'react-native-device-info';
var pjson = require('./../../../package.json');

import SignInScreenBackLayout from '../../assets/images/SignInScreenBackLayout.svg';
import AppLogo from '../../assets/images/AppLogo.svg';
import Email from '../../assets/images/Email.svg';
import Password from '../../assets/images/Password.svg';
import Checked from '../../assets/images/Checked.svg';
import UnChecked from '../../assets/images/UnChecked.svg';

import {
  BLACK,
  DARK_GRAY,
  DARK_GRAY_10,
  ORANGE,
  responsiveScale,
  WHITE,
} from '../../styles';
import {useDispatch} from 'react-redux';
import {setAuthTokenAction, setUserDetailsAction} from '../../../store/auth';
import {TxtPoppinNormal} from '../../components/text/TxtPoppinNormal';
import {TextInputWithIcon} from '../../components/tetInput/TextInputWithIcon';
import {TxtPoppinMedium} from '../../components/text/TxtPoppinMedium';
import {ActionButton} from '../../components/buttons/ActionButton';
import {signIn} from '../../resources/baseServices/auth';
import {
  getRememberUserCredentials,
  setAuthToken,
  setRememberUserCredentials,
  setUserCredentials,
  setUserDetails,
} from '../../helpers/auth';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {showMessage} from 'react-native-flash-message';
import { RFValue } from 'react-native-responsive-fontsize';
import AsyncStorage from '@react-native-community/async-storage';

const SignInScreen = ({navigation}) => {
  const [isRemember, setIsRemember] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {loading, result} = useDeviceName();

  const [txtEmail, setTxtEmail] = useState('');
  const [txtPassword, setTxtPassword] = useState('');

  const dispatch = useDispatch();

  const onPressSignInButton = async () => {
    try {
      const data = {
        username: txtEmail,
        password: txtPassword,
        email: txtEmail,
        appVersionInfo: {
          appVersion: `${pjson.version}` || '',
          deviceUniqueId:
            Platform.OS === 'ios' ? (await getUniqueId()) || '' : '',
          platform: Platform.OS,
          deviceName: result,
          ipAddress: Platform.OS === 'ios' ? (await getIpAddress()) || '' : '',
          brandName: getBrand() || '',
          deviceOSName: getSystemName() || '',
          deviceOSVersion: getSystemVersion() || '',
          carrierName: Platform.OS === 'ios' ? (await getCarrier()) || '' : '',
          cellularNumber:
            Platform.OS === 'ios' ? (await getPhoneNumber()) || '' : '',
        },
      };

      let emailValidator = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;

      if (txtEmail === '') {
        Alert.alert('Alert', 'Please enter email address!', [
          {text: 'OK', onPress: () => console.log('OK Pressed')},
        ]);
      } else if (txtPassword === '') {
        Alert.alert('Alert', 'Please enter password!', [
          {text: 'OK', onPress: () => console.log('OK Pressed')},
        ]);
      } else if (emailValidator.test(txtEmail) === false) {
        Alert.alert('Alert', 'EmailId is Not Correct!', [
          {text: 'OK', onPress: () => console.log('OK Pressed')},
        ]);
      } else {
        setIsLoading(true);
        const res = await signIn(data);
        if (res?.data?.data) {
          await AsyncStorage.setItem('lastExecutionTimestamp', Date.now().toString());
          setUserDetails(JSON.stringify(res?.data?.data));
          setAuthToken(res?.data?.data?.authToken);
          setUserCredentials(JSON.stringify({password: txtPassword, email: txtEmail}));
          if (isRemember) {
            setRememberUserCredentials(
              JSON.stringify({password: txtPassword, email: txtEmail}),
            );
          } else {
            setRememberUserCredentials();
          }

          dispatch(setUserDetailsAction(res?.data?.data));
          dispatch(setAuthTokenAction(res?.data?.data?.authToken));
        } else {
          showMessage({
            message: 'Failed!',
            description: `Invalid EmailId or Password!`,
            type: 'danger',
          });
        }
      }
    } catch (error) {
      console.log('[SignInScreen] onPressSignInButton error: ', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const checkUserIsRememberOrNot = async () => {
      const rememberedUserDetail = await getRememberUserCredentials();
      if (!!rememberedUserDetail) {
        setTxtEmail(JSON.parse(rememberedUserDetail)?.email);
        setTxtPassword(JSON.parse(rememberedUserDetail)?.password);
        setIsRemember(true);
      }
    };
    checkUserIsRememberOrNot();
  }, []);

  return (
    <View style={styles.container}>
      <View style={{width: '100%', flex: 1}}>
        <KeyboardAwareScrollView style={{width: '100%'}}>
          <View style={{width: '100%', alignItems: 'center'}}>
            <View
              style={{
                marginTop: 120,
                width: '45%',
                aspectRatio: 2.8,
              }}>
              <AppLogo width={'100%'} height={'100%'} />
            </View>
            <View style={{marginTop: 70}}>
              <TxtPoppinNormal title="Email" />
              <TextInputWithIcon
                value={txtEmail}
                onChange={(txt) => {
                  setTxtEmail(txt);
                }}
                style={{marginTop: 8}}
                placeholder="Enter your email address"
                image={<Email width={'100%'} height={'100%'} />}
              />

              <TxtPoppinNormal title="Password" style={{marginTop: 20}} />

              <TextInputWithIcon
                value={txtPassword}
                onChange={(txt) => {
                  setTxtPassword(txt);
                }}
                secureTextEntry={true}
                style={{marginTop: 8}}
                placeholder="Enter your password"
                image={<Password width={'100%'} height={'100%'} />}
              />
            </View>

            <ActionButton
              onPress={onPressSignInButton}
              title="Sign In"
              isLoading={isLoading}
              style={{marginTop: 50, width: '90%'}}
            />

            <View
              style={{
                width: '90%',
                marginTop: 15,
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}>
              <TouchableOpacity
                onPress={() => setIsRemember(!isRemember)}
                style={{flexDirection: 'row', alignItems: 'center'}}>
                <View style={{height: 30, width: 30}}>
                  {isRemember ? (
                    <Checked height={'100%'} width={'100%'} />
                  ) : (
                    <UnChecked height={'100%'} width={'100%'} />
                  )}
                </View>
                <TxtPoppinMedium
                  title="Remember Password"
                  style={{
                    marginLeft: 15,
                    color: isRemember ? BLACK : DARK_GRAY,
                  }}
                />
              </TouchableOpacity>
              <TxtPoppinNormal
                title="Forgot Password?"
                style={{
                  textDecorationLine: 'underline',
                  color: ORANGE,
                  fontSize: RFValue(14),
                }}
              />
            </View>

            <View
              style={{
                width: '90%',
                marginTop: 70,
                flexDirection: 'row',
                justifyContent: 'center',
              }}>
              <TxtPoppinNormal
                title="By signing you are agreeing our"
                style={{color: DARK_GRAY_10}}
              />
              <TxtPoppinNormal
                title=" Term and privacy policy"
                style={{textDecorationLine: 'underline', color: ORANGE}}
              />
            </View>
          </View>
          {Platform.OS === 'android' && (
            <View style={{width: '100%', aspectRatio: 6}}>
              <SignInScreenBackLayout height={'100%'} width={'100%'} />
            </View>
          )}
        </KeyboardAwareScrollView>
      </View>
      {Platform.OS === 'ios' && (
        <View style={{width: '100%', aspectRatio: 6}}>
          <SignInScreenBackLayout height={'100%'} width={'100%'} />
        </View>
      )}
    </View>
  );
};

export default SignInScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: WHITE,
    flex: 1,
  },
});
