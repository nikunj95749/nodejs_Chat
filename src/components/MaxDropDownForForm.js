import {isEmpty} from 'lodash';
import React, {useEffect, useMemo, useState} from 'react';
import {View} from 'react-native';
import {Dropdown} from 'react-native-element-dropdown';
import {useDispatch, useSelector} from 'react-redux';
import store from '../../store/configureStore';
import {setDispatchFormData, setFormValidation} from '../../store/form';
import DropDown from '../assets/images/DropDown.svg';

import {DARK_GRAY, LIGHT_GRAY, RED, responsiveScale, WHITE} from '../styles';
import {TxtPoppinMedium} from './text/TxtPoppinMedium';
import {RFValue} from 'react-native-responsive-fontsize';

export default function MaxDropDownForForm({
  data,
  isLoadingData,
  arrDropDownData = [],
  isFromTable = false,
  onChangeTextValue = () => {},
  valueForTbl = '',
  formSample = {},
}) {
  const [dropDownValue, setDropDownValue] = useState('');

  const [isValidateText, setIsValidateText] = useState(true);

  const dispatch = useDispatch();

  const isTriggerValidation = useSelector(
    (state) => state.form?.isValidate ?? {},
  );

  const arrData = useMemo(() => {
    return JSON.parse(data?.options);
  }, []);

  useEffect(() => {
    setDropDownValue(valueForTbl);
  }, [valueForTbl]);

  const onChange = (text) => {
    setDropDownValue(text);
    setIsValidateText(true);
    onChangeTextValue({value: text, id: data?.id});
  };

  return (
    <View
      style={{
        width: '100%',
      }}>
      <View style={{flexDirection: 'row', width: '100%'}}>
        <TxtPoppinMedium
          style={{
            fontSize: RFValue(11),
          }}
          title={data?.title}
        />
        {data?.isRequired ? (
          <TxtPoppinMedium
            style={{
              fontSize: RFValue(11),
              color: RED,
            }}
            title={'*'}
          />
        ) : null}
      </View>
      <Dropdown
        style={{
          paddingHorizontal: 20,
          width: '100%',
          height: 35,
          borderColor: isValidateText ? LIGHT_GRAY : RED,
          borderWidth: 1,
          marginBottom: 8,
          borderRadius: 8,
          backgroundColor: WHITE,
        }}
        selectedTextStyle={{fontSize: RFValue(10)}}
        placeholderStyle={{
          color: DARK_GRAY,
          fontSize: RFValue(11),
          fontFamily: 'Poppins-Regular',
        }}
        iconStyle={{}}
        data={arrDropDownData}
        search
        maxHeight={300}
        labelField="label"
        valueField="value"
        placeHolder={data?.placeholder}
        searchPlaceholder="Search..."
        value={dropDownValue}
        onChange={(item) => {
          onChange(item?.label);
        }}
        renderRightIcon={() => <DropDown />}
      />
    </View>
  );
}
