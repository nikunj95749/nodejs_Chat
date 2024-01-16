import React, {useCallback, useEffect, useRef, useState} from 'react';
import PhotoEditor from 'react-native-photo-editor';
import ReactNativeBlobUtil from 'react-native-blob-util';
import ImagePicker from 'react-native-image-crop-picker';
import ImageResizer from 'react-native-image-resizer';
import DocumentPicker, {types} from 'react-native-document-picker';
import {BLACK} from '../styles';
import {appImages} from '../config';
import {chackboxUnChecked, whitePage} from '../helpers/base64Images';
import {Platform} from 'react-native';

export const useImageProgress = () => {
  const arrSticker = [
    'square',
    'arrow1',
    'arrow2',
    'arrow3',
    'arrow4',
    'arrow5',
    'arrow6',
    'arrow7',
  ];
  const getPhotoFromTheCamera = (cb) => {
    setTimeout(() => {
      ImagePicker.openCamera({
        cropping: false,
        cropperStatusBarColor: BLACK,
        cropperToolbarColor: BLACK,
        includeBase64: true,
        compressImageQuality: 0.6,
      })
        .then(async (response) => {
          const imagePath =
            Platform.OS === 'ios'
              ? response.path
              : response.path?.replace('file://', '');
          if (response.path) {
            PhotoEditor.Edit({
              stickers: [],
              hiddenControls: ['sticker'],
              path: imagePath,
              onDone: (responseEditImage) => {
                ImageResizer.createResizedImage(
                  responseEditImage,
                  2000,
                  2000,
                  'JPEG',
                  1,
                )
                  .then((res) => {
                    const imagePathfromResizer =
                      Platform.OS === 'ios'
                        ? res.path
                        : res.path.replace('file://', '');
                    ReactNativeBlobUtil.fs
                      .readFile(imagePathfromResizer, 'base64')
                      .then((data) => {
                        cb({mime: response?.mime, data: data});
                      })
                      .catch((err) => {
                        console.log('errrooooo base64 ', err);
                      });
                  })
                  .catch((err) => {
                    console.log('resperronsxe====== ', err);
                  });
              },
            });
          }
        })
        .catch((err) => {});
    }, 500);
  };

  const getPhotoFromTheFiles = (cb) => {
    setTimeout(async () => {
      const response = await DocumentPicker.pick({
        presentationStyle: 'fullScreen',
        type: [DocumentPicker.types.images],
      });
      if (response?.[0]?.uri) {
        PhotoEditor.Edit({
          stickers: [],
          hiddenControls: ['sticker'],
          path: response?.[0]?.uri,
          onDone: (responseEditImage) => {
            ImageResizer.createResizedImage(
              responseEditImage,
              2000,
              2000,
              'JPEG',
              1,
            )
              .then((res) => {
                const imagePathfromResizer =
                  Platform.OS === 'ios'
                    ? res.path
                    : res.path.replace('file://', '');
                ReactNativeBlobUtil.fs
                  .readFile(imagePathfromResizer, 'base64')
                  .then((data) => {
                    cb({mime: response?.[0]?.type, data: data});
                  })
                  .catch((err) => {
                    console.log('err base64 ', err);
                  });
                // response.uri is the URI of the new image that can now be displayed, uploaded...
                // response.path is the path of the new image
                // response.name is the name of the new image with the extension
                // response.size is the size of the new image
              })
              .catch((err) => {
                console.log('err ====== ', err);

                // Oops, something went wrong. Check that the filename is correct and
                // inspect err to get more details.
              });
          },
        });
      }
    }, 500);
  };

  const getPhotoFromTheGallery = (cb) => {
    setTimeout(() => {
      ImagePicker.openPicker({
        cropping: false,
        cropperStatusBarColor: BLACK,
        cropperToolbarColor: BLACK,
        includeBase64: true,
        compressImageQuality: 0.6,
        mediaType: 'photo',
        smartAlbums: [
          'PhotoStream',
          'Generic',
          'Panoramas',
          'Favorites',
          'Timelapses',
          'AllHidden',
          'RecentlyAdded',
          'Bursts',
          'SlomoVideos',
          'UserLibrary',
          'SelfPortraits',
          'Screenshots',
          'DepthEffect',
          'LivePhotos',
          'Animated',
          'LongExposure',
        ],
      })
        .then(async (response) => {
          if (response.path) {
            const imagePath =
              Platform.OS === 'ios'
                ? response.path
                : response.path?.replace('file://', '');
            PhotoEditor.Edit({
              stickers: arrSticker,
              // hiddenControls: ['sticker'],
              path: imagePath,
              onDone: (responseEditImage) => {
                ImageResizer.createResizedImage(
                  responseEditImage,
                  2000,
                  2000,
                  'JPEG',
                  1,
                )
                  .then((res) => {
                    const imagePathfromResizer =
                      Platform.OS === 'ios'
                        ? res.path
                        : res.path.replace('file://', '');
                    ReactNativeBlobUtil.fs
                      .readFile(imagePathfromResizer, 'base64')
                      .then((data) => {
                        cb({mime: response?.mime, data: data});
                      })
                      .catch((err) => {
                        console.log('err base64 ', err);
                      });
                  })
                  .catch((err) => {
                    console.log('res====== ', err);
                  });
              },
            });
          }
        })
        .catch((err) => {});
    }, 500);
  };

  const getEmptyDrawImage = (cb) => {
    setTimeout(() => {
      const filePath =
        ReactNativeBlobUtil.fs.dirs.DocumentDir + `/whiteImage.png`;

      ReactNativeBlobUtil.fs
        .writeFile(filePath, whitePage, 'base64')
        .then(() => {
          PhotoEditor.Edit({
            stickers: arrSticker,
            path: filePath,
            onDone: (responseEditImage) => {
              ImageResizer.createResizedImage(
                responseEditImage,
                2000,
                2000,
                'JPEG',
                1,
              )
                .then((res) => {
                  const imagePathfromResizer =
                    Platform.OS === 'ios'
                      ? res.path
                      : res.path.replace('file://', '');
                  ReactNativeBlobUtil.fs
                    .readFile(imagePathfromResizer, 'base64')
                    .then((data) => {
                      cb({mime: 'base64', data: data});
                    })
                    .catch((err) => {
                      console.log('err base64 ', err);
                    });
                })
                .catch((err) => {
                  console.log('res====== ', err);
                });
            },
          }).catch((err) => {
            console.log('res11====== ', err);
          });
        });
    }, 500);
  };

  return {
    getPhotoFromTheGallery,
    getPhotoFromTheCamera,
    getPhotoFromTheFiles,
    getEmptyDrawImage,
  };
};
