import React, {useMemo, useState} from 'react';
import {Alert, Linking, TouchableOpacity, View} from 'react-native';
import Mailer from 'react-native-mail';
import base64 from 'react-native-base64';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import ReactNativeBlobUtil from 'react-native-blob-util';
import {
  responsiveScale,
  WHITE,
  ORANGE,
  BLACK,
  getWorkOrderStatusColor,
} from '../../../styles';
import Calender2 from '../../../assets/images/Calender2.svg';
import User from '../../../assets/images/User.svg';
import Location from '../../../assets/images/Location.svg';
import Docs from '../../../assets/images/Docs.svg';

import {TxtPoppinNormal} from '../../../components/text/TxtPoppinNormal';
import {TxtPoppinSemiBold} from '../../../components/text/TxtPoppinSemiBold';
import {TxtPoppinMedium} from '../../../components/text/TxtPoppinMedium';
import {
  TagCancelled,
  TagDialPhone,
  TagNew,
  TagSendEmail,
  TagViewPdf,
} from '../../../components/Tags';
import moment from 'moment';
import {useNavigation} from '@react-navigation/native';
import {getCompletedOrderPdfDetails} from '../../../resources/baseServices/form';
import {logError, weekDays} from '../../../helpers/logging';
import {SwipeRow} from 'react-native-swipe-list-view';
import {CompletedWorkItemSwipeView} from './CompletedWorkItemSwipeView';
import { RFValue } from 'react-native-responsive-fontsize';

export const CompleteWorkItem = ({item = {}, onPress = () => {}}) => {
  const navigation = useNavigation();
  const [isLoadingPdfData, setIsLoadingPdfData] = useState(false);

  const [isLoadingEmailData, setIsLoadingEmailData] = useState(false);

  const weekDay = useMemo(() => {
    var d = moment(item?.LockStartTime).format('YYYY-MM-DD');
    const dayOfWeek = new Date(d).getDay();
    var dayName = weekDays[dayOfWeek];
    return dayName;
  }, []);

  const onPressPDF = async () => {
    try {
      setIsLoadingPdfData(true);
      const res = await getCompletedOrderPdfDetails(item?.Id);
      navigation.navigate('viewer', {
        isBase64: true,
        type: 'pdf',
        uri: res?.data,
        folderName: item?.WorkOrderNo,
      });
    } catch (error) {
      console.log('[CompleteWorkItem] onPressPDF error: ', error);
    } finally {
      setIsLoadingPdfData(false);
    }
  };

  const onPressDial = async () => {
    try {
      Linking.openURL(`tel:${item?.ContactNo}`);
    } catch (error) {
      console.log('[CompleteWorkItem] onPressDial error: ', error);
    } finally {
    }
  };

  const onPressEmail = async () => {
    try {
      setIsLoadingEmailData(true);

      const res = await getCompletedOrderPdfDetails(item?.Id);
      const base64Data = res?.data;

      const filePath =
        ReactNativeBlobUtil.fs.dirs.DocumentDir + `/${item?.WorkOrderNo}.pdf`;

      ReactNativeBlobUtil.fs
        .writeFile(filePath, base64Data, 'base64')
        .then((res) => {
          setIsLoadingEmailData(false);
          try {
            Mailer.mail(
              {
                subject: `${item?.WorkOrderNo ?? ''}`,
                recipients: !item?.ToEmailIds
                  ? ['']
                  : item?.ToEmailIds.split(','),
                ccRecipients: !item?.ContactEmail
                  ? ['']
                  : item?.ContactEmail.split(','),
                bccRecipients: [''],
                body: '',
                customChooserTitle: '',
                isHTML: false,
                attachments: [
                  {
                    path: filePath,
                    uri: '',
                    type: 'pdf',
                    mimeType: 'pdf',
                    name: item?.WorkOrderNo ?? '',
                  },
                ],
              },
              (error, event) => {
                if (event === 'sent') {
                  Alert.alert(
                    error,
                    event,
                    [
                      {
                        text: 'Ok',
                        onPress: () => console.log('OK: Email Error Response'),
                      },
                      {
                        text: 'Cancel',
                        onPress: () => console.log('CANCEL: Email Error Response'),
                      },
                    ],
                    {cancelable: true},
                  );
                }
              },
            );
          } catch (err) {
            // console.log('error ======= ',err);
          }
        })
        .catch((error) => {
          setIsLoadingEmailData(false);

          console.log('error ======= ', error);
        });

    } catch (error) {
      console.log('[CompleteWorkItem] onPressEmail error: ', error);
    } finally {
      setIsLoadingEmailData(false);
    }
  };

  return (
    <SwipeRow
      disableRightSwipe={true}
      recalculateHiddenLayout={true}
      disableLeftSwipe={item?.Status === 'Completed' ? false : true}
      rightOpenValue={-290}>
      <CompletedWorkItemSwipeView item={item} />
      <View
        style={{
          width: '100%',
          marginTop: 30,
          borderRadius: 10,
          padding: 20,
          backgroundColor: WHITE,
          borderWidth: 4,
          borderColor: getWorkOrderStatusColor(item?.SubStatus),
        }}>
        <View style={{width: '100%', flexDirection: 'row'}}>
          <View style={{height: '100%', width: '60%'}}>
            <TxtPoppinSemiBold
              style={{color: ORANGE}}
              title={`WO #  ${item?.WorkOrderNo}${item?.ScopeNo ? `/${item?.ScopeNo}`:''}`}
            />
            <TxtPoppinMedium
              style={{color: BLACK, fontSize: RFValue(12.5)}}
              title={`${item?.TaskName}`}
            />

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 5,
              }}>
              <View style={{height: 25, width: 25, marginRight: 10}}>
                <Docs width={'100%'} height={'100%'} />
              </View>
              <TxtPoppinNormal
                style={{
                  color: BLACK,
                  marginTop: 4,
                  fontSize: RFValue(11),
                }}
                title={item?.ProjectName}
              />
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 5,
                marginRight: 10,
              }}>
              <View style={{height: 25, width: 25, marginRight: 10}}>
                <Location width={'100%'} height={'100%'} />
              </View>
              <TxtPoppinNormal
                style={{
                  color: BLACK,
                  marginTop: 4,
                  fontSize: RFValue(11),
                  flex: 1
                }}
                numberOfLines={3}
                title="1430 E. 103rd St., Los Angeles, CA - 90002"
              />
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 5,
              }}>
              <View style={{height: 25, width: 25, marginRight: 10}}>
                <User width={'100%'} height={'100%'} />
              </View>
              <TxtPoppinNormal
                style={{
                  color: BLACK,
                  marginTop: 4,
                  fontSize: RFValue(11),
                }}
                title={item?.ClientName}
              />
            </View>
          </View>
          <View style={{height: '100%', alignItems: 'flex-end', width: '40%'}}>
            <TagNew title={item?.SubStatus} />
            <View
              style={{
                width: '100%',
                flex: 1,
                marginTop: 5,
              }}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: 10,
                }}>
                <View style={{height: 25, width: 25, marginRight: 10}}>
                  <Calender2 width={'100%'} height={'100%'} />
                </View>
                <TxtPoppinNormal
                  style={{
                    color: BLACK,
                    marginTop: 4,
                    fontSize: RFValue(11),
                  }}
                  title={moment(item?.JobDate).format('MM/DD/YY hh:mm a')}
                />
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: 10,
                }}>
                <TxtPoppinNormal
                  style={{
                    color: BLACK,
                    marginTop: 4,
                    fontSize: RFValue(11),
                  }}
                  title={item?.StartDayName}
                />
              </View>

              <View style={{flexDirection: 'row', marginTop: 10}}>
                <TagDialPhone
                  onPress={() => {
                    onPressDial();
                  }}
                  title={item?.ContactNo}
                />
              </View>
            </View>
          </View>
        </View>
        <View style={{flexDirection: 'row', marginTop: 20}}>
          <TagViewPdf
            isLoading={isLoadingPdfData}
            onPress={() => {
              onPressPDF();
            }}
          />
          <TagSendEmail
            isLoading={isLoadingEmailData}
            onPress={() => {
              onPressEmail();
            }}
          />
        </View>
      </View>
    </SwipeRow>
  );
};
