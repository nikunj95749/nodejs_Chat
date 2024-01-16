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
import Add from '../assets/images/Add.svg';
import Close from '../assets/images/Close.svg';
import FastImage from 'react-native-fast-image';
import Minus from '../assets/images/Minus.svg';

import {BLACK, DARK_GRAY, ORANGE, responsiveScale, WHITE} from '../styles';
import {useDispatch, useSelector} from 'react-redux';
import {isEmpty} from 'lodash';
import {setDispatchFormData} from '../../store/form';
import store from '../../store/configureStore';
import {TxtPoppinMedium} from './text/TxtPoppinMedium';
import moment from 'moment';
import {useImageProgress} from '../hooks/useImageProgress';
import {RFValue} from 'react-native-responsive-fontsize';
import Info from './Info';

export default function FixedImageComponentWithInput({
  style = {},
  data = {},
  isLoadingData,
  formSample = {},
}) {
  const [selectedButtonImadex, setSelectedButtonIndex] = useState({
    imageSectionIndex: 0,
    imageIndex: 0,
  });
  const actionSheetRef = useRef(null);

  const {getPhotoFromTheGallery, getPhotoFromTheFiles, getPhotoFromTheCamera} =
    useImageProgress();

  const [arrImageList, setArrImageList] = useState([]);
  const [arrAddImageButton, setArrAddImageButton] = useState(
    isEmpty(data?.options) ? [1, 2, 4, 6] : JSON.parse(data?.options),
  );
  const dispatch = useDispatch();

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
        let getFormFieldPhoto = [...dispatchObj?.formFiles]?.filter((obj) => {
          return obj?.formFieldId === data?.id;
        });

        if (getFormFieldPhoto?.length > 0) {
          getFormFieldPhoto = getFormFieldPhoto.reduce(function (r, a) {
            r[a.photoSectionId] = r[a.photoSectionId] || [];
            r[a.photoSectionId].push(a);
            return r;
          }, Object.create(null));
          if (!isEmpty(getFormFieldPhoto)) {
            getFormFieldPhoto = Object.values(getFormFieldPhoto);
          }
        }
        if (!isEmpty(getFormFieldPhoto)) {
          setArrImageList(
            getFormFieldPhoto.sort((obj1, obj2) => {
              return obj1?.[0]?.displayIndex - obj2?.[0]?.displayIndex;
            }),
          );
        }
      }
    } else {
      if (!isEmpty(latestDispatchFormData?.formFiles)) {
        let getFormFieldPhoto = [...latestDispatchFormData?.formFiles]?.filter(
          (obj) => {
            return obj?.formFieldId === data?.id;
          },
        );

        if (getFormFieldPhoto?.length > 0) {
          getFormFieldPhoto = getFormFieldPhoto.reduce(function (r, a) {
            r[a.photoSectionId] = r[a.photoSectionId] || [];
            r[a.photoSectionId].push(a);
            return r;
          }, Object.create(null));
          if (!isEmpty(getFormFieldPhoto)) {
            getFormFieldPhoto = Object.values(getFormFieldPhoto);
          }
        }
        if (!isEmpty(getFormFieldPhoto)) {
          setArrImageList(
            getFormFieldPhoto.sort((obj1, obj2) => {
              return obj1?.[0]?.displayIndex - obj2?.[0]?.displayIndex;
            }),
          );
        }
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
        options: ['Done', 'Camera', 'Photo Library', 'Choose From File'],
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
      }
    },
    [selectedButtonImadex],
  );

  const setImage = async (response, currentIndexObject) => {
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

          const removedOldformFields =
            [...dispatchObj?.formFiles]?.filter((o) => {
              return (
                o?.photoSectionId !==
                obj?.[currentIndexObject?.imageSectionIndex]?.[
                  currentIndexObject?.imageIndex
                ]?.photoSectionId
              );
            }) || [];

          let newImageList = obj?.map((res1, i1) => {
            if (currentIndexObject?.imageSectionIndex === i1) {
              return res1?.map((res, i) => {
                if (i === currentIndexObject?.imageIndex) {
                  return {
                    ...res,
                    fileType: response?.mime ?? '',
                    fileDataBase64: response?.data ?? '',
                  };
                }
                return res;
              });
            }
            return res1;
          });

          let finalData = {
            ...dispatchObj,
            formFiles: [
              ...newImageList?.[currentIndexObject?.imageSectionIndex],
              ...removedOldformFields,
            ],
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
          const removedOldformFields =
            [...latestDispatchFormData?.formFiles]?.filter((o) => {
              return (
                o?.photoSectionId !==
                obj?.[currentIndexObject?.imageSectionIndex]?.[
                  currentIndexObject?.imageIndex
                ]?.photoSectionId
              );
            }) || [];

          let newImageList = obj?.map((res1, i1) => {
            if (currentIndexObject?.imageSectionIndex === i1) {
              return res1?.map((res, i) => {
                if (i === currentIndexObject?.imageIndex) {
                  return {
                    ...res,
                    fileType: response?.mime ?? '',
                    fileDataBase64: response?.data ?? '',
                  };
                }
                return res;
              });
            }
            return res1;
          });

          let finalData = {
            ...latestDispatchFormData,
            formFiles: [
              ...newImageList?.[currentIndexObject?.imageSectionIndex],
              ...removedOldformFields,
            ],
          };

          dispatch(setDispatchFormData(finalData));
          return newImageList;
        }
      });
    } catch (error) {}
  };

  const choosePhotoFromGallery = useCallback(() => {
    try {
      setSelectedButtonIndex((latestIndex) => {
        getPhotoFromTheGallery((response) => {
          setImage(response, latestIndex);
        });
      });
    } catch (error) {}
  }, [selectedButtonImadex]);

  const choosePhotoFromFile = useCallback(() => {
    try {
      setSelectedButtonIndex((latestIndex) => {
        getPhotoFromTheFiles((response) => {
          setImage(response, latestIndex);
        });
      });
    } catch (error) {}
  }, [selectedButtonImadex]);

  const takePhotoFromCamera = () => {
    try {
      setSelectedButtonIndex((latestIndex) => {
        getPhotoFromTheCamera((response) => {
          setImage(response, latestIndex);
        });
      });
    } catch (error) {}
  };

  const onChangeRemark = (txt, currentIndexObject) => {
    try {
      // remarks
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
          const removedOldformFields =
            [...dispatchObj?.formFiles]?.filter((o) => {
              return (
                o?.photoSectionId !==
                obj?.[currentIndexObject?.imageSectionIndex]?.[
                  currentIndexObject?.imageIndex
                ]?.photoSectionId
              );
            }) || [];

          let newImageList = obj?.map((res1, i1) => {
            if (currentIndexObject?.imageSectionIndex === i1) {
              return res1?.map((res, i) => {
                if (i === currentIndexObject?.imageIndex) {
                  return {
                    ...res,
                    remarks: txt,
                  };
                }
                return res;
              });
            }
            return res1;
          });

          let finalData = {
            ...dispatchObj,
            formFiles: [
              ...newImageList?.[currentIndexObject?.imageSectionIndex],
              ...removedOldformFields,
            ],
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
          const removedOldformFields =
            [...latestDispatchFormData?.formFiles]?.filter((o) => {
              return (
                o?.photoSectionId !==
                obj?.[currentIndexObject?.imageSectionIndex]?.[
                  currentIndexObject?.imageIndex
                ]?.photoSectionId
              );
            }) || [];

          let newImageList = obj?.map((res1, i1) => {
            if (currentIndexObject?.imageSectionIndex === i1) {
              return res1?.map((res, i) => {
                if (i === currentIndexObject?.imageIndex) {
                  return {
                    ...res,
                    remarks: txt,
                  };
                }
                return res;
              });
            }
            return res1;
          });

          let finalData = {
            ...latestDispatchFormData,
            formFiles: [
              ...newImageList?.[currentIndexObject?.imageSectionIndex],
              ...removedOldformFields,
            ],
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

  const ImageComponent = ({
    data = {},
    style = {},
    imageIndex = 0,
    imageSectionIndex = 0,
  }) => {
    const [txtRemark, setTxtRemark] = useState(data?.remarks ?? '');

    return (
      <View
        style={[
          {
            flex: 1 / 2,
            aspectRatio: 1.5,
            marginTop: 10,
          },
          style,
        ]}>
        <Pressable
          onPress={() => {
            setSelectedButtonIndex({imageSectionIndex, imageIndex});
            _handleMenuPress();
          }}
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            borderRadius: 5,
            borderWidth: 2,
            marginVertical: 10,
            marginHorizontal: 10,
            borderStyle: data?.fileDataBase64 ? 'solid' : 'dashed',
          }}>
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
            <Add width={'70%'} height={'70%'} />
          )}
        </Pressable>
        {data?.fileDataBase64 ? (
          <TouchableOpacity
            onPress={() => {
              onPressDeleteImage({imageSectionIndex, imageIndex});
            }}
            style={{
              height: 35,
              width: 35,
              borderRadius: 17.5,
              right: 0,
              top: -5,
              position: 'absolute',
              backgroundColor: 'red',
            }}>
            <Minus width={'100%'} height={'100%'} />
          </TouchableOpacity>
        ) : null}
        <View
          style={{
            width: '95%',
            justifyContent: 'center',
            alignItems: 'center',
            alignSelf: 'center',
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
              onChangeRemark(txtRemark, {imageSectionIndex, imageIndex});
            }}
            onChangeText={(txt) => {
              setTxtRemark(txt);
            }}
            value={txtRemark}
          />
        </View>
      </View>
    );
  };

  const AddImageListButton = ({number, currentImageList}) => {
    return (
      <Pressable
        onPress={() => {
          const date = moment();
          let newImageList = Array(number)
            .fill()
            .map((_, idx) => {
              return {
                id: 0,
                dispatchFormId: data?.formId,
                formFieldId: data?.id,
                fileType: '',
                fileData: null,
                fileDataBase64: '',
                masterId: 0,
                remarks: '',
                photoSectionId: `${date}`,
                displayIndex:
                  currentImageList?.length > 0
                    ? currentImageList?.length + 1
                    : 1,
              };
            });

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

            let finalData = {
              ...dispatchObj,
              formFiles: [...newImageList, ...dispatchObj?.formFiles],
            };
            setArrImageList((oldobj) => {
              return [...oldobj, newImageList];
            });

            const finalFormSample = [
              ...latestDispatchFormData?.formSamples,
            ]?.map((obj) => {
              if (formSample?.displayIndex === obj?.sample?.displayIndex) {
                return finalData;
              } else {
                return obj;
              }
            });

            dispatch(
              setDispatchFormData({
                ...latestDispatchFormData,
                formSamples: finalFormSample,
              }),
            );
          } else {
            let finalData = {
              ...latestDispatchFormData,
              formFiles: [
                ...newImageList,
                ...latestDispatchFormData?.formFiles,
              ],
            };
            setArrImageList((oldobj) => {
              return [...oldobj, newImageList];
            });
            dispatch(setDispatchFormData(finalData));
          }
        }}
        style={{
          height: 55,
          minWidth: 120,
          flex: 1,
          marginHorizontal: 10,
          backgroundColor: WHITE,
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: 10,
          shadowColor: '#000',
          shadowOffset: {width: 0, height: 1},
          shadowOpacity: 0.2,
          marginBottom: 10,
          elevation: 2,
        }}>
        <TxtPoppinMedium title={`+ ${number} Image`} />
      </Pressable>
    );
  };

  const onPressClosePage = (arrImageObj, index) => {
    const latestDispatchFormData = store?.getState()?.form?.dispatchFormData;
    if (
      !isEmpty(formSample) &&
      latestDispatchFormData?.formSamples?.length > 0
    ) {
      const dispatchObj =
        latestDispatchFormData?.formSamples?.find((obj) => {
          return formSample?.displayIndex === obj?.sample?.displayIndex;
        }) ?? {};

      const formField = [...dispatchObj?.formFiles]?.filter((obj) => {
        return obj?.photoSectionId !== arrImageObj?.[0]?.photoSectionId;
      });

      let finalData = {
        ...dispatchObj,
        formFiles: formField,
      };

      setArrImageList((oldArray) => oldArray.filter((item, i) => index !== i));

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
      const formField = [...latestDispatchFormData?.formFiles]?.filter(
        (obj) => {
          return obj?.photoSectionId !== arrImageObj?.[0]?.photoSectionId;
        },
      );

      let finalData = {
        ...latestDispatchFormData,
        formFiles: formField,
      };

      setArrImageList((oldArray) => oldArray.filter((item, i) => index !== i));
      dispatch(setDispatchFormData(finalData));
    }
  };

  const ImageSection = ({arrImageObj = [], sectionIndex = 0}) => {
    return (
      <View style={{width: '100%'}}>
        <View
          style={{
            width: '100%',
            height: 60,
            flexDirection: 'row-reverse',
            alignItems: 'center',
            marginTop: 10,
          }}>
          <Pressable
            onPress={() => onPressClosePage(arrImageObj, sectionIndex)}
            style={{
              height: 30,
              width: 30,
              marginRight: 20,
            }}>
            <Close width={'100%'} height={'100%'} />
          </Pressable>
        </View>
        <FlatList
          scrollEnabled={false}
          data={arrImageObj}
          numColumns={2}
          renderItem={({item, index}) => {
            return (
              <ImageComponent
                data={item}
                imageIndex={index}
                imageSectionIndex={sectionIndex}
                style={arrImageObj?.length === 1 && {flex: 1, aspectRatio: 2}}
              />
            );
          }}
          keyExtractor={(item, index) => `${item.id}__${index}`}
        />
        <View
          style={{
            width: '100%',
            height: 0.5,
            marginTop: 10,
            backgroundColor: BLACK,
          }}></View>
      </View>
    );
  };

  return (
    <View style={{width: '100%'}}>
      {data.tooltipText && (
        <View style={{flexDirection: 'row-reverse'}}>
          <Info content={`${data.tooltipText}`} style={{paddingRight: 25}} />
        </View>
      )}

      <View style={{width: '100%'}}>
        {arrImageList?.map((item, index) => (
          <ImageSection arrImageObj={item} sectionIndex={index} />
        ))}
        <View
          style={{
            width: '100%',
            flexDirection: 'row',
            alignItems: 'center',
            flexWrap: 'wrap',
            marginTop: 20,
          }}>
          {arrAddImageButton.map((item) => (
            <AddImageListButton number={item} currentImageList={arrImageList} />
          ))}
        </View>
      </View>

      <ActionSheet
        ref={actionSheetRef}
        title={'User Actions'}
        options={['Done', 'Camera', 'Photo Library', 'Choose From File']}
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
