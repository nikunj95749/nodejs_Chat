import React from 'react';
import {ActivityIndicator, TouchableOpacity, View} from 'react-native';
import {
  DARK_GRAY,
  DARK_GRAY_15,
  LIGHT_GRAY,
  ORANGE,
  responsiveScale,
  WHITE,
} from '../../styles';
import {TxtPoppinNormal} from '../text/TxtPoppinNormal';

export const ActionButton = ({
  title = '',
  style = {},
  onPress = () => {},
  isLoading = false,
  isDisable = false
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        {
          width: '100%',
          height: 70,
          borderRadius: 10,
          alignItems: 'center',
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: ORANGE,
        },
        {...style},
        isDisable && {backgroundColor: LIGHT_GRAY,}
      ]}>
      {isLoading ? (
        <ActivityIndicator color={WHITE} size={'large'} />
      ) : (
        <TxtPoppinNormal
          title={title}
          style={{color: WHITE, fontWeight: '600'}}
        />
      )}
    </TouchableOpacity>
  );
};
