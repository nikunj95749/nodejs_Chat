import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Modal,
  Image,
  ActionSheetIOS,
  Platform,
  Alert,
  ActivityIndicator,
  Text,
  SafeAreaView,
  Dimensions,
} from "react-native";
import Location from "../assets/images/Add.svg";
import Geolocation from "react-native-geolocation-service";
import { RFValue } from "react-native-responsive-fontsize";
import { showMessage } from "react-native-flash-message";
import DateTimePickerModal from "react-native-modal-datetime-picker";

import { useDispatch, useSelector } from "react-redux";
import { TxtFieldWorkOrder } from "./filters/TxtFieldWorkOrder";
import CloseRed from "../assets/images/CloseRed.svg";
import Add from "../assets/images/Add.svg";
import MapView, { Marker, Circle } from "react-native-maps";
import Geocoder from "react-native-geocoding";

import {
  BLACK,
  DARK_GRAY,
  LIGHT_GRAY,
  ORANGE,
  RED,
  responsiveScale,
  WHITE,
} from "../styles";
import {
  PERMISSIONS,
  RESULTS,
  request,
  check,
  openSettings,
} from "react-native-permissions";
import { DropDownMenu } from "./filters/DropDownMenu";
import { TxtPoppinMedium } from "./text/TxtPoppinMedium";
import { TextInput } from "react-native";
import ActionSheet from "react-native-actionsheet";
import { useImageProgress } from "../hooks/useImageProgress";
import { TxtPoppinSemiBold } from "./text/TxtPoppinSemiBold";
import { submitPickUpDropRequest } from "../resources/baseServices/form";
import { TxtPoppinNormal } from "./text/TxtPoppinNormal";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { CustomDatePicker } from "./filters/CustomDatePicker";
import moment from "moment";
import { isEmpty } from "lodash";
import { setCurrentLocationAction } from "../../store/currentLocation";

const HIDE = "Hide";
const DISABLE = "Disable";
const SHOW = "Show";
Geocoder.init("AIzaSyD5ZAIAJCt9u8PwbDpSnbSG26CUJcaycaY");

export default function PickUpAndDropButton({ data, navigation }) {
  const dispatch = useDispatch();
  const internetAvailable = useSelector(
    (state) => state.workOrderForOffline?.internetAvailable
  );
  const { latitude, longitude } = useSelector((state) => state.currentLocation);
  const pickUpDropData = useSelector(
    (state) => state.form?.pickUpDropData ?? []
  );
  const [isRefreshedDropDown, setIsRefreshedDropDown] = useState(true);
  const [showModal, setshowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [isCheckAllValidation, setIsCheckAllValidation] = useState(false);
  const [isCheckItemValidation, setIsCheckItemValidation] = useState(false);
  const [selectedPickerIndex, setSelectedPickerIndex] = useState(null);
  const [open, setOpen] = useState(false);

  const [state, setState] = useState({
    date: new Date().setHours(new Date().getHours() + 24),
    time: moment().format(
      "DD-MM-YYYY h:mm a"
    ),
  });

  const [pickupStatus, setPickupStatus] = useState(data?.PickupStatus);

  const actionSheetRef = useRef(null);
  const [sampleDetails, setSampleDetails] = useState({});

  const [txtCount, setTxtCount] = useState("");
  const [txtOtherValue, setTxtOtherValue] = useState("");
  const {
    getPhotoFromTheGallery,
    getPhotoFromTheFiles,
    getPhotoFromTheCamera,
  } = useImageProgress();

  const [submitDetails, setSubmitDetails] = useState({
    id: data?.Id,
    remarks: "",
    locationLate: latitude,
    locationLong: longitude,
    img: "",
    samples: [],
  });
  const [isLocation, setIsLocation] = useState(false);
  const [locationDetails, setLocationDetails] = useState({
    lat: latitude,
    long: longitude,
    address: "",
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [address, setAddress] = useState("");

  useEffect(() => {
    Geolocation.getCurrentPosition(
      async (obj) => {
        dispatch(
          setCurrentLocationAction({
            latitude: obj.coords.latitude,
            longitude: obj.coords.longitude,
          })
        );
        const res = await Geocoder.from(
          obj.coords.latitude,
          obj.coords.longitude
        );

        setLocationDetails({
          lat: obj.coords.latitude,
          long: obj.coords.longitude,
          address: res.results[0].formatted_address,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });
      },
      (getLocationError) => {
        if (getLocationError?.code == 1) {
          Alert.alert(
            "",
            "Location permission is required for Pickup & Dropoff feature.",
            [
              {
                text: "Grant Location Permission",
                onPress: () => {
                  request({
                    android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
                    ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
                  }).then((result) => {
                    if (result === RESULTS.BLOCKED) {
                      openSettings().then((res) => {});
                    } else if (result !== RESULTS.GRANTED) {
                      openSettings().then((res) => {});
                    } else {
                      setshowModal(false);
                      setIsCheckAllValidation(false);
                      setIsCheckItemValidation(false);
                    }
                  });
                },
              },
            ]
          );
        }
      }
    );
  }, []);

  const handleChange = (name, value) => {
    setSubmitDetails((latestData) => {
      return {
        ...latestData,
        [name]: value,
      };
    });
  };

  const choosePhotoFromGallery = useCallback(() => {
    try {
      getPhotoFromTheGallery((response) => {
        handleChange("img", response?.data);
      });
    } catch (error) {}
  }, []);

  const choosePhotoFromFile = useCallback(() => {
    try {
      getPhotoFromTheFiles((response) => {
        handleChange("img", response?.data);
      });
    } catch (error) {}
  }, []);

  const takePhotoFromCamera = () => {
    try {
      getPhotoFromTheCamera((response) => {
        handleChange("img", response?.data);
      });
    } catch (error) {}
  };

  const _handleMenuPress = useCallback(() => {
    if (Platform.OS === "android") {
      actionSheetRef.current.show();

      return;
    }
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: ["Done", "Camera", "Photo Library", "Choose From File"],
        cancelButtonIndex: 0,
        tintColor: ORANGE,
        message: "User Actions",
      },
      _handleActionSheet
    );
  }, [_handleActionSheet]);

  const _handleActionSheet = useCallback(async (buttonIndex) => {
    switch (buttonIndex) {
      case 1:
        takePhotoFromCamera();
        break;
      case 2:
        choosePhotoFromGallery();
        break;
      case 3:
        Platform.OS === "android"
          ? choosePhotoFromGallery()
          : choosePhotoFromFile();
        break;
    }
  }, []);

  const handleSubmit = async () => {
    const errorMessage =
      !submitDetails?.samples?.length > 0 &&
      !submitDetails?.img &&
      !submitDetails?.remarks
        ? "Please enter Item, Location Photo and Speacial Instructions "
        : submitDetails?.samples?.length > 0 &&
          !submitDetails?.img &&
          !submitDetails?.remarks
        ? "Please Location Photo and Speacial Instructions "
        : !submitDetails?.samples?.length > 0 &&
          submitDetails?.img &&
          !submitDetails?.remarks
        ? "Please enter Item and Speacial Instructions "
        : !submitDetails?.samples?.length > 0 &&
          !submitDetails?.img &&
          submitDetails?.remarks
        ? "Please enter Item and Location Photo  "
        : submitDetails?.samples?.length > 0 &&
          submitDetails?.img &&
          !submitDetails?.remarks
        ? "Please enter Speacial Instructions "
        : submitDetails?.samples?.length > 0 &&
          !submitDetails?.img &&
          submitDetails?.remarks
        ? "Please enter Location Photo  "
        : !submitDetails?.samples?.length > 0 &&
          submitDetails?.img &&
          submitDetails?.remarks
        ? "Please enter Item "
        : null;
    try {
      if (
        submitDetails?.samples?.length > 0 &&
        submitDetails?.img &&
        submitDetails?.remarks
      ) {
        setIsLoading(true);
        const req = {
          ...submitDetails,
          PickupOn: `${moment(state?.date).format("YYYY-MM-DD")}T${moment(
            state?.time,
            "DD-MM-YYYY h:mm a"
          ).format("HH:mm:ss")}`,
        };
        const res = await submitPickUpDropRequest(req);
        showMessage({
          message: "Success!",
          description: `WO ${data?.WorkOrderNo} Pickup & Dropoff request generated successfully!`,
          type: "success",
          duration: 5000,
        });
        setPickupStatus(DISABLE);

        setshowModal(false);
        setIsCheckAllValidation(false);
        setIsCheckItemValidation(false);
      } else {
        setIsCheckAllValidation(true);

        Alert.alert(
          "",
          errorMessage,
          [
            {
              text: "Ok",
              onPress: () => console.log("OK: Email Error Response"),
            },
          ],
          { cancelable: true }
        );
      }
    } catch (error) {
      console.log("ddddddddd", error);
    } finally {
      setIsLoading(false);
    }
  };

  return pickupStatus === SHOW || pickupStatus === DISABLE ? (
    <TouchableOpacity
      onPress={() => {
        if (pickupStatus === DISABLE) {
          return;
        }
        Geolocation.getCurrentPosition(
          async (obj) => {
            dispatch(
              setCurrentLocationAction({
                latitude: obj.coords.latitude,
                longitude: obj.coords.longitude,
              })
            );
            setSubmitDetails({
              id: data?.Id,
              remarks: "",
              locationLate: obj.coords.latitude,
              locationLong: obj.coords.longitude,
              img: "",
              samples: [],
            });
            const res = await Geocoder.from(
              obj.coords.latitude,
              obj.coords.longitude
            );

            setLocationDetails({
              lat: obj.coords.latitude,
              long: obj.coords.longitude,
              address: res.results[0].formatted_address,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            });
            if (internetAvailable) {
              setshowModal(true);
            } else {
              showMessage({
                message: "Failed!",
                description: `Internet connection required for this action.`,
                type: "danger",
              });
            }
          },
          (getLocationError) => {
            if (getLocationError?.code == 1) {
              Alert.alert(
                "",
                "Location permission is required for Pickup & Dropoff feature.",
                [
                  {
                    text: "Grant Location Permission",
                    onPress: () => {
                      request({
                        android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
                        ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
                      }).then((result) => {
                        if (result === RESULTS.BLOCKED) {
                          openSettings().then((res) => {});
                        } else if (result !== RESULTS.GRANTED) {
                          openSettings().then((res) => {});
                        } else {
                          setshowModal(false);
                          setIsCheckAllValidation(false);
                          setIsCheckItemValidation(false);
                        }
                      });
                    },
                  },
                ]
              );
            }
          }
        );
      }}
      style={[
        styles.container,
        { backgroundColor: pickupStatus === DISABLE ? "#85afe7" : "#5587c8" },
      ]}
    >
      <TxtPoppinMedium style={styles.txtPickUp} title="Pickup & Dropoff" />
      <Modal
        animationType={"slide"}
        transparent={true}
        visible={showModal}
        onRequestClose={() => {
          console.log("model is close");
        }}
      >
        <View style={styles.modalContainer}>
          <KeyboardAwareScrollView style={{ width: "100%" }}>
            <View style={{ width: "100%", flexDirection: "row" }}>
              <TxtPoppinSemiBold
                style={{
                  color: BLACK,
                  width: "100%",
                  textAlign: "center",
                  fontSize: RFValue(13),
                }}
                title={`Pickup & Dropoff`}
              />
              <TouchableOpacity
                onPress={async () => {
                  setshowModal(false);
                  setIsCheckAllValidation(false);
                  setIsCheckItemValidation(false);
                  setSubmitDetails({
                    id: data?.Id,
                    remarks: "",
                    locationLate: latitude,
                    locationLong: longitude,
                    img: "",
                    samples: [],
                  });
                  const res = await Geocoder.from(latitude, longitude);

                  setLocationDetails({
                    lat: latitude,
                    long: longitude,
                    address: res.results[0].formatted_address,
                  });
                }}
                style={styles.closeView}
              >
                <CloseRed width={"100%"} height={"100%"} />
              </TouchableOpacity>
            </View>
            <View
              style={{ marginTop: 10, width: "100%", flexDirection: "row" }}
            >
              <TxtPoppinMedium
                style={{
                  textAlign: "left",

                  fontSize: RFValue(14),
                }}
                title="Add item to request"
              />
              <TxtPoppinMedium
                style={{
                  textAlign: "left",
                  color: "red",
                  fontSize: RFValue(14),
                }}
                title="*"
              />
            </View>

            <View style={styles.searchMainView}>
              {isRefreshedDropDown && (
                <View
                  style={{
                    width: "100%",
                    flexDirection: "row",
                    borderWidth:
                      isCheckAllValidation && submitDetails?.samples < 1
                        ? 1
                        : 0,
                    borderColor: "red",
                  }}
                >
                  <DropDownMenu
                    selectedTextStyle={[{ fontSize: RFValue(11) }]}
                    placeholderStyle={{ fontSize: RFValue(11) }}
                    data={
                      !!pickUpDropData
                        ? pickUpDropData?.map((item) => {
                            return {
                              label: item?.title ?? "",
                              value: item?.id ?? "",
                            };
                          })
                        : []
                    }
                    // defaultValue={state?.orderNumber}
                    onChangeItem={(item) => {
                      setSampleDetails(item);
                    }}
                    style={[
                      styles.checkListView,
                      isEmpty(sampleDetails) &&
                        isCheckItemValidation &&
                        styles.redline,
                    ]}
                    placeHolder={"Item Type"}
                  />
                  <TxtFieldWorkOrder
                    style={[
                      styles.txtAddCount,
                      txtCount == "" && isCheckItemValidation && styles.redline,
                    ]}
                    placeholder={"Quantity"}
                    keyboardType={"decimal-pad"}
                    value={txtCount}
                    onChange={(txt) => {
                      setTxtCount(txt);
                    }}
                  />
                  <TouchableOpacity
                    onPress={() => {
                      if (
                        !sampleDetails?.label ||
                        (sampleDetails?.label == "Other" &&
                          txtOtherValue === "")
                      ) {
                        setIsCheckItemValidation(true);
                        Alert.alert(
                          "",
                          "Please Enter the item value!",
                          [
                            {
                              text: "Ok",
                              onPress: () =>
                                console.log("OK: Email Error Response"),
                            },
                          ],
                          { cancelable: true }
                        );
                        return;
                      }
                      if (!txtCount) {
                        setIsCheckItemValidation(true);
                        Alert.alert(
                          "",
                          `Please Enter the Quantity!`,
                          [
                            {
                              text: "Ok",
                              onPress: () =>
                                console.log("OK: Email Error Response"),
                            },
                          ],
                          { cancelable: true }
                        );
                        return;
                      }
                      setTxtCount("");
                      setTxtOtherValue("");
                      setIsCheckItemValidation(false);
                      setIsRefreshedDropDown(false);
                      setTimeout(() => {
                        setIsRefreshedDropDown(true);
                        setSampleDetails({});
                      }, 10);

                      handleChange("samples", [
                        ...submitDetails?.samples,
                        {
                          sampleTitle:
                            sampleDetails?.label == "Other"
                              ? txtOtherValue
                              : sampleDetails?.label,
                          count: txtCount,
                        },
                      ]);
                    }}
                    style={styles.btnAdd}
                  >
                    <TxtPoppinMedium style={styles.txtBtnAdd} title="Add" />
                  </TouchableOpacity>
                </View>
              )}
            </View>
            {sampleDetails?.label == "Other" && (
              <TxtFieldWorkOrder
                style={[
                  {
                    height: 60,
                    width: "50%",
                    paddingLeft: 10,
                    marginBottom: 20,
                  },
                  txtOtherValue == "" &&
                    isCheckItemValidation &&
                    styles.redline,
                ]}
                placeholder={"Enter other item type"}
                value={txtOtherValue}
                onChange={(txt) => {
                  setTxtOtherValue(txt);
                }}
              />
            )}
            {submitDetails?.samples?.map((el, index) => {
              return (
                <View
                  style={[
                    styles.searchMainView,
                    {
                      justifyContent: "flex-start",
                      borderWidth: 1,
                      paddingHorizontal: 20,
                      borderRadius: 10,
                    },
                  ]}
                >
                  <View style={{ width: "50%" }}>
                    <TxtPoppinNormal
                      style={{ color: BLACK, fontSize: RFValue(12) }}
                      title={`${el?.sampleTitle}`}
                    />
                  </View>

                  <View style={{ flex: 1, marginRight: 20 }}></View>
                  <TxtPoppinSemiBold
                    style={{ color: BLACK, fontSize: RFValue(11) }}
                    title={`Quantity - ${el?.count}`}
                  />
                  <TouchableOpacity
                    onPress={() => {
                      handleChange(
                        "samples",
                        submitDetails?.samples?.filter((obj, i) => index !== i)
                      );
                    }}
                    style={[
                      styles.btnAdd,
                      {
                        height: 40,
                        flex: null,
                        paddingHorizontal: 15,
                        marginLeft: 20,
                        backgroundColor: RED,
                      },
                    ]}
                  >
                    <TxtPoppinMedium style={styles.txtBtnAdd} title="Delete" />
                  </TouchableOpacity>
                </View>
              );
            })}
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <TouchableOpacity
                onPress={() => {
                  setIsLocation(true);
                }}
              >
                <View style={[styles.btnAdd, { width: 150 }]}>
                  <Text style={[styles.txtBtnAdd, { fontSize: 20 }]}>
                    Set Location
                  </Text>
                </View>
              </TouchableOpacity>
              <Text style={{ fontSize: 20, marginLeft: 20 }}>
                {locationDetails?.address ?? ""}
              </Text>
            </View>
            <Modal visible={isLocation}>
              <SafeAreaView style={{ flex: 1 }}>
                <MapView
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  tracksViewChanges={false}
                  initialRegion={{
                    latitude: longitude,
                    longitude: longitude,
                    latitudeDelta: 0.0922,
                    longitudeDelta: 0.0421,
                  }}
                  region={{
                    latitude: locationDetails?.lat,
                    longitude: locationDetails?.long,
                    latitudeDelta: locationDetails?.latitudeDelta,
                    longitudeDelta: locationDetails?.longitudeDelta,
                  }}
                  onRegionChangeComplete={async (location) => {
                    console.log("locationlocationlocationlocation= ", location);
                    const res = await Geocoder.from(
                      location.latitude,
                      location.longitude
                    );
                    setSubmitDetails({
                      ...submitDetails,
                      locationLate: location.latitude,
                      locationLong: location.longitude,
                    });
                    setLocationDetails({
                      lat: location.latitude,
                      long: location.longitude,
                      address: res.results[0].formatted_address,
                      latitudeDelta: location.latitudeDelta,
                      longitudeDelta: location.longitudeDelta,
                    });
                  }}
                >
                  <Image
                    source={require("../assets/images/Subtract.png")}
                    style={{
                      height: 40,
                      width: 40,
                      marginBottom: 20,
                      resizeMode: "contain",
                    }}
                  />
                </MapView>
                <View
                  style={{
                    height: 90,
                    width: "100%",
                    justifyContent: "center",
                    alignItems: "flex-end",
                    paddingRight: 20,
                  }}
                >
                  <TouchableOpacity
                    onPress={() => {
                      setIsLocation(false);
                    }}
                    style={styles.closeButton}
                  >
                    <Text style={styles.closeButtonText}>Submit</Text>
                  </TouchableOpacity>
                </View>
              </SafeAreaView>
            </Modal>

            <View style={[styles.imageWithRemarkContainer]}>
              <View
                style={{ marginTop: 10, width: "100%", flexDirection: "row" }}
              >
                <TxtPoppinMedium
                  style={{
                    textAlign: "left",

                    fontSize: RFValue(14),
                  }}
                  title="Location Photo"
                />
                <TxtPoppinMedium
                  style={{
                    textAlign: "left",
                    color: "red",
                    fontSize: RFValue(14),
                  }}
                  title="*"
                />
              </View>
              <TouchableOpacity
                onPress={() => {
                  _handleMenuPress();
                }}
                style={[
                  styles.btnAddImage,
                  isCheckAllValidation && !submitDetails?.img && styles.redline,
                ]}
              >
                {submitDetails?.img ? (
                  <Image
                    style={{
                      width: "100%",
                      height: "100%",
                      resizeMode: "contain",
                      backgroundColor: BLACK,
                    }}
                    source={{
                      uri: `data:application/image;base64,${submitDetails?.img}`,
                    }}
                  />
                ) : (
                  <Add width={"70%"} height={"70%"} />
                )}
              </TouchableOpacity>
              <View
                style={{ marginTop: 10, width: "100%", flexDirection: "row" }}
              >
                <TxtPoppinMedium
                  style={{
                    textAlign: "left",
                    fontSize: RFValue(14),
                  }}
                  title="Special Instructions"
                />
                <TxtPoppinMedium
                  style={{
                    textAlign: "left",
                    color: "red",
                    fontSize: RFValue(14),
                  }}
                  title="*"
                />
              </View>
              <View style={styles.remarksView}>
                <TextInput
                  placeholder={"Enter Special Instructions"}
                  placeholderTextColor={DARK_GRAY}
                  style={[
                    styles.txtRemark,
                    isCheckAllValidation &&
                      !submitDetails?.remarks &&
                      styles.redline,
                  ]}
                  multiline={true}
                  onChangeText={(txt) => {
                    handleChange("remarks", txt);
                  }}
                  value={submitDetails?.remarks}
                />
              </View>
              <View
                style={{ marginTop: 10, width: "100%", flexDirection: "row" }}
              >
                <TxtPoppinMedium
                  style={{
                    textAlign: "left",
                    fontSize: RFValue(14),
                  }}
                  title="Pickup On"
                />
                <TxtPoppinMedium
                  style={{
                    textAlign: "left",
                    color: "red",
                    fontSize: RFValue(14),
                  }}
                  title="*"
                />
              </View>
              <View style={{ flexDirection: "row", marginTop: 0 }}>
                <CustomDatePicker
                  onPress={() => {
                    setSelectedPickerIndex(0);
                    setOpen(true);
                  }}
                  defaulttitle="Select Date"
                  title={state.date && moment(state?.date).format("MM/DD/YYYY")}
                  style={{
                    // width: '100%',
                    height: 70,
                    flex: 1,
                    borderColor: LIGHT_GRAY,
                    borderWidth: 1,
                    marginRight: 20,
                  }}
                  txtStyle={{ fontSize: RFValue(12) }}
                />

                <CustomDatePicker
                  onPress={() => {
                    setSelectedPickerIndex(1);
                    setOpen(true);
                  }}
                  defaulttitle="Select Time"
                  title={
                    state.time &&
                    moment(state?.time, "DD-MM-YYYY h:mm a").format("h:mm a")
                  }
                  style={{
                    // width: '100%',
                    height: 70,
                    flex: 1,
                    borderColor: LIGHT_GRAY,
                    borderWidth: 1,
                  }}
                  txtStyle={{ fontSize: RFValue(12) }}
                />
              </View>
            </View>

            <View style={[styles.submitButtonView]}>
              <TouchableOpacity
                onPress={() => {
                  handleSubmit();
                }}
                style={styles.btnSubmit}
              >
                {isLoading ? (
                  <ActivityIndicator color={WHITE} />
                ) : (
                  <TxtPoppinMedium style={styles.txtSubmit} title="Submit" />
                )}
              </TouchableOpacity>
            </View>
          </KeyboardAwareScrollView>
        </View>
        <ActionSheet
          ref={actionSheetRef}
          title={"User Actions"}
          options={["Done", "Camera", "Photo Library", "Choose From File"]}
          cancelButtonIndex={0}
          tintColor={ORANGE}
          onPress={_handleActionSheet}
        />
        <DateTimePickerModal
          isVisible={open}
          minuteInterval={15}
          mode={selectedPickerIndex === 0 ? "date" : "time"}
          date={new Date()}
          onConfirm={(d) => {
            setOpen(false);
            if (selectedPickerIndex === 0) {
              setState((oldData) => {
                return { ...oldData, date: moment(d).format("MM/DD/YYYY") };
              });
            }

            if (selectedPickerIndex === 1) {
              setState((oldData) => {
                return {
                  ...oldData,
                  time: moment(d).format("DD-MM-YYYY h:mm a"),
                };
              });
            }
          }}
          onCancel={() => {
            setOpen(false);
          }}
        />
      </Modal>
    </TouchableOpacity>
  ) : null;
}

const styles = StyleSheet.create({
  container: {
    height: 45,
    borderRadius: 7,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    marginRight: 15,
    backgroundColor: "#6eabfa",
    justifyContent: "center",
  },
  modalContainer: {
    flex: 1,
    margin: 50,
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    borderWidth: 1,
  },
  txtPickUp: { fontSize: RFValue(11), color: WHITE },
  closeView: {
    height: 35,
    width: 35,
    right: 40,
    alignSelf: "flex-end",
    justifyContent: "center",
  },
  searchMainView: {
    width: "100%",
    minHeight: 60,
    marginTop: 5,
    marginBottom: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  checkListView: {
    width: "45%",
    height: 60,
    borderColor: LIGHT_GRAY,
    borderWidth: 1,
  },
  txtAddCount: {
    width: "25%",
    height: 60,
    paddingLeft: 10,
  },
  btnAdd: {
    height: 60,
    flex: 1,
    borderRadius: 7,
    alignItems: "center",
    backgroundColor: ORANGE,
    justifyContent: "center",
  },
  txtBtnAdd: { fontSize: RFValue(11), color: WHITE },
  imageWithRemarkContainer: {
    width: "100%",
    aspectRatio: 1,
  },
  imgView: {
    width: "100%",
    height: "100%",
    backgroundColor: BLACK,
  },
  submitButtonView: {
    height: 80,
    width: "100%",
    alignItems: "flex-end",
    justifyContent: "center",
  },
  btnSubmit: {
    borderRadius: 7,
    height: 55,
    width: "100%",
    alignItems: "center",
    backgroundColor: ORANGE,
    justifyContent: "center",
  },
  txtSubmit: { fontSize: RFValue(11), color: WHITE },
  btnAddImage: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    borderWidth: 2,
    marginBottom: 20,
  },
  remarksView: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    height: 120,
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "white",
  },
  txtRemark: {
    width: "95%",
    height: "97%",
    fontSize: RFValue(11),
    textAlign: "left",
  },
  closeButton: {
    height: 70,
    width: 200,
    backgroundColor: ORANGE,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  closeButtonText: { color: WHITE, fontSize: 25, fontWeight: "500" },
  redline: { borderWidth: 1, borderColor: "red" },
});
