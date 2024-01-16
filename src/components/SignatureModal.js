import React, {useEffect, useRef, useState} from 'react';
import {StyleSheet, TouchableOpacity, View, Image} from 'react-native';
import Modal from 'react-native-modal';
import CloseRed from '../assets/images/CloseRed.svg';
import {
  BLACK,
  LIGHT_GRAY,
  ORANGE,
  RED,
  responsiveScale,
  WHITE,
  WINDOW_HEIGHT,
  WINDOW_WIDTH,
} from '../styles';
import {TxtPoppinMedium} from './text/TxtPoppinMedium';
import SignatureCapture from 'react-native-signature-capture';
import {TxtPoppinNormal} from './text/TxtPoppinNormal';
import {useDispatch, useSelector} from 'react-redux';
import store from '../../store/configureStore';
import {isEmpty} from 'lodash';
import {setDispatchFormData, setFormValidation} from '../../store/form';
import {RFValue} from 'react-native-responsive-fontsize';
import Info from './Info';

export default function SignatureModal({data = {}, formSample = {}}) {
  const refSignature = useRef();
  const [isShowSignatureModal, setIsShowSignatureModal] = useState(false);
  const [signature, setSignature] = useState('');
  const [isValidateText, setIsValidateText] = useState(true);

  const dispatchFormData = useSelector(
    (state) => state.form?.dispatchFormData ?? {},
  );
  const isTriggerValidation = useSelector(
    (state) => state.form?.isValidate ?? {},
  );
  const dispatch = useDispatch();

  useEffect(() => {
    if (isTriggerValidation === true) {
      dispatch(setFormValidation(false));
      if (
        isEmpty(signature) &&
        (data?.isRequired === true || store.getState().form?.selectedFormItem?.IsClientSignReq == true)
      ) {
        setIsValidateText(false);
        window.isValicationSuccessfully = false;
      } else {
        setIsValidateText(true);
      }
    }
  }, [isTriggerValidation]);

  function _onSaveEvent(result, isfromUseEffect = false) {
    const latestDispatchFormData = store?.getState()?.form?.dispatchFormData;
    if (
      !isEmpty(formSample) &&
      latestDispatchFormData?.formSamples?.length > 0
    ) {
      const dispatchObj =
        latestDispatchFormData?.formSamples?.find((obj) => {
          return formSample?.displayIndex === obj?.sample?.displayIndex;
        }) ?? {};

      const formField = [...dispatchObj?.formFiles]?.find((obj) => {
        return obj?.formFieldId === data?.id;
      });
      let finalData;
      if (isEmpty(formField)) {
        finalData = {
          ...dispatchObj,
          formFiles: [
            {
              id: 0,
              dispatchFormId: data?.formId,
              formFieldId: data?.id,
              fileType: 'image/png',
              fileData: null,
              fileDataBase64: result?.encoded,
              masterId: 0,
              remarks: 'string',
            },
            ...dispatchObj?.formFiles,
          ],
        };
      } else {
        finalData = {
          ...dispatchObj,
          formFiles: [...dispatchObj?.formFiles]?.map((obj) => {
            if (obj?.formFieldId === data?.id) {
              return {
                ...obj,
                fileDataBase64: result?.encoded,
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
      const formField = [...latestDispatchFormData?.formFiles]?.find((obj) => {
        return obj?.formFieldId === data?.id;
      });
      let finalData;
      if (isEmpty(formField)) {
        finalData = {
          ...latestDispatchFormData,
          formFiles: [
            {
              id: 0,
              dispatchFormId: data?.formId,
              formFieldId: data?.id,
              fileType: 'image/png',
              fileData: null,
              fileDataBase64: result?.encoded,
              masterId: 0,
              remarks: 'string',
            },
            ...latestDispatchFormData?.formFiles,
          ],
        };
      } else {
        finalData = {
          ...latestDispatchFormData,
          formFiles: [...latestDispatchFormData?.formFiles]?.map((obj) => {
            if (obj?.formFieldId === data?.id) {
              return {
                ...obj,
                fileDataBase64: result?.encoded,
              };
            }
            return obj;
          }),
        };
      }
      dispatch(setDispatchFormData(finalData));
    }

    if (!isfromUseEffect) {
      setSignature(result?.encoded);

      onModalClose();
    }
  }

  const onModalClose = () => {
    setIsShowSignatureModal(false);
  };

  const onPressAdd = () => {
    refSignature.current.saveImage();
  };

  const onPressCancel = () => {
    setIsShowSignatureModal(false);
    onModalClose();
  };

  useEffect(() => {
    if (!isEmpty(formSample) && dispatchFormData?.formSamples?.length > 0) {
      const dispatchObj =
        dispatchFormData?.formSamples?.find((obj) => {
          return formSample?.displayIndex === obj?.sample?.displayIndex;
        }) ?? {};

      if (!isEmpty(dispatchObj?.formFiles)) {
        const formField = [...dispatchObj?.formFiles]?.find((obj) => {
          return obj?.formFieldId === data?.id;
        });
        setSignature(formField?.fileDataBase64);
      }
    } else {
      if (!isEmpty(dispatchFormData?.formFiles)) {
        const formField = [...dispatchFormData?.formFiles]?.find((obj) => {
          return obj?.formFieldId === data?.id;
        });
        setSignature(formField?.fileDataBase64);
      }
    }
  }, [isEmpty(dispatchFormData)]);
  return (
    <View>
      <TouchableOpacity
        onPress={() => {
          setIsShowSignatureModal(true);
        }}
        style={{
          width: 300,
          marginLeft: 0,
          marginTop: 20,
          borderRadius: 5,
          // borderWidth: 2,
        }}>
        <View
          style={{
            width: 300,
            aspectRatio: 3,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Image
            resizeMode={'contain'}
            source={{uri: `data:image/png;base64, ${signature}`}}
            style={{width: '90%', height: '100%'}}
          />
        </View>
        <View
          style={{
            borderTopWidth: 2,
            borderColor: isValidateText ? LIGHT_GRAY : RED,
            // alignItems: 'center',
            flexDirection: 'row',
          }}>
          <TxtPoppinNormal
            style={{
              fontSize: RFValue(11),
            }}
            title={data?.title}
          />
          {data?.isRequired || store.getState().form?.selectedFormItem?.IsClientSignReq == true ? (
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
      </TouchableOpacity>

      <Modal
        isVisible={isShowSignatureModal}
        onBackdropPress={onModalClose}
        onBackButtonPress={onModalClose}
        animationIn={'slideInUp'}
        animationOutTiming={500}
        backdropTransitionOutTiming={0}
        hasBackdrop={false}
        backdropOpacity={0.3}>
        <>
          <View
            style={{
              width: WINDOW_WIDTH - 120,
              borderRadius: 20,
              overflow: 'hidden',
              backgroundColor: WHITE,
              alignSelf: 'center',
            }}>
            <View
              style={{
                width: '100%',
                alignItems: 'flex-end',
              }}>
              <TouchableOpacity
                onPress={onModalClose}
                style={{
                  height: 40,
                  width: 40,
                  marginRight: 30,
                  marginTop: 30,
                }}>
                <CloseRed width={'100%'} height={'100%'} />
              </TouchableOpacity>
            </View>
            <TxtPoppinMedium
              style={{
                textAlign: 'center',
                fontWeight: '600',
                fontSize: RFValue(15),
              }}
              title={'Add Signature'}
            />

            <View
              style={{
                // marginHorizontal: 60,
                borderTopWidth: 2,
                marginTop: 20,
                height: WINDOW_HEIGHT * 0.4,
                width: '100%',
                backgroundColor: 'red',
              }}>
              <SignatureCapture
                style={[{flex: 1}, styles.signature]}
                ref={refSignature}
                onSaveEvent={_onSaveEvent}
                // onDragEvent={this._onDragEvent}
                saveImageFileInExtStorage={false}
                showNativeButtons={false}
                showTitleLabel={false}
                backgroundColor="#ffffff"
                strokeColor="#000000"
                // minStrokeWidth={4}
                // maxStrokeWidth={4}
                viewMode={'portrait'}
              />
            </View>
            <View style={{height: 70, width: '100%', flexDirection: 'row'}}>
              <TouchableOpacity
                onPress={onPressCancel}
                style={styles.addAndCancelButtonView}>
                <TxtPoppinMedium style={{color: WHITE}} title="Cancel" />
              </TouchableOpacity>
              <View
                style={{height: 40, width: 2, backgroundColor: WHITE}}></View>
              <TouchableOpacity
                onPress={onPressAdd}
                style={styles.addAndCancelButtonView}>
                <TxtPoppinMedium style={{color: WHITE}} title="Add" />
              </TouchableOpacity>
            </View>
          </View>
        </>
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
