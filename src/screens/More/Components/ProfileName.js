import React from 'react';
import {View} from 'react-native';
import {TxtPoppinMedium} from '../../../components/text/TxtPoppinMedium';

export default function ProfileName(props) {
  return (
    <View
      {...props}
      style={{
        width: '95%',
        height: 80,
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'center',
        borderRadius: 8,
        // backgroundColor: WHITE,
        marginTop: 15,
      }}>
      <View style={{justifyContent: 'center', height: '100%', width: '100%'}}>
        <TxtPoppinMedium
          style={{
            fontSize: 30,
          }}
          title={props?.title}
        />
      </View>
    </View>
  );
}
