import {isEmpty} from 'lodash';
import React, {useCallback, useEffect, useState} from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  TextInput,
  Alert,
  Text,
  FlatList,
} from 'react-native';
import Modal from 'react-native-modal';
import {useDispatch, useSelector} from 'react-redux';
import Copy from '../assets/images/Copy.svg';
import Edit from '../assets/images/Edit.svg';
import AddSummary from '../assets/images/AddSummary.svg';

import {FloatingActionButton} from '../components/buttons/FloatingActionButton';
import store from '../../store/configureStore';
import {
  setDispatchFormData,
  setFormValidation,
  setSummary,
} from '../../store/form';

import {
  DARK_GRAY,
  LIGHT_GRAY,
  ORANGE,
  RED,
  responsiveScale,
  WHITE,
  WINDOW_HEIGHT,
  WINDOW_WIDTH,
  BLACK,
} from '../styles';
import {replaceAll} from '../helpers/logging';
import {TxtPoppinMedium} from './text/TxtPoppinMedium';
import {TxtPoppinSemiBold} from './text/TxtPoppinSemiBold';
import {useNavigation} from '@react-navigation/native';
import { RFValue } from 'react-native-responsive-fontsize';
import Info from './Info';

export default function TextArea({data, formSample = {}}) {
  const summaryList = useSelector((state) => state.form?.summaryList ?? '');
  const [txtValue, setTxtValue] = useState('');
  const [isValidateText, setIsValidateText] = useState(true);
  const [isShowSummaryModal, setIsShowSummaryModal] = useState(false);
  const navigation = useNavigation();

  const arrCopyPriorFormFieldData = useSelector(
    (state) => state.form?.arrCopyPriorFormFieldData ?? [],
  );

  const isTriggerValidation = useSelector(
    (state) => state.form?.isValidate ?? {},
  );

  const dispatchFormData = useSelector(
    (state) => state.form?.dispatchFormData ?? {},
  );
  const dispatch = useDispatch();

  useEffect(() => {
    if (isTriggerValidation === true) {
      dispatch(setFormValidation(false));
      if (isEmpty(txtValue) && data?.isRequired === true) {
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
      const formField = [...(dispatchObj?.formFields ?? [])]?.find((obj) => {
        return obj?.formFieldId === data?.id;
      });
      setTxtValue(formField?.textValue ?? '');
    } else {
      if (!isEmpty(latestDispatchFormData?.formFields)) {
        const formField = [...latestDispatchFormData?.formFields]?.find(
          (obj) => {
            return obj?.formFieldId === data?.id;
          },
        );
        setTxtValue(formField?.textValue ?? '');
      }
    }
  }, [isEmpty(dispatchFormData?.formFields)]);

  const onPressCopy = () => {
    Alert.alert(
      'Are you sure to load Form Prior information?',
      'It operation will override your some existing information.',
      [
        {
          text: 'Yes',
          onPress: () => {
            if (arrCopyPriorFormFieldData?.length > 0) {
              const findCopyObject = arrCopyPriorFormFieldData?.find(
                (obj) => obj?.FormFieldId === data?.id,
              );

              if (!isEmpty(findCopyObject)) {
                onChange(replaceAll(findCopyObject?.TextValue, '\r', '\n'));
              }
            }
          },
        },
        {
          text: 'No',
        },
      ],
    );
  };

  const onPressAddSummary = () => {
    setIsShowSummaryModal(true);
  };

  const onChange = (text) => {
    setIsValidateText(true);
    setTxtValue(text);
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
              return {
                ...obj,
                textValue: text,
                isRequired: data?.isRequired,
              };
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
              return {
                ...obj,
                textValue: text,
                isRequired: data?.isRequired,
              };
            }
            return obj;
          }),
        };
      }
      dispatch(setDispatchFormData(finalData));
    }
  };

  const onTextLayout = useCallback((e) => {
    if (data?.name === 'Summary') {
      dispatch(
        setSummary({styleJson: data?.styleJson, txtValue: e.nativeEvent}),
      );
    }

    // setShowMore(e.nativeEvent.lines.length > NUM_OF_LINES);
  }, []);

  const onModalClose = () => {
    setIsShowSummaryModal(false);
  };

  const SummaryListItem = ({item = {}, index}) => {
    return (
      <TouchableOpacity
        onPress={() => {
          onChange(replaceAll(item?.body, '\r', '\n'));
          setIsShowSummaryModal(false);
        }}
        style={{
          minHeight: 60,
          marginBottom: 20,
          marginHorizontal: 20,
          backgroundColor: WHITE,
          borderRadius: 10,
          shadowColor: '#000',
          shadowOffset: {width: 0, height: 1},
          shadowOpacity: 0.2,
          marginBottom: 10,
          elevation: 2,
        }}>
        <View
          style={{
            flex: 1,
            justifyContent: 'space-between',
            flexDirection: 'row',
          }}>
          <View>
            <TxtPoppinSemiBold
              style={{
                marginTop: 15,
                marginLeft: 10,
                fontSize: RFValue(13),
                color: BLACK,
              }}
              title={item?.title}
            />
            <TxtPoppinMedium
              style={{
                marginBottom: 10,
                marginLeft: 10,
                fontSize: RFValue(13),
                color: BLACK,
              }}
              title={item?.body}
              props={{numberOfLines: 3}}
            />
          </View>
          <TouchableOpacity
            onPress={() => {
              setIsShowSummaryModal(false);
              navigation.navigate('AddSummaryScreen', {routeData: item});
            }}
            style={{marginTop: 10, marginRight: 10}}>
            <Edit />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };
  return (
    <View>
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
      <View
        style={{
          height:
            data?.styleJson != null
              ? data?.styleJson?.height
                ? data?.styleJson?.height
                : 120
              : 120,
          width: '100%',
          paddingLeft: 10,
          backgroundColor: WHITE,
          borderWidth: 1,
          borderColor: isValidateText ? LIGHT_GRAY : RED,
          borderRadius: 10,
          paddingBottom: 5,
          flexDirection: 'row',
        }}>
        <TextInput
          multiline
          autoCorrect={true}
          placeholder={data?.placeholder}
          placeholderTextColor={DARK_GRAY}
          onChangeText={(txt) => onChange(txt)}
          value={txtValue}
          style={{flex: 1}}
        />
        <View>
          {data?.name === 'Summary' ? (
            <TouchableOpacity
              onPress={onPressCopy}
              style={{
                height: 35,
                width: 35,
                marginRight: 10,
                marginTop: 5,
                marginLeft: 10,
              }}>
              <Copy height={'100%'} width={'100%'} />
            </TouchableOpacity>
          ) : null}
          {/* AddSummary */}
          {data?.name === 'Summary' ? (
            <TouchableOpacity
              onPress={onPressAddSummary}
              style={{
                height: 35,
                width: 35,
                marginRight: 10,
                marginTop: 5,
                marginLeft: 10,
              }}>
                <AddSummary width={'100%'} height={'100%'}/>
              </TouchableOpacity>
          ) : null}
        </View>
      </View>
      {data?.name === 'Summary' && (
        <View style={{height: 0, overflow: 'hidden'}}>
          <Text
            onTextLayout={onTextLayout}
            style={{width: 750, fontSize: 10.5, position: 'absolute'}}>
            {txtValue}
          </Text>
        </View>
      )}

      <Modal
        isVisible={isShowSummaryModal}
        onBackdropPress={onModalClose}
        onBackButtonPress={onModalClose}
        animationIn={'slideInUp'}
        animationOutTiming={500}
        backdropTransitionOutTiming={0}
        hasBackdrop={true}
        backdropOpacity={0.3}>
        <View
          style={{
            width: WINDOW_WIDTH - 120,
            borderRadius: 20,
            minHeight: 300,
            maxHeight: WINDOW_HEIGHT - 150,
            overflow: 'hidden',
            backgroundColor: WHITE,
            alignSelf: 'center',
          }}>
          <View
            style={{
              width: '100%',
              height: 90,
              backgroundColor: ORANGE,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <TxtPoppinMedium
              style={{fontSize: RFValue(18), color: WHITE}}
              title={'Summary List'}
            />
          </View>
          <FlatList
            data={summaryList}
            style={{paddingBottom: 20, paddingTop: 20}}
            ListEmptyComponent={() => (
              <View
                style={{
                  width: '100%',
                  height: 300,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <TxtPoppinMedium
                  style={{fontSize: RFValue(20)}}
                  title={'Empty List'}
                />
              </View>
            )}
            renderItem={({item, index}) => <SummaryListItem item={item} />}
            keyExtractor={(item, index) => index}
          />
          <TouchableOpacity
            onPress={()=>{
              setIsShowSummaryModal(false);
              navigation.navigate('AddSummaryScreen');
            }}
            style={{
              height: 70,
              width: '90%',
              marginTop: 25,
              marginBottom: 25,
              borderRadius: 10,
              justifyContent: 'center',
              alignItems: 'center',
              alignSelf:'center',
              backgroundColor: ORANGE,
            }}>
              <TxtPoppinMedium style={{color: WHITE}} title="Add New" />
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  addAndCancelButtonView: {
    height: 70,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: ORANGE,
  },
});
