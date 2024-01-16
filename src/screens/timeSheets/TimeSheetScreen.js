/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  RefreshControl,
  View,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import {TxtPoppinMedium} from '../../components/text/TxtPoppinMedium';
import TopBar from '../../components/TopBar';
import {DARK_GRAY, ORANGE, WHITE, responsiveScale} from '../../styles';
import {FloatingActionButton} from '../../components/buttons/FloatingActionButton';
import NewWorkOrderModal from './components/NewWorkOrderModal';
import {TimeSheetItem} from './components/TimeSheetItem';
import {RowTitle} from './components/RowTitle';
import DeleteTimeSheetModal from './components/DeleteTimeSheetModal';
import {
  deleteTimeSheetAPI,
  getTimeSheetListAPI,
} from '../../resources/baseServices/timeSheet';
import {useSelector} from 'react-redux';
import {useCallback} from 'react';
import moment from 'moment';
import {DropDownMenu} from '../../components/filters/DropDownMenu';
import Calender from '../../assets/images/Calender.svg';
import DateRangePicker from '../../components/DateRangePicker';
import { RFValue } from 'react-native-responsive-fontsize';

const TimeSheetScreen = ({navigation, route}) => {
  const [isShowAddNewModal, setIsShowAddNewModal] = useState(false);
  const [isShowDeleteModal, setIsShowDeleteModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [arrWorkOrderId, setArrWorkOrderId] = useState([]);
  const [edititem, setEdititem] = useState({});

  const [dropDownSelectedDateObject, setDropDownSelectedDateObject] = useState(
    {},
  );

  const [selectedTimeSheetIndex, setSelectedTimeSheetIndex] = useState(0);
  const workOrderList = useSelector(
    (state) => state.workOrder?.workOrderList ?? [],
  );
  const userDetails = useSelector((state) => state.auth?.userDetails ?? '');

  const [arrTimeSheets, setArrTimeSheets] = useState([]);

  const getWorkOrders = async () => {
    try {
      if (!!workOrderList) {
        let finalWorkOrders = [...workOrderList].map((item, index) => {
          return {
            label: `${item?.WorkOrderNo}`,
            value: `${item?.Id}`,
          };
        });

        setArrWorkOrderId(finalWorkOrders);
      }
    } catch (error) {}
  };

  const deleteTimeSheet = async (id) => {
    try {
      let data = {
        id,
      };
      const res = await deleteTimeSheetAPI(data);
    } catch (error) {
      console.log('deleteTimeSheet error: ', error);
    }
  };

  function getCurrentWeek() {
    let currentDate = moment();
    let weekStart = currentDate.clone().startOf('week');
    let days = [];
    for (let i = 0; i <= 6; i++) {
      days.push(moment(weekStart).add(i, 'days').format('YYYY-MM-DD'));
    }
    return days;
  }
  const getWeek = () => {
    let currentDate = moment();
    let days = [];
    for (let i = 0; i <= 10; i++) {
      let weekStart = moment(currentDate.clone().startOf('week')).subtract(
        i,
        'week',
      );
      let weekDay = moment().day();
      if (
        moment(weekStart).format('YYYY-MM-DD') ==
        moment(moment().subtract(weekDay, 'day')).format('YYYY-MM-DD')
      ) {
        days.push(
          moment(weekStart).format('ddd, DD MMM') +
            ' - ' +
            moment().format('ddd, DD MMM'),
        );
      } else {
        days.push(
          moment(weekStart).format('ddd, DD MMM') +
            ' - ' +
            moment(weekStart).add(6, 'days').format('ddd, DD MMM'),
        );
      }
    }
    const dropDownData = days?.map((item) => {
      const data = {label: item, value: item};
      return data;
    });
    return dropDownData;
  };

  const getTimeSheetList = useCallback(
    async (isShowMainLoader = true, dateValue) => {
      try {
        let data = {
          employeeId: userDetails?.loginId,
          fromDate: dateValue?.fromDate
            ? moment(dateValue?.fromDate).format('YYYY-MM-DD')
            : getCurrentWeek()[0],
          toDate: dateValue?.toDate
            ? moment(dateValue?.toDate).format('YYYY-MM-DD')
            : moment().format('YYYY-MM-DD'),
        };
        if (isShowMainLoader) {
          setIsLoading(true);
        }

        const res = await getTimeSheetListAPI(data);
        if (res?.data?.length > 0) {
          setArrTimeSheets(
            [...res?.data]?.sort(
              (a, b) =>
                new Date(b.woDate).getTime() - new Date(a.woDate).getTime(),
            ),
          );
        } else {
          setArrTimeSheets([]);
        }
      } catch (error) {
        console.log('[TimeSheetScreen] getTimeSheetList error: ', error);
      } finally {
        setIsLoading(false);
      }
    },
    [userDetails],
  );

  useEffect(() => {
    getWorkOrders();
    const date = {
      fromDate: moment(getCurrentWeek()[0]).format('YYYY-MM-DD'),
      toDate: moment().format('YYYY-MM-DD'),
    };
    setDropDownSelectedDateObject(date);
    getTimeSheetList(true, date);
  }, []);

  const onRefresh = async () => {
    try {
      setIsLoadingRefresh(true);
      await getTimeSheetList(false,dropDownSelectedDateObject);
    } catch (error) {
      console.log('getWorkOrders error: ', error);
    } finally {
      setIsLoadingRefresh(false);
    }
  };

  const [isLoadingRefresh, setIsLoadingRefresh] = useState(false);
  const [showMultiDateModal, setShowMultiDateModal] = useState(false);
  const [isDateSelect, setIsDateSelect] = useState(false);
  const [isDropDownDateSelect, setIsDropDownDateSelect] = useState(false);

  const handleOnSubmit = (date) => {
    setDropDownSelectedDateObject(date);
    getTimeSheetList(true, date);
    setShowMultiDateModal(false);
    setIsDateSelect(true);
    setIsDropDownDateSelect(false);
  };
  function getMonthNumber(monthStr) {
    const months = {
      Jan: '01',
      Feb: '02',
      Mar: '03',
      Apr: '04',
      May: '05',
      Jun: '06',
      Jul: '07',
      Aug: '08',
      Sep: '09',
      Oct: '10',
      Nov: '11',
      Dec: '12',
    };
    return months[monthStr];
  }
  return (
    <View style={styles.container}>
      <TopBar
        isShowRefresh
        isShowLeftIcon
        headingText="Time Sheets"
        onPressRefresh={() => {
          onRefresh();
        }}
      />
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginVertical: 10,
        }}>
        <DropDownMenu
          style={{
            marginLeft: 15,
            width: '87%',
            borderColor: isDropDownDateSelect ? ORANGE : DARK_GRAY,
            borderWidth: 0.8,
          }}
          placeHolder={'Date Range'}
          data={getWeek()}
          onChangeItem={(data) => {
            const dateStr = data?.value?.split('-')[0];
            const year = new Date().getFullYear();
            const isoString = `${year}-${getMonthNumber(
              dateStr.substr(8, 3),
            )}-${dateStr.substr(5, 2)}T00:00:00.000Z`;

            const dateStr2 = data?.value?.split('-')[1];
            const year2 = new Date().getFullYear();
            const isoString2 = `${year2}-${getMonthNumber(
              dateStr2.substr(9, 3),
            )}-${dateStr2.substr(6, 2)}T00:00:00.000Z`;
            const dateObject = {
              fromDate: isoString,
              toDate: isoString2,
            };
            setDropDownSelectedDateObject(dateObject);
            getTimeSheetList(true, dateObject);
            setIsDropDownDateSelect(true);
            setIsDateSelect(false);
          }}
          defaultValue={
            moment(getCurrentWeek()[0]).format('ddd, DD MMM') +
            ' - ' +
            moment().format('ddd, DD MMM')
          }
        />
        <TouchableOpacity
          style={{
            height: 55,
            width: 55,
            backgroundColor: WHITE,
            borderColor: isDateSelect ? ORANGE : DARK_GRAY,
            borderWidth: 0.8,
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onPress={() => setShowMultiDateModal(true)}>
          <Calender width={35} height={35} />
        </TouchableOpacity>
      </View>
      <View style={{marginHorizontal: 30}}>
        {/* <View
          style={{
            width: '100%',
            marginTop: 15,
            height: 60,
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <View
            style={{
              height: '100%',
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'row',
            }}>
            <View
              style={{
                height: 25,
                width: 4,
                marginRight: 10,
                backgroundColor: ORANGE,
              }}></View>
            <TxtPoppinMedium
              style={{fontSize: responsiveScale(11)}}
              title="PROJECT BILLABLE"
            />
          </View>
        </View> */}

        {arrTimeSheets?.length > 0 ? (
          <View
            style={{
              width: '100%',
              height: 60,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <RowTitle width="11%" title="Days" />
            <RowTitle width="20%" title="Work Order #" />
            <RowTitle width="10%" title="Type" />

            <RowTitle width="9%" title="Start" />
            <RowTitle width="9%" title="End" />
            <RowTitle width="7%" title="Lunch" />
            <RowTitle width="7%" title="Work Hr" />
            {/* <RowTitle width="14%" title="Action" /> */}
          </View>
        ) : null}
      </View>
      {isLoading ? (
        <ActivityIndicator color={ORANGE} size={'large'} />
      ) : (
        <>
          {arrTimeSheets?.length > 0 ? (
            <FlatList
              data={arrTimeSheets}
              refreshControl={
                <RefreshControl
                  refreshing={isLoadingRefresh}
                  onRefresh={onRefresh}
                />
              }
              renderItem={({item, index}) => (
                <TimeSheetItem
                  onClose={(index) => {
                    setSelectedTimeSheetIndex(index);
                    setIsShowDeleteModal(true);
                  }}
                  onEdit={(item) => {
                    setEdititem(item);
                    setTimeout(() => {
                      setIsShowAddNewModal(true);
                    }, 500);
                  }}
                  item={item}
                  arrWorkOrderId={arrWorkOrderId}
                  index={index}
                />
              )}
              keyExtractor={(item) => `${item.id}`}
            />
          ) : (
            <View
              style={{
                width: '100%',
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <TxtPoppinMedium
                style={{fontSize: RFValue(20)}}
                title={'Empty Timesheets'}
              />
            </View>
          )}
        </>
      )}

      {/* <FloatingActionButton
        onPress={() => {
          setEdititem({});
          setIsShowAddNewModal(true);
        }}
        style={{position: 'absolute', bottom: 30, right: 30}}
      /> */}
      {isShowAddNewModal ? (
        <NewWorkOrderModal
          workOrders={arrWorkOrderId}
          edititem={edititem}
          onModalClose={() => {
            setIsShowAddNewModal(false);
          }}
          onPressUpdateButton={(item) => {
            let mapTimeSheet = [...arrTimeSheets].map((obj) => {
              return obj?.id === item?.id ? item : obj;
            });
            setArrTimeSheets(mapTimeSheet);
          }}
          onPressAddButton={(item) => {
            setArrTimeSheets([item, ...arrTimeSheets]);
          }}
          isOpenModal={isShowAddNewModal}
        />
      ) : null}

      <DeleteTimeSheetModal
        onPressYes={() => {
          var array = [...arrTimeSheets];
          array.splice(selectedTimeSheetIndex, 1);
          setArrTimeSheets(array);
          deleteTimeSheet(arrTimeSheets?.[selectedTimeSheetIndex]?.id);
          setIsShowDeleteModal(false);
        }}
        onPressNo={() => {
          setIsShowDeleteModal(false);
        }}
        isOpenModal={isShowDeleteModal}
        onModalClose={() => {
          setIsShowDeleteModal(false);
        }}
      />
      <DateRangePicker
        showModal={showMultiDateModal}
        setShowMultiDateModal={setShowMultiDateModal}
        onSubmit={handleOnSubmit}
      />
    </View>
  );
};

// PROJECT BILLABLE

export default TimeSheetScreen;

const styles = StyleSheet.create({
  container: {flex: 1},
});
