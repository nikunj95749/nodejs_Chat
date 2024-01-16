import React from 'react';
import {StyleSheet, View} from 'react-native';

import {BLACK, responsiveScale} from '../styles';
import {TxtPoppinNormal} from './text/TxtPoppinNormal';
import { RFValue } from 'react-native-responsive-fontsize';
import Info from './Info';

export default function Label({data}) {
  return (
    <View style={{alignItems: 'center', width: 300, marginBottom: 10,flexDirection:'row'}}>
      <TxtPoppinNormal
        style={{
          fontSize: RFValue(11),
          width: '100%',
          color:
            data?.styleJson != null
              ? data?.styleJson?.color
                ? data?.styleJson?.color
                : BLACK
              : BLACK,
        }}
        title={data?.title}
      />
      {data.title.trim() !== '' && data.tooltipText && <Info content={`${data.tooltipText}`}/>}
    </View>
  );
}

const styles = StyleSheet.create({
  
});
