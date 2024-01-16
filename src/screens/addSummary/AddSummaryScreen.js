/* eslint-disable react-hooks/exhaustive-deps */
import {isEmpty} from 'lodash';
import React, {useState} from 'react';
import {
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {setSummaryList} from '../../../store/form';
import {TxtPoppinMedium} from '../../components/text/TxtPoppinMedium';
import TopBar from '../../components/TopBar';
import {
  createFormSummaryAPI,
  deleteFormSummaryAPI,
  getFormSummaryTemplateByUserIdAPI,
  updateFormSummaryAPI,
} from '../../resources/baseServices/form';
import {
  DARK_GRAY,
  LIGHT_GRAY,
  ORANGE,
  RED,
  responsiveScale,
  WHITE,
} from '../../styles';
import { RFValue } from 'react-native-responsive-fontsize';

const AddSummaryScreen = ({navigation, route}) => {
  const userDetails = useSelector((state) => state.auth?.userDetails ?? '');
  const routeData = route?.params?.routeData;

  const dispatch = useDispatch();

  const [isupdateOrAddLoading, setIsupdateOrAddLoading] = useState(false);

  const [isDeleteLoading, setIsDeleteLoading] = useState(false);

  const [summaryDetails, setSummaryDetails] = useState({
    title: routeData?.title,
    description: routeData?.body,
  });

  const isRequireFilled =
    isEmpty(summaryDetails?.title) || isEmpty(summaryDetails?.description);

  const handleChange = (name, value) => {
    setSummaryDetails({
      ...summaryDetails,
      [name]: value,
    });
  };

  const onPressAdd = async () => {
    try {
      setIsupdateOrAddLoading(true);
      const reqData = {
        id: 0,
        title: summaryDetails?.title,
        body: summaryDetails?.description,
        createdById: userDetails?.id,
      };
      await createFormSummaryAPI(reqData);
      await getFormSummaryTemplateByUserId();
      navigation.goBack();
    } catch (error) {
      console.log('error [onPressAdd]', error);
    } finally {
      setIsupdateOrAddLoading(false);
    }
  };

  const getFormSummaryTemplateByUserId = async () => {
    try {
      const res = await getFormSummaryTemplateByUserIdAPI(userDetails?.id);
      dispatch(setSummaryList(res?.data));
    } catch (error) {
      console.log('getFormSummaryTemplateByUserId error: ', error);
    } finally {
    }
  };

  const onPressUpdate = async () => {
    try {
      setIsupdateOrAddLoading(true);
      const reqData = {
        id: routeData?.id,
        title: summaryDetails?.title,
        body: summaryDetails?.description,
        createdById: userDetails?.id,
      };
      await updateFormSummaryAPI(reqData);
      await getFormSummaryTemplateByUserId();
      navigation.goBack();
    } catch (error) {
      console.log('error [onPressUpdate]', error);
    } finally {
      setIsupdateOrAddLoading(false);
    }
  };

  const onPressDelete = async () => {
    try {
      setIsDeleteLoading(true);
      await deleteFormSummaryAPI(routeData?.id);
      await getFormSummaryTemplateByUserId();
      navigation.goBack();
    } catch (error) {
      console.log('error [onPressDelete]', error);
    } finally {
      setIsDeleteLoading(true);
    }
  };

  return (
    <View style={styles.container}>
      <TopBar onBack={() => navigation.goBack()} headingText={'Summary'} />
      <View style={{marginHorizontal: 30, paddingTop: 20, flex: 1}}>
        <View style={{alignItems: 'center', width: '100%', marginBottom: 10}}>
          <View style={{flexDirection: 'row', width: '100%'}}>
            <TxtPoppinMedium
              style={{
                fontSize: RFValue(11),
              }}
              title={'Title'}
            />
            <TxtPoppinMedium
              style={{
                fontSize: RFValue(11),
                color: RED,
              }}
              title={'*'}
            />
          </View>
          <View
            style={{
              height: 35,
              width: '100%',
              paddingLeft: 10,
              backgroundColor: WHITE,
              borderWidth: 1,
              borderColor: LIGHT_GRAY,
              borderRadius: 10,
            }}>
            <TextInput
              placeholder={'Enter Title'}
              placeholderTextColor={DARK_GRAY}
              onChangeText={(txt) => handleChange('title', txt)}
              value={summaryDetails.title}
              style={{flex: 1}}
            />
          </View>
        </View>

        <View>
          <View style={{flexDirection: 'row', width: '100%'}}>
            <TxtPoppinMedium
              style={{
                fontSize: RFValue(11),
              }}
              title={'Description'}
            />
            <TxtPoppinMedium
              style={{
                fontSize: RFValue(11),
                color: RED,
              }}
              title={'*'}
            />
          </View>
          <View
            style={{
              height: 210,
              width: '100%',
              paddingLeft: 10,
              backgroundColor: WHITE,
              borderWidth: 1,
              borderColor: LIGHT_GRAY,
              borderRadius: 10,
              paddingBottom: 5,
              flexDirection: 'row',
            }}>
            <TextInput
              multiline
              placeholder={'Enter Description'}
              placeholderTextColor={DARK_GRAY}
              onChangeText={(txt) => handleChange('description', txt)}
              value={summaryDetails?.description}
              style={{flex: 1}}
            />
          </View>
        </View>

        {isEmpty(routeData) ? (
          <View
            style={{
              height: 70,
              opacity: isRequireFilled ? 0.4 : 1,
              width: '100%',
              marginTop: 30,
              borderRadius: 10,
              backgroundColor: ORANGE,
            }}>
            <TouchableOpacity
              onPress={onPressAdd}
              activeOpacity={1}
              disabled={isupdateOrAddLoading || isRequireFilled}
              style={{
                width: '100%',
                height: '100%',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              {isupdateOrAddLoading ? (
                <ActivityIndicator color={WHITE} />
              ) : (
                <TxtPoppinMedium style={{color: WHITE}} title="Add" />
              )}
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <TouchableOpacity
              onPress={onPressUpdate}
              disabled={isupdateOrAddLoading}
              style={{
                height: 70,
                width: '100%',
                marginTop: 30,
                borderRadius: 10,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: ORANGE,
              }}>
              {isupdateOrAddLoading ? (
                <ActivityIndicator color={WHITE} />
              ) : (
                <TxtPoppinMedium style={{color: WHITE}} title="Update" />
              )}
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onPressDelete}
              style={{
                height: 70,
                width: '100%',
                marginTop: 30,
                borderRadius: 10,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: RED,
              }}>
              {isDeleteLoading ? (
                <ActivityIndicator color={WHITE} />
              ) : (
                <TxtPoppinMedium style={{color: WHITE}} title="Delete" />
              )}
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
};

export default AddSummaryScreen;

const styles = StyleSheet.create({
  container: {flex: 1},
});
