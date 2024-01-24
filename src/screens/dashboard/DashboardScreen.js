/* eslint-disable react-hooks/exhaustive-deps */
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  StyleSheet,
  View,
  FlatList,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Pressable,
  useWindowDimensions,
  Linking,
  Platform,
  Text,
  RefreshControl,
  AppState,
  NativeModules,
} from "react-native";
import Geolocation, {
  getCurrentPosition,
} from "react-native-geolocation-service";
import { request, PERMISSIONS, check } from "react-native-permissions";
import { RFValue } from "react-native-responsive-fontsize";
import {
  getUniqueId,
  useDeviceName,
  getIpAddress,
  getBrand,
  getSystemName,
  getSystemVersion,
  getPhoneNumber,
  getCarrier,
} from "react-native-device-info";
var pjson = require("./../../../package.json");
import TopBar from "../../components/TopBar";
import {
  LIGHT_GRAY,
  ORANGE,
  responsiveScale,
  WHITE,
  WINDOW_WIDTH,
} from "../../styles";
import StatusItemLayout from "../../assets/images/StatusItemLayout.svg";
import Pending from "../../assets/images/Pending.svg";
import Completed from "../../assets/images/Completed.svg";
import Summarys from "../../assets/images/Summarys.svg";
import Canceled from "../../assets/images/Canceled.svg";
import InProgressWO from "../../assets/images/InProgressWO.svg";
import AddNewWO from "../../assets/images/AddNewWO.svg";

import MyReport from "../../assets/images/MyReport.svg";
import FloatingButton from "../../assets/images/FloatingButton.svg";
import Folder from "../../assets/images/Folder.svg";
import Reports from "../../assets/images/Reports.svg";
import LinearGradient from "react-native-linear-gradient";
import { TxtPoppinSemiBold } from "../../components/text/TxtPoppinSemiBold";
import { TxtPoppinMedium } from "../../components/text/TxtPoppinMedium";
import { TxtPoppinNormal } from "../../components/text/TxtPoppinNormal";
import NewFolderModal from "./components/NewFolderModal";
import moment from "moment";
import { getAllDocuments } from "../../resources/baseServices/folder";
import { useDispatch, useSelector } from "react-redux";
import {
  setAllFormIds,
  setLoadingWorkOrder,
  setWorkOrderList,
} from "../../../store/workOrder";
import { getWorkOrdersAPI } from "../../resources/baseServices/timeSheet";
import {
  getAllFormSampleData,
  getAllReportTemplate,
  getCommonCollectionAPI,
  getDispatchFormData,
  getFormSummaryTemplateByUserIdAPI,
  getFormTemplate,
  getPickUpAndDropList,
  getWorkOrderDashboardAPI,
  insertOrUpdateFormAPI,
  updateDispatchStatusAPI,
} from "../../resources/baseServices/form";
import {
  setAllReportTemplate,
  setCommonCollection,
  setFormSampleData,
  setFormTemplate,
  setPickUpAndDropData,
  setSummaryList,
  setSyncOfflineLoader,
} from "../../../store/form";
import { useFocusEffect } from "@react-navigation/native";
import {
  addVersionInfo,
  getCurrentAppVersion,
} from "../../resources/baseServices/auth";
import RBSheet from "react-native-raw-bottom-sheet";
import { setCurrentLocationAction } from "../../../store/currentLocation";
import {
  deleteItemFromPendingWO,
  getpendingWorkOrdersResults,
  insertNewItemInPendingWorkOrdersResults,
  updateAllDataFromPendingWO,
  updateItemFromPendingWO,
} from "../../helpers/sqlQuery";
import SyncOfflineLoader from "../../components/SyncOfflineLoader";
import { isEmpty } from "lodash";
import {
  setDashBoardDetails,
  setFolderDetails,
  setLateAndLockWO,
} from "../../../store/dashboard";
import {
  setCountOfflineData,
  setIsTapSynchButton,
  setPendingWorkOrderListForOffline,
  setRefreshedOfflineData,
  setTotalCountOfflineData,
} from "../../../store/workOrderForOffline";
import useCheckNetworkInfo from "../../hooks/useCheckNetworkInfo";
import AsyncStorage from "@react-native-community/async-storage";
import PermissionModal from "../../components/PermissionModal";
// NewWO,
// InProgressWO,
// SubmittedWO,
// ReviewedWO,
// ResubmittedWO,
// CancelledWO,

const arrStaturItems = [
  {
    title: "New",
    subTitle: "NewWO",
    color: ["#5985DC", "#3870DF", "#1558DC"],
    image: <AddNewWO width={"100%"} height={"100%"} />,
  },
  {
    title: "In-Progress",
    subTitle: "InProgressWO",
    color: ["#EBA25E", "#E17C1E", "#D86C09"],
    image: <InProgressWO width={"100%"} height={"100%"} />,
  },
  {
    title: "Completed",
    subTitle: "SubmittedWO",
    color: ["#21EC8B", "#18CE77", "#0FB063"],
    image: <Completed width={"100%"} height={"100%"} />,
  },
  {
    title: "Reviewed",
    subTitle: "ReviewedWO",
    color: ["#696764", "#64615F", "#353332"],
    image: <Pending width={"100%"} height={"100%"} />,
  },
  {
    title: "Late/ Locked WO",
    subTitle: "lateAndLockWO",
    color: ["#1EC5EA", "#1CA9E4", "#198BDE"],
    image: <MyReport width={"100%"} height={"100%"} />,
  },
  {
    title: "Cancelled",
    subTitle: "CancelledWO",
    color: ["#FF5858", "#F63C54", "#EC1F51"],
    image: <Canceled width={"100%"} height={"100%"} />,
  },
];
const arrReportsItems = [
  {
    title: "Summary List",

    subTitle: "SummaryListWO",
    color: ["#E06EE0", "#DF38D1", "#DC15D2"],
    image: <Summarys width={"100%"} height={"100%"} />,
  },
  {
    title: "Report Look Up",
    subTitle: "WorkOrderReportWO",
    color: ["#9E6EE0", "#894AE0", "#7F38E0"],
    image: <Reports width={"100%"} height={"100%"} />,
  },
];

const DashboardScreen = ({ navigation, route }) => {
  const [isShowAddNewModal, setIsShowAddNewModal] = useState(false);
  const [isFolderLoading, setIsFolderLoading] = useState(false);
  const [isAvailableInRange, setIsAvailableInRange] = useState(false);
  const [isLoadingRefresh, setIsLoadingRefresh] = useState(false);
  const [appStates, setAppStates] = useState(AppState.currentState);
  const [restartTimeout, setRestartTimeout] = useState(null);
  const { width, height } = useWindowDimensions();
  const refRBSheetForAppUpdate = useRef();
  const { loading, result } = useDeviceName();
  const { internetAvailable } = useCheckNetworkInfo();

  const userDetails = useSelector((state) => state.auth?.userDetails ?? "");
  const arrFolders = useSelector((state) => state.dashboard?.arrFolders ?? []);
  const isRefreshedOffline = useSelector(
    (state) => state.workOrderForOffline?.isRefreshed
  );
  const isTapSynchButton = useSelector(
    (state) => state.workOrderForOffline?.isTapSynchButton
  );
  const dashBoardData = useSelector(
    (state) =>
      state.dashboard?.dashBoardData ?? {
        PendingWO: 0,
        CompletedWO: 0,
        CancelledWO: 0,
        MyReports: 0,
        lateAndLockWO: 0,
      }
  );
  const pendingworkOrderListForOffline = useSelector(
    (state) => state.workOrderForOffline?.pendingworkOrderListForOffline ?? []
  );

  useEffect(() => {
    const appStateChangeHandler = (nextAppState) => {
      if (nextAppState === 'background') {
        const restartTimeout = setTimeout(() => {
          NativeModules.DevSettings.reload();
        },7 * 24 * 60 * 60 * 1000 );

        setRestartTimeout(restartTimeout);
      }

      setAppStates(nextAppState);
    };

    AppState.addEventListener('change', appStateChangeHandler);

    return () => {
      AppState.removeEventListener('change', appStateChangeHandler);
      if (restartTimeout) {
        clearTimeout(restartTimeout);
      }
    };
  }, [appStates]);


  const checkIsFutureDate = (targetTime) => {
    const targetDate = moment(targetTime);
    const currentDate = moment();
    if (currentDate < targetDate) {
      return true;
    } else {
      return false;
    }
  };

  useEffect(() => {
    const LateAndLockedWO = pendingworkOrderListForOffline
      ?.filter((obj) => !obj?.data?.shouldMoveToCompleted)
      ?.filter((item) => {
        const IsLocked =
          dateDifference(item.data.pendingData?.JobDate) > 36 &&
          !item.data?.pendingData?.IsUnlocked;
        const isFutureDate = checkIsFutureDate(item.data.pendingData?.JobDate);
        return (IsLocked && !isFutureDate);
      });
    
      dispatch(setLateAndLockWO(LateAndLockedWO?.length ?? 0));
    
  }, [pendingworkOrderListForOffline]);

  const pendingworkOrderList = useSelector(
    (state) => state.workOrder?.pendingworkOrderList ?? []
  );

  const dispatch = useDispatch();
  const getWorkOrdersCount = async () => {
    try {
      const res = await getWorkOrderDashboardAPI({
        userId: userDetails?.id,
      });
      dispatch(setDashBoardDetails(res?.data));
    } catch (error) {
      console.log("getWorkOrders error: ", error);
    } finally {
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
  function calculateWeekendHours(targetTime) {
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
  }

  const getWorkOrders = async (isDisableLoadwer = false) => {
    try {
      if (isDisableLoadwer == false) {
        dispatch(setLoadingWorkOrder(true));
      }

      const res = await getWorkOrdersAPI({
        userId: userDetails?.id,
      });
      dispatch(setWorkOrderList(res?.data));

      let arrFormIds = [...res?.data].map((item, index) => {
        return item?.FormId;
      });
      const uniqueIds = Array.from(new Set(arrFormIds));
      dispatch(setAllFormIds(uniqueIds));

      const resFormTemplate = await getFormTemplate(userDetails?.id);

      dispatch(setFormTemplate(resFormTemplate?.data));
    } catch (error) {
      console.log("getWorkOrders error: ", error);
    } finally {
      dispatch(setLoadingWorkOrder(false));
    }
  };

  const getCommanTemplate = async () => {
    try {
      const res = await getCommonCollectionAPI(userDetails?.id);
      dispatch(setCommonCollection(res?.data));
    } catch (error) {
      console.log("getWorkOrders error: ", error);
    }
  };

  const getFormSummaryTemplateByUserId = async () => {
    try {
      const res = await getFormSummaryTemplateByUserIdAPI(userDetails?.id);

      dispatch(setSummaryList(res?.data));
    } catch (error) {
      console.log("getFormSummaryTemplateByUserId error: ", error);
    } finally {
    }
  };

  const getFolderDetails = async () => {
    try {
      setIsFolderLoading(true);
      const res = await getAllDocuments();
      dispatch(setFolderDetails(res?.data));
    } catch (error) {
      console.log("[DashboardScreen] getFolderDetails error: ", error);
    } finally {
      setIsFolderLoading(false);
    }
  };

  const getPickUpAndDropCheckList = async () => {
    try {
      setIsFolderLoading(true);
      const res = await getPickUpAndDropList();

      dispatch(setPickUpAndDropData(res.data));
    } catch (error) {
      console.log("[DashboardScreen] getFolderDetails error: ", error);
    } finally {
      setIsFolderLoading(false);
    }
  };

  const getWOCount = (title, obj) => {
    return obj?.[title] ?? "";
  };

  const StatusItem = ({ style, item = {} }) => {
    return (
      <LinearGradient
        colors={item?.color}
        style={[
          {
            width: (width - 85) / 2,
            aspectRatio: 3.3,
            backgroundColor: "green",
            marginTop: 25,
            borderRadius: 20,
          },
          { ...style },
        ]}
      >
        <View
          style={{
            width: "100%",
            flex: 1,
            justifyContent: "flex-end",
            // marginBottom: -10,
          }}
        >
          <StatusItemLayout width={"100%"} />
        </View>
        <Pressable
          onPress={() => {
            if (
              item?.subTitle === "ReviewedWO" ||
              item?.subTitle === "SubmittedWO"
            ) {
              navigation.navigate("CompletedWorkOrders");
            } else {
              navigation.navigate("PendingWorkOrders");
            }
          }}
          style={{
            height: "100%",
            width: "100%",
            position: "absolute",
            justifyContent: "center",
          }}
        >
          <View style={{ height: "60%", width: "100%", flexDirection: "row" }}>
            <View
              style={{
                height: "80%",
                aspectRatio: 1,
                marginLeft: "10%",
                alignSelf: "center",
              }}
            >
              {item?.image}
            </View>
            <View
              style={{
                marginLeft: 20,
                marginRight: 15,
                height: "100%",
                flex: 1,
              }}
            >
              <TxtPoppinSemiBold
                style={{ fontSize: RFValue(18), color: WHITE }}
                title={getWOCount(item?.subTitle, dashBoardData)}
              />
              <TxtPoppinMedium
                style={{
                  marginTop: Platform.OS === "ios" ? -15 : null,
                  color: WHITE,
                  fontSize: RFValue(14),
                }}
                title={item?.title}
              />
            </View>
          </View>
        </Pressable>
      </LinearGradient>
    );
  };
  const ReportsItem = ({ style, item = {} }) => {
    return (
      <LinearGradient
        colors={item?.color}
        style={[
          {
            width: (width - 85) / 2,
            aspectRatio: 3.3,
            backgroundColor: "green",
            marginTop: 25,
            borderRadius: 20,
          },
          { ...style },
        ]}
      >
        <View
          style={{
            width: "100%",
            flex: 1,
            justifyContent: "flex-end",
            marginBottom: -10,
          }}
        >
          <StatusItemLayout width={"100%"} />
        </View>
        <Pressable
          onPress={() => {
            if (item?.subTitle === "SummaryListWO") {
              navigation.navigate("SummaryList");
            } else if (item?.subTitle === "WorkOrderReportWO") {
              navigation.navigate("WorkOrderReport");
            }
          }}
          style={{
            height: "100%",
            width: "100%",
            position: "absolute",
            justifyContent: "center",
          }}
        >
          <View style={{ height: "60%", width: "100%", flexDirection: "row" }}>
            <View
              style={{
                height: "80%",
                aspectRatio: 1,
                marginLeft: "10%",
                alignSelf: "center",
              }}
            >
              {item?.image}
            </View>
            <View
              style={{
                marginLeft: 20,
                marginRight: 15,
                justifyContent: "center",
                height: "100%",
                flex: 1,
              }}
            >
              <TxtPoppinMedium
                style={{
                  color: WHITE,
                  fontSize: RFValue(14),
                }}
                title={item?.title}
              />
            </View>
          </View>
        </Pressable>
      </LinearGradient>
    );
  };

  const FolderItem = ({ style, item = {}, index }) => {
    return (
      <TouchableOpacity
        onPress={() => {
          navigation.navigate("FolderDetailScreen", { item: item });
        }}
        style={[
          {
            width: (width - 100) / 3,
            aspectRatio: 1.3,
            backgroundColor: WHITE,
            marginTop: index > 2 ? 20 : 0,
            borderRadius: 20,
            alignItems: "center",
          },
          { ...style },
        ]}
      >
        <View
          style={{
            height: "50%",
            aspectRatio: 1,
            alignSelf: "center",
            marginTop: "11%",
          }}
        >
          <Folder height={"100%"} width={"100%"} />
        </View>
        <View style={{ alignSelf: "center", height: "100%", flex: 1 }}>
          <TxtPoppinMedium
            style={{
              textAlign: "center",
              marginTop: "3.5%",
              fontWeight: "600",
              fontSize: RFValue(13),
            }}
            title={item?.folderName}
          />
        </View>
      </TouchableOpacity>
    );
  };

  const onPressPlusButton = () => {
    setIsShowAddNewModal(true);
  };

  const getCurrentAppVersionForUpdateApp = async () => {
    try {
      if (Platform.OS === "android") {
        return;
      }
      setIsFolderLoading(true);
      const res = await getCurrentAppVersion();
      if (versionCompare(pjson.version, res?.data?.minVersion) <= 0) {
        refRBSheetForAppUpdate.current.open();
        setIsAvailableInRange(false);
      } else if (
        versionCompare(pjson.version, res?.data?.minVersion) > 0 &&
        versionCompare(pjson.version, res?.data?.maxVersion) <= 0
      ) {
        setIsAvailableInRange(true);
        refRBSheetForAppUpdate.current.open();
      }
    } catch (error) {
      console.log(
        "[DashboardScreen] getCurrentAppVersionForUpdateApp error: ",
        error
      );
    } finally {
      setIsFolderLoading(false);
    }
  };

  function versionCompare(v1, v2, options) {
    var lexicographical = options && options.lexicographical,
      zeroExtend = options && options.zeroExtend,
      v1parts = v1.split("."),
      v2parts = v2.split(".");

    function isValidPart(x) {
      return (lexicographical ? /^\d+[A-Za-z]*$/ : /^\d+$/).test(x);
    }

    if (!v1parts.every(isValidPart) || !v2parts.every(isValidPart)) {
      return NaN;
    }

    if (zeroExtend) {
      while (v1parts.length < v2parts.length) v1parts.push("0");
      while (v2parts.length < v1parts.length) v2parts.push("0");
    }

    if (!lexicographical) {
      v1parts = v1parts.map(Number);
      v2parts = v2parts.map(Number);
    }

    for (var i = 0; i < v1parts.length; ++i) {
      if (v2parts.length == i) {
        return 1;
      }

      if (v1parts[i] == v2parts[i]) {
        continue;
      } else if (v1parts[i] > v2parts[i]) {
        return 1;
      } else {
        return -1;
      }
    }

    if (v1parts.length != v2parts.length) {
      return -1;
    }

    return 0;
  }

  const onPressAppUpdate = () => {
    const link = "itms-apps://itunes.apple.com/us/app/id1633473396?mt=8";
    Linking.canOpenURL(link).then(
      (supported) => {
        supported && Linking.openURL(link);
      },
      (err) => console.log(err)
    );
  };

  const onPressAppUpdateCancel = () => {
    refRBSheetForAppUpdate.current.close();
  };

  const formSampleData = async () => {
    const resSampleData = await getAllFormSampleData();
    const resGetAllReportTemplate = await getAllReportTemplate();
    dispatch(setAllReportTemplate(resGetAllReportTemplate?.data));
    dispatch(setFormSampleData(resSampleData?.data));
  };

  const addVersionInfoAPI = async () => {
    try {
      let data = {
        appVersion: pjson.version || "",
        deviceUniqueId:
          Platform.OS === "ios" ? (await getUniqueId()) || "" : "",
        platform: Platform.OS,
        deviceName: result,
        ipAddress: Platform.OS === "ios" ? (await getIpAddress()) || "" : "",
        brandName: getBrand() || "",
        deviceOSName: getSystemName() || "",
        deviceOSVersion: getSystemVersion() || "",
        carrierName: Platform.OS === "ios" ? (await getCarrier()) || "" : "",
        cellularNumber:
          Platform.OS === "ios" ? (await getPhoneNumber()) || "" : "",
      };

      Geolocation.getCurrentPosition(
        async (obj) => {
          data.LocationLate = obj.coords.latitude;
          data.LocationLong = obj.coords.longitude;
          await addVersionInfo(userDetails?.id, data);
        },
        (getLocationError) => {
          console.log("getCurrentLocation== ", getLocationError);
        }
      );
    } catch (error) {}
  };

  const syncOfflineDataToServer = async (cb) => {
    try {
      const sqlPendigWOResults = await getpendingWorkOrdersResults();
      let count = 0;
      if (sqlPendigWOResults?.length > 0) {
        for (let index = 0; index < sqlPendigWOResults.length; index++) {
          const element = sqlPendigWOResults[index];
          const data = JSON.parse(element?.data);

          // if (data?.shouldMoveToCompleted) {
          //   await updateDispatchStatusAPI(data?.completedData);
          //   await deleteItemFromPendingWO(`${element?.itemId}`);
          // }

          if (data?.shouldSave) {
            await insertOrUpdateFormAPI(data?.dispatchFormData);

            await updateItemFromPendingWO(
              JSON.stringify({ ...data, shouldSave: false }),
              `${element?.itemId}`
            );

            // Refresh SQL
          }

          count = count + 1;

          if (count == sqlPendigWOResults.length) {
            dispatch(setRefreshedOfflineData());
            cb();
          }
        }
      } else {
        cb();
      }
    } catch (error) {
      cb();
    }
  };

  const setOfflineData = async () => {
    try {
      const sqlPendigWOResults = await getpendingWorkOrdersResults();

      if (sqlPendigWOResults?.length > 0) {
        const mappedArray = sqlPendigWOResults?.map((obj) => {
          return { ...obj, data: JSON.parse(obj.data) };
        });
        dispatch(setPendingWorkOrderListForOffline(mappedArray));
      } else {
        dispatch(setPendingWorkOrderListForOffline([]));
      }
    } catch (error) {}
  };

  const synchOfflineData = async () => {
    try {
      const sqlPendigWOResults = await getpendingWorkOrdersResults();
      dispatch(setRefreshedOfflineData());
      if (pendingworkOrderList?.length > 0) {
        if (pendingworkOrderList?.length !== sqlPendigWOResults?.length) {
          dispatch(setSyncOfflineLoader(true));
        }

        let count = 0;

        dispatch(setCountOfflineData(count));
        dispatch(setTotalCountOfflineData(pendingworkOrderList?.length));

        for (let index = 0; index < pendingworkOrderList.length; index++) {
          const element = pendingworkOrderList[index];

          const findFormObject = sqlPendigWOResults?.filter(
            (obj) => `${obj?.itemId}` == `${element?.Id}`
          );

          if (isEmpty(findFormObject)) {
            const res = await getDispatchFormData(
              `${element?.Id}`,
              `${element?.FormId}`
            );
            const updatedData = {
              dispatchFormData: res?.data,
              pendingData: element,
              shouldSave: false,
              shouldMoveToCompleted: false,
            };

            const sqlPendigWOResults1 = await getpendingWorkOrdersResults();
            const findFormObject1 = sqlPendigWOResults1?.filter(
              (obj) => `${obj?.itemId}` == `${element?.Id}`
            );
            if (isEmpty(findFormObject1)) {
              await insertNewItemInPendingWorkOrdersResults(
                updatedData,
                `${element?.Id}`
              );
            } else {
              const data = JSON.parse(findFormObject?.[0]?.data);
              await updateItemFromPendingWO(
                JSON.stringify({ ...data, pendingData: element }),
                `${element?.Id}`
              );
            }
          } else {
            const data = JSON.parse(findFormObject?.[0]?.data);
            await updateItemFromPendingWO(
              JSON.stringify({ ...data, pendingData: element }),
              `${element?.Id}`
            );
          }
          count = count + 1;
          dispatch(setCountOfflineData(count));

          if (count == pendingworkOrderList.length) {
            setTimeout(() => {
              dispatch(setIsTapSynchButton(false));
            }, 1500);

            dispatch(setSyncOfflineLoader(false));
            dispatch(setRefreshedOfflineData());
            if (sqlPendigWOResults?.length > 0) {
              let count1 = 0;

              for (let index = 0; index < sqlPendigWOResults.length; index++) {
                const element = sqlPendigWOResults[index];

                const sqlPendigWOResults2 = await getpendingWorkOrdersResults();

                if (sqlPendigWOResults2?.length > 0) {
                  const findSqlArrPendingWo = pendingworkOrderList?.filter(
                    (obj) => `${element?.itemId}` == `${obj?.Id}`
                  );
                  if (isEmpty(findSqlArrPendingWo)) {
                    await deleteItemFromPendingWO(`${element?.itemId}`);
                    // Refresh SQL
                  }
                }

                count1 = count1 + 1;
                if (count1 == sqlPendigWOResults.length) {
                  dispatch(setRefreshedOfflineData());
                }
              }
            }
          } else {
            setTimeout(() => {
              dispatch(setIsTapSynchButton(false));
            }, 1500);
          }
        }
      } else {
        setTimeout(() => {
          dispatch(setIsTapSynchButton(false));
        }, 1500);
      }
    } catch (error) {
      setTimeout(() => {
        dispatch(setIsTapSynchButton(false));
      }, 1500);
    }
  };

  const onRefresh = async () => {
    try {
      setIsLoadingRefresh(true);

      await getWorkOrdersCount();
      await getFormSummaryTemplateByUserId();
      getFolderDetails();
      getWorkOrders(true);

      formSampleData();
      getPickUpAndDropCheckList();
    } catch (error) {
      console.log("getWorkOrders error: ", error);
    } finally {
      setIsLoadingRefresh(false);
    }
  };

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

  useEffect(() => {
    getCommanTemplate();
    getCurrentAppVersionForUpdateApp();
    getFolderDetails();
    getWorkOrders();
    getFormSummaryTemplateByUserId();
    formSampleData();
    getPickUpAndDropCheckList();
  }, []);

  // useEffect(() => {
  //   check(
  //     Platform.select({
  //       android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
  //       ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
  //     })
  //   )
  //     .then((result) => {
  //       // 'granted'
  //       request(
  //         Platform.select({
  //           android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
  //           ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
  //         })
  //       ).then((reqResult) => {
  //      getCurrentLocation();
  //       });
  //     })
  //     .catch(() => {});
  // }, []);

  useFocusEffect(
    useCallback(() => {
      getWorkOrdersCount();
    }, [])
  );

  // useEffect(() => {
  //   // synchOfflineData();
  // }, [pendingworkOrderList]);

  const appState = useRef(AppState.currentState);

  useEffect(() => {
    addVersionInfoAPI();

    const subscription = AppState.addEventListener("change", (nextAppState) => {
      if (appState.current.match(/inactive|background|active/)) {
        console.log("App has come to the foreground!");
        addVersionInfoAPI();
      }

      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, []);

  useEffect(() => {
    setOfflineData();
  }, [isRefreshedOffline]);

  useEffect(() => {
    if (internetAvailable) {
      syncOfflineDataToServer(() => {
        setTimeout(() => {
          synchOfflineData();
        }, 500);
      });
    }
  }, [internetAvailable, pendingworkOrderList, isTapSynchButton]);

  return (
    <View style={styles.container}>
      <TopBar
        isShowRefresh
        isShowLeftIcon
        headingText="Dashboard"
        onPressRefresh={() => {
          onRefresh();
        }}
      />
      <View style={{ marginHorizontal: 30, flex: 1 }}>
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={isLoadingRefresh}
              onRefresh={onRefresh}
            />
          }
          style={{ width: "100%" }}
        >
          <View
            style={{
              width: "100%",
              marginTop: 15,
              height: 40,
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <View
              style={{
                height: "100%",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "row",
              }}
            >
              <TxtPoppinMedium
                style={{ fontSize: RFValue(11) }}
                title={" Welcome: "}
              />
              <TxtPoppinMedium
                style={{ fontSize: RFValue(11) }}
                title={userDetails?.firstName + " " + userDetails?.lastName}
              />
            </View>
            <View
              style={{
                height: "100%",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "row",
              }}
            >
              <TxtPoppinMedium
                style={{ fontSize: RFValue(11) }}
                title={"Date: "}
              />
              <TxtPoppinMedium
                style={{ fontSize: RFValue(11) }}
                title={moment().format("MM/DD/YY ")}
              />
            </View>
          </View>
          <FlatList
            data={arrStaturItems}
            numColumns={2}
            scrollEnabled={false}
            renderItem={({ item }) => (
              <StatusItem item={item} style={{ marginRight: 25 }} />
            )}
            keyExtractor={(item) => item.id}
          />
          <FlatList
            data={arrReportsItems}
            numColumns={2}
            scrollEnabled={false}
            renderItem={({ item }) => (
              <ReportsItem item={item} style={{ marginRight: 25 }} />
            )}
            keyExtractor={(item) => item.id}
          />
          <View
            style={{
              width: "100%",
              marginTop: 15,
              height: 80,
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <View
              style={{
                height: "100%",
                justifyContent: "center",
                alignItems: "center",
                flexDirection: "row",
              }}
            >
              <View
                style={{
                  height: 25,
                  width: 4,
                  marginRight: 10,
                  backgroundColor: ORANGE,
                }}
              ></View>
              <TxtPoppinMedium title="Folders" />
            </View>
            {/* <TouchableOpacity
              onPress={onPressPlusButton}
              style={{height: 80, width: 80, paddingTop: 5}}>
              <FloatingButton width={'100%'} height={'100%'} />
            </TouchableOpacity> */}
          </View>

          {isFolderLoading ? (
            <ActivityIndicator size={"large"} color={ORANGE} />
          ) : (
            <FlatList
              data={arrFolders}
              style={{ paddingBottom: 20 }}
              numColumns={3}
              scrollEnabled={false}
              ListEmptyComponent={() => (
                <View
                  style={{
                    width: "100%",
                    height: 300,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <TxtPoppinMedium
                    style={{ fontSize: RFValue(20) }}
                    title={"Empty Folders"}
                  />
                </View>
              )}
              renderItem={({ item, index }) => (
                <FolderItem
                  item={item}
                  style={{ marginRight: (index + 1) % 3 !== 0 ? 20 : 0 }}
                  index={index}
                />
              )}
              keyExtractor={(item) => item.folderName}
            />
          )}
        </ScrollView>
      </View>
      <NewFolderModal
        onModalClose={() => {
          setIsShowAddNewModal(false);
        }}
        onPressAddButton={(data) => {
          setIsShowAddNewModal(false);
          dispatch(
            setFolderDetails([
              {
                title: data,
                date: `${new Date()}`,
              },
              ...arrFolders,
            ])
          );
        }}
        isOpenModal={isShowAddNewModal}
      />

      <RBSheet
        ref={refRBSheetForAppUpdate}
        closeOnDragDown={isAvailableInRange}
        closeOnPressMask={isAvailableInRange}
        height={240}
        // onClose={onCloseBottomSheet}
        customStyles={{
          wrapper: {
            backgroundColor: "rgba(0,0,0,0.5)",
          },
          draggableIcon: {
            backgroundColor: "#000",
          },
        }}
      >
        <View style={{ flex: 1, alignItems: "center", marginHorizontal: 20 }}>
          <View
            style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
          >
            <TxtPoppinSemiBold
              style={{ fontSize: RFValue(19.5) }}
              title="New version available"
            />
            <TxtPoppinNormal
              style={{ fontSize: RFValue(16.5) }}
              title="Please, update app to new version to continue reposting."
            />
          </View>
          <View
            style={{
              height: 50,
              width: "100%",
              flexDirection: "row",
              marginBottom: 25,
            }}
          >
            {isAvailableInRange ? (
              <TouchableOpacity
                onPress={onPressAppUpdateCancel}
                style={{
                  alignItems: "center",
                  justifyContent: "center",
                  height: 50,
                  flex: 1,
                  marginTop: 10,
                  paddingLeft: 10,
                  marginHorizontal: 5,
                  borderRadius: 5,
                  backgroundColor: ORANGE,
                  shadowColor: "#171717",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 3,
                }}
              >
                <TxtPoppinMedium
                  style={{ fontSize: RFValue(12.5), color: WHITE }}
                  title={"Cancel"}
                />
              </TouchableOpacity>
            ) : null}
            <TouchableOpacity
              onPress={onPressAppUpdate}
              style={{
                alignItems: "center",
                justifyContent: "center",
                height: 50,

                flex: 1,
                marginTop: 10,
                paddingLeft: 10,
                marginHorizontal: 5,
                borderRadius: 5,
                backgroundColor: ORANGE,
                shadowColor: "#171717",
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 3,
                marginBottom: 15,
              }}
            >
              <TxtPoppinMedium
                style={{ fontSize: RFValue(12.5), color: WHITE }}
                title={"Update App"}
              />
            </TouchableOpacity>
          </View>
        </View>
      </RBSheet>

      <PermissionModal />
    </View>
  );
};

export default DashboardScreen;

const styles = StyleSheet.create({
  container: { flex: 1 },
});
