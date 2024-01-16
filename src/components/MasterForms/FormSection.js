import {isEmpty} from 'lodash';
import React, {useEffect, useState} from 'react';
import {View} from 'react-native';
import {useSelector} from 'react-redux';
import store from '../../../store/configureStore';
import {ORANGE} from '../../styles';
import MultipleCheckListSection from '../multipleChecklist/MultipleCheckListSection';
import {TxtPoppinMedium} from '../text/TxtPoppinMedium';
import ShowChildUI from './ShowChildUI';

export default function FormSection({
  data,
  isFromMultiSection = false,
  formSample = {},
  taskCodeSamples,
}) {
  const formTemplate = useSelector(
    (state) => state.form?.dispatchFormData ?? [],
  );
  if (!isEmpty(data?.formField?.showOnJson)) {
    const fieldData = formTemplate?.formFields?.find(
      (obj) => obj?.formFieldId === data?.formField?.showOnJson?.FieldId,
    );
    if (
      fieldData?.textValue !== data?.formField?.showOnJson?.FieldValue &&
      !isFromMultiSection
    ) {
      // make a separate copy of the array
      if (window?.arrShowOnJson?.length > 0) {
        window.arrShowOnJson = [...(window?.arrShowOnJson ?? [])]?.filter(
          (obj) => obj !== data?.formField?.templatePageName,
        );
      }
      return <></>;
    }
  }

  if (
    !window?.arrShowOnJson?.includes(data?.formField?.templatePageName) &&
    !isFromMultiSection
  ) {

    if (
      isEmpty(
        store
          ?.getState()
          ?.form?.formSampleData?.find(
            (obj) =>
              obj?.formSample?.reportTemplateName ===
              data?.formField?.templatePageName,
          ),
      )
    ) {
      window.arrShowOnJson = [
        ...(window?.arrShowOnJson ?? []),
        data?.formField?.templatePageName,
      ];
    }
  }

  if (
    !isEmpty(
      store
        ?.getState()
        ?.form?.formSampleData?.find(
          (obj) =>
            obj?.formSample?.reportTemplateName ===
            data?.formField?.templatePageName,
        ),
    ) &&
    !isFromMultiSection
  ) {
    return <></>;
  }

  return (
    <View
      style={{
        width: '100%',
        alignSelf: 'center',
        marginTop:
          data?.formField?.styleJson != null
            ? data?.formField?.styleJson?.backgroundColor
              ? 10
              : 15
            : 15,
        paddingHorizontal: 10,
      }}>
      <View
        style={{
          width: '100%',
          height: 35,
          marginBottom: 10,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor:
            data?.formField?.styleJson != null
              ? data?.formField?.styleJson?.backgroundColor
                ? data?.formField?.styleJson?.backgroundColor
                : ORANGE
              : ORANGE,
        }}>
        <TxtPoppinMedium
          style={{fontSize: 16}}
          title={data?.formField?.title}
        />
      </View>

      {data?.formField?.name == 'AddFormCheckLists' ? (
        <View style={{flex: 1, paddingHorizontal: 10}}>
          <MultipleCheckListSection
            data={data?.formField}
            taskCodeSamples={taskCodeSamples}
          />
        </View>
      ) : (
        data?.child?.map((item, index) => {
          return (
            <ShowChildUI
              key={`__${index}`}
              data={item}
              formSample={formSample}
              taskCodeSamples={taskCodeSamples}
            />
          );
        })
      )}
    </View>
  );
}
