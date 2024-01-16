/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState} from 'react';
import {View, TouchableOpacity} from 'react-native';

import Delete from '../../../assets/images/Delete.svg';

import {BLACK_10, WHITE} from '../../../styles';
import {RowTitle} from './RowTitle';
import moment from 'moment';
import {useMemo} from 'react';
import {DOUBLE_TIME, OVER_TIME, REGULAR} from '../../../helpers/common';
import {timeRemaining} from '../../../helpers/configureAxios';

export const TimeSheetItem = ({
  item = {},
  arrWorkOrderId = [],
  index,
  onClose = () => {},
  onEdit = () => {},
}) => {
  const [hours, setHours] = useState('-');

  const [lunchHours, setLunchHours] = useState('-');

  const workOrder = useMemo(() => {
    const data = arrWorkOrderId?.find((obj) => {
      return `${obj?.value}` === `${item?.woId}`;
    });
    return data ? data : {};
  }, [arrWorkOrderId]);

  useEffect(() => {
    if (item?.hours) {
      const splitHours = item?.hours.split(':');
      setHours(`${splitHours?.[0]}:${splitHours?.[1]}`);
    }
    if (item?.lunchHours) {
      const splitHours = item?.lunchHours.split(':');
      setLunchHours(`${splitHours?.[0]}:${splitHours?.[1]}`);
    }
  }, []);

  return (
    <View
      style={{
        paddingHorizontal: 30,
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
        {/* */}
        <RowTitle
          width="11%"
          title={moment(item?.woDate).format('MM/DD/YYYY')}
          color={BLACK_10}
        />
        <RowTitle
          width="20%"
          title={
            (item?.workOrderNo || '-') + (item?.scope ? `/${item?.scope}` : '')
          }
          color={BLACK_10}
        />
        <RowTitle width="10%" title={item?.type || '-'} color={BLACK_10} />
        <RowTitle
          width="9%"
          title={
            item?.startTime
              ? moment(item?.startTime, 'DD-MM-YYYY h:mm a').format('h:mm a')
              : '-'
          }
          color={BLACK_10}
        />
        <RowTitle
          width="9%"
          title={
            item?.endTime
              ? moment(item?.endTime, 'DD-MM-YYYY h:mm a').format('h:mm a')
              : '-'
          }
          color={BLACK_10}
        />
        <RowTitle width="7%" title={lunchHours} color={BLACK_10} />
        <RowTitle width="7%" title={hours} color={BLACK_10} />
        {/* <RowTitle
          width="14%"
          title={
            item?.type === DOUBLE_TIME
              ? timeRemaining(item?.startTime, item?.endTime)
              : '-'
          }
          color={BLACK_10}
        /> */}
        {/* <View
          style={{
            height: '100%',
            alignItems: 'center',
            width: '14%',
            flexDirection: 'row',
          }}>
          <TouchableOpacity
            onPress={() => {
              onEdit(item);
            }}
            style={{height: 30, width: 30, marginRight: 15}}>
            <Edit width={'100%'} height={'100%'} />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              onClose(index);
            }}
            style={{height: 30, width: 30}}>
            <Delete width={'100%'} height={'100%'} />
          </TouchableOpacity>
        </View> */}
      </View>
    </View>
  );
};
