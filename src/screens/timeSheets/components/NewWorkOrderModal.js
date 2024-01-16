import React, {useEffect, useMemo, useState} from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  ScrollView,
  Alert,
} from 'react-native';
import Modal from 'react-native-modal';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import CloseRed from '../../../assets/images/CloseRed.svg';
import NewFolder from '../../../assets/images/NewFolder.svg';
import SegmentedControl from '@react-native-segmented-control/segmented-control';

import {
  LIGHT_GRAY,
  responsiveScale,
  WHITE,
  WINDOW_HEIGHT,
  WINDOW_WIDTH,
} from '../../../styles';
import {TxtPoppinMedium} from '../../../components/text/TxtPoppinMedium';
import {TextInputWithIcon} from '../../../components/tetInput/TextInputWithIcon';
import {ActionButton} from '../../../components/buttons/ActionButton';
import {CustomDatePicker} from '../../../components/filters/CustomDatePicker';
import {DropDownMenu} from '../../../components/filters/DropDownMenu';
import moment from 'moment';
import {timeRemaining} from '../../../helpers/configureAxios';
import {createNUpdateTimeSheetAPI} from '../../../resources/baseServices/timeSheet';
import {isEmpty} from 'lodash';
import { RFValue } from 'react-native-responsive-fontsize';

// Regular/Over time/Double time

const REGULAR = 'Regular';
const OVER_TIME = 'Over time';
const DOUBLE_TIME = 'Double time';

export default function NewWorkOrderModal({
  isOpenModal,
  onModalClose,
  onPressAddButton = () => {},
  onPressUpdateButton = () => {},
  workOrders = [],
  edititem = null,
}) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [selectedSegmentIndex, setSelectedSegmentIndex] = useState(
    !isEmpty(edititem)
      ? edititem?.type === OVER_TIME
        ? 1
        : edititem?.type === DOUBLE_TIME
        ? 2
        : 0
      : 0,
  );
  const [selectedPickerIndex, setSelectedPickerIndex] = useState(null);
  const [state, setState] = useState({
    date: !isEmpty(edititem) ? edititem?.timesheetDate : '',
    orderNumber: !isEmpty(edititem) ? `${edititem?.woId}` : '',
    startTime: !isEmpty(edititem) ? edititem?.startTime : '',
    endTime: !isEmpty(edititem) ? edititem?.endTime : '',
    lunchTime: !isEmpty(edititem) ? `${edititem?.lunchHours}` : '',
  });

  const onProgressAddButton = async () => {
    try {
      if (state?.date === '') {
        Alert.alert('Please select your work day!');
      } else if (state?.orderNumber === '') {
        Alert.alert('Please select your order number!');
      } else if (state?.startTime === '') {
        Alert.alert('Please select your start time!');
      } else if (state?.endTime === '') {
        Alert.alert('Please select your end time!');
      } else if (state?.lunchTime === '') {
        Alert.alert('Please select your lunch time!');
      } else {
        let type = REGULAR;
        if (selectedSegmentIndex === 1) {
          type = OVER_TIME;
        } else if (selectedSegmentIndex === 2) {
          type = DOUBLE_TIME;
        }
        setIsLoading(true);
        let data = {
          id: 0,
          employeeId: 1,
          woId: state?.orderNumber,
          timesheetDate: state?.date,
          type: type,
          startTime: state?.startTime,
          endTime: state?.endTime,
          hours: timeRemaining(state?.startTime, state?.endTime),
          lunchHours: state?.lunchTime,
          comments: 'string',
          createdById: 0,
          createdDate: new Date(),
          modifiedById: 0,
          modifiedDate: new Date(),
        };

        if (!isEmpty(edititem)) {
          data = {
            ...edititem,
            id: edititem?.id,
            employeeId: 1,
            woId: state?.orderNumber,
            timesheetDate: state?.date,
            type: type,
            startTime: state?.startTime,
            endTime: state?.endTime,
            hours: timeRemaining(state?.startTime, state?.endTime),
            lunchHours: state?.lunchTime,
          };
        }
        await createNUpdateTimeSheetAPI(data);
        if (!isEmpty(edititem)) {
          onPressUpdateButton(data);
        } else {
          onPressAddButton(data);
        }
        onModalClose();
        setState({
          date: '',
          orderNumber: '',
          startTime: '',
          endTime: '',
          lunchTime: '',
        });
      }
    } catch (error) {
      console.log('onProgressAddButton error: ', error);
    } finally {
      setIsLoading(false);
    }
  };

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
            title={'Add New Time Record'}
          />

          <View
            style={{
              marginHorizontal: 60,
              marginTop: 50,
              maxHeight: WINDOW_HEIGHT - 100,
            }}>
            <ScrollView>
              <CustomDatePicker
                onPress={() => {
                  setSelectedPickerIndex(0);
                  setOpen(true);
                }}
                defaulttitle="Select Day"
                title={state.date && moment(state?.date).format('MM/DD/YYYY')}
                style={{
                  width: '100%',
                  height: 70,
                  borderColor: LIGHT_GRAY,
                  borderWidth: 1,
                }}
                txtStyle={{fontSize: RFValue(12)}}
              />

              <DropDownMenu
                selectedTextStyle={{fontSize: RFValue(15)}}
                placeholderStyle={{fontSize: RFValue(15)}}
                data={workOrders}
                defaultValue={state?.orderNumber}
                onChangeItem={(item) => {
                  setState((oldData) => {
                    return {...oldData, orderNumber: item?.value};
                  });
                }}
                style={{
                  width: '100%',
                  height: 70,
                  borderColor: LIGHT_GRAY,
                  borderWidth: 1,
                  marginTop: 20,
                }}
                placeHolder={'Work Order #'}
              />

              <SegmentedControl
                values={['Regular', 'Over time', 'Double time']}
                selectedIndex={selectedSegmentIndex}
                fontStyle={{
                  fontFamily: 'Poppins-Medium',
                  fontSize: RFValue(15),
                }}
                style={{height: 60, marginTop: 20}}
                onChange={(event) => {
                  setSelectedSegmentIndex(
                    event.nativeEvent.selectedSegmentIndex,
                  );
                }}
              />

              {/* <TxtPoppinMedium
                style={{
                  marginTop: 15,
                  fontWeight: '600',
                  fontSize: responsiveScale(15),
                }}
                title={'Working Hours'}
              /> */}
              <View style={{flexDirection: 'row', marginTop: 20}}>
                <CustomDatePicker
                  onPress={() => {
                    setSelectedPickerIndex(1);
                    setOpen(true);
                  }}
                  defaulttitle="Start Time"
                  title={
                    state?.startTime &&
                    moment(state?.startTime, 'DD-MM-YYYY h:mm a').format(
                      'h:mm a',
                    )
                  }
                  style={{
                    height: 70,
                    flex: 1,
                    borderColor: LIGHT_GRAY,
                    borderWidth: 1,
                    marginRight: 20,
                  }}
                  txtStyle={{fontSize: RFValue(12)}}
                />
                <CustomDatePicker
                  onPress={() => {
                    setSelectedPickerIndex(2);
                    setOpen(true);
                  }}
                  defaulttitle="End Time"
                  title={
                    state?.endTime &&
                    moment(state?.endTime, 'DD-MM-YYYY h:mm a').format(
                      'h:mm a',
                    )
                  }
                  style={{
                    height: 70,
                    flex: 1,
                    borderColor: LIGHT_GRAY,
                    borderWidth: 1,
                  }}
                  txtStyle={{fontSize: RFValue(12)}}
                />
              </View>

              <TxtPoppinMedium
                style={{
                  marginTop: 15,
                  fontWeight: '600',
                  fontSize: RFValue(15),
                }}
                title={'Lunch Time'}
              />
              <View style={{flexDirection: 'row', marginTop: 10}}>
                <DropDownMenu
                  data={[
                    {label: '00:15:00', value: '00:15:00'},
                    {label: '00:30:00', value: '00:30:00'},
                    {label: '00:45:00', value: '00:45:00'},
                    {label: '01:00:00', value: '01:00:00'},
                    {label: '01:15:00', value: '01:15:00'},
                    {label: '01:30:00', value: '01:30:00'},
                    {label: '01:45:00', value: '01:45:00'},
                    {label: '02:00:00', value: '02:00:00'},
                  ]}
                  defaultValue={state?.lunchTime}
                  onChangeItem={(item) => {
                    setState((oldData) => {
                      return {...oldData, lunchTime: item?.label};
                    });
                  }}
                  selectedTextStyle={{fontSize: RFValue(15)}}
                  placeholderStyle={{fontSize: RFValue(15)}}
                  style={{
                    width: '100%',
                    height: 70,
                    borderColor: LIGHT_GRAY,
                    borderWidth: 1,
                  }}
                  placeHolder={'Select Time'}
                />
              </View>

              <ActionButton
                onPress={() => {
                  onProgressAddButton();
                }}
                isLoading={isLoading}
                title={!isEmpty(edititem) ? 'Update' : 'Add'}
                style={{
                  marginTop: 20,
                  alignSelf: 'center',
                  height: 70,
                  marginBottom: 50,
                }}
              />
            </ScrollView>
          </View>
        </View>
      </>

      <DateTimePickerModal
        isVisible={open}
        minuteInterval={15}
        mode={selectedPickerIndex === 0 ? 'date' : 'time'}
        date={new Date()}
        onConfirm={(d) => {
          setOpen(false);
          if (selectedPickerIndex === 0) {
            setState((oldData) => {
              return {...oldData, date: moment(d).format('MM/DD/YYYY')};
            });
          }

          if (selectedPickerIndex === 1) {
            setState((oldData) => {
              return {
                ...oldData,
                startTime: moment(d).format('DD-MM-YYYY h:mm a'),
              };
            });
          }
          if (selectedPickerIndex === 2) {

            setState((oldData) => {
              return {
                ...oldData,
                endTime: moment(d).format('DD-MM-YYYY h:mm a'),
              };
            });
          }

          // {
          //   date: '',
          //   orderNumber: '',
          //   workingHoursStartTime: '',
          //   workingHoursEndTime: '',
          //   otHoursStartTime: '',
          //   otHoursEndTime: '',
          //   dtHoursStartTime: '',
          //   dtHoursEndTime: '',
          //   lunchTime: '',
          // }

          // setDate(date);
        }}
        onCancel={() => {
          setOpen(false);
        }}
      />
    </Modal>
  );
}

const styles = StyleSheet.create({});
