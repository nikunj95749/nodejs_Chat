


import React from 'react';
import {Text, View} from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { responsiveScale } from '../../styles';

export const TxtPoppinSemiBold = ({props, title = '', style = {}}) => {
    return (
      <Text
        {...props}
        style={[
          {
            fontFamily: 'Poppins-SemiBold',
            fontWeight: 'bold',
            fontSize: RFValue(14),
          },
          {...style},
        ]}>
        {title}
      </Text>
    );
  };