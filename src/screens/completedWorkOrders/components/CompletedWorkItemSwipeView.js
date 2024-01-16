import React, {useState} from 'react';
import {ActivityIndicator, Alert, TouchableOpacity, View} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {updateWorkOrderList} from '../../../../store/workOrder';
import {TxtPoppinSemiBold} from '../../../components/text/TxtPoppinSemiBold';
import {updateDispatchStatusAPI} from '../../../resources/baseServices/form';
import {ORANGE, WHITE} from '../../../styles';
import { RFValue } from 'react-native-responsive-fontsize';
import { showMessage } from 'react-native-flash-message';

export const CompletedWorkItemSwipeView = ({item = {}, onPress = () => {}}) => {
  const userDetails = useSelector((state) => state.auth?.userDetails ?? '');
  const internetAvailable = useSelector(
    (state) => state.workOrderForOffline?.internetAvailable,
  );
  const [isLoadingSubmit, setIsLoadingSubmit] = useState(false);
  const dispatch = useDispatch();

  const onPressCancelButton = async () => {
    Alert.alert(
      'Are your sure?',
      `Are you sure you want to move this WO #  ${item?.WorkOrderNo} to "In-Progress"?`,
      [
        // The "Yes" button
        {
          text: 'Yes',
          onPress: async () => {
            try {
              if (internetAvailable) {
                setIsLoadingSubmit(true);
              await updateDispatchStatusAPI({
                dispatchId: item?.Id,
                statusId: 50001,
                userId: userDetails?.id,
              });
              dispatch(
                updateWorkOrderList({
                  ...item,
                  Status: 'InProgress',
                  SubStatus: 'InProgress',
                }),
              );
              } else {
                showMessage({
                  message: 'Failed!',
                  description: `Internet connection required for this action.`,
                  type: 'danger',
                });
              }
              
            } catch (error) {
              console.log(
                '[CompletedWorkItemSwipeView] onPressCancelButton error: ',
                error,
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
  };

  return (
    <View
      style={{
        width: '100%',
        flex: 1,
        paddingVertical: 30,
      }}>
      <View
        style={{
          width: '100%',
          flex: 1,
          flexDirection: 'row-reverse',
        }}>
        {item?.Status === 'Completed' ?<TouchableOpacity
          disabled={isLoadingSubmit}
          onPress={onPressCancelButton}
          style={{
            width: 290,
            height: '100%',
            borderTopRightRadius: 20,
            borderBottomEndRadius: 20,
            backgroundColor: ORANGE,
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          {isLoadingSubmit ? (
            <ActivityIndicator color={WHITE} />
          ) : (
            <TxtPoppinSemiBold
              style={{
                color: WHITE,
                marginTop: 4,
                textAlign: 'center',
                width: '100%',
                fontSize: RFValue(15),
              }}
              title={'Move to "In-Progress"'}
            />
          )}
        </TouchableOpacity> : null}
      </View>
    </View>
  );
};
