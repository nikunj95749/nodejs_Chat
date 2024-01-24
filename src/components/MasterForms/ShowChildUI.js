import { isEmpty } from "lodash";
import React, { useState } from "react";
import { View } from "react-native";
import CheckBoxes from "../CheckBoxes";
import DropDownForForm from "../DropDownForForm";
import FixedImageComponentWithInput from "../FixedImageComponentWithInput";
import Label from "../Label";
import PhotoList from "../PhotoList";
import SignatureModal from "../SignatureModal";
import SwitchController from "../SwitchController";
import TableView from "../TableView";
import TextArea from "../TextArea";
import TextWithTitle from "../TextWithTitle";
import TimePickerForForm from "../TimePickerForForm";
import FormSection from "./FormSection";
import TableViewD6039 from "../TableViewD6039";
import CategorySection from "../categorySection/CategorySection";

const ShowChildUI = ({
  data,
  taskCodeSamples,
  formSample = {},
  // arrShowOnJson,
  // onChangeShowOnJson = () => {},
  isLoadingData = false,
  isFromMultiSection = false,
}) => {
  if (data?.formField?.fieldType === "Grid") {
    return (
      <View
        style={[
          data?.formField?.styleJson != null
            ? { ...data?.formField?.styleJson }
            : { width: "100%" },
        ]}
      >
        {data?.child?.map((item, index) => {
          return (
            <ShowChildUI
              key={`__${index}`}
              data={item}
              taskCodeSamples={taskCodeSamples}
              formSample={formSample}
            />
          );
        })}
      </View>
    );
  } else if (data?.formField?.fieldType === "Text") {
    return (
      <View style={{ flex: 1, paddingHorizontal: 10 }}>
        <TextWithTitle
          data={data?.formField}
          formSample={formSample}
          // dispatchData={dispatchFormData}
          // onEditData={(item) => {
          //   setUpdatedDispatchFormData(item);
          // }}
        />
      </View>
    );
  } else if (data?.formField?.fieldType === "TextArea") {
    return (
      <View style={{ flex: 1, paddingHorizontal: 10 }}>
        <TextArea data={data?.formField} formSample={formSample} />
      </View>
    );
  } else if (data?.formField?.fieldType === "Label") {
    return (
      <View style={{ flex: 1, paddingHorizontal: 10 }}>
        <Label data={data?.formField} />
      </View>
    );
  } else if (data?.formField?.fieldType === "Switch") {
    if (!isEmpty(taskCodeSamples)) {
      if (data?.formField?.name?.includes("HaveSample")) {
        if (
          taskCodeSamples?.includes(
            data?.formField?.name?.replace("HaveSample", "")
          )
        ) {
          return (
            <View style={{ flex: 1, paddingHorizontal: 10 }}>
              <SwitchController
                data={data?.formField}
                formSample={formSample}
              />
            </View>
          );
        }
        return <></>;
      }
    }
    return (
      <View style={{ flex: 1, paddingHorizontal: 10 }}>
        <SwitchController
          data={data?.formField}
          formSample={formSample}
        />
      </View>
    );
  } else if (data?.formField?.fieldType === "AddPhotoList") {
    return (
      <View style={{ flex: 1, paddingHorizontal: 10 }}>
        <PhotoList
          data={data?.formField}
          isLoadingData={isLoadingData}
          formSample={formSample}
        />
      </View>
    );
  } else if (data?.formField?.fieldType === "AddPhoto") {
    return (
      <View style={{ flex: 1, paddingHorizontal: 10 }}>
        <FixedImageComponentWithInput
          data={data?.formField}
          isLoadingData={isLoadingData}
          formSample={formSample}
        />
      </View>
    );
  } else if (data?.formField?.fieldType === "Sign") {
    return (
      <View style={{ flex: 1, paddingHorizontal: 10 }}>
        <SignatureModal data={data?.formField} formSample={formSample} />
      </View>
    );
  } else if (data?.formField?.fieldType === "Dropdown") {
    return (
      <View style={{ flex: 1, paddingHorizontal: 10 }}>
        <DropDownForForm
          data={data?.formField}
          isLoadingData={isLoadingData}
          formSample={formSample}
        />
      </View>
    );
  } else if (data?.formField?.fieldType === "Time") {
    return (
      <View style={{ flex: 1, paddingHorizontal: 10 }}>
        <TimePickerForForm
          data={data?.formField}
          isLoadingData={isLoadingData}
          formSample={formSample}
        />
      </View>
    );
  } else if (data?.formField?.fieldType === "Date") {
    return (
      <View style={{ flex: 1, paddingHorizontal: 10 }}>
        <TimePickerForForm
          data={data?.formField}
          isLoadingData={isLoadingData}
          formSample={formSample}
          isDate={true}
        />
      </View>
    );
  } else if (data?.formField?.fieldType === "Number") {
    return (
      <View style={{ flex: 1, paddingHorizontal: 10 }}>
        <TextWithTitle data={data?.formField} formSample={formSample} />
      </View>
    );
  } else if (data?.formField?.fieldType === "CheckList") {
    return (
      <View style={{ flex: 1, paddingHorizontal: 10 }}>
        <CheckBoxes data={data?.formField} formSample={formSample} />
      </View>
    );
  } else if (data?.formField?.fieldType === "Section") {
    return (
      <View style={{ width: "100%", flex: 1 }}>
        <FormSection
          data={data}
          taskCodeSamples={taskCodeSamples}
          isFromMultiSection={isFromMultiSection}
          formSample={formSample}
        />
      </View>
    );
  } else if (data?.formField?.fieldType === "Table") {
    return (
      <View style={{ flex: 1, paddingHorizontal: 10 }}>
        {formSample?.formSampleId == 70 &&
        data?.formField?.styleJson?.isAutoCalc === true ? (
          <TableViewD6039
            data={data}
            formSample={formSample}
            taskCodeSamples={taskCodeSamples}
          />
        ) : (
          <TableView
            data={data}
            formSample={formSample}
            taskCodeSamples={taskCodeSamples}
          />
        )}
      </View>
    );
  } else if (data?.formField?.fieldType === "SampleCategory") {
    return (
      <View style={{ flex: 1, paddingHorizontal: 10 }}>
        <CategorySection
          data={data?.formField}
          taskCodeSamples={taskCodeSamples}
        />
      </View>
    );
  }

  return <View />;
};

export default ShowChildUI;
