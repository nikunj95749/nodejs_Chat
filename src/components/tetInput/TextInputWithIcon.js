import React from 'react';
import {TextInput, View} from 'react-native';
import {DARK_GRAY, LIGHT_GRAY, responsiveScale} from '../../styles';
import { RFValue } from 'react-native-responsive-fontsize';

export const TextInputWithIcon = ({
  image = <></>,
  secureTextEntry = false,
  placeholder = '',
  style = {},
  isShowIcon = true,
  value = '',
  onChange = () => {},
}) => {
  return (
    <View
      style={[
        {
          width: '90%',
          aspectRatio: 9.0,
          borderRadius: 10,
          borderColor: LIGHT_GRAY,
          borderWidth: 1,
          alignItems: 'center',
          flexDirection: 'row',
        },
        {...style},
      ]}>
      {isShowIcon ? (
        <View
          style={{
            height: '40%',
            aspectRatio: 1,
            marginLeft: 22,
          }}>
          {image}
        </View>
      ) : null}

      <TextInput
        secureTextEntry={secureTextEntry}
        placeholder={placeholder}
        placeholderTextColor={DARK_GRAY}
        style={{
          flex: 1,
          height: '100%',
          fontSize: RFValue(15),
          marginLeft: 18,
          marginRight: 10,
        }}
        onChangeText={onChange}
        value={value}
      />
    </View>
  );
};
