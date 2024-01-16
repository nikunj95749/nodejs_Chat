import React, {useEffect, useRef, useState} from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  Animated,
} from 'react-native';
import {BLACK, ORANGE, WHITE} from '../styles';

import {TxtPoppinMedium} from './text/TxtPoppinMedium';
import AppLogo from './../assets/images/AppLogo.svg';
import Back from './../assets/images/Back.svg';
import Print from './../assets/images/Print.svg';
import Refresh from './../assets/images/Refresh.svg';
import {TxtPoppinSemiBold} from './text/TxtPoppinSemiBold';
import moment from 'moment';
import Calender2 from './../assets/images/Calender2.svg';
import {RFValue} from 'react-native-responsive-fontsize';
import {useDispatch, useSelector} from 'react-redux';
import {setIsTapSynchButton} from '../../store/workOrderForOffline';

export default function TopBar({
  onBack,
  onPrint,
  isShowLeftIcon = false,
  headingText = '',
  onColorPicker,
  isShowRefresh = false,
  onPressRefresh = () => {},
  containerStyle = {},
  headerTextStyles = {},
  woItem,
}) {
  const [offlineNumbers, setOfflineNumbers] = useState(0);

  const isTapSynchButton = useSelector(
    (state) => state.workOrderForOffline?.isTapSynchButton,
  );

  const pendingworkOrderListForOffline = useSelector(
    (state) => state.workOrderForOffline?.pendingworkOrderListForOffline ?? [],
  );

  const dispatch = useDispatch();

  const rotation = useRef(new Animated.Value(0)).current;
  const rotateAnimation = Animated.loop(
    Animated.timing(rotation, {
      toValue: 1,
      duration: 2000, // Duration of one rotation cycle in milliseconds
      useNativeDriver: true,
    }),
  );

  useEffect(() => {

    if (isTapSynchButton) {
      rotateAnimation.start();
    } else {
      rotateAnimation.reset();
      rotateAnimation.stop();
    }
  }, [isTapSynchButton]);

  const interpolatedRotate = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  useEffect(() => {
    let offlineCount = 0;
    for (
      let index = 0;
      index < pendingworkOrderListForOffline.length;
      index++
    ) {
      const element = pendingworkOrderListForOffline[index];

      if (element?.data?.shouldSave) {
        offlineCount = offlineCount + 1;
      }
      // if (element?.data?.shouldMoveToCompleted) {
      //   offlineCount = offlineCount + 1;
      // }
    }
    setOfflineNumbers(offlineCount);
  }, [pendingworkOrderListForOffline]);

  return (
    <View style={styles.container}>
      <SafeAreaView>
        <View style={[styles.topBar, containerStyle]}>
          <View style={{flexDirection: 'row'}}>
            {isShowLeftIcon && (
              <View
                style={{
                  height: '70%',
                  aspectRatio: 2.8,
                  marginLeft: 30,
                }}>
                <AppLogo width={'100%'} height={'100%'} />
              </View>
            )}
            {onBack && (
              <TouchableOpacity style={styles.back} onPress={onBack}>
                <Back width={'100%'} height={'100%'} />
              </TouchableOpacity>
            )}
          </View>
          {headingText !== '' && (
            <TxtPoppinMedium
              title={headingText}
              style={{...styles.headerText, ...headerTextStyles}}
            />
          )}
          {onPrint && <View style={{flex: 1}} />}
          {onPrint && (
            <TouchableOpacity style={styles.print} onPress={onPrint}>
              <Print width={'100%'} height={'100%'} />
            </TouchableOpacity>
          )}

          {woItem && (
            <View
              style={{
                height: '100%',
                flex: 1,
                marginLeft: 10,
                justifyContent: 'center',
              }}>
              <View
                style={{
                  marginLeft: 10,
                  flexDirection: 'row',
                  marginRight:30
                }}>
                <View style={{height: '100%', flex: 1, flexDirection: 'row'}}>
                  <TxtPoppinSemiBold
                    style={{color: ORANGE, fontSize: RFValue(11.5)}}
                    title={`WO #  ${woItem?.WorkOrderNo}`}
                  />
                  <TxtPoppinMedium
                    style={{
                      color: BLACK,
                      fontSize: RFValue(11),
                    }}
                    title={` (${woItem?.formName})`}
                  />
                </View>
                <View
                  style={{
                    height: '100%',
                    flex: 1,
                    alignItems: 'flex-end',
                  }}>
                  <TxtPoppinSemiBold
                    style={{
                      color: ORANGE,
                      fontSize: RFValue(11.5),
                    }}
                    title={`${woItem?.SubStatus}`}
                  />
                </View>
              </View>
              <View
                style={{
                  marginLeft: 10,
                  flexDirection: 'row',
                  marginRight:30
                }}>
                <View style={{height: '100%', flex: 1, flexDirection: 'row'}}>
                  <TxtPoppinMedium
                    style={{
                      color: BLACK,
                      fontSize: RFValue(10),
                    }}
                    title={`${woItem?.TaskName}`}
                  />
                </View>
                <View
                  style={{
                    height: '100%',
                    flex: 1,
                    alignItems: 'flex-end',
                  }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}>
                    <View style={{height: 21, width: 21, marginRight: 10}}>
                      <Calender2 width={'100%'} height={'100%'} />
                    </View>
                    <TxtPoppinMedium
                      style={{
                        color: BLACK,
                        marginTop: 3,
                        fontSize: RFValue(10.5),
                      }}
                      title={moment(woItem?.JobDate).format('MM/DD/YY hh:mm a')}
                    />
                  </View>
                </View>
              </View>
              {/* <View style={{height: '100%', width: '60%'}}>
                <TxtPoppinSemiBold
                  style={{color: ORANGE, fontSize: responsiveScale(12.5)}}
                  title={`WO #  ${woItem?.WorkOrderNo}`}
                />
                <TxtPoppinMedium
                  style={{
                    color: BLACK,
                    fontSize: responsiveScale(11),
                    marginTop: -2,
                  }}
                  title={`${woItem?.TaskName}`}
                />
                <TxtPoppinMedium
                  style={{
                    color: BLACK,
                    fontSize: responsiveScale(11),
                    marginTop: -2,
                  }}
                  title={`${woItem?.formName}`}
                />

              </View>
              <View
                style={{
                  height: '100%',
                  flex: 1,
                  alignItems: 'flex-end',
                }}>
                <TxtPoppinSemiBold
                  style={{
                    color: ORANGE,
                    fontSize: responsiveScale(12.5),
                  }}
                  title={`${woItem?.SubStatus}`}
                />
                <View
                  style={{
                    flexDirection: 'row',
                    marginTop: -2,
                    alignItems: 'center',
                  }}>
                  <View style={{height: 21, width: 21, marginRight: 10}}>
                    <User width={'100%'} height={'100%'} />
                  </View>
                  <TxtPoppinMedium
                    style={{
                      color: BLACK,
                      marginTop:3,
                      fontSize: responsiveScale(10.5),
                    }}
                    number
                    title={woItem?.ClientName}
                  />
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <View style={{height: 21, width: 21, marginRight: 10}}>
                    <Calender2 width={'100%'} height={'100%'} />
                  </View>
                  <TxtPoppinMedium
                    style={{
                      color: BLACK,
                      marginTop:3,
                      fontSize: responsiveScale(10.5),
                    }}
                    title={moment(woItem?.JobDate).format('MM/DD/YY hh:mm a')}
                  />
                </View>
              </View> */}
            </View>
          )}

          {isShowRefresh&&<View
            style={[
              !onColorPicker && styles.emptyView,
              {flexDirection: 'row', alignItems: 'center'},
            ]}>
            {isShowRefresh && (
              <TxtPoppinMedium
                title={`${
                  offlineNumbers == 0 ? '' : `Sync (${offlineNumbers})`
                } `}
                style={{}}
              />
            )}
            <Animated.View
              style={[
                styles.refreshView,
                {transform: [{rotate: interpolatedRotate}]},
              ]}>
              {isShowRefresh && (
                <TouchableOpacity
                  style={styles.refreshView}
                  onPress={() => {
                    if (!isTapSynchButton) {
                      rotateAnimation.reset();
                      rotateAnimation.stop();
                      // dispatch(setIsTapSynchButton(false));
                      setTimeout(() => {
                        dispatch(setIsTapSynchButton(true));
                      }, 200);
                      
                      onPressRefresh();
                    }
                  }}>
                  <Refresh width={'100%'} height={'100%'} />
                </TouchableOpacity>
              )}
            </Animated.View>
          </View>}
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {backgroundColor: WHITE},
  topBar: {
    height: 80,
    position: 'relative',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerText: {
    position: 'absolute',
    alignSelf: 'center',
    width: Dimensions.get('window').width * 0.5,
    textAlign: 'center',
    marginLeft:
      Dimensions.get('window').width * 0.5 -
      Dimensions.get('window').width * 0.25,
  },
  refreshView: {
    height: 35,
    width: 35,
    marginRight: 30,
  },
  leftHeaderItemView: {
    flexDirection: 'row',
  },
  emptyView: {
    padding: 10,
  },
  back: {height: 30, width: 30, marginLeft: 20},
  print: {height: 40, width: 40,marginRight:25},
});
