import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  ActivityIndicator,
  SafeAreaView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import Pdf from 'react-native-pdf';
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import {BLACK, ORANGE, responsiveScale, WHITE} from '../../styles';
import TopBar from '../TopBar';
import {TxtPoppinMedium} from '../text/TxtPoppinMedium';
import Mailer from 'react-native-mail';
import base64 from 'react-native-base64';
import RNPrint from 'react-native-print';
import {PDFDocument, StandardFonts, rgb} from 'pdf-lib';
import {
  insertOrUpdateFormAPI,
  updateDispatchStatusAPI,
} from '../../resources/baseServices/form';
import {useDispatch, useSelector} from 'react-redux';
import {updateWorkOrderList} from '../../../store/workOrder';
import ReactNativeBlobUtil from 'react-native-blob-util';
var pjson = require('./../../../package.json');
import {RFValue} from 'react-native-responsive-fontsize';
import {
  deleteItemFromPendingWO,
  getpendingWorkOrdersResults,
  updateItemFromPendingWO,
} from '../../helpers/sqlQuery';
import {setRefreshedOfflineData} from '../../../store/workOrderForOffline';
import {showMessage} from 'react-native-flash-message';
import ConfirmationPopupForSubmitWO from '../ConfirmationPopupForSubmitWO';
import moment from 'moment';

export default function Viewer({navigation, route}) {
  const item = route.params;

  const userDetails = useSelector((state) => state.auth?.userDetails ?? '');
  const internetAvailable = useSelector(
    (state) => state.workOrderForOffline?.internetAvailable,
  );

  // isFromMasterForm
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingSubmit, setIsLoadingSubmit] = useState(false);
  const [isVisibleSubmitPopup, setIsVisibleSubmitPopup] = useState(false);

  const [uri, setUri] = useState('');

  const dispatch = useDispatch();

  useEffect(() => {
    if (item?.isFromMasterForm) {
      setPDF(item?.uri);
    } else {
      setUri(item?.uri);
    }
  }, []);

  const setPDF = async (data) => {
    try {
      let options = {
        //Content to print
        html: data,
        base64: true,
        //File Name
        fileName: `main`,
        //File directory
        directory: 'docs',
        paddingRight: 5,
        paddingLeft: 0,
        paddingTop: 0,
        paddingBottom: 0,
        bgColor: '#FFFFFF',
      };
      let file = await RNHTMLtoPDF.convert(options);

      const pdfDoc = await PDFDocument.create();

      const pdfData1 = await ReactNativeBlobUtil.fs.readFile(
        file.filePath,
        'base64',
      );

      const pdf1 = await PDFDocument.load(pdfData1);
      const copiedPages1 = await pdfDoc.copyPages(pdf1, pdf1.getPageIndices());
      copiedPages1.forEach((page) => pdfDoc.addPage(page));

      if (item?.arrFormBuffers?.length > 0) {
        for (let index = 0; index < item?.arrFormBuffers.length; index++) {
          const element = item?.arrFormBuffers[index];
          let options2 = {
            //Content to print
            html: element?.templateHtmlText,
            base64: true,
            //File Name
            fileName: element?.name,
            //File directory
            directory: 'pdf',
            paddingLeft: 0,
            paddingTop: 0,
            paddingBottom: 0,
            paddingRight: 5,
            bgColor: '#FFFFFF',
          };

          if (element?.name.includes('ASTMD')) {
            options2 = {
              ...options2,
              width: 3508 / 4,
              height: 2480 / 4,
              paddingLeft: 0,
              paddingTop: 0,
              paddingBottom: 0,
              paddingRight: 5,
              bgColor: '#FFFFFF',
            };
          }

          let file2 = await RNHTMLtoPDF.convert(options2);

          const pdfData2 = await ReactNativeBlobUtil.fs.readFile(
            file2.filePath,
            'base64',
          );

          const pdf2 = await PDFDocument.load(pdfData2);
          const copiedPages2 = await pdfDoc.copyPages(
            pdf2,
            pdf2.getPageIndices(),
          );
          copiedPages2.forEach((page) => pdfDoc.addPage(page));
        }
      }

      const totalPages = pdfDoc.getPageCount();

      for (let i = 0; i < totalPages; i++) {
        const page = pdfDoc.getPage(i);

        // Get page dimensions
        const {width, height} = page.getSize();

        let test = `Page ${i + 1} of ${totalPages}`;
        const fontSize = 8;
        page.drawText(test, {
          x: width / 2 - (test?.length * 6) / 2,
          y: 5,
          size: fontSize,
          color: rgb(0, 0, 0),
        });
      }

      const mergedPdfFile = await pdfDoc.save();
      setUri(base64.encodeFromByteArray(mergedPdfFile));
    } catch (error) {
      console.log('setPDF error=====> ', error);
    }
  };

  const onPressSendEmail = async (data) => {
    const filePath =
      ReactNativeBlobUtil.fs.dirs.DocumentDir + `/${item?.WorkOrderNo}.pdf`;

    if (item?.isFromMasterForm) {
      await ReactNativeBlobUtil.fs.writeFile(filePath, uri, 'base64');
    }

    Mailer.mail(
      {
        subject: `${item?.folderName ?? ''} - ${item?.item?.WorkOrderNo ?? ''}`,
        recipients: !item?.item?.ToEmailIds
          ? ['']
          : item?.item?.ToEmailIds?.split(','),
        ccRecipients: !item?.item?.ContactEmail
          ? ['']
          : item?.item?.ContactEmail?.split(','),
        bccRecipients: [''],
        body: '',
        customChooserTitle: '',
        isHTML: false,
        attachments: [
          {
            path: item?.isFromMasterForm ? filePath : uri,
            uri: '',
            type: 'pdf',
            mimeType: 'pdf',
            name: item?.item?.WorkOrderNo ?? '',
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
  };

  const onPressSubmit = async () => {
    try {
      setIsLoadingSubmit(true);
      const sqlPendigWOResults = await getpendingWorkOrdersResults();
      const findedObjectFromSqlResults = sqlPendigWOResults?.find(
        (obj) => `${obj?.itemId}` === `${item?.item?.Id}`,
      );
      const data = JSON.parse(findedObjectFromSqlResults?.data);

      if (data?.shouldSave) {
        await insertOrUpdateFormAPI(data?.dispatchFormData);

        await updateItemFromPendingWO(
          JSON.stringify({...data, shouldSave: false}),
          `${item?.item?.Id}`,
        );

        // Refresh SQL
      }
      // Refresh SQL
      await updateDispatchStatusAPI({
        dispatchId: item?.item?.Id,
        fileDataBase64: uri,
        statusId: 50002,
        userId: userDetails?.id,
        AppVersion: `${pjson.version}`,
      });

      await deleteItemFromPendingWO(item?.item?.Id);

      dispatch(setRefreshedOfflineData());
      dispatch(
        updateWorkOrderList({
          ...item?.item,
          Status: 'Completed',
          SubStatus: 'Completed',
        }),
      );
      navigation.navigate('CompletedWorkOrders');

      //  else {
      //   console.log('item?.item?.Id===> ', item?.item?.Id);
      //   const updatedObject = {
      //     ...findedObjectFromSqlResults,
      //     data: {
      //       ...data,
      //       completedData: {
      //         dispatchId: item?.item?.Id,
      //         fileDataBase64: uri,
      //         statusId: 50002,
      //         userId: userDetails?.id,
      //         AppVersion: `${getReadableVersion()}`,
      //       },
      //       shouldMoveToCompleted: true,
      //     },
      //   };

      //   await updateItemFromPendingWO(
      //     JSON.stringify(updatedObject?.data),
      //     `${item?.item?.Id}`,
      //   );
      //   dispatch(setRefreshedOfflineData());
      //   // Refresh SQL
      // }
    } catch (error) {
      console.log(
        '[MasterForm] insertOrUpdateForm error: ',
        error?.response?.status,
      );
    } finally {
      setIsLoadingSubmit(false);
    }
  };

  const startTime = item?.formDetails?.startTimeValue
    ? moment(item?.formDetails?.startTimeValue, 'DD-MM-YYYY h:mm a').format(
        'h:mm a',
      )
    : '';
  const endTime = item?.formDetails?.endTimeValue
    ? moment(item?.formDetails?.endTimeValue, 'DD-MM-YYYY h:mm a').format(
        'h:mm a',
      )
    : '';

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: WHITE,
      }}>
      <TopBar
        onBack={() => navigation.goBack()}
        headingText={route?.params?.folderName}
        onPrint={async () => {
          let filePath =
            ReactNativeBlobUtil.fs.dirs.DocumentDir +
            `/${item?.WorkOrderNo || item?.folderName}.pdf`;

          if (item?.isBase64) {
            await ReactNativeBlobUtil.fs.writeFile(filePath, uri, 'base64');
          }

          await RNPrint.print({
            filePath: item?.isBase64 ? filePath : uri,
          });
        }}
      />
      {isLoading && (
        <View style={{backgroundColor: WHITE}}>
          <ActivityIndicator color={ORANGE} />
        </View>
      )}
      <View style={{flex: 1}}>
        {uri !== '' ? (
          <Pdf
            source={{
              uri: item?.isBase64 ? `data:application/pdf;base64,${uri}` : uri,
            }}
            onLoadComplete={(numberOfPages, filePath) => {
              setIsLoading(false);
            }}
            onError={(error) => {
              setIsLoading(false);
              if (error?.message?.includes('canceled')) {
                return;
              }
              alert('Cannot render PDF' + error);
            }}
            style={styles.flex1}
          />
        ) : null}
      </View>
      {item?.isShowBottomBar ? (
        <View
          style={{
            width: '95%',
            marginTop: 15,
            alignSelf: 'center',
          }}>
          <View
            style={{
              width: '100%',
              height: 70,
              borderRadius: 10,
              marginBottom: 10,
              justifyContent: 'flex-end',
              alignItems: 'center',
              flexDirection: 'row',
              backgroundColor: ORANGE,
            }}>
            <TouchableOpacity
              onPress={() => {
                onPressSendEmail();
              }}
              style={{
                height: 50,
                justifyContent: 'center',
                alignItems: 'center',
                width: 150,
                marginRight: 20,
                borderRadius: 10,
                backgroundColor: WHITE,
              }}>
              <TxtPoppinMedium
                style={{
                  fontSize: RFValue(12),
                }}
                title="Send a Email"
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                if (internetAvailable) {
                  if (startTime && endTime) {
                    setIsVisibleSubmitPopup(true);
                  } else {
                    Alert.alert(
                      'Are your sure?',
                      'Are you sure you want to submit this form?',
                      [
                        // The "Yes" button
                        {
                          text: 'Yes',
                          onPress: async () => {
                            try {
                              onPressSubmit();
                            } catch (error) {
                              console.log(
                                '[MasterForm] insertOrUpdateForm error: ',
                                error?.response?.status,
                              );
                            } finally {
                              setIsLoadingSubmit(false);
                            }
                          },
                        },
                        // The "No" button
                        // Does nothing but dismiss the dialog when tapped
                        {
                          text: 'No',
                        },
                      ],
                    );
                  }
                } else {
                  showMessage({
                    message: 'Failed!',
                    description: `Internet connection required for this action.`,
                    type: 'danger',
                  });
                }
              }}
              disabled={isLoading || internetAvailable !== true}
              style={{
                height: 50,
                justifyContent: 'center',
                alignItems: 'center',
                width: 150,
                marginRight: 20,
                borderRadius: 10,
                backgroundColor: WHITE,
                opacity: internetAvailable !== true ? 0.5 : 1,
              }}>
              {isLoadingSubmit ? (
                <ActivityIndicator color={BLACK} />
              ) : (
                <TxtPoppinMedium
                  style={{
                    fontSize: RFValue(12),
                  }}
                  title="Submit"
                />
              )}
            </TouchableOpacity>
          </View>
        </View>
      ) : null}

      <ConfirmationPopupForSubmitWO
        isVisible={isVisibleSubmitPopup}
        isAM={
          startTime?.includes('am') && endTime?.includes('am')
            ? true
            : startTime?.includes('pm') && endTime?.includes('pm')
            ? false
            : null
        }
        startTime={startTime}
        endTime={endTime}
        lunch={item?.formDetails?.lunchTimeValue ?? '-'}
        st={item?.formDetails?.STValue ?? '-'}
        ot={item?.formDetails?.OTValue ?? '-'}
        dt={item?.formDetails?.DTValue ?? '-'}
        ns={item?.formDetails?.NSValue ?? '-'}
        nsot={item?.formDetails?.NSOTValue ?? '-'}
        nsdt={item?.formDetails?.NSDTValue ?? '-'}
        handleEditDetails={() => {
          setIsVisibleSubmitPopup(false);
          navigation.goBack();
        }}
        handleConfirm={() => {
          setIsVisibleSubmitPopup(false);
          onPressSubmit();
        }}
        onModalClose={() => {
          setIsVisibleSubmitPopup(false);
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  imageStyle: {height: '100%', width: '100%'},
  flex1: {flex: 1, paddingTop: 10},
});
