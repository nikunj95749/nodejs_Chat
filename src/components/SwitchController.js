import {isEmpty} from 'lodash';
import React, {useEffect, useMemo, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {setDispatchFormData, setFormValidation} from '../../store/form';
import SegmentedControl from '@react-native-segmented-control/segmented-control';
import {RFValue} from 'react-native-responsive-fontsize';

import {RED, responsiveScale} from '../styles';
import {TxtPoppinMedium} from './text/TxtPoppinMedium';
import store from '../../store/configureStore';
import Info from './Info';

const SwitchController = ({data, formSample = {}}) => {
  const arrData = useMemo(() => {
    return JSON.parse(data?.options);
  }, []);
  const [selectedSegmentIndex, setSelectedSegmentIndex] = useState(null);
  const [isValidateText, setIsValidateText] = useState(true);
  // const dispatchFormData = useSelector(
  //   (state) => state.form?.dispatchFormData ?? {},
  // );
  const dispatch = useDispatch();

  const isTriggerValidation = useSelector(
    (state) => state.form?.isValidate ?? {},
  );

  const formSampleData = useSelector(
    (state) => state.form?.formSampleData ?? [],
  );

  useEffect(() => {
    if (isTriggerValidation === true) {
      dispatch(setFormValidation(false));
      if (selectedSegmentIndex === null && data?.isRequired === true) {
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
          setSelectedSegmentIndex(arrData?.indexOf(formField?.textValue));
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
          setSelectedSegmentIndex(arrData?.indexOf(formField?.textValue));
        }
      }
    }
  }, [store?.getState()?.form?.dispatchFormData]);

  const onChange = (index) => {
    if (index == 0) {
      const findFormSample = formSampleData?.find((obj) => {
        return data?.name?.includes(obj?.formSample?.name);
      });

      if (!isEmpty(findFormSample)) {
        let duplicateDispatchdata = {
          ...store.getState().form?.dispatchFormData,
        };
        const oldFormSamples =
          store?.getState()?.form?.dispatchFormData?.formSamples;
        const arrLatestList = [
          ...oldFormSamples,
          {
            sample: {
              id: 0,
              dispatchFormId: duplicateDispatchdata?.form?.id,
              formSampleId: findFormSample?.formSample?.id,
              displayIndex: oldFormSamples?.length ?? 0 + 1,
            },
            formFields: [],
            formFiles: [],
          },
        ];

        const finalDispatchData = {
          ...store?.getState()?.form?.dispatchFormData,
          formSamples: arrLatestList,
        };

        dispatch(setDispatchFormData(finalDispatchData));
        
      }
    } else {
      const findFormSample = formSampleData?.find((obj) => {
        return data?.name?.includes(obj?.formSample?.name);
      });
      if (!isEmpty(findFormSample)) {
        const arrFilterFormSamples = store
          ?.getState()
          ?.form?.dispatchFormData?.formSamples?.filter((obj) => {
            return obj?.sample?.formSampleId !== findFormSample?.formSample?.id;
          });
        const finalDispatchData = {
          ...store?.getState()?.form?.dispatchFormData,
          formSamples: arrFilterFormSamples,
        };

        dispatch(setDispatchFormData(finalDispatchData));
        
      }
      
    }

    let formField = [];
    setIsValidateText(true);
    const latestDispatchFormData = store?.getState()?.form?.dispatchFormData;
    if (
      !isEmpty(formSample) &&
      latestDispatchFormData?.formSamples?.length > 0
    ) {
      const dispatchObj =
        [...latestDispatchFormData?.formSamples]?.find((obj) => {
          return formSample?.displayIndex === obj?.sample?.displayIndex;
        }) ?? {};

      if (!isEmpty(dispatchObj?.formFields)) {
        formField = [...dispatchObj?.formFields]?.find((obj) => {
          return obj?.formFieldId === data?.id;
        });
      }

      let finalData;
      if (isEmpty(formField)) {
        finalData = {
          ...dispatchObj,
          formFields: [
            ...(dispatchObj?.formFields ?? []),
            {
              id: 0,
              dispatchFormId: 0,
              formFieldId: data?.id,
              textValue: arrData?.[index],
            },
          ],
        };
      } else {
        finalData = {
          ...dispatchObj,
          formFields: [...dispatchObj?.formFields]?.map((obj) => {
            if (obj?.formFieldId === data?.id) {
              return {...obj, textValue: arrData?.[index]};
            }
            return obj;
          }),
        };
      }

      const finalFormSample = latestDispatchFormData?.formSamples?.map(
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
      if (!isEmpty(latestDispatchFormData?.formFields)) {
        formField = [...latestDispatchFormData?.formFields]?.find((obj) => {
          return obj?.formFieldId === data?.id;
        });
      }

      let finalData;
      if (isEmpty(formField)) {
        finalData = {
          ...latestDispatchFormData,
          formFields: [
            ...(latestDispatchFormData?.formFields ?? []),
            {
              id: 0,
              dispatchFormId: 0,
              formFieldId: data?.id,
              textValue: arrData?.[index],
            },
          ],
        };
      } else {
        finalData = {
          ...latestDispatchFormData,
          formFields: [...latestDispatchFormData?.formFields]?.map((obj) => {
            if (obj?.formFieldId === data?.id) {
              return {...obj, textValue: arrData?.[index]};
            }
            return obj;
          }),
        };
      }
      dispatch(setDispatchFormData(finalData));
    }
  };

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        minHeight: 40,
        marginBottom: 5,
      }}>
      <View style={{minHeight: 30, flexDirection: 'row', flex: 1}}>
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
        { data.tooltipText && <Info content={`${data.tooltipText}`} style={{marginLeft:2}} />}
      </View>

      <View
        style={{
          height: 30,
          paddingLeft: 7,
        }}>
        <SegmentedControl
          values={arrData}
          selectedIndex={selectedSegmentIndex}
          fontStyle={{
            fontFamily: 'Poppins-Medium',
            fontSize: RFValue(9),
          }}
          style={{
            height: 30,
            width: 150,
            borderWidth: 1,
            borderColor: isValidateText ? 'rgba(0,0,0,0)' : RED,
            alignSelf: 'flex-end',
          }}
          onChange={(event) => {
            onChange(event.nativeEvent.selectedSegmentIndex);
            setSelectedSegmentIndex(event.nativeEvent.selectedSegmentIndex);
          }}
        />
      </View>
    </View>
  );
};
export default SwitchController;
const styles = StyleSheet.create({});
