/* eslint-disable react-hooks/exhaustive-deps */
import React, {useState} from 'react';
import {StyleSheet, View, TouchableOpacity, FlatList} from 'react-native';
import FileViewer from 'react-native-file-viewer';
import {TagView} from '../../components/Tags';
import {TxtPoppinMedium} from '../../components/text/TxtPoppinMedium';
import TopBar from '../../components/TopBar';
import {downloadDocuments} from '../../resources/baseServices/folder';
import {BLACK_10, responsiveScale, WHITE} from '../../styles';
import {RowTitle} from '../timeSheets/components/RowTitle';
import { RFValue } from 'react-native-responsive-fontsize';

const FolderDetailScreen = ({navigation, route}) => {
 
  const [arrRefDocuments, setArrRefDocuments] = useState(
    route?.params?.item?.refDocuments ?? [],
  );

  const onPressPlusButton = () => {};
  

  const TimeSheetItem = ({item = {}, index, onClose = () => {}}) => {
    const [isLoading, setIsLoading] = useState(false);
    return (
      <View
        style={{
          height: 60,
          marginBottom: 20,
          backgroundColor: WHITE,
        }}>
        <View
          style={{
            width: '100%',
            height: 60,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <RowTitle
            width="15%"
            title={`${index +1}`}
            color={BLACK_10}
            txtStyle={{textAlign: 'center'}}
          />
          <RowTitle width="30%" title={item?.documentName} color={BLACK_10} />

          <View
            style={{
              height: '100%',
              alignItems: 'center',
              width: '55%',
              flexDirection: 'row',
            }}>
            <RowTitle
              style={{flex: 1}}
              title={item?.remarks ?? '-'}
              color={BLACK_10}
            />
            <TouchableOpacity
              onPress={async () => {
                try {
                  setIsLoading(true)
                  const res = await downloadDocuments(item?.id);
                navigation.navigate('viewer', {
                  isBase64: true,
                  type: 'pdf',
                  uri: res?.data,
                  folderName: item?.documentName,
                });
                } catch (error) {
                  
                }finally{
                  setIsLoading(false)
                }
                
                // await FileViewer.open(`data:application/pdf;base64,${res?.data}`);
              }}>
              <TagView isLoading={isLoading}/>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <TopBar
        onBack={() => navigation.goBack()}
        headingText={route?.params?.item?.folderName}
      />
      <View style={{marginHorizontal: 30, flex: 1}}>
        <View
          style={{
            width: '100%',
            height: 60,
            marginTop: 20,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          <RowTitle width="15%" title="No." txtStyle={{textAlign: 'center'}} />
          <RowTitle width="30%" title="Document Name" />
          <RowTitle width="55%" title="Description" />
        </View>

        <FlatList
          data={arrRefDocuments}
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
          renderItem={({item, index}) => <TimeSheetItem item={item}  index={index}/>}
          keyExtractor={(item ) => item.folderName}
        />
      </View>
    </View>
  );
};

export default FolderDetailScreen;

const styles = StyleSheet.create({
  container: {flex: 1},
});
