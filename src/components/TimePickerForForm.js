import {isEmpty} from 'lodash';
import moment from 'moment';
import React, {useEffect, useState} from 'react';
import {View, TouchableOpacity} from 'react-native';

import {useDispatch, useSelector} from 'react-redux';
import store from '../../store/configureStore';
import {setDispatchFormData, setFormValidation} from '../../store/form';

import {LIGHT_GRAY, RED, responsiveScale} from '../styles';
import {TxtPoppinMedium} from './text/TxtPoppinMedium';
import {TxtPoppinNormal} from './text/TxtPoppinNormal';
import {RFValue} from 'react-native-responsive-fontsize';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Info from './Info';

export default function TimePickerForForm({
  data,
  isLoadingData,
  formSample = {},
  isDate = false,
}) {
  const [timePickerValue, setTimePickerValue] = useState('');
  const [open, setOpen] = useState(false);
  const [isValidateText, setIsValidateText] = useState(true);

  const dispatch = useDispatch();
  const isTriggerValidation = useSelector(
    (state) => state.form?.isValidate ?? {},
  );

  useEffect(() => {
    if (isTriggerValidation === true) {
      dispatch(setFormValidation(false));
      if (isEmpty(timePickerValue) && data?.isRequired === true) {
        setIsValidateText(false);
        window.isValicationSuccessfully = false;
      } else {
        setIsValidateText(true);
      }
    }
  }, [isTriggerValidation]);

  useEffect(() => {
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
          setTimePickerValue(formField?.textValue);
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
          setTimePickerValue(formField?.textValue);
        }
      }
    }
  }, [isLoadingData]);

  const onChange = (text) => {
    setTimePickerValue(`${text}`);
    setIsValidateText(true);
    const latestDispatchFormData = store.getState().form?.dispatchFormData;
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
      const formField = [...latestDispatchFormData?.formFields]?.find((obj) => {
        return obj?.formFieldId === data?.id;
      });
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
  };
  return (
    <TouchableOpacity
      onPress={() => {
        setOpen(true);
      }}
      style={{height: 110, paddingVertical: 10, flex: 1}}>
      <View
        style={{
          flex: 1,
          borderRadius: 10,
          borderWidth: 2,
          borderColor: isValidateText ? LIGHT_GRAY : RED,
          backgroundColor: 'white',
        }}>
        <View
          style={{
            flexDirection: 'row',
            height: 35,
            alignItems: 'center',
            justifyContent: 'center',
            borderColor: isValidateText ? LIGHT_GRAY : RED,
            borderBottomWidth: 2,
            width: '100%',
          }}>
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

        <View
          style={{
            height: 55,
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
          }}>
          <TxtPoppinNormal
            style={{
              fontSize: RFValue(13),
            }}
            title={
              timePickerValue
                ? isDate
                  ? moment(timePickerValue, 'DD-MM-YYYY h:mm a').format(
                      'MM/DD/YYYY',
                    )
                  : moment(timePickerValue, 'DD-MM-YYYY h:mm a').format(
                      'h:mm a',
                    )
                : ''
            }
          />
        </View>
      </View>
      <DateTimePickerModal
        isVisible={open}
        minuteInterval={15}
        mode={isDate ? 'date' : 'time'}
        date={new Date()}
        onConfirm={(d) => {
          setOpen(false);
          onChange(moment(d).format('DD-MM-YYYY h:mm a'));
        }}
        onCancel={() => {
          setOpen(false);
        }}
      />
    </TouchableOpacity>
  );
}
