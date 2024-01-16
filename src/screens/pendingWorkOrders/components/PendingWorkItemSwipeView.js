import React, { useRef, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  FlatList,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import ClickRadio from "../../../assets/images/ClickRadio.svg";
import UnClickRadio from "../../../assets/images/UnClickRadio.svg";
import { updateWorkOrderList } from "../../../../store/workOrder";
import { TxtPoppinSemiBold } from "../../../components/text/TxtPoppinSemiBold";
import {
  getMoreInfo,
  insertOrUpdateFormAPI,
  submitFormDataAPI,
  updateDispatchStatusAPI,
} from "../../../resources/baseServices/form";
import {
  LIGHT_GRAY,
  ORANGE,
  RED,
  responsiveScale,
  WHITE,
} from "../../../styles";
import RBSheet from "react-native-raw-bottom-sheet";
import { TxtPoppinMedium } from "../../../components/text/TxtPoppinMedium";
import { showMessage } from "react-native-flash-message";
import { RFValue } from "react-native-responsive-fontsize";
import {
  deleteItemFromPendingWO,
  getpendingWorkOrdersResults,
  updateItemFromPendingWO,
} from "../../../helpers/sqlQuery";
import { setRefreshedOfflineData } from "../../../../store/workOrderForOffline";

const arrReasons = [
  "Client Cancel Work",
  "Duplicate Dispatch",
  "Wrong Project Dispatched",
  "Wrong Task Dispatched",
  "Wrong Shift",
  "Wrong Day",
  "Inclement Weather",
  "Work Delay",
  "Contractor Not Ready",
  "Out Sick",
];

export const PendingWorkItemSwipeView = ({
  item = {},
  onPress = () => {},
  navigation,
}) => {
  const userDetails = useSelector((state) => state.auth?.userDetails ?? "");
  const [isLoadingSubmit, setIsLoadingSubmit] = useState(false);
  const [txtValue, setTxtValue] = useState("");
  const [selectedReasonIndex, setSelectedReasonIndex] = useState(0);
  const [isLoadingMoreInfo, setIsLoadingMoreInfo] = useState(false);
  const internetAvailable = useSelector(
    (state) => state.workOrderForOffline?.internetAvailable
  );

  const dispatch = useDispatch();
  const refRBSheet = useRef();

  const onChange = (text) => {
    setTxtValue(text);
  };

  const onCloseBottomSheet = () => {
    setTxtValue("");
    setSelectedReasonIndex(0);
    setIsLoadingSubmit(false);
  };

  const onPressCancel = async () => {
    try {
      if (internetAvailable) {
        setIsLoadingSubmit(true);
        const sqlPendigWOResults = await getpendingWorkOrdersResults();
        const findedObjectFromSqlResults = sqlPendigWOResults?.find(
          (obj) => `${obj?.itemId}` === `${item?.Id}`
        );
        const data = JSON.parse(findedObjectFromSqlResults?.data);
        if (data?.shouldSave) {
          await insertOrUpdateFormAPI(data?.dispatchFormData);

          await updateItemFromPendingWO(
            JSON.stringify({ ...data, shouldSave: false }),
            `${item?.Id}`
          );
          // Refresh SQL
        }
        await updateDispatchStatusAPI({
          dispatchId: item?.Id,
          statusId: 50006,
          userId: userDetails?.id,
          reason: `${arrReasons?.[selectedReasonIndex]}`,
          comments: txtValue,
        });
        await deleteItemFromPendingWO(item?.Id);

        dispatch(setRefreshedOfflineData());
        dispatch(
          updateWorkOrderList({
            ...item,
            Status: "Cancelled",
            SubStatus: "Cancelled",
          })
        );
        showMessage({
          message: "Success!",
          description: "Order Cancelled Successfully!",
          type: "success",
        });
      } else {
        showMessage({
          message: "Failed!",
          description: `Internet connection required for this action.`,
          type: "danger",
        });
      }
    } catch (error) {
      showMessage({
        message: "",
        description: error,
        type: "danger",
      });
      console.log("[MasterForm] insertOrUpdateForm error: ", error);
    } finally {
      setIsLoadingSubmit(false);
    }
  };

  const onPressCancelButton = async () => {
    refRBSheet.current.open();

    // Alert.alert(
    //   'Are your sure?',
    //   `Are you sure you want to Cancel this WO #  ${item?.WorkOrderNo}?`,
    //   [
    //     // The "Yes" button
    //     {
    //       text: 'Yes',
    //       onPress: async () => {
    //         try {
    //           setIsLoadingSubmit(true);
    //           await updateDispatchStatusAPI({
    //             dispatchId: item?.Id,
    //             statusId: 50006,
    //             userId: userDetails?.id,
    //           });
    //           dispatch(
    //             updateWorkOrderList({
    //               ...item,
    //               Status: 'Cancelled',
    //               SubStatus: 'Cancelled',
    //             }),
    //           );
    //         } catch (error) {
    //           console.log('[MasterForm] insertOrUpdateForm error: ', error);
    //         } finally {
    //           setIsLoadingSubmit(false);
    //         }
    //       },
    //     },
    //     // The "No" button
    //     // Does nothing but dismiss the dialog when tapped
    //     {
    //       text: 'No',
    //     },
    //   ],
    // );
  };

  const onPressIn_ProgressButton = async () => {
    Alert.alert(
      "Are your sure?",
      `Are you sure you want to move this WO #  ${item?.WorkOrderNo} to "In-Progress"?`,
      [
        // The "Yes" button
        {
          text: "Yes",
          onPress: async () => {
            try {
              setIsLoadingSubmit(true);
              await updateDispatchStatusAPI({
                dispatchId: item?.Id,
                statusId: 50001,
                userId: userDetails?.id,
              });
              dispatch(
                updateWorkOrderList({
                  ...item,
                  Status: "InProgress",
                  SubStatus: "InProgress",
                })
              );
            } catch (error) {
              console.log(
                "[CompletedWorkItemSwipeView] onPressCancelButton error: ",
                error
              );
            } finally {
              setIsLoadingSubmit(false);
            }
          },
        },
        // The "No" button
        // Does nothing but dismiss the dialog when tapped
        {
          text: "No",
        },
      ]
    );
  };
  const handleMoreInfo = async (Id) => {
    try {
      setIsLoadingMoreInfo(true);
      const res = await getMoreInfo(Id);
      setIsLoadingMoreInfo(false);
      navigation.navigate("HtmlViewerScreen", { result: res?.data.result });
    } catch (error) {
      setIsLoadingMoreInfo(false);
      console.log(error);
    }
  };

  return (
    <View
      style={{
        width: "100%",
        flex: 1,
        paddingVertical: 30,
      }}
    >
      <View
        style={{
          width: "100%",
          flex: 1,
          flexDirection: "row",
        }}
      >
        <TouchableOpacity
          onPress={() => {
            handleMoreInfo(item?.Id);
          }}
          style={{
            width: "25%",
            height: "100%",
            borderTopLeftRadius: 20,
            borderBottomLeftRadius: 20,
            backgroundColor: "#85afe7",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {!isLoadingMoreInfo ? (
            <TxtPoppinSemiBold
              style={{
                color: WHITE,
                marginTop: 4,
                fontSize: RFValue(15),
              }}
              title={"More info"}
            />
          ) : (
            <ActivityIndicator size={"large"} color={"white"} />
          )}
        </TouchableOpacity>
        <View style={{ width: "25%" }}></View>
        <TouchableOpacity
          disabled={isLoadingSubmit}
          onPress={() =>
            item?.Status === "Cancelled"
              ? onPressIn_ProgressButton()
              : onPressCancelButton()
          }
          style={{
            width: "50%",
            height: "100%",
            borderTopRightRadius: 20,
            borderBottomEndRadius: 20,
            backgroundColor: item?.Status === "Cancelled" ? ORANGE : RED,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <TxtPoppinSemiBold
            style={{
              color: WHITE,
              marginTop: 4,
              fontSize: RFValue(15),
            }}
            title={
              item?.Status === "Cancelled" ? 'Move to "In-Progress"' : "Cancel"
            }
          />
        </TouchableOpacity>
      </View>

      <RBSheet
        ref={refRBSheet}
        closeOnDragDown={true}
        closeOnPressMask={true}
        height={530}
        onClose={onCloseBottomSheet}
        customStyles={{
          wrapper: {
            backgroundColor: "rgba(0,0,0,0.5)",
          },
          draggableIcon: {
            backgroundColor: "#000",
          },
        }}
      >
        <View style={{ flex: 1, marginHorizontal: 20 }}>
          <FlatList
            data={arrReasons}
            style={{ paddingBottom: 20 }}
            numColumns={2}
            renderItem={({ item, index }) => (
              <TouchableOpacity
                onPress={() => {
                  setSelectedReasonIndex(index);
                }}
                style={{
                  alignItems: "center",
                  height: 40,
                  flex: 1,
                  flexDirection: "row",
                  marginTop: 10,
                  paddingLeft: 10,
                  borderRadius: 5,
                  marginRight: index % 2 === 0 ? 20 : 0,
                  backgroundColor: WHITE,
                  shadowColor: "#171717",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.15,
                  shadowRadius: 3,
                }}
              >
                <View
                  style={{
                    height: 21,
                    width: 21,
                    marginRight: 10,
                  }}
                >
                  {selectedReasonIndex === index ? (
                    <ClickRadio width={"100%"} height={"100%"} />
                  ) : (
                    <UnClickRadio width={"100%"} height={"100%"} />
                  )}
                </View>
                <TxtPoppinMedium
                  style={{ fontSize: RFValue(12.5) }}
                  title={item}
                />
              </TouchableOpacity>
            )}
            ListHeaderComponent={
              <TxtPoppinMedium
                style={{ fontSize: RFValue(12.5) }}
                title={`Are you sure you want to Cancel this WO #  ${item?.WorkOrderNo}?`}
              />
            }
            ListFooterComponent={
              <View>
                <View
                  style={{
                    height: 130,
                    borderRadius: 10,
                    padding: 10,
                    marginTop: 25,
                    overflow: "hidden",
                    backgroundColor: WHITE,
                    borderColor: LIGHT_GRAY,
                    borderWidth: 1,
                  }}
                >
                  <TextInput
                    onChangeText={(txt) => onChange(txt)}
                    value={txtValue}
                    placeholder="Comments"
                    textAlignVertical={"top"}
                    multiline
                    style={{ width: "100%", flex: 1 }}
                  />
                </View>
                <TouchableOpacity
                  onPress={onPressCancel}
                  style={{
                    alignItems: "center",
                    justifyContent: "center",
                    height: 50,
                    flex: 1,
                    marginTop: 10,
                    paddingLeft: 10,
                    marginHorizontal: 5,
                    borderRadius: 5,
                    backgroundColor: RED,
                    shadowColor: "#171717",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 3,
                  }}
                >
                  {isLoadingSubmit ? (
                    <ActivityIndicator color={WHITE} />
                  ) : (
                    <TxtPoppinMedium
                      style={{ fontSize: RFValue(12.5), color: WHITE }}
                      title={"WO Cancel"}
                    />
                  )}
                </TouchableOpacity>
              </View>
            }
            keyExtractor={(item) => item.toString()}
          />
        </View>
      </RBSheet>
    </View>
  );
};
