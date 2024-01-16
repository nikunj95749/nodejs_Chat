import {StyleSheet, Text, View, Modal, TouchableOpacity} from 'react-native';
import React from 'react';
import CloseRed from '../assets/images/CloseRed.svg';

const ConfirmationPopupForSubmitWO = ({
  isVisible = false,
  isAM = null,
  startTime = '',
  endTime = '',
  lunch = '',
  st = '',
  ot = '',
  dt = '',
  ns = '',
  nsot = '',
  nsdt = '',
  handleConfirm = () => {},
  handleEditDetails = () => {},
  onModalClose = () => {},
}) => {
  return (
    <Modal visible={isVisible} transparent={true}>
      <View style={styles.flex}>
        <View style={styles.container}>
          <View
            style={{
              width: '100%',
              alignItems: 'flex-end',
            }}>
            <TouchableOpacity
              onPress={onModalClose}
              style={{
                height: 30,
                width: 30,
                marginRight: 10,
                marginTop: 10,
              }}>
              <CloseRed width={'100%'} height={'100%'} />
            </TouchableOpacity>
          </View>
          <Text style={styles.title}>WO TimeSheet Information</Text>
          {isAM === true && (
            <Text style={styles.content}>
              Warning! both start and end times are in the morning. please check
              your input.
            </Text>
          )}
          {isAM === false && (
            <Text style={styles.content}>
              Warning both start and end times are in evening. Please double
              check your input.
            </Text>
          )}
          <View style={styles.time}>
            <Text style={{fontSize: 18, fontWeight: 'bold'}}>
              Start time:{' '}
              <Text style={{fontSize: 18, fontWeight: 'normal'}}>
                {startTime}
              </Text>
            </Text>
            <Text style={{fontSize: 18, fontWeight: 'bold'}}>
              End time:{' '}
              <Text style={{fontSize: 18, fontWeight: 'normal'}}>
                {endTime}
              </Text>
            </Text>
          </View>
          <View style={styles.time}>
            <Text style={{fontSize: 18, fontWeight: 'bold'}}>
              Lunch:{' '}
              <Text style={{fontSize: 18, fontWeight: 'normal'}}>{lunch}</Text>
            </Text>
          </View>
          <View style={styles.txtSTOTDT}>
            <Text style={{fontSize: 18, fontWeight: 'bold'}}>
              ST: <Text style={{fontSize: 18, fontWeight: 'normal'}}>{st}</Text>
            </Text>
            <Text style={{fontSize: 18, fontWeight: 'bold'}}>
              OT: <Text style={{fontSize: 18, fontWeight: 'normal'}}>{ot}</Text>
            </Text>
            <Text style={{fontSize: 18, fontWeight: 'bold'}}>
              DT: <Text style={{fontSize: 18, fontWeight: 'normal'}}>{dt}</Text>
            </Text>
          </View>
          <View style={styles.txtNS}>
            <Text style={{fontSize: 18, fontWeight: 'bold'}}>
              NS: <Text style={{fontSize: 18, fontWeight: 'normal'}}>{ns}</Text>
            </Text>
            <Text style={{fontSize: 18, fontWeight: 'bold'}}>
              NSOT:{' '}
              <Text style={{fontSize: 18, fontWeight: 'normal'}}>{nsot}</Text>
            </Text>
            <Text style={{fontSize: 18, fontWeight: 'bold'}}>
              NSDT:{' '}
              <Text style={{fontSize: 18, fontWeight: 'normal'}}>{nsdt}</Text>
            </Text>
          </View>
          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={handleConfirm} style={styles.button}>
              <Text style={styles.buttonText}>Confirm</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleEditDetails} style={styles.button}>
              <Text style={styles.buttonText}>Edit Details</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};
export default ConfirmationPopupForSubmitWO;

const styles = StyleSheet.create({
  flex: {flex: 1, justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.3)'},
  container: {
    minHeight: 250,
    width: 400,
    backgroundColor: 'white',
    alignSelf: 'center',
  },
  title: {
    alignSelf: 'center',
    marginTop: -15,
    fontSize: 25,
    fontWeight: '600',
    padding: 10,
  },
  content: {
    alignSelf: 'center',
    fontSize: 20,
    fontWeight: '500',
    paddingHorizontal: 10,
  },
  time: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
    paddingHorizontal: 10,
  },
  txtSTOTDT: {
    justifyContent: 'space-around',
    flexDirection: 'row',
    marginTop: 20,
    paddingHorizontal: 10,
  },
  txtNS: {
    justifyContent: 'space-evenly',
    flexDirection: 'row',
    paddingHorizontal: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    marginTop: 20,
  },
  button: {
    backgroundColor: '#f58442',
    borderRadius: 5,
    height: 50,
    width: 170,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 20,
    fontWeight: '600',
  },
});
