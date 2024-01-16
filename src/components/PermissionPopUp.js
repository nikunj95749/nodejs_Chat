import React, { useEffect, useState } from "react";
import {
  View,
  Modal,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Platform,
} from "react-native";
import {
  request,
  PERMISSIONS,
  check,
  openSettings,
  checkMultiple,
} from "react-native-permissions";
import { ORANGE } from "../styles";
const PermissionPopUp = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [permission, setPermission] = useState("");
  useEffect(() => {
    if (Platform.OS === "ios") {
      checkMultiple([
        PERMISSIONS.IOS.CAMERA,
        PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
      ])
        .then((result) => {
          setPermission(result);
          if (
            result["ios.permission.CAMERA"] == "blocked" ||
            result["ios.permission.CAMERA"] == "denied" ||
            result["ios.permission.LOCATION_WHEN_IN_USE"] == "blocked" ||
            result["ios.permission.LOCATION_WHEN_IN_USE"] == "denied"
          ) {
            setIsVisible(true);
          } else {
            setIsVisible(false);
          }
        })
        .catch(() => {});
    } else if (Platform.OS === "android") {
      checkMultiple([
        PERMISSIONS.ANDROID.CAMERA,
        PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
      ])
        .then((result) => {
          setPermission(result);
          if (
            result["android.permission.CAMERA"] == "blocked" ||
            result["android.permission.CAMERA"] == "denied" ||
            result["android.permission.ACCESS_FINE_LOCATION"] == "blocked" ||
            result["android.permission.ACCESS_FINE_LOCATION"] == "denied"
          ) {
            setIsVisible(true);
          } else {
            setIsVisible(false);
          }
        })
        .catch(() => {});
    }
  },[]);
  const handleOpenSetting = () => {
    if (Platform.OS === "ios") {
      if (
        permission["ios.permission.CAMERA"] == "blocked" ||
        permission["ios.permission.LOCATION_WHEN_IN_USE"] == "blocked"
      ) {
        if (Platform.OS === "ios") {
          Linking.openSettings("app-settings:");
          // openSettings();
        } else {
          Linking.openSettings();
        }
      } else if (
        permission["ios.permission.CAMERA"] == "denied" ||
        permission["ios.permission.LOCATION_WHEN_IN_USE"] == "denied"
      ) {
        request(
          Platform.select({
            android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
            ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
          })
        ).then((reqResult) => {
          getCurrentLocation();
        });
        request(
          Platform.select({
            android: PERMISSIONS.ANDROID.CAMERA,
            ios: PERMISSIONS.IOS.CAMERA,
          })
        );
      }
    } else if (Platform.OS === "android") {
      if (
        permission["android.permission.CAMERA"] == "blocked" ||
        permission["android.permission.ACCESS_FINE_LOCATION"] == "blocked"
      ) {
        if (Platform.OS === "ios") {
          Linking.openSettings("app-settings:");
          // openSettings();
        } else {
          Linking.openSettings();
        }
      } else if (
        permission["android.permission.CAMERA"] == "denied" ||
        permission["android.permission.ACCESS_FINE_LOCATION"] == "denied"
      ) {
        request(
          Platform.select({
            android: PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
            ios: PERMISSIONS.IOS.LOCATION_WHEN_IN_USE,
          })
        ).then((reqResult) => {
          getCurrentLocation();
        });
        request(
          Platform.select({
            android: PERMISSIONS.ANDROID.CAMERA,
            ios: PERMISSIONS.IOS.CAMERA,
          })
        );
      }
    }
  };
  return (
    <Modal visible={isVisible} transparent={true} animationType="slide">
      <View
        style={styles.container}
      >
        <Text
          style={styles.warningText}
        >
          Location and Camera permission is require
        </Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            handleOpenSetting();
          }}
        >
          <View
            style={styles.buttonView}
          >
            <Text style={styles.buttonText}>
              Allow
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </Modal>
  );
};
export default PermissionPopUp;

const styles = StyleSheet.create({
  container:{
    height: 200,
    width: 400,
    alignSelf: "center",
    backgroundColor: "white",
    marginTop: 450,
    borderRadius: 10,
    alignItems: "center",
    borderWidth: 0.3,
    justifyContent: "center",
    paddingHorizontal: 5,
  },
  warningText:{
    color: "black",
    fontSize: 25,
    padding: 10,
    fontWeight: "600",
  },
  button:{ marginTop: 30 },
  buttonView:{
    height: 40,
    width: 350,
    backgroundColor: ORANGE,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText:{ color: "white", fontSize: 20, fontWeight: "800" }
});
