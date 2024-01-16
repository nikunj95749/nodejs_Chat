import React from 'react';
import {ActivityIndicator, Text, TouchableOpacity, View} from 'react-native';
import {
  BLACK_20,
  GREEN,
  LIGHT_GREEN,
  RED_LIGHT,
  responsiveScale,
  WHITE,
  ORANGE,
  ORANGE_LIGHT,
  ORANGE_WHITE_LIGHT,
} from '../styles';
import Close from './../assets/images/Close.svg';
import Eye from './../assets/images/Eye.svg';
import PDF from './../assets/images/PDF.svg';
import Call from './../assets/images/Call.svg';

import {TxtPoppinMedium} from './text/TxtPoppinMedium';
import { RFValue } from 'react-native-responsive-fontsize';
export const TagCancelled = ({style}) => (
  <View
    style={[
      {
        height: 45,
        borderRadius: 7,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        backgroundColor: RED_LIGHT,
      },
      style,
    ]}>
    <View style={{height: 17, width: 17, marginRight: 10}}>
      <Close width={'100%'} height={'100%'} />
    </View>
    <TxtPoppinMedium style={{fontSize: RFValue(11)}} title="View" />
  </View>
);

export const TagView = ({style, isLoading}) => (
  <View
    style={[
      {
        height: 37,
        borderRadius: 7,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        marginRight: 20,
        backgroundColor: ORANGE,
      },
      style,
    ]}>
    <View style={{height: 17, width: 17, marginRight: 10}}>
      <Eye width={'100%'} height={'100%'} />
    </View>
    {isLoading ? (
      <ActivityIndicator color={WHITE} />
    ) : (
      <TxtPoppinMedium
        style={{fontSize: RFValue(10), color: WHITE}}
        title="View"
      />
    )}
  </View>
);

export const TagNew = ({style, title = ''}) => (
  <View
    style={[
      {
        height: 45,
        borderRadius: 7,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        backgroundColor: ORANGE_WHITE_LIGHT,
      },
      style,
    ]}>
    <TxtPoppinMedium
      style={{fontSize: RFValue(11), color: ORANGE_LIGHT}}
      title={title}
    />
  </View>
);

export const TagViewPdf = ({onPress = () => {}, isLoading = false}) => (
  <TouchableOpacity
    onPress={onPress}
    style={{
      height: 45,
      borderRadius: 7,
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 20,
      marginRight: 20,
      backgroundColor: ORANGE,
    }}>
    <View style={{height: 22, width: 20, marginRight: 10}}>
      {isLoading ? (
        <ActivityIndicator color={WHITE} />
      ) : (
        <PDF width={'100%'} height={'100%'} />
      )}
    </View>
    <TxtPoppinMedium
      style={{fontSize: RFValue(11), color: WHITE}}
      title="View PDF"
    />
  </TouchableOpacity>
);

export const TagDialPhone = ({title = '', onPress = () => {}}) => (
  <TouchableOpacity
    onPress={onPress}
    style={{
      height: 45,
      borderRadius: 7,
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 20,
      backgroundColor: LIGHT_GREEN,
      borderWidth: 1,
      borderColor: GREEN,
    }}>
    <View style={{height: 19, width: 19, marginRight: 10}}>
      <Call width={'100%'} height={'100%'} />
    </View>
    <TxtPoppinMedium
      style={{fontSize: RFValue(11), color: BLACK_20}}
      title={title}
    />
  </TouchableOpacity>
);

export const TagSendEmail = ({onPress = () => {}, isLoading = false}) => (
  <TouchableOpacity
    onPress={onPress}
    style={{
      height: 45,
      borderRadius: 7,
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 20,
      marginRight: 20,
      backgroundColor: GREEN,
    }}>
    <View style={{height: 22, width: 20, marginRight: 10}}>
      {isLoading ? (
        <ActivityIndicator color={WHITE} />
      ) : (
        <PDF width={'100%'} height={'100%'} />
      )}
    </View>
    <TxtPoppinMedium
      style={{fontSize: RFValue(11), color: WHITE}}
      title="Send Email"
    />
  </TouchableOpacity>
);
