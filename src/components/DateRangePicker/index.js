import React, {useState} from 'react';
import {Text, TouchableOpacity, View, StyleSheet, Modal} from 'react-native';
import moment from 'moment';
import {
  BLACK,
  BLACK_80,
  LIGHT_GRAY,
  LIGHT_GRAY_5,
  ORANGE,
  WHITE,
} from '../../styles';
import {CustomDatePicker} from '../filters/CustomDatePicker';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

const DateRangePicker = ({
  showModal = false,
  setShowMultiDateModal,
  onSubmit = () => {},
}) => {
  const [state, setState] = useState({
    fromDate: '',
    toDate: '',
  });
  const [selectedPickerIndex, setSelectedPickerIndex] = useState(null);
  const [open, setOpen] = useState(false);

  return (
    <>
      <Modal animationType="slide" transparent={true} visible={showModal}>
        <TouchableOpacity
          style={styles.container}
          onPress={() => setShowMultiDateModal(!showModal)}>
          <DateTimePickerModal
            isVisible={open}
            date={new Date()}
            maximumDate={new Date()}
            mode={'date'}
            onConfirm={(d) => {
              setOpen(false);
              if (selectedPickerIndex === 1) {
                setState((oldData) => {
                  return {
                    ...oldData,
                    fromDate: moment(d).format('YYYY-MM-DD'),
                  };
                });
              }
              if (selectedPickerIndex === 2) {
                setState((oldData) => {
                  return {
                    ...oldData,
                    toDate: moment(d).format('YYYY-MM-DD'),
                  };
                });
              }
            }}
            onCancel={() => {
              setOpen(false);
            }}
          />
          <View activeOpacity={1} style={styles.modalPosition}>
            <View style={styles.filterHeader}>
              <View style={styles.filterSubHeader}>
                <CustomDatePicker
                  onPress={() => {
                    setSelectedPickerIndex(1);
                    setOpen(true);
                  }}
                  defaulttitle="Start Date"
                  title={
                    state?.fromDate &&
                    moment(state?.fromDate, 'YYYY-MM-DD').format('MM/DD/YYYY')
                  }
                  style={{
                    borderColor: LIGHT_GRAY,
                    borderWidth: 1,
                    marginRight: 20,
                    flex: 1,
                  }}
                  txtStyle={{fontSize: 12}}
                />
                <CustomDatePicker
                  onPress={() => {
                    setSelectedPickerIndex(2);
                    setOpen(true);
                  }}
                  defaulttitle="End Date"
                  title={
                    state?.toDate &&
                    moment(state?.toDate, 'YYYY-MM-DD').format('MM/DD/YYYY')
                  }
                  style={{
                    borderColor: LIGHT_GRAY,
                    borderWidth: 1,
                    flex: 1,
                  }}
                  txtStyle={{fontSize: 12}}
                />
              </View>
            </View>
            <TouchableOpacity
              onPress={() => onSubmit(state)}
              style={{
                height: 60,
                width: '100%',
                borderRadius: 50,
                paddingHorizontal: 20,
                backgroundColor: ORANGE,
                marginRight: 20,
                marginTop: 30,
                justifyContent: 'center',
                borderColor: LIGHT_GRAY,
                borderWidth: 1,
              }}>
              <Text
                style={{
                  fontSize: 30,
                  color: WHITE,
                  alignSelf: 'center',
                  marginLeft: 20,
                }}>
                Submit
              </Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BLACK_80,
  },
  modalPosition: {
    backgroundColor: WHITE,
    position: 'absolute',
    left: 0,
    right: 0,
    height: 250,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    bottom: 0,
    padding: 20,
    shadowColor: BLACK,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.4,
    shadowRadius: 2.22,
    elevation: 4,
  },
  filterHeader: {
    width: '100%',
    marginTop: 15,
    height: 65,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  filterSubHeader: {
    width: '100%',
    height: 80,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dateInput: {
    height: 35,
    width: 120,
    backgroundColor: 'white',
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: LIGHT_GRAY_5,
  },
  flex_center: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  margin_vertical_20: {
    marginVertical: 20,
  },
});
export default DateRangePicker;
