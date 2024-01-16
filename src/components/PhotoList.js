import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  ActionSheetIOS,
  FlatList,
  TextInput,
  Pressable,
  Alert,
  Image,
  Platform,
} from 'react-native';
import ActionSheet from 'react-native-actionsheet';
import FastImage from 'react-native-fast-image';

import {
  BLACK,
  DARK_GRAY,
  LIGHT_GRAY,
  ORANGE,
  RED,
  responsiveScale,
  WHITE,
} from '../styles';
import {useDispatch, useSelector} from 'react-redux';
import {isEmpty} from 'lodash';
import {setDispatchFormData, setFormValidation} from '../../store/form';
import store from '../../store/configureStore';
import {TxtPoppinMedium} from './text/TxtPoppinMedium';
import {useImageProgress} from '../hooks/useImageProgress';
import Minus from '../assets/images/Minus.svg';
import {RFValue} from 'react-native-responsive-fontsize';
import Info from './Info';

export default function PhotoList({
  style = {},
  data = {},
  isLoadingData,
  formSample = {},
}) {
  const [selectedButtonImadex, setSelectedButtonIndex] = useState(0);
  const [viewWidth, setViewWidth] = useState(0);

  const actionSheetRef = useRef(null);
  const {
    getPhotoFromTheGallery,
    getPhotoFromTheFiles,
    getPhotoFromTheCamera,
    getEmptyDrawImage,
  } = useImageProgress();

  const photoCount = data?.styleJson?.PhotoCount ?? 3;
  const drawingPrompt = data?.styleJson?.DrawingPrompt ?? false;

  const arrDefaultImageList = Array(photoCount)
    .fill()
    .map((_, idx) => {
      // const uuid = U
      return {
        id: 0,
        dispatchFormId: data?.formId,
        formFieldId: data?.id,
        fileType: '',
        fileData: null,
        fileDataBase64: '',
        masterId: 0,
        remarks: '',
      };
    });

  const [arrImageList, setArrImageList] = useState([]);

  const dispatchFormData = useSelector(
    (state) => state.form?.dispatchFormData ?? {},
  );
  const dispatch = useDispatch();

  const setupDefaultImageListInDispatchFormData = () => {
    const latestDispatchFormData = store?.getState()?.form?.dispatchFormData;
    if (
      !isEmpty(formSample) &&
      latestDispatchFormData?.formSamples?.length > 0
    ) {
      const dispatchObj =
        latestDispatchFormData?.formSamples?.find((obj) => {
          return formSample?.displayIndex === obj?.sample?.displayIndex;
        }) ?? {};

      let removedOldformFields = [];

      if (!isEmpty(dispatchObj?.formFiles)) {
        removedOldformFields = [...dispatchObj?.formFiles]?.filter((obj) => {
          return obj?.formFieldId !== data?.id;
        });
      }

      let newImageList = arrDefaultImageList;

      let finalData = {
        ...dispatchObj,
        formFiles: [...newImageList, ...removedOldformFields],
      };

      const finalFormSample = [...latestDispatchFormData?.formSamples]?.map(
        (obj) => {
          if (formSample?.displayIndex === obj?.sample?.displayIndex) {
            return finalData;
          } else {
            return obj;
          }
        },
      );

      dispatch(
        setDispatchFormData({
          ...latestDispatchFormData,
          formSamples: finalFormSample,
        }),
      );
    } else {
      let removedOldformFields = [];

      if (!isEmpty(latestDispatchFormData?.formFiles)) {
        removedOldformFields = [...latestDispatchFormData?.formFiles]?.filter(
          (obj) => {
            return obj?.formFieldId !== data?.id;
          },
        );
      }

      let newImageList = arrDefaultImageList;
      if (isEmpty(latestDispatchFormData)) {
        let finalData = {
          formFields: [],
          formFiles: [...newImageList, ...removedOldformFields],
        };

        dispatch(setDispatchFormData(finalData));
      } else {
        let finalData = {
          ...latestDispatchFormData,
          formFiles: [...newImageList, ...removedOldformFields],
        };

        dispatch(setDispatchFormData(finalData));
      }
    }
  };

  useEffect(() => {
    const latestDispatchFormData = store?.getState()?.form?.dispatchFormData;
    if (
      !isEmpty(formSample) &&
      latestDispatchFormData?.formSamples?.length > 0
    ) {
      const dispatchObj =
        latestDispatchFormData?.formSamples?.find((obj) => {
          return formSample?.displayIndex === obj?.sample?.displayIndex;
        }) ?? {};

      if (!isEmpty(dispatchObj?.formFiles)) {
        const formField = [...dispatchObj?.formFiles]?.filter((obj) => {
          return obj?.formFieldId === data?.id;
        });
        if (!isEmpty(formField)) {
          setArrImageList(formField);
        } else {
          setupDefaultImageListInDispatchFormData();
          setArrImageList(arrDefaultImageList);
        }
      } else {
        setupDefaultImageListInDispatchFormData();
        setArrImageList(arrDefaultImageList);
      }
    } else {
      if (!isEmpty(dispatchFormData?.formFiles)) {
        const formField = [...dispatchFormData?.formFiles]?.filter((obj) => {
          return obj?.formFieldId === data?.id;
        });
        if (!isEmpty(formField)) {
          setArrImageList(formField);
        } else {
          setupDefaultImageListInDispatchFormData();
          setArrImageList(arrDefaultImageList);
        }
      } else {
        setupDefaultImageListInDispatchFormData();
        setArrImageList(arrDefaultImageList);
      }
    }
  }, [isLoadingData]);

  const _handleMenuPress = useCallback(() => {
    if (Platform.OS === 'android') {
      actionSheetRef.current.show();

      return;
    }
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: drawingPrompt
          ? [
              'Done',
              'Camera',
              'Photo Library',
              'Choose From File',
              'Add Drawing',
            ]
          : ['Done', 'Camera', 'Photo Library', 'Choose From File'],
        cancelButtonIndex: 0,
        tintColor: ORANGE,
        message: 'User Actions',
      },
      _handleActionSheet,
    );
  }, [_handleActionSheet]);

  const _handleActionSheet = useCallback(
    async (buttonIndex) => {
      switch (buttonIndex) {
        case 1:
          takePhotoFromCamera();
          break;
        case 2:
          choosePhotoFromGallery();
          break;
        case 3:
          Platform.OS === 'android'
            ? choosePhotoFromGallery()
            : choosePhotoFromFile();
          break;
        case 4:
          choosePhotoFromWhiteScreen();
          break;
      }
    },
    [selectedButtonImadex],
  );

  const setImage = async (response, currentImageIndex) => {
    try {
      setArrImageList((obj) => {
        const latestDispatchFormData =
          store?.getState()?.form?.dispatchFormData;
        if (
          !isEmpty(formSample) &&
          latestDispatchFormData?.formSamples?.length > 0
        ) {
          const dispatchObj =
            latestDispatchFormData?.formSamples?.find((obj) => {
              return formSample?.displayIndex === obj?.sample?.displayIndex;
            }) ?? {};

          const removedOldformFields = [...dispatchObj?.formFiles]?.filter(
            (obj) => {
              return obj?.formFieldId !== data?.id;
            },
          );
          let newImageList = obj?.map((res, i) => {
            if (i === currentImageIndex) {
              return {
                ...res,
                fileType: response?.mime,
                fileDataBase64: response?.data,
              };
            }
            return res;
          });

          let finalData = {
            ...dispatchObj,
            formFiles: [...newImageList, ...removedOldformFields],
          };

          const finalFormSample = [...latestDispatchFormData?.formSamples]?.map(
            (obj) => {
              if (formSample?.displayIndex === obj?.sample?.displayIndex) {
                return finalData;
              } else {
                return obj;
              }
            },
          );

          dispatch(
            setDispatchFormData({
              ...latestDispatchFormData,
              formSamples: finalFormSample,
            }),
          );

          return newImageList;
        } else {
          const removedOldformFields = [
            ...latestDispatchFormData?.formFiles,
          ]?.filter((obj) => {
            return obj?.formFieldId !== data?.id;
          });
          let newImageList = obj?.map((res, i) => {
            if (i === currentImageIndex) {
              return {
                ...res,
                fileType: response?.mime,
                fileDataBase64: response?.data,
              };
            }
            return res;
          });

          let finalData = {
            ...latestDispatchFormData,
            formFiles: [...newImageList, ...removedOldformFields],
          };

          dispatch(setDispatchFormData(finalData));
          return newImageList;
        }
      });
    } catch (error) {}
  };

  const choosePhotoFromWhiteScreen = useCallback(() => {
    try {
      setSelectedButtonIndex((latestIndex) => {
        getEmptyDrawImage((response) => {
          setImage(response, latestIndex);
        });
      });
    } catch (error) {}
  }, []);

  const choosePhotoFromGallery = useCallback(() => {
    try {
      setSelectedButtonIndex((latestIndex) => {
        getPhotoFromTheGallery((response) => {
          setImage(response, latestIndex);
        });
      });
    } catch (error) {}
  }, []);

  const choosePhotoFromFile = useCallback(() => {
    try {
      setSelectedButtonIndex((latestIndex) => {
        getPhotoFromTheFiles((response) => {
          setImage(response, latestIndex);
        });
      });
    } catch (error) {}
  }, []);

  const takePhotoFromCamera = () => {
    try {
      setSelectedButtonIndex((latestIndex) => {
        getPhotoFromTheCamera((response) => {
          setImage(response, latestIndex);
        });
      });
    } catch (error) {
      setActionsheetVisible(false);
    }
  };

  const onChangeRemark = async (response, currentImageIndex) => {
    try {
      setArrImageList((obj) => {
        const latestDispatchFormData =
          store?.getState()?.form?.dispatchFormData;
        if (
          !isEmpty(formSample) &&
          latestDispatchFormData?.formSamples?.length > 0
        ) {
          const dispatchObj =
            latestDispatchFormData?.formSamples?.find((obj) => {
              return formSample?.displayIndex === obj?.sample?.displayIndex;
            }) ?? {};

          const removedOldformFields = [...dispatchObj?.formFiles]?.filter(
            (obj) => {
              return obj?.formFieldId !== data?.id;
            },
          );

          let newImageList = obj?.map((res, i) => {
            if (i === currentImageIndex) {
              return {
                ...res,
                remarks: response,
              };
            }
            return res;
          });

          let finalData = {
            ...dispatchObj,
            formFiles: [...newImageList, ...removedOldformFields],
          };

          const finalFormSample = [...latestDispatchFormData?.formSamples]?.map(
            (obj) => {
              if (formSample?.displayIndex === obj?.sample?.displayIndex) {
                return finalData;
              } else {
                return obj;
              }
            },
          );

          dispatch(
            setDispatchFormData({
              ...latestDispatchFormData,
              formSamples: finalFormSample,
            }),
          );

          return newImageList;
        } else {
          const removedOldformFields = [
            ...latestDispatchFormData?.formFiles,
          ]?.filter((obj) => {
            return obj?.formFieldId !== data?.id;
          });

          let newImageList = obj?.map((res, i) => {
            if (i === currentImageIndex) {
              return {
                ...res,
                remarks: response,
              };
            }
            return res;
          });

          let finalData = {
            ...latestDispatchFormData,
            formFiles: [...newImageList, ...removedOldformFields],
          };

          dispatch(setDispatchFormData(finalData));
          return newImageList;
        }
      });
    } catch (error) {}
  };

  const onPressDeleteImage = useCallback(
    (latestIndex) => {
      try {
        Alert.alert(
          'Are your sure?',
          'Are you sure you want to Delete this Photo?',
          [
            // The "Yes" button
            {
              text: 'Yes',
              onPress: () => {
                setImage({mime: '', data: ''}, latestIndex);
              },
            },
            // The "No" button
            // Does nothing but dismiss the dialog when tapped
            {
              text: 'No',
            },
          ],
        );
      } catch (error) {}
    },
    [selectedButtonImadex],
  );

  const ImageComponent = ({data = {}, style = {}, imageIndex = 0}) => {
    const [txtRemark, setTxtRemark] = useState(data?.remarks ?? '');

    return (
      <View
        style={[
          {
            flex: 1,
            marginTop: 10,
          },
          style,
        ]}>
        <Pressable
          onPress={() => {
            setSelectedButtonIndex(imageIndex);

            _handleMenuPress();
          }}
          style={{
            flex: 1,

            borderRadius: 5,
            backgroundColor: LIGHT_GRAY,
            marginVertical: 10,
            marginHorizontal: 10,
            aspectRatio: 1,
          }}>
          <View
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            {data?.fileDataBase64 ? (
              <Image
                style={{
                  width: '100%',
                  height: '100%',
                  resizeMode: 'contain',
                  backgroundColor: BLACK,
                }}
                source={{
                  uri: `data:application/image;base64,${data?.fileDataBase64}`,
                }}
              />
            ) : (
              // <Image
              //   source={{
              //     uri: `data:application/image;base64,${data?.fileDataBase64}`,
              //   }}
              //   style={{width: '100%', height: '100%'}}
              // />
              <TxtPoppinMedium title="PHOTOGRAPHY" />
            )}
          </View>
          {data?.fileDataBase64 ? (
            <TouchableOpacity
              onPress={() => {
                onPressDeleteImage(imageIndex);
              }}
              style={{
                height: 35,
                width: 35,
                borderRadius: 17.5,
                right: -16,
                top: -16,
                position: 'absolute',
                backgroundColor: 'red',
              }}>
              <Minus width={'100%'} height={'100%'} />
            </TouchableOpacity>
          ) : null}
          <View
            style={{
              width: '100%',
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 5,
              height: 45,
              borderRadius: 10,
              overflow: 'hidden',
              backgroundColor: 'white',
            }}>
            <TextInput
              placeholder={'Photo Remark'}
              placeholderTextColor={DARK_GRAY}
              style={{
                width: '100%',
                height: '100%',
                fontSize: RFValue(11),
                marginLeft: 18,
                marginRight: 10,
                textAlign: 'center',
              }}
              onBlur={(e) => {
                onChangeRemark(txtRemark, imageIndex);
              }}
              onChangeText={(txt) => {
                setTxtRemark(txt);
              }}
              value={txtRemark}
            />
          </View>
        </Pressable>
      </View>
    );
  };

  const onLayout = (event) => {
    const {x, y, height, width} = event.nativeEvent.layout;
    setViewWidth(width);
  };

  return (
    <View style={{width: '100%'}}>
      {data.tooltipText && (
        <View style={{flexDirection: 'row-reverse',marginTop:10}}>
          <Info content={`${data.tooltipText}`} style={{paddingRight: 25}} />
        </View>
      )}
      <View onLayout={onLayout} style={{width: '100%'}}>
        <FlatList
          scrollEnabled={false}
          data={arrImageList}
          numColumns={3}
          renderItem={({item, index}) => {
            return (
              <ImageComponent
                data={item}
                imageIndex={index}
                style={{width: viewWidth / 3, height: viewWidth / 3}}
              />
            );
          }}
          keyExtractor={(item, index) => `${item.id}__${index}`}
        />
      </View>

      <ActionSheet
        ref={actionSheetRef}
        title={'User Actions'}
        options={
          drawingPrompt
            ? [
                'Done',
                'Camera',
                'Photo Library',
                'Choose From File',
                'Add Drawing',
              ]
            : ['Done', 'Camera', 'Photo Library', 'Choose From File']
        }
        cancelButtonIndex={0}
        tintColor={ORANGE}
        onPress={_handleActionSheet}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  addAndCancelButtonView: {
    height: 70,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: ORANGE,
  },
});
