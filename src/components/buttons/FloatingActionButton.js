import React from 'react';
import {TouchableOpacity} from 'react-native';
import {ORANGE} from '../../styles';
import FloatingButton from '../../assets/images/FloatingButton.svg';

export const FloatingActionButton = ({
  style = {},
  onPress = () => {},
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        {
          width: 80,
          height:80,
          borderRadius: 40,
          alignItems: 'center',
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: ORANGE,
        },
        {...style},
      ]}>
      <FloatingButton width={'100%'} height={'100%'} />
    </TouchableOpacity>
  );
};
