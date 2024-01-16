import React, {useEffect, useState} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import Modal from 'react-native-modal';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import CloseRed from '../../../assets/images/CloseRed.svg';
import NewFolder from '../../../assets/images/NewFolder.svg';

import {responsiveScale, WHITE, WINDOW_WIDTH} from '../../../styles';
import {TxtPoppinMedium} from '../../../components/text/TxtPoppinMedium';
import {TextInputWithIcon} from '../../../components/tetInput/TextInputWithIcon';
import {ActionButton} from '../../../components/buttons/ActionButton';
import { RFValue } from 'react-native-responsive-fontsize';

export default function NewFolderModal({
  isOpenModal,
  onModalClose,
  onPressAddButton = () => {},
}) {
  const [txtFolderName, setTxtFolderName] = useState('');

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
            <NewFolder width={'100%'} height={'100%'} />
          </View>
          <TxtPoppinMedium
            style={{
              textAlign: 'center',
              fontWeight: '600',
              fontSize: RFValue(15),
            }}
            title={'Add New Folder'}
          />
          <TextInputWithIcon
            value={txtFolderName}
            onChange={setTxtFolderName}
            style={{
              marginTop: 15,
              alignSelf: 'center',
              width: '80%',
              aspectRatio: 7,
            }}
            isShowIcon={false}
            placeholder="Enter Folder Name"
          />
          <ActionButton
            onPress={() => {
              setTxtFolderName('');
              onPressAddButton(txtFolderName);
            }}
            title="Add"
            style={{
              marginTop: 20,
              alignSelf: 'center',
              width: '80%',
              aspectRatio: 7,
              marginBottom: 50,
            }}
          />
        </View>
      </>
    </Modal>
  );
}

const styles = StyleSheet.create({});
