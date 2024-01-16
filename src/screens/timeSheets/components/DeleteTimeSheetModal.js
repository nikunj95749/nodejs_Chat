import React, {useEffect, useState} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import Modal from 'react-native-modal';

import CloseRed from '../../../assets/images/CloseRed.svg';
import DeleteBig from '../../../assets/images/DeleteBig.svg';

import {
  DARK_GRAY_15,
  LIGHT_GRAY_5,
  responsiveScale,
  WHITE,
  WINDOW_WIDTH,
} from '../../../styles';
import {TxtPoppinMedium} from '../../../components/text/TxtPoppinMedium';
import {TextInputWithIcon} from '../../../components/tetInput/TextInputWithIcon';
import {ActionButton} from '../../../components/buttons/ActionButton';
import { RFValue } from 'react-native-responsive-fontsize';

export default function DeleteTimeSheetModal({
  isOpenModal,
  onModalClose,
  onPressSignInButton = () => {},
  onPressYes = () => {},
  onPressNo = () => {},
}) {

  return (
    <Modal
      isVisible={isOpenModal}
      onBackdropPress={onModalClose}
      onBackButtonPress={onModalClose}
      animationIn={'slideInUp'}
      animationOutTiming={500}
      backdropTransitionOutTiming={0}
      hasBackdrop={true}
      backdropOpacity={0.3}>
      <>
        <View
          style={{
            width: WINDOW_WIDTH / 1.35,
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
          <View
            style={{
              width: '30%',
              aspectRatio: 1.3,
              alignSelf: 'center',
            }}>
            <DeleteBig width={'100%'} height={'100%'} />
          </View>
          <TxtPoppinMedium
            style={{
              textAlign: 'center',
              fontWeight: '600',
              fontSize: RFValue(20),
            }}
            title={'Are you sure?'}
          />

          <TxtPoppinMedium
            style={{
              textAlign: 'center',
              fontSize: RFValue(14),
              color: DARK_GRAY_15,
              paddingHorizontal: 20,
            }}
            title={
              'Are you sure you want to Delete this Record?  This process cannot be indone.'
            }
          />
          <View
            style={{
              width: '100%',
              paddingHorizontal: 40,
              flexDirection: 'row',
              marginBottom: 40,
              marginTop: 25,
            }}>
            <ActionButton
              onPress={onPressYes}
              title="Yes"
              style={{
                height: '100%',
                flex: 1,
                marginRight: 20,
              }}
            />
            <ActionButton
              onPress={onPressNo}
              title="No"
              style={{
                height: 60,
                flex: 1,
                backgroundColor: LIGHT_GRAY_5,
              }}
            />
          </View>
        </View>
      </>
      
    </Modal>
  );
}

const styles = StyleSheet.create({});
