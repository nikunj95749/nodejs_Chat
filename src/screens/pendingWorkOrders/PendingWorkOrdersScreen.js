/* eslint-disable react-hooks/exhaustive-deps */
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  StyleSheet,
  useWindowDimensions,
  View,
} from "react-native";
import Geolocation from "react-native-geolocation-service";
import TopBar from "../../components/TopBar";
import { PendingWorkItem } from "./components/PendingWorkItem";
import { useDispatch, useSelector } from "react-redux";
import { ORANGE } from "../../styles";
import {
  setDispatchFormData,
  setResetOnPreviewFlag,
  setSelectedFormItem,
  setSummary,
} from "../../../store/form";
import { setWorkOrderList } from "../../../store/workOrder";
import { getWorkOrdersAPI } from "../../resources/baseServices/timeSheet";
import { SwipeListView, SwipeRow } from "react-native-swipe-list-view";
import { PendingWorkItemSwipeView } from "./components/PendingWorkItemSwipeView";
import { setCurrentLocationAction } from "../../../store/currentLocation";
import moment from "moment";

const PendingWorkOrdersScreen = ({ navigation, route }) => {
  const [isLoadingData, setIsLoadingData] = useState(false);
  const userDetails = useSelector((state) => state.auth?.userDetails ?? "");
  const pendingworkOrderListForOffline = useSelector(
    (state) => state.workOrderForOffline?.pendingworkOrderListForOffline ?? []
  );

  const isLoadingWorkOrder = useSelector(
    (state) => state.workOrder?.isLoadingWorkOrder ?? ""
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
      console.log("getWorkOrders error: ", error);
    } finally {
      setIsLoadingData(false);
    }
  };

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      async (data) => {
        dispatch(
          setCurrentLocationAction({
            latitude: data.coords.latitude,
            longitude: data.coords.longitude,
          })
        );
      },

      (getLocationError) => {
        console.log("getCurrentLocation== ", getLocationError);
      }
    );
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
      startDate.add(1, "hour");
    }

    return totalWeekendHours;
  };

  const checkIsFutureDate = (targetTime) => {
    const targetDate = moment(targetTime);
    const currentDate = moment();
    if (currentDate < targetDate) {
      return true;
    } else {
      return false;
    }
  };

  return (
    <View style={styles.container}>
      <TopBar isShowRefresh isShowLeftIcon headingText="Pending Work Orders" />
      <View style={styles.subContainer}>
        {/* <View style={styles.filterHeader}>
          <View style={styles.filterSubHeader}>
            <CustomDatePicker style={{marginRight: 20}} />
            <TxtFieldWorkOrder />
            <DropDownMenu />
          </View>
        // </View> */}
        {/* // {isLoadingWorkOrder ? (
        //   <ActivityIndicator
        //     style={{marginTop: 15}}
        //     size={'large'}
        //     color={ORANGE}
        //   />
        // ) : ( */}
        <SwipeListView
          refreshControl={
            <RefreshControl refreshing={isLoadingData} onRefresh={onRefresh} />
          }
          recalculateHiddenLayout={true}
          style={{ marginTop: 15 }}
          data={pendingworkOrderListForOffline?.filter(
            (obj) => !obj?.data?.shouldMoveToCompleted
          )}
          // PendingWorkItemSwipeView
          renderItem={({ item, index }) => (
            <SwipeRow
              disableLeftSwipe={
                dateDifference(item?.data?.pendingData.JobDate) > 36 &&
                !item?.data?.pendingData.IsUnlocked &&
                !checkIsFutureDate(item?.data?.pendingData.JobDate)
              }
              disableRightSwipe={
                dateDifference(item?.data?.pendingData.JobDate) > 36 &&
                !item?.data?.pendingData.IsUnlocked &&
                !checkIsFutureDate(item?.data?.pendingData.JobDate)
              }
              rightOpenValue={-330}
              leftOpenValue={190}
            >
              <PendingWorkItemSwipeView
                item={item?.data?.pendingData}
                navigation={navigation}
              />
              <PendingWorkItem
                onPress={(item) => {
                  dispatch(setResetOnPreviewFlag());
                  dispatch(setDispatchFormData({}));
                  dispatch(setSummary([]));
                  dispatch(setSelectedFormItem(item));

                  setTimeout(() => {
                    navigation.navigate("MasterForm", { item: item });
                  }, 500);
                }}
                item={item?.data?.pendingData}
                navigation={navigation}
              />
            </SwipeRow>
          )}
          keyExtractor={(item, index) =>
            `index__${item?.data?.pendingData?.Id}`
          }
        />
        {/* // )} */}
      </View>
    </View>
  );
};

export default PendingWorkOrdersScreen;

const styles = StyleSheet.create({
  container: { flex: 1 },
  subContainer: { marginHorizontal: 30, flex: 1 },
  filterHeader: {
    width: "100%",
    marginTop: 15,
    height: 60,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  filterSubHeader: {
    width: "100%",
    height: 80,
    flexDirection: "row",
    alignItems: "center",
  },
});
