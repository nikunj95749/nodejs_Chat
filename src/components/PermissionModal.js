import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  Modal,
  Button,
  Linking,
  Platform,
  NativeModules,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import {
  check,
  request,
  PERMISSIONS,
  RESULTS,
  openSettings,
} from "react-native-permissions";
import { setCurrentLocationAction } from "../../store/currentLocation";
import { useFocusEffect } from "@react-navigation/native";
import Geolocation from "react-native-geolocation-service";
const { CameraPermissionModule } = NativeModules;

const PermissionModal = () => {
  const [cameraPermission, setCameraPermission] = useState(false);
  const [locationPermission, setLocationPermission] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const dispatch = useDispatch();

  useFocusEffect(
    useCallback(() => {
      checkPermissions();
    }, [])
  );

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
  const checkPermissions = async () => {
    try {
      let cameraStatus = "";

      if (Platform.OS === "ios") {
        cameraStatus = await CameraPermissionModule.checkCameraPermission();
      } else {
        cameraStatus = await check(PERMISSIONS.ANDROID.CAMERA);
      }
console.log('cameraStatuscameraStatus>>> ', cameraStatus);
      const locationStatus = await check(
        Platform.OS === "ios"
          ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
          : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION
      );

      setCameraPermission(
        cameraStatus === RESULTS.GRANTED ||
          cameraStatus === "restricted"
      );
      setLocationPermission(locationStatus === RESULTS.GRANTED);

      if (
        (cameraStatus === RESULTS.GRANTED ||
          cameraStatus === "restricted") &&
        locationStatus === RESULTS.GRANTED
      ) {
        setModalVisible(false);
      } else {
        setModalVisible(true);
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const requestCameraPermission = async () => {
    try {
      if (Platform.OS === "android") {
        const result = await request(
          Platform.select({
            android: PERMISSIONS.ANDROID.CAMERA,
          })
        );

        console.log("resultresultresultresultresult ", result);
        if (result === RESULTS.GRANTED) {
        }
        if (result === RESULTS.BLOCKED) {
          Linking.openSettings();
          checkPermissions();
        }
      } else {
        const cameraStatus =
          await CameraPermissionModule.checkCameraPermission();

        console.log(
          "Camera permission result:Camera permission result: ",
          cameraStatus
        );

        if (cameraStatus === "denied") {
          Linking.openSettings();
          checkPermissions();
        } else {
          CameraPermissionModule.requestCameraPermission()
            .then((result) => {
              console.log("Camera permission result:", result);
              if (result === "granted") {
                console.log("Camera permission is granted");
                setCameraPermission(true);
                checkPermissions();
                // You can now use the camera
              } else {
                console.log("Camera permission denied");
              }
            })
            .catch((error) => {
              console.error("Error requesting camera permission:", error);
            });
        }
      }
    } catch (err) {
      console.log("resultresultresultresultreserrerrult ", result);
      console.warn(err);
    }
  };

  const requestLocationPermission = async () => {
    try {
      const result = await request(
        Platform.OS === "ios"
          ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
          : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION
      );
      if (result === RESULTS.GRANTED) {
        setLocationPermission(true);
        checkPermissions();
        getCurrentLocation();
      }
      if (result === RESULTS.BLOCKED) {
        Linking.openSettings();
        checkPermissions();
      }
    } catch (err) {
      console.warn(err);
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        console.warn("Modal has been closed.");
      }}
    >
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <View
          style={{ backgroundColor: "white", padding: 20, borderRadius: 10 }}
        >
          <Text style={{ fontSize: 19, marginBottom: 20 }}>
            {!cameraPermission &&
              "The camera is required so that you can store pictures for you"}
            {!cameraPermission && !locationPermission && " and\n"}
            {!locationPermission &&
              "Allow Fast app to access your location to support a better experience by connecting you with others near you and displaying geo-targeted content"}
          </Text>
          {!cameraPermission && (
            <Button
              title="Allow Camera"
              onPress={requestCameraPermission}
              buttonStyle={{ marginBottom: 10 }}
            />
          )}
          {!locationPermission && (
            <Button
              title="Allow Location"
              onPress={requestLocationPermission}
              buttonStyle={{ marginBottom: 10 }}
            />
          )}
        </View>
      </View>
    </Modal>
  );
};

export default PermissionModal;
