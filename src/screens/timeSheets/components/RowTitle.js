import React, {useState} from 'react';
import { DARK_GRAY_5, responsiveScale } from "../../../styles";
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import { TxtPoppinMedium } from "../../../components/text/TxtPoppinMedium";
import { RFValue } from 'react-native-responsive-fontsize';

export const RowTitle = ({width = '10%', title = '', color = DARK_GRAY_5, style,txtStyle}) => {
    return (
      <View
        style={[{
          height: '100%',
          justifyContent: 'center',
          width: width,
        },style]}>
        <TxtPoppinMedium
          style={{...{color: color, fontSize: RFValue(8)},...txtStyle}}
          title={title}
        />
      </View>
    );
  };