import React, {useCallback, useEffect, useState} from 'react';
import {StyleSheet, View, ActivityIndicator} from 'react-native';
import {useSelector} from 'react-redux';

import {ORANGE, WHITE} from '../styles';
import {TxtPoppinSemiBold} from './text/TxtPoppinSemiBold';

export default function SyncOfflineLoader({data, formSample = {}}) {
  const isShowSyncOfflineLoader = useSelector(
    (state) => state.form?.isShowSyncOfflineLoader ?? '',
  );

  const countOfflineData = useSelector(
    (state) => state.workOrderForOffline?.countOfflineData ?? 0,
  );
  const totalCountOfflineData = useSelector(
    (state) => state.workOrderForOffline?.totalCountOfflineData ?? 0,
  );

  return isShowSyncOfflineLoader ? (
    <View
      style={{
        position: 'absolute',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.3)',
      }}>
      <View
        style={{
          position: 'absolute',
          width: '60%',
          alignItems: 'center',
          justifyContent: 'center',
          // height: 150,
          backgroundColor: WHITE,
          borderRadius: 10,
          paddingTop: 20,
          overflow: 'hidden',
        }}>
        <ActivityIndicator size={'large'} color={'red'} />
        <TxtPoppinSemiBold
          title={'Storing Data To Offline'}
          style={{marginTop: 10}}
        />

        <TxtPoppinSemiBold
          title={`(${countOfflineData}/${totalCountOfflineData})`}
          style={{marginTop: 10, marginBottom: 20, fontSize: 25}}
        />
      </View>
    </View>
  ) : null;
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
