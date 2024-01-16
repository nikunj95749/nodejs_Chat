import React from 'react';
import {Text} from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
export const TxtPoppinMedium = ({props, title = '', style = {}}) => {
  return (
    <Text
      style={[
        {
          fontFamily: 'Poppins-Medium',
          fontSize: RFValue(14),
        },
        {...style},
      ]}
      {...props}>
      {title}
    </Text>
  );
};
