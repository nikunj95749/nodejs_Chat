import React from 'react';
import {TextInput, View} from 'react-native';
import {DARK_GRAY, responsiveScale, WHITE} from '../../styles';
import { RFValue } from 'react-native-responsive-fontsize';

export const TxtFieldWorkOrder = ({
  style = {},
  placeholder = 'Work Order #',
  onChange = () => {},
  value = '',
  keyboardType = 'default',
}) => {
  return (
    <View
      style={[
        {
          height: 55,
          width: '30%',
          borderRadius: 5,
          backgroundColor: WHITE,
          marginRight: 20,
        },
        style,
      ]}>
      <TextInput
        placeholder={placeholder}
        value={value}
        placeholderTextColor={DARK_GRAY}
        onChangeText={onChange}
        keyboardType={keyboardType}
        style={{
          flex: 1,
          height: '100%',
          fontSize: RFValue(12),
          marginLeft: 5,
          fontFamily: 'Poppins-Regular',
        }}
      />
    </View>
  );
};
