
import React from 'react';
import {Text, View} from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';

export const TxtPoppinNormal = ({props, title = '', style = {}}) => {
    return (
      <Text
        {...props}
        style={[
          {
            fontFamily: 'Poppins-Regular',
            fontWeight: '400',
            fontSize: RFValue(14),
            
          },
          {...style},
        ]}>
        {title}
      </Text>
    );
  };