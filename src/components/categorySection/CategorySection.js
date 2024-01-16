import React, {useEffect, useState} from 'react';
import {StyleSheet, View, Pressable} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import store from '../../../store/configureStore';
import {ORANGE, WHITE} from '../../styles';

import {TxtPoppinMedium} from '../text/TxtPoppinMedium';
import {setDispatchFormData} from '../../../store/form';
import {RFValue} from 'react-native-responsive-fontsize';
import CategoryOptionsModal from '../CategoryOptionsModal';
import {isEmpty} from 'lodash';
import Info from '../Info';

export default function CategorySection({
  style = {},
  data = {},
  isLoadingData,
  taskCodeSamples,
}) {

  const dispatch = useDispatch();

  const [isShowSampleModal, setIsShowSampleModal] = useState(false);

  const AddImageListButton = ({}) => {
    return (
      <Pressable
        onPress={() => {
          setIsShowSampleModal(true);
        }}
        style={styles.btnMainView}>
        <TxtPoppinMedium
          style={{fontSize: RFValue(12)}}
          title={`Add`}
        />
      </Pressable>
    );
  };

  return (
    <View style={{width: '100%'}}>
      <View style={{width: '100%'}}>
        <View style={{width: '100%', flex: 1}}>
          <View
            style={{
              minHeight: 30,
              flexDirection: 'row',
              alignItems: 'center',
              flex: 1,
            }}>
            <TxtPoppinMedium
              style={{
                fontSize: RFValue(11),
              }}
              title={data?.title}
            />
            {data?.isRequired ? (
              <TxtPoppinMedium
                style={{
                  fontSize: RFValue(11),
                  color: RED,
                }}
                title={'*'}
              />
            ) : null}
            { data.tooltipText && <Info content={`${data.tooltipText}`}/>}
            <View style={{flex: 1}}></View>

            <AddImageListButton />
          </View>
        </View>
      </View>
      <CategoryOptionsModal
        name={data?.name}
        onPressAddButton={(item) => {
          let duplicateDispatchdata = {
            ...store.getState().form?.dispatchFormData,
          };

          const formSamples = [
            ...(store?.getState()?.form?.dispatchFormData?.formSamples ?? []),
          ];

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
            ...duplicateDispatchdata,
            formSamples: arrLatestList,
          };

          dispatch(setDispatchFormData(finalDispatchData));

          // setIsShowSampleModal(false);
        }}
        onPressNo={(item) => {
          if (!isEmpty(item)) {
            const arrFilterFormSamples = [
              ...store?.getState()?.form?.dispatchFormData?.formSamples,
            ]?.filter((obj) => {
              return obj?.sample?.formSampleId !== item?.formSample?.id;
            });
            const finalDispatchData = {
              ...store?.getState()?.form?.dispatchFormData,
              formSamples: arrFilterFormSamples,
            };

            dispatch(setDispatchFormData(finalDispatchData));
          }
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
    height: 40,
    width: 150,

    // marginHorizontal: 10,
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
