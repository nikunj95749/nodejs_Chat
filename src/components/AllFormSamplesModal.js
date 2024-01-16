import React, {useEffect, useState} from 'react';
import {StyleSheet, TouchableOpacity, View, ScrollView} from 'react-native';
import Modal from 'react-native-modal';
import CloseRed from '../assets/images/CloseRed.svg';

import {LIGHT_GRAY, WHITE, WINDOW_HEIGHT, WINDOW_WIDTH} from '../styles';
import {TxtPoppinMedium} from './text/TxtPoppinMedium';
import {ActionButton} from './buttons/ActionButton';
import {DropDownMenu} from './filters/DropDownMenu';
import {isEmpty} from 'lodash';
import {useSelector} from 'react-redux';
import {RFValue} from 'react-native-responsive-fontsize';

export default function AllFormSamplesModal({
  isOpenModal,
  onModalClose,
  onPressAddButton = () => {},
  edititem = null,
}) {
  const [isLoading, setIsLoading] = useState(false);
  const formSampleFilteredData = useSelector(
    (state) => state.form?.formSampleFilteredData ?? [],
  );
  const [sampleDetails, setSampleDetails] = useState({});

  useEffect(() => {
    if (isOpenModal) {
      setSampleDetails({});
    }
  }, [isOpenModal]);

  const onProgressAddButton = async () => {
    try {
      if (!isEmpty(sampleDetails)) {
        onPressAddButton(
          formSampleFilteredData?.find((obj) => {
            return obj?.formSample?.id === sampleDetails?.value;
          }),
        );
      } else {
      }
    } catch (error) {
      console.log('onProgressAddButton error: ', error);
    } finally {
      setIsLoading(false);
    }
  };

  const onPressCloseModal = async () => {
    try {
      setSampleDetails();
      onModalClose();
    } catch (error) {
      console.log('onProgressAddButton error: ', error);
    } finally {
    }
  };

  return (
    <Modal
      isVisible={isOpenModal}
      onBackdropPress={onPressCloseModal}
      onBackButtonPress={onPressCloseModal}
      animationIn={'slideInUp'}
      animationOutTiming={500}
      backdropTransitionOutTiming={0}
      hasBackdrop={true}
      backdropOpacity={0.3}>
      <>
        <View
          style={{
            width: WINDOW_WIDTH - 150,
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
              onPress={onPressCloseModal}
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
            title={'Add Checklist'}
          />

          <View
            style={{
              marginHorizontal: 60,
              marginTop: 10,
              maxHeight: WINDOW_HEIGHT - 100,
            }}>
            <ScrollView>
              <DropDownMenu
                selectedTextStyle={{fontSize: RFValue(15)}}
                placeholderStyle={{fontSize: RFValue(15)}}
                data={
                  !!formSampleFilteredData
                    ? formSampleFilteredData?.map((item) => {
                        return {
                          label: item?.formSample?.title ?? '',
                          value: item?.formSample?.id ?? '',
                        };
                      })
                    : []
                }
                // defaultValue={state?.orderNumber}
                onChangeItem={(item) => {
                  setSampleDetails(item);
                }}
                style={{
                  width: '100%',
                  height: 70,
                  borderColor: LIGHT_GRAY,
                  borderWidth: 1,
                  marginTop: 20,
                }}
                placeHolder={'Select Checklist'}
              />

              <ActionButton
                onPress={() => {
                  onProgressAddButton();
                }}
                isDisable={isEmpty(sampleDetails)}
                isLoading={isLoading}
                title={!isEmpty(edititem) ? 'Update' : 'Add'}
                style={{
                  marginTop: 20,
                  alignSelf: 'center',
                  height: 70,
                  marginBottom: 30,
                }}
              />
            </ScrollView>
          </View>
        </View>
      </>
    </Modal>
  );
}

const styles = StyleSheet.create({});
