import {isEmpty} from 'lodash';
import React, {useEffect, useMemo, useState} from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  TextInput,
  Image,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {setDispatchFormData} from '../../store/form';

import {DARK_GRAY, ORANGE, responsiveScale, WHITE} from '../styles';
import {TxtPoppinMedium} from './text/TxtPoppinMedium';
import store from '../../store/configureStore';
import { RFValue } from 'react-native-responsive-fontsize';
import Info from './Info';

const CheckBoxes = ({
  data,
  isFromTable = false,
  isEnableEdit = false,
  onChangeTextValue = () => {},
  value,
  formSample = {},
}) => {
  const arrData = useMemo(() => {
    return data?.options
      ? JSON.parse(data?.options)?.map((obj) => {
          return {key: obj, value: false, txt: '', fieldType: 'CheckList'};
        })
      : [];
  }, []);
  const [arrDataUpdatedData, setArrDataUpdatedData] = useState(arrData);

  const [txtOtherText, setTxtOtherText] = useState('');

  const dispatchFormData = useSelector(
    (state) => state.form?.dispatchFormData ?? {},
  );
  const dispatch = useDispatch();

  useEffect(() => {
    if (isFromTable === true) {
      if (isEnableEdit === true) {
        if (!isEmpty(value)) {
          setTimeout(() => {
            if (isJsonString(value)) {
              let arr = JSON.parse(value);

              let OtherText = [...arr]?.find((obj) => {
                return obj?.key === 'OtherWithText';
              });
              setTxtOtherText(OtherText?.txt);
              setArrDataUpdatedData(arr);
            } else {
              setArrDataUpdatedData(JSON.parse(value));
              onChange(JSON.parse(value));
            }
          }, 500);
        }
      } else {
        onChange(arrData);
        setArrDataUpdatedData(arrData);
      }
    }
  }, [value]);

  function isJsonString(str) {
    try {
      JSON.parse(str);
    } catch (e) {
      return false;
    }
    return true;
  }

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
          if (!isEmpty(formField?.textValue)) {
            if (isJsonString(formField?.textValue)) {
              let arr = JSON.parse(formField?.textValue);

              let OtherText = [...arr]?.find((obj) => {
                return obj?.key === 'OtherWithText';
              });
              setTxtOtherText(OtherText?.txt);
              setArrDataUpdatedData(arr);
            } else {
              onChange(arrData);
              setArrDataUpdatedData(arrData);
            }
          } else {
            onChange(arrData);
            setArrDataUpdatedData(arrData);
          }
        } else {
          onChange(arrData);
        }
      } else {
        if (!isEmpty(dispatchFormData?.formFields)) {
          const formField = [...dispatchFormData?.formFields]?.find((obj) => {
            return obj?.formFieldId === data?.id;
          });
          if (!isEmpty(formField?.textValue)) {
            if (isJsonString(formField?.textValue)) {
              let arr = JSON.parse(formField?.textValue);

              let OtherText = [...arr]?.find((obj) => {
                return obj?.key === 'OtherWithText';
              });
              setTxtOtherText(OtherText?.txt);
              setArrDataUpdatedData(arr);
            } else {
              onChange(arrData);
              setArrDataUpdatedData(arrData);
            }
          } else {
            onChange(arrData);
            setArrDataUpdatedData(arrData);
          }
        } else {
          onChange(arrData);
        }
      }
    }
  }, [isEmpty(dispatchFormData)]);

  const onChange = (arrMapedData) => {
    if (isFromTable === true) {
      onChangeTextValue({
        value: JSON.stringify(arrMapedData),
        id: data?.id,
        fieldType: 'CheckList',
      });
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
                textValue: JSON.stringify(arrMapedData),
              },
            ],
          };
        } else {
          finalData = {
            ...dispatchObj,
            formFields: [...dispatchObj?.formFields]?.map((obj) => {
              if (obj?.formFieldId === data?.id) {
                return {...obj, textValue: JSON.stringify(arrMapedData)};
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
                textValue: JSON.stringify(arrMapedData),
              },
            ],
          };
        } else {
          finalData = {
            ...latestDispatchFormData,
            formFields: [...latestDispatchFormData?.formFields]?.map((obj) => {
              if (obj?.formFieldId === data?.id) {
                return {...obj, textValue: JSON.stringify(arrMapedData)};
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
    <View style={{width: '100%'}}>
      <TxtPoppinMedium
        style={{
          fontSize: RFValue(12),
        }}
        title={data?.title}
      />
      <View
        style={{
          minHeight: 50,
          flex: 1,
          paddingLeft: 10,
          alignItems: 'center',
          flexDirection: 'row',
          flexWrap: 'wrap',
        }}>
        {arrDataUpdatedData?.map((obj, index) => {
          return (
            <TouchableOpacity
              onPress={() => {
                let arrMapedData = arrDataUpdatedData?.map((item, i) => {
                  if (i === index) {
                    if (item?.value === obj?.value) {
                      return {...item, value: !obj?.value};
                    }
                  }

                  return item;
                });
                setArrDataUpdatedData(arrMapedData);
                onChange(arrMapedData);
              }}
              style={{
                flexDirection: 'row',
                height: 50,
                alignItems: 'center',
                marginRight: 10,
              }}>
              {obj?.key === 'OtherWithText' ? (
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <View
                    style={{
                      height: 20,
                      width: 20,
                      marginRight: 10,
                    }}>
                    {obj?.value === true ? (
                      <Image
                        source={require('./../assets/images/CheckedCheckBox.png')}
                        style={{width: '100%', height: '100%'}}
                      />
                    ) : (
                      <Image
                        source={require('./../assets/images/UnCheckedCheckBox.png')}
                        style={{width: '100%', height: '100%'}}
                      />
                    )}
                  </View>
                  <TxtPoppinMedium
                    style={{marginTop: 0, fontSize: RFValue(11)}}
                    title={'Other'}
                  />
                  { data.tooltipText && <Info content={`${data.tooltipText}`}/>}

                  <View
                    style={{
                      height: 40,
                      width: 200,
                      marginLeft: 10,
                      backgroundColor: WHITE,
                      borderRadius: 10,
                    }}>
                    <TextInput
                      style={{flex: 1, textAlign: 'center'}}
                      placeholder={'Other Text'}
                      placeholderTextColor={DARK_GRAY}
                      onBlur={(e) => {
                        let arrMapedData = arrDataUpdatedData?.map(
                          (item, i) => {
                            if (i === index) {
                              return {
                                ...item,
                                txt: txtOtherText,
                                value: txtOtherText ? true : false,
                              };
                            }
                            return item;
                          },
                        );
                        setArrDataUpdatedData(arrMapedData);
                        onChange(arrMapedData);
                      }}
                      onChangeText={(txt) => {
                        let arrMapedData = arrDataUpdatedData?.map(
                          (item, i) => {
                            if (i === index) {
                              return {
                                ...item,
                                txt: txt,
                                value: txt ? true : false,
                              };
                            }
                            return item;
                          },
                        );
                        setArrDataUpdatedData(arrMapedData);
                        setTxtOtherText(txt);
                      }}
                      value={txtOtherText}
                    />
                  </View>
                </View>
              ) : (
                <>
                  <View
                    style={{
                      height: 20,
                      width: 20,
                      marginRight: 10,
                    }}>
                    {obj?.value === true ? (
                      <Image
                        source={require('./../assets/images/CheckedCheckBox.png')}
                        style={{width: '100%', height: '100%'}}
                      />
                    ) : (
                      <Image
                        source={require('./../assets/images/UnCheckedCheckBox.png')}
                        style={{width: '100%', height: '100%'}}
                      />
                    )}
                  </View>
                  <TxtPoppinMedium
                    style={{marginTop: 0, fontSize: RFValue(11)}}
                    title={obj?.key}
                  />
                  { data.tooltipText && <Info content={`${data.tooltipText}`}/>}
                </>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};
export default CheckBoxes;
const styles = StyleSheet.create({
  addAndCancelButtonView: {
    height: 70,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: ORANGE,
  },
});
