/* eslint-disable react-hooks/exhaustive-deps */
import React, {useState} from 'react';
import {StyleSheet, View, FlatList, TouchableOpacity} from 'react-native';
import {useSelector} from 'react-redux';
import {FloatingActionButton} from '../../components/buttons/FloatingActionButton';
import {TxtPoppinMedium} from '../../components/text/TxtPoppinMedium';
import {TxtPoppinSemiBold} from '../../components/text/TxtPoppinSemiBold';
import TopBar from '../../components/TopBar';
import {BLACK, responsiveScale, WHITE} from '../../styles';
import { RFValue } from 'react-native-responsive-fontsize';

const SummaryList = ({navigation, route}) => {
  const summaryList = useSelector((state) => state.form?.summaryList ?? '');
  const [arrSummaryList, setArrSummaryList] = useState([0]);

  const onPressPlusButton = async () => {
    try {
    } catch (error) {}
  };

  const TimeSheetItem = ({item = {}, index}) => {
    return (
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('AddSummaryScreen', {routeData: item});
        }}
        style={{
          minHeight: 60,
          marginBottom: 20,
          backgroundColor: WHITE,
          borderRadius: 10,
        }}>
        <View
          style={{
            flex: 1,
            justifyContent: 'space-between',
          }}>
          <TxtPoppinSemiBold
            style={{
              marginTop: 15,
              marginLeft: 10,
              fontSize: RFValue(13),
              color: BLACK,
            }}
            title={item?.title}
          />
          <TxtPoppinMedium
            style={{
              marginBottom: 10,
              marginLeft: 10,
              fontSize: RFValue(13),
              color: BLACK,
            }}
            title={item?.body}
            props={{numberOfLines: 3}}
          />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <TopBar onBack={() => navigation.goBack()} headingText={'Summary List'} />
      <View style={{marginHorizontal: 30, paddingTop: 20, flex: 1}}>
        <FlatList
          data={summaryList}
          style={{paddingBottom: 20}}
          ListEmptyComponent={() => (
            <View
              style={{
                width: '100%',
                height: 300,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <TxtPoppinMedium
                style={{fontSize: RFValue(20)}}
                title={'Empty List'}
              />
            </View>
          )}
          renderItem={({item, index}) => <TimeSheetItem item={item} />}
          keyExtractor={(item) => item.folderName}
        />
      </View>
      <FloatingActionButton
        onPress={() => {
          navigation.navigate('AddSummaryScreen');
        }}
        style={{position: 'absolute', bottom: 30, right: 30}}
      />
    </View>
  );
};

export default SummaryList;

const styles = StyleSheet.create({
  container: {flex: 1},
});
