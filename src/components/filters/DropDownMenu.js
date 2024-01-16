import React, { useState } from 'react';
import {TouchableOpacity, View} from 'react-native';
import {
  DARK_GRAY,
  LIGHT_GRAY,
  ORANGE,
  responsiveScale,
  WHITE,
} from '../../styles';
import {TxtPoppinNormal} from '../text/TxtPoppinNormal';
import DropDown from '../../assets/images/DropDown.svg';
import {Dropdown} from 'react-native-element-dropdown';
import { RFValue } from 'react-native-responsive-fontsize';

const defaultData = [
  {label: 'Project 1', value: '1'},
  {label: 'Project 2', value: '2'},
  {label: 'Project 3', value: '3'},
  {label: 'Project 4', value: '4'},
  {label: 'Project 5', value: '5'},
  {label: 'Project 6', value: '6'},
  {label: 'Project 7', value: '7'},
  {label: 'Project 8', value: '8'},
];

export const DropDownMenu = ({
  style,
  placeholderStyle,
  selectedTextStyle,
  placeHolder = 'Select Project',
  data = defaultData,
  onChangeItem  = () => {},
  defaultValue = '',
}) => {
  const [value, setValue] = useState(defaultValue);
  return (
    <View style={[{height: 55, width: '35%', backgroundColor: WHITE,marginRight:20}, style]}>
      <Dropdown
        style={{height: '100%', paddingHorizontal: 20}}
        selectedTextStyle={selectedTextStyle}
        placeholderStyle={[
          {
            color: DARK_GRAY,
            fontSize: RFValue(12),
            fontFamily: 'Poppins-Regular',
          },
          placeholderStyle,
        ]}
        
        iconStyle={{}}
        data={data}
        search
        maxHeight={300}
        labelField="label"
        valueField="value"
        placeholder={placeHolder}
        searchPlaceholder="Search..."
        value={value}
        onChange={(item) => {
          setValue(item.value);
          onChangeItem(item);
        }}
        renderRightIcon={() => <DropDown />}
      />
    </View>
  );
};
