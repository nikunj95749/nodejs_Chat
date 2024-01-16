import React, {useCallback, useEffect, useState} from 'react';
import {StyleSheet, TouchableOpacity, View, ScrollView, FlatList} from 'react-native';
import Modal from 'react-native-modal';
import CloseRed from '../assets/images/CloseRed.svg';

import {LIGHT_GRAY, WHITE, WINDOW_HEIGHT, WINDOW_WIDTH} from '../styles';
import {TxtPoppinMedium} from './text/TxtPoppinMedium';
import {ActionButton} from './buttons/ActionButton';
import {DropDownMenu} from './filters/DropDownMenu';
import {isEmpty} from 'lodash';
import {useSelector} from 'react-redux';
import {RFValue} from 'react-native-responsive-fontsize';
import SegmentedControl from '@react-native-segmented-control/segmented-control';
import store from '../../store/configureStore';
export default function CategoryOptionsModal({
  isOpenModal,
  name = '',
  onModalClose,
  onPressAddButton = () => {},
  onPressNo = () => {},
  edititem = null,
}) {
  const [isLoading, setIsLoading] = useState(false);
  const formSampleFilteredData = useSelector((state) =>
    (state.form?.formSampleFilteredData ?? [])?.filter((obj) =>
      obj?.formSample?.category?.includes(name),
    ),
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

  const SwitchCcontroller = useCallback(({item}) => {
    const arrFilterFormSamples = [
      ...store?.getState()?.form?.dispatchFormData?.formSamples,
    ]?.filter((obj) => {
      return obj?.sample?.formSampleId === item?.formSample?.id;
    });
    return (
      <SegmentedControl
        values={['Yes', 'No']}
        selectedIndex={isEmpty(arrFilterFormSamples) ? 1 : 0}
        fontStyle={{
          fontFamily: 'Poppins-Medium',
          fontSize: RFValue(9),
        }}
        style={{
          height: 30,
          width: 150,
        }}
        onChange={(event) => {
          if (event.nativeEvent.selectedSegmentIndex == 0) {
            onPressAddButton(item);
          } else {
            onPressNo(item);
          }
        }}
      />
    );
  }, []);

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
            width: WINDOW_WIDTH - 40,
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
            title={'Add Sample'}
          />

          <View
            style={{
              marginHorizontal: 30,
              marginTop: 10,
              marginBottom: 20,
              // maxHeight: WINDOW_HEIGHT - 100,
            }}>
            {isOpenModal && formSampleFilteredData?.length > 0 && (
              <FlatList
                data={formSampleFilteredData}
                renderItem={({item}) => (
                  <View
                    style={{
                      minHeight: 45,
                      flexDirection: 'row',
                      alignItems: 'center',
                      flex: 1,
                    }}>
                    <TxtPoppinMedium
                      style={{
                        fontSize: RFValue(11),
                      }}
                      title={item?.formSample?.title}
                    />
                    {item?.formSample?.isRequired ? (
                      <TxtPoppinMedium
                        style={{
                          fontSize: RFValue(11),
                          color: RED,
                        }}
                        title={'*'}
                      />
                    ) : null}
                    <View style={{flex: 1}}></View>

                    <SwitchCcontroller item={item} />
                  </View>
                )}
                estimatedItemSize={200}
              />
            )}
          </View>
        </View>
      </>
    </Modal>
  );
}

const styles = StyleSheet.create({});
