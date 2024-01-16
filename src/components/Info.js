import { StyleSheet, View, TouchableOpacity, Image } from "react-native";
import React, { useState } from "react";
import Tooltip from "react-native-walkthrough-tooltip";
import HTMLView from "react-native-htmlview";

const Info = ({ content, style,iconStyle }) => {
  const [visible, setVisible] = useState(false);
  return (
    <View style={[{justifyContent:'center',marginLeft:5},style]}>
      <Tooltip
        isVisible={visible}
        content={<HTMLView value={content}></HTMLView>}
        placement="top"
        onClose={() => setVisible(false)}
      >
        <TouchableOpacity onPress={() => setVisible(true)}>
          <Image
            source={require('../assets/images/Information.png')}
            style={[styles.iconStyle,iconStyle]}
          />
        </TouchableOpacity>
      </Tooltip>
    </View>
  );
};

export default Info;

const styles = StyleSheet.create({ iconStyle: { height: 20, width: 20 } });
