/* eslint-disable react-hooks/exhaustive-deps */
import React, {useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StyleSheet,
  View,
} from 'react-native';
import TopBar from '../../components/TopBar';
import {CompleteWorkItem} from './components/CompleteWorkItem';
import {useDispatch, useSelector} from 'react-redux';
import {ORANGE} from '../../styles';
import {getWorkOrdersAPI} from '../../resources/baseServices/timeSheet';
import {setWorkOrderList} from '../../../store/workOrder';

const CompletedWorkOrdersScreen = ({navigation, route}) => {
  const [isLoadingData, setIsLoadingData] = useState(false);

  const completedworkOrderList = useSelector(
    (state) => state.workOrder?.completedworkOrderList ?? '',
  );
  const userDetails = useSelector((state) => state.auth?.userDetails ?? '');

  const isLoadingWorkOrder = useSelector(
    (state) => state.workOrder?.isLoadingWorkOrder ?? '',
  );

  const dispatch = useDispatch();

  const onRefresh = async () => {
    try {
      setIsLoadingData(true);
      const res = await getWorkOrdersAPI({
        userId: userDetails?.id,
      });

      dispatch(setWorkOrderList(res?.data));
    } catch (error) {
      console.log('getWorkOrders error: ', error);
    } finally {
      setIsLoadingData(false);
    }
  };

  return (
    <View style={styles.container}>
      <TopBar
        isShowRefresh
        isShowLeftIcon
        headingText="Completed Work Orders"
      />
      <View style={styles.subContainer}>
        {/* <View style={styles.filterHeader}>
          <View style={styles.filterSubHeader}>
            <CustomDatePicker style={{marginRight: 20}} />
            <TxtFieldWorkOrder />
            <DropDownMenu />
          </View>
        </View> */}
        {isLoadingWorkOrder ? (
          <ActivityIndicator
            style={{marginTop: 15}}
            size={'large'}
            color={ORANGE}
          />
        ) : (
         
          <FlatList
          refreshControl={
            <RefreshControl
              refreshing={isLoadingData}
              onRefresh={onRefresh}
            />
          }
          
          // renderHiddenItem={({item, index}) => (
          //   <CompletedWorkItemSwipeView item={item} />
          // )}
          style={{marginTop: 15}}
          data={completedworkOrderList}
          // PendingWorkItemSwipeView
          renderItem={({item, index}) => (
            <CompleteWorkItem item={item} />
          )}
          
          keyExtractor={(item, index) => `index__${item.Id}`}
        />
        )}
      </View>
    </View>
  );
};

export default CompletedWorkOrdersScreen;

const styles = StyleSheet.create({
  container: {flex: 1},
  subContainer: {marginHorizontal: 30, flex: 1},
  filterHeader: {
    width: '100%',
    marginTop: 15,
    height: 60,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  filterSubHeader: {
    width: '100%',
    height: 80,
    flexDirection: 'row',
    alignItems: 'center',
  },
});
