import React, { useEffect, useMemo } from "react";
import {
  View,
  TouchableOpacity,
  Linking,
  StyleSheet,
  Alert,
} from "react-native";
import {
  responsiveScale,
  WHITE,
  ORANGE,
  BLACK,
  getWorkOrderStatusColor,
} from "../../../styles";
import Calender2 from "../../../assets/images/Calender2.svg";
import User from "../../../assets/images/User.svg";
import Location from "../../../assets/images/Location.svg";
import Docs from "../../../assets/images/Docs.svg";
import Lock from "../../../assets/images/Lock.svg";
import Unlock from "../../../assets/images/Unlock.svg";

import { TxtPoppinNormal } from "../../../components/text/TxtPoppinNormal";
import { TxtPoppinSemiBold } from "../../../components/text/TxtPoppinSemiBold";
import { TxtPoppinMedium } from "../../../components/text/TxtPoppinMedium";
import { TagDialPhone, TagNew } from "../../../components/Tags";
import moment from "moment";
import { useDispatch } from "react-redux";
import { setDispatchFormData } from "../../../../store/form";
import { weekDays } from "../../../helpers/logging";
import { RFValue } from "react-native-responsive-fontsize";
import PickUpAndDropButton from "../../../components/PickUpAndDropButton";

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginTop: 30,
    borderRadius: 10,
    overflow: "hidden",
    borderWidth: 4,
  },
  overlay: {
    backgroundColor: "black",
    zIndex: 1,
    position: "absolute",
    width: "100%",
    height: "100%",
    opacity: 0.2,
  },
  touchableOpacity: {
    width: "100%",
    padding: 20,
    paddingBottom:10,
    paddingTop:10,
    backgroundColor: WHITE,
  },
  rowContainer: {
    width: "100%",
    flexDirection: "row",
  },
  leftColumn: {
    height: "100%",
    flex: 1,
  },
  rightColumn: {
    height: "100%",
    alignItems: "flex-end",
  },
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
    marginRight: 10,
  },
  tagContainer: {
    flexDirection: "row",
  },
  imageContainer: {
    height: 25,
    width: 25,
    marginRight: 10,
  },
  title: { color: ORANGE, fontSize: RFValue(14) },
  subtitle: { color: BLACK, fontSize: RFValue(12.5) },
  cardText: { color: BLACK, marginTop: 4, fontSize: RFValue(11) },
  pickupAndDropButton: { marginRight: -20, marginTop: 15 },
  rightColumnContainer: { width: "100%", flex: 1 },
  telePhoneDialContainer: { flexDirection: "row", marginTop: 5 },
  subContainer: { width: "100%", paddingTop: 10},
  horizontalLine: { width: "100%", height: 2, marginBottom: 10 },
  BottomTextContainer: { flex: 1, alignItems: "center", flexDirection: "row" },
  bottomText: {
    color: BLACK,
    marginTop: 4,
    fontWeight: "400",
    fontSize: RFValue(13),
  },
});

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

export const PendingWorkItem = ({
  item = {},
  onPress = () => {},
  navigation,
}) => {
  const dispatch = useDispatch();

  const onPressDial = async () => {
    try {
      Linking.openURL(`tel:${item?.ContactNo}`);
    } catch (error) {
      console.log("[CompleteWorkItem] onPressDial error: ", error);
    }
  };

  const weekDay = useMemo(() => {
    const d = moment(item?.LockStartTime).format("YYYY-MM-DD");
    const dayOfWeek = new Date(d).getDay();
    const dayName = weekDays[dayOfWeek];
    return dayName;
  }, []);

  const IsLocked = dateDifference(item?.LockStartTime) > 36 && !item.IsUnlocked;
  const isFutureDate = checkIsFutureDate(item?.LockStartTime);

  return (
    <View
      style={[
        styles.container,
        { borderColor: getWorkOrderStatusColor(item?.SubStatus) },
      ]}
    >
      {IsLocked && !isFutureDate && (
        <TouchableOpacity
          style={styles.overlay}
          onPress={() => {
            Alert.alert(
              `Work Order is Locked please contact ${item?.ProjectLeadInfo}`
            );
          }}
        />
      )}
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => {
          dispatch(setDispatchFormData({}));
          setTimeout(() => {
            onPress(item);
          }, 500);
        }}
        style={[styles.touchableOpacity]}
      >
        <View style={styles.rowContainer}>
          <View style={styles.leftColumn}>
            <TxtPoppinSemiBold
              numberOfLines={3}
              style={styles.title}
              title={`WO #  ${item?.WorkOrderNo}${
                item?.ScopeNo ? `/${item?.ScopeNo}` : ""
              }`}
            />
            <TxtPoppinMedium
              style={styles.subtitle}
              numberOfLines={3}
              title={`${item?.TaskName}`}
            />
            <View style={styles.dateContainer}>
              <View style={styles.imageContainer}>
                <Docs width={"100%"} height={"100%"} />
              </View>
              <TxtPoppinNormal
                style={{ ...styles.cardText, flex: 1 }}
                numberOfLines={3}
                title={item?.ProjectName}
              />
            </View>
            <View style={[styles.dateContainer]}>
              <View style={styles.imageContainer}>
                <Location width={"100%"} height={"100%"} />
              </View>
              <TxtPoppinNormal
                style={{ ...styles.cardText, flex: 1 }}
                numberOfLines={3}
                title={`${item?.ClientAddress1}, ${item?.ClientAddress2}`}
              />
            </View>
            <View style={styles.dateContainer}>
              <View style={styles.imageContainer}>
                <User width={"100%"} height={"100%"} />
              </View>
              <TxtPoppinNormal
                style={{ ...styles.cardText, flex: 1 }}
                numberOfLines={3}
                title={item?.ClientName}
              />
            </View>
          </View>
          <View style={styles.rightColumn}>
            <View style={styles.pickupAndDropButton}>
              <PickUpAndDropButton data={item} navigation={navigation} />
            </View>
            <View style={styles.rightColumnContainer}>
              <View style={styles.dateContainer}>
                <View style={styles.imageContainer}>
                  <Calender2 width={"100%"} height={"100%"} />
                </View>
                <TxtPoppinNormal
                  style={styles.cardText}
                  title={moment(item?.JobDate).format("MM/DD/YY hh:mm a")}
                />
              </View>
              <View style={[styles.dateContainer, { marginTop: 4 }]}>
                <TxtPoppinNormal
                  style={styles.cardText}
                  title={item?.StartDayName}
                />
              </View>
              <View style={styles.telePhoneDialContainer}>
                <TagDialPhone
                  onPress={() => {
                    onPressDial();
                  }}
                  title={item?.ContactNo}
                />
              </View>
            </View>
          </View>
        </View>
        <View style={styles.subContainer}>
          <View
            style={[
              styles.horizontalLine,
              {
                backgroundColor: getWorkOrderStatusColor(item?.SubStatus),
              },
            ]}
          />
          <View style={styles.tagContainer}>
            <View style={styles.BottomTextContainer}>
              {isFutureDate
                ? null
                : dateDifference(item?.LockStartTime) > 36 && (
                    <>
                      {!IsLocked ? (
                        <View style={styles.imageContainer}>
                          <Unlock height="100%" width="100%" />
                        </View>
                      ) : (
                        <View style={styles.imageContainer}>
                          <Lock height="100%" width="100%" />
                        </View>
                      )}
                    </>
                  )}
              <TxtPoppinNormal
                style={styles.bottomText}
                title={
                  isFutureDate
                    ? null
                    : dateDifference(item?.LockStartTime) <= 24
                    ? `WO late after ${
                        24 - Math.trunc(dateDifference(item?.LockStartTime))
                      } hours`
                    : dateDifference(item?.LockStartTime) > 24 &&
                      dateDifference(item?.LockStartTime) <= 36
                    ? `WO lock after ${
                        36 - Math.trunc(dateDifference(item?.LockStartTime))
                      } hours`
                    : dateDifference(item?.LockStartTime) > 36
                    ? item.IsUnlocked
                      ? "WO Unlocked"
                      : "WO Locked"
                    : null
                }
              />
            </View>
            <TagNew title={item?.SubStatus} />
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};
