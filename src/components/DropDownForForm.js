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
import { RFValue } from 'react-native-responsive-fontsize';
import Info from './Info';

export default function DropDownForForm({
  data,
  isLoadingData,
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

  useEffect(() => {
    if (isTriggerValidation === true) {
      dispatch(setFormValidation(false));
      if (isEmpty(dropDownValue) && data?.isRequired === true) {
        setIsValidateText(false);
        if (isFromTable) {
          window.isValicationSuccessfullyTable = false;
        } else {
          window.isValicationSuccessfully = false;
        }
      } else {
        setIsValidateText(true);
      }
    }
  }, [isTriggerValidation]);

  useEffect(() => {
    if (isFromTable === false) {
      const latestDispatchFormData = store?.getState()?.form?.dispatchFormData;
      if (
        !isEmpty(formSample) &&
        latestDispatchFormData?.formSamples?.length > 0
      ) {
        const dispatchObj =
          latestDispatchFormData?.formSamples?.find((obj) => {
            return formSample?.displayIndex === obj?.sample?.displayIndex;
          }) ?? {};
        if (!isEmpty(dispatchObj?.formFields)) {
          const formField = [...dispatchObj?.formFields]?.find((obj) => {
            return obj?.formFieldId === data?.id;
          });

          if (!isEmpty(formField)) {
            setDropDownValue(formField?.textValue);
          }
        }
      } else {
        if (!isEmpty(latestDispatchFormData?.formFields)) {
          const formField = [...latestDispatchFormData?.formFields]?.find(
            (obj) => {
              return obj?.formFieldId === data?.id;
            },
          );

          if (!isEmpty(formField)) {
            setDropDownValue(formField?.textValue);
          }
        }
      }
    }
  }, [isLoadingData]);

  const onChange = (text) => {
    setDropDownValue(text);
    setIsValidateText(true);
    if (isFromTable === true) {
      onChangeTextValue({value: text, id: data?.id});
    }

    if (isFromTable === false) {
      const latestDispatchFormData = store?.getState()?.form?.dispatchFormData;
      if (
        !isEmpty(formSample) &&
        latestDispatchFormData?.formSamples?.length > 0
      ) {
        const dispatchObj =
          latestDispatchFormData?.formSamples?.find((obj) => {
            return formSample?.displayIndex === obj?.sample?.displayIndex;
          }) ?? {};

        const formField = [...dispatchObj?.formFields]?.find((obj) => {
          return obj?.formFieldId === data?.id;
        });
        let finalData;
        if (isEmpty(formField)) {
          finalData = {
            ...dispatchObj,
            formFields: [
              ...dispatchObj?.formFields,
              {
                id: 0,
                dispatchFormId: 0,
                formFieldId: data?.id,
                textValue: text,
                isRequired: data?.isRequired,
              },
            ],
          };
        } else {
          finalData = {
            ...dispatchObj,
            formFields: [...dispatchObj?.formFields]?.map((obj) => {
              if (obj?.formFieldId === data?.id) {
                return {...obj, textValue: text, isRequired: data?.isRequired};
              }
              return obj;
            }),
          };
        }

        const finalFormSample = [...latestDispatchFormData?.formSamples]?.map(
          (obj) => {
            if (formSample?.displayIndex === obj?.sample?.displayIndex) {
              return finalData;
            } else {
              return obj;
            }
          },
        );

        dispatch(
          setDispatchFormData({
            ...latestDispatchFormData,
            formSamples: finalFormSample,
          }),
        );
      } else {
        const formField = [...latestDispatchFormData?.formFields]?.find(
          (obj) => {
            return obj?.formFieldId === data?.id;
          },
        );
        let finalData;
        if (isEmpty(formField)) {
          finalData = {
            ...latestDispatchFormData,
            formFields: [
              ...latestDispatchFormData?.formFields,
              {
                id: 0,
                dispatchFormId: 0,
                formFieldId: data?.id,
                textValue: text,
                isRequired: data?.isRequired,
              },
            ],
          };
        } else {
          finalData = {
            ...latestDispatchFormData,
            formFields: [...latestDispatchFormData?.formFields]?.map((obj) => {
              if (obj?.formFieldId === data?.id) {
                return {...obj, textValue: text, isRequired: data?.isRequired};
              }
              return obj;
            }),
          };
        }

        dispatch(setDispatchFormData(finalData));
      }
    }
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
        { data.tooltipText && <Info content={`${data.tooltipText}`}/>}
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
        data={arrData?.map((item) => {
          return {label: item, value: item};
        })}
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
