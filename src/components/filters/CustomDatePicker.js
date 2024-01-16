import React from 'react';
import {TouchableOpacity, View} from 'react-native';
import {
  DARK_GRAY,
  LIGHT_GRAY,
  ORANGE,
  responsiveScale,
  WHITE,
} from '../../styles';
import {TxtPoppinNormal} from '../text/TxtPoppinNormal';
import Calender from '../../assets/images/Calender.svg';
import { RFValue } from 'react-native-responsive-fontsize';

export const CustomDatePicker = ({
  style,
  txtStyle,
  onPress = () => {},
  title = '07/07/2022',
  defaulttitle = '',
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        {
          height: 55,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '30%',
          borderRadius: 5,
          paddingHorizontal: 20,
          backgroundColor: WHITE,
        },
        style,
      ]}>
      <TxtPoppinNormal
        style={[{fontSize: RFValue(11)}, txtStyle]}
        title={!!title ? `${title}` : defaulttitle}
      />
      <View style={{height: 25, width: 25}}>
        <Calender width={'100%'} height={'100%'} />
      </View>
    </TouchableOpacity>
  );
};
