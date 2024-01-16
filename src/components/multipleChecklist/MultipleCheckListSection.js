import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  Pressable,
  Alert,
  TouchableOpacity,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import store from '../../../store/configureStore';
import {ORANGE, WHITE} from '../../styles';
import AllFormSamplesModal from '../AllFormSamplesModal';
import ShowChildUI from '../MasterForms/ShowChildUI';
import Close from '../../assets/images/Close.svg';
import Copy from '../../assets/images/Copy.svg';

import {TxtPoppinMedium} from '../text/TxtPoppinMedium';
import {setDispatchFormData} from '../../../store/form';
import {showMessage} from 'react-native-flash-message';

export default function MultipleCheckListSection({
  style = {},
  data = {},
  isLoadingData,
  taskCodeSamples,
}) {
  const formSampleData = useSelector(
    (state) => state.form?.formSampleData ?? [],
  );

  const formSamples = useSelector(
    (state) => state.form?.dispatchFormData?.formSamples ?? [],
  );

  const dispatch = useDispatch();

  const [isShowSampleModal, setIsShowSampleModal] = useState(false);
  const [isRefreshed, setIsRefreshed] = useState(true);

  const AddImageListButton = ({}) => {
    return (
      <Pressable
        onPress={() => {
          setIsShowSampleModal(true);
        }}
        style={styles.btnMainView}>
        <TxtPoppinMedium title={`Add Checklist`} />
      </Pressable>
    );
  };

  function addAfter(array, index, newItem) {
    return [...array.slice(0, index), newItem, ...array.slice(index)];
  }

  return (
    <View style={{width: '100%'}}>
      <View style={{width: '100%'}}>
        <View style={{width: '100%', flex: 1}}>
          {isRefreshed
            ? formSamples?.map((item, i) => {
                const findTamplete = formSampleData?.find((obj) => {
                  return obj?.formSample?.id === item?.sample?.formSampleId;
                });

                return (
                  <View style={{width: '100%'}}>
                    <View
                      style={{
                        width: '100%',
                        height: 40,
                        flexDirection: 'row-reverse',
                        alignItems: 'center',
                        marginTop: 0,
                      }}>
                      <TouchableOpacity
                        onPress={() => {
                          Alert.alert(
                            'Are your sure?',
                            `Are you sure you want to Delete ${findTamplete?.formSample?.title}?`,
                            [
                              {
                                text: 'Yes',
                                onPress: () => {
                                  const newUpdatedMultipleList = [
                                    ...formSamples,
                                  ].filter(
                                    (el) =>
                                      `${el?.sample?.displayIndex}` !==
                                      `${item?.sample?.displayIndex}`,
                                  );
                                  const finalDispatchData = {
                                    ...store?.getState()?.form
                                      ?.dispatchFormData,
                                    formSamples: newUpdatedMultipleList,
                                  };
                                  dispatch(
                                    setDispatchFormData(finalDispatchData),
                                  );
                                  setIsRefreshed(false);
                                  setIsRefreshed(true);
                                  showMessage({
                                    message: 'Success!',
                                    description: `${findTamplete?.formSample?.title} Deleted Successfully!`,
                                    type: 'success',
                                  });
                                },
                              },
                              {
                                text: 'No',
                              },
                            ],
                          );
                        }}
                        style={{
                          height: 30,
                          width: 30,
                          marginRight: 20,
                        }}>
                        <Close width={'100%'} height={'100%'} />
                      </TouchableOpacity>

                      <View
                        style={{
                          height: '100%',
                          flex: 1,
                          alignItems: 'flex-end',
                          // justifyContent: 'center',
                        }}>
                        <TouchableOpacity
                          onPress={() => {
                            let findItem = [...formSamples].find(
                              (el) =>
                                el?.sample?.displayIndex ===
                                item?.sample?.displayIndex,
                            );

                            const highestMaxScore = Math.max(
                              ...formSamples.map(
                                (member) => member.sample?.displayIndex,
                              ),
                            );

                            let finalArr = [
                              ...formSamples,
                              {
                                ...findItem,
                                sample: {
                                  id: 0,
                                  dispatchFormId:
                                    findItem?.sample?.dispatchFormId,
                                  formSampleId: findItem?.sample?.formSampleId,
                                  displayIndex: highestMaxScore + 1,
                                },
                                formFields:
                                  findItem?.formFields?.map((obj) => {
                                    return {
                                      ...obj,
                                      id: 0,
                                      dispatchFormSampleId: 0,
                                    };
                                  }) || [],
                                formFiles:
                                  findItem?.formFiles?.map((obj) => {
                                    return {
                                      ...obj,
                                      id: 0,
                                      dispatchFormSampleId: 0,
                                    };
                                  }) || [],
                              },
                            ];

                            const finalDispatchData = {
                              ...store?.getState()?.form?.dispatchFormData,
                              formSamples: finalArr,
                            };
                            dispatch(setDispatchFormData(finalDispatchData));

                            showMessage({
                              message: 'Success!',
                              description: `${findTamplete?.formSample?.name} Copied Successfully!`,
                              type: 'success',
                            });
                          }}
                          style={{
                            height: '100%',
                            flexDirection: 'row',
                            alignItems: 'center',
                          }}>
                          <View
                            style={{height: 38, width: 38, marginRight: 20}}>
                            <Copy width={'100%'} height={'100%'} />
                          </View>
                        </TouchableOpacity>
                      </View>
                      <View style={{flex: 1, backgroundColor: 'red'}}></View>
                      <TxtPoppinMedium
                        title={`${findTamplete?.formSample?.title}`}
                      />
                    </View>
                    {findTamplete?.formFields?.map((obj, index) => {
                      return (
                        <ShowChildUI
                          key={`__${index}`}
                          data={obj}
                          formSample={item?.sample}
                          taskCodeSamples={taskCodeSamples}
                          isFromMultiSection={true}
                        />
                      );
                    })}
                  </View>
                );
              })
            : null}
        </View>
        <View
          style={{
            width: '100%',
            marginTop: 20,
          }}>
          <AddImageListButton />
        </View>
      </View>
      <AllFormSamplesModal
        onPressAddButton={(item) => {
          let duplicateDispatchdata = {
            ...store.getState().form?.dispatchFormData,
          };

          const highestMaxScore =
            formSamples?.length > 0
              ? Math.max(
                  ...formSamples.map((member) => member.sample?.displayIndex),
                )
              : 0;
          const arrLatestList = [
            ...formSamples,
            {
              sample: {
                id: 0,
                dispatchFormId: duplicateDispatchdata?.form?.id,
                formSampleId: item?.formSample?.id,
                displayIndex: highestMaxScore + 1,
              },
              formFields: [],
              formFiles: [],
            },
          ];

          const finalDispatchData = {
            ...store?.getState()?.form?.dispatchFormData,
            formSamples: arrLatestList,
          };

          dispatch(setDispatchFormData(finalDispatchData));

          setIsShowSampleModal(false);
        }}
        isOpenModal={isShowSampleModal}
        onModalClose={() => {
          setIsShowSampleModal(false);
        }}
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
  btnMainView: {
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
  },
});
