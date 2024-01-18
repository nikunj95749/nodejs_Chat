import React, { useState, useEffect } from 'react';
import { View, Text, Modal,Button,Linking } from 'react-native';
import { useDispatch, useSelector } from "react-redux";
import { check, request, PERMISSIONS, RESULTS ,openSettings } from 'react-native-permissions';
import { setCurrentLocationAction } from '../../store/currentLocation';

const PermissionModal = () => {
  const [cameraPermission, setCameraPermission] = useState(false);
  const [locationPermission, setLocationPermission] = useState(false);
  const [modalVisible, setModalVisible] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    check(
      Platform.select({
        android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
        ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
      })
    )
      .then((result) => {
        // 'granted'
        request(
          Platform.select({
            android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
            ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
          })
        ).then((reqResult) => {
          checkPermissions();
          getCurrentLocation();
        });
      })
      .catch(() => {
      });
  }, []);

  useEffect(() => {
    checkPermissions();
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

  const checkPermissions = async () => {
    try {
      const cameraStatus = await check(
        Platform.OS === 'ios'
          ? PERMISSIONS.IOS.CAMERA
          : PERMISSIONS.ANDROID.CAMERA
      );

      const locationStatus = await check(
        Platform.OS === 'ios'
          ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
          : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION
      );

      setCameraPermission(cameraStatus === RESULTS.GRANTED);
      setLocationPermission(locationStatus === RESULTS.GRANTED);

      if (cameraStatus === RESULTS.GRANTED && locationStatus === RESULTS.GRANTED) {
        setModalVisible(false);
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const requestCameraPermission = async () => {
    try {
      const result = await request(
        Platform.OS === 'ios'
          ? PERMISSIONS.IOS.CAMERA
          : PERMISSIONS.ANDROID.CAMERA
      );
      if (result === RESULTS.GRANTED) {
        setCameraPermission(true);
        checkPermissions();
      }
      if(result === RESULTS.BLOCKED){
        Linking.openSettings();
        checkPermissions();
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const requestLocationPermission = async () => {
    try {
      const result = await request(
        Platform.OS === 'ios'
          ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
          : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION
      );
      if (result === RESULTS.GRANTED) {
        setLocationPermission(true);
        checkPermissions();
      }
      if(result === RESULTS.BLOCKED){
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
        console.warn('Modal has been closed.');
      }}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10 }}>
          <Text style={{ fontSize: 18, marginBottom: 20 }}>
            App requires access to camera and location.
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
