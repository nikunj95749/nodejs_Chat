import React from "react";
import { StyleSheet, View, SafeAreaView } from "react-native";

import TopBar from "../../components/TopBar";

import { WHITE } from "../../styles";
import WebView from "react-native-webview";

export default function HtmlViewerScreen({ navigation, route }) {
  const item = route.params;

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: WHITE,
      }}
    >
      <TopBar onBack={() => navigation.goBack()} headingText={"More Info"} />
      <View style={{ flex: 1 }}>
        <WebView originWhitelist={["*"]} source={{ html: `${item.result}` }} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  imageStyle: { height: "100%", width: "100%" },
  flex1: { flex: 1, paddingTop: 10 },
});
