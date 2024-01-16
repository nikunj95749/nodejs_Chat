import React, {useState, useEffect} from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {CustomDatePicker} from '../../components/filters/CustomDatePicker';
import {DropDownMenu} from '../../components/filters/DropDownMenu';
import {TxtFieldWorkOrder} from '../../components/filters/TxtFieldWorkOrder';
import TopBar from '../../components/TopBar';
import {LIGHT_GRAY, ORANGE, WHITE} from '../../styles';
import moment from 'moment';
import {useSelector, useDispatch} from 'react-redux';
import {searchReportFilter} from '../../resources/baseServices/report';
import {
  setDispatchFormData,
  setResetOnPreviewFlag,
  setSummary,
} from '../../../store/form';
import {PendingWorkItemSwipeView} from '../pendingWorkOrders/components/PendingWorkItemSwipeView';
import {SwipeListView} from 'react-native-swipe-list-view';
import {PendingWorkItem} from '../pendingWorkOrders/components/PendingWorkItem';
import {CompleteWorkItem} from '../completedWorkOrders/components/CompleteWorkItem';
import {isEmpty} from 'lodash';

const WorkOrderReport = ({navigation}) => {
  const dispatch = useDispatch();
  const [selectedPickerIndex, setSelectedPickerIndex] = useState(null);
  const userDetails = useSelector((state) => state.auth?.userDetails ?? '');
  const pendingworkOrderList = useSelector(
    (state) => state.workOrder?.pendingworkOrderList ?? '',
  );
  const [open, setOpen] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [arrFilterData, setArrFilterData] = useState([]);
  const [state, setState] = useState({
    fromDate: '',
    toDate: '',
    filterType: 'All',
    filterText: '',
  });

  const postSearchReportFilter = async () => {
    try {
      setIsLoadingData(true);
      const params = {
        fromDate: isEmpty(state?.fromDate) ? '' : state?.fromDate,
        toDate: isEmpty(state?.toDate) ? '' : state?.toDate,
        filterType: isEmpty(state?.filterType) ? '' : state?.filterType,
        filterText: isEmpty(state?.filterText) ? '' : state?.filterText,
        userId: userDetails?.id,
      };
      const res = await searchReportFilter(params);

      setArrFilterData(res?.data?.result);
    } catch (error) {
      console.log('', error);
    } finally {
      setIsLoadingData(false);
    }
  };

  function dateDifference(targetTime) {
    const targetDate = moment(targetTime);
    const currentDate = moment();
    const duration = moment.duration(currentDate.diff(targetDate));
    const hours = Math.abs(duration.asHours());

    let totalWeekEndHours = calculateWeekendHours(targetTime);

    const weekendHoursDifference = Math.max(hours - totalWeekEndHours, 0);
    return weekendHoursDifference;
  }

  // Function to calculate weekend hours difference
  const calculateWeekendHours = (targetTime) => {
    const startDate = moment(targetTime);
    const currentDate = moment();

    // Initialize a variable to store the total weekend hours
    let totalWeekendHours = 0;

    // Iterate through each hour between startDate and currentDate
    while (startDate.isBefore(currentDate)) {
      // Check if the current day is a weekend day (Saturday or Sunday)
      if (startDate.day() === 0 || startDate.day() === 6) {
        totalWeekendHours += 1;
      }

      // Move to the next hour
      startDate.add(1, 'hour');
    }

    return totalWeekendHours;
  };

  return (
    <View style={styles.container}>
      <TopBar
        onBack={() => navigation.goBack()}
        headingText={'Work Order Report'}
      />
      <View style={styles.subContainer}>
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

        <View style={styles.filterSubHeader}>
          <DropDownMenu
            style={{flex: 1, marginRight: 15}}
            placeHolder={'Filter Type'}
            data={[
              {label: 'All', value: 'All'},
              {label: 'WO Number', value: 'WO Number'},
              {label: 'Project No.', value: 'Project No.'},
              {label: 'Task Code', value: 'Task Code'},
            ]}
            onChangeItem={(data) => {
              setState((oldData) => {
                return {
                  ...oldData,
                  filterType: data?.value,
                };
              });
            }}
            defaultValue={'All'}
          />
          <TxtFieldWorkOrder
            style={{
              flex: 1,
              paddingLeft: 10,
              marginRight: null,
              marginLeft: 10,
            }}
            value={state?.filterText}
            placeholder={'Search'}
            onChange={(txt) => {
              setState((oldData) => {
                return {
                  ...oldData,
                  filterText: txt,
                };
              });
            }}
          />
        </View>
        <TouchableOpacity
          onPress={postSearchReportFilter}
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
          {isLoadingData ? (
            <ActivityIndicator color={WHITE} />
          ) : (
            <Text
              style={{
                fontSize: 30,
                color: WHITE,
                alignSelf: 'center',
                marginLeft: 20,
              }}>
              Search
            </Text>
          )}
        </TouchableOpacity>
        <SwipeListView
          disableRightSwipe={false}
          recalculateHiddenLayout={true}
          renderHiddenItem={({item, index}) => {
            let pendingItem = {};
            if (
              item?.SubStatus === 'Completed' ||
              item?.SubStatus === 'Reviewed'
            ) {
            } else {
              pendingItem = pendingworkOrderList?.find((obj) => {
                return obj?.WorkOrderNo === item?.WorkOrderNo;
              });
            }
            return item?.SubStatus === 'Completed' ||
              item?.SubStatus === 'Reviewed' ? null : dateDifference(
                pendingItem.JobDate,
              ) > 36 && !pendingItem.IsUnlocked ? null : (
              <PendingWorkItemSwipeView item={item} navigation={navigation}/>
            );
          }}
          style={{marginTop: 15}}
          data={arrFilterData}
          // PendingWorkItemSwipeView
          renderItem={({item, index}) => {
            let pendingItem = {};
            if (
              item?.SubStatus === 'Completed' ||
              item?.SubStatus === 'Reviewed'
            ) {
            } else {
              pendingItem = pendingworkOrderList?.find((obj) => {
                return obj?.WorkOrderNo === item?.WorkOrderNo;
              });
            }

            return item?.SubStatus === 'Completed' ||
              item?.SubStatus === 'Reviewed' ? (
              <CompleteWorkItem item={item} />
            ) : (
              <PendingWorkItem
                onPress={(item) => {
                  dispatch(setResetOnPreviewFlag());
                  dispatch(setDispatchFormData({}));
                  dispatch(setSummary([]));

                  setTimeout(() => {
                    navigation.navigate('MasterForm', {item: pendingItem});
                  }, 500);
                }}
                item={pendingItem}
              />
            );
          }}
          rightOpenValue={-330}
          leftOpenValue={220}
          keyExtractor={(item, index) => `index__${item.Id}`}
        />
      </View>
      <DateTimePickerModal
        isVisible={open}
        date={new Date()}
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
    </View>
  );
};

export default WorkOrderReport;

const styles = StyleSheet.create({
  container: {flex: 1},
  subContainer: {marginHorizontal: 30, flex: 1},
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
});
