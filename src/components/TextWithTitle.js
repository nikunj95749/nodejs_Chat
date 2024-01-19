import { isEmpty } from "lodash";
import React, { useEffect, useState } from "react";
import { StyleSheet, View, TextInput, Platform } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import store from "../../store/configureStore";
import { setDispatchFormData, setFormValidation } from "../../store/form";

import {
  DARK_GRAY,
  LIGHT_GRAY,
  ORANGE,
  RED,
  responsiveScale,
  WHITE,
} from "../styles";
import { TxtPoppinMedium } from "./text/TxtPoppinMedium";
import { RFValue } from "react-native-responsive-fontsize";
import Info from "./Info";

export default function TextWithTitle({
  data,
  isFromTable = false,
  onChangeTextValue = () => {},
  value = "",
  RoundOff = 0,
  editable = true,
  formSample = {},
}) {
  const [txtValue, setTxtValue] = useState(value);
  const [isValidateText, setIsValidateText] = useState(true);

  const dispatchFormData = useSelector(
    (state) => state.form?.dispatchFormData ?? {}
  );
  const isTriggerValidation = useSelector(
    (state) => state.form?.isValidate ?? {}
  );

  const dispatch = useDispatch();

  useEffect(() => {
    setTxtValue(value);
  }, [value]);

  useEffect(() => {
    if (isTriggerValidation === true) {
      dispatch(setFormValidation(false));
      if (isEmpty(txtValue) && data?.isRequired === true) {
        setIsValidateText(false);
        if (isFromTable) {
          window.isValicationSuccessfullyTable = false;
        } else {
          window.isValicationSuccessfully = false;
        }
      } else {
        setIsValidateText(true);
      }
    }
  }, [isTriggerValidation]);

  useEffect(() => {
    if (isFromTable === false) {
      if (!isEmpty(formSample) && dispatchFormData?.formSamples?.length > 0) {
        const dispatchObj = dispatchFormData?.formSamples?.find((obj) => {
          return formSample?.displayIndex === obj?.sample?.displayIndex;
        });

        if (!isEmpty(dispatchObj?.formFields)) {
          const formField = [...dispatchObj?.formFields]?.find((obj) => {
            return obj?.formFieldId === data?.id;
          });
          setTxtValue(formField?.textValue);
        }
      } else {
        if (!isEmpty(dispatchFormData?.formFields)) {
          const formField = [...dispatchFormData?.formFields]?.find((obj) => {
            return obj?.formFieldId === data?.id;
          });
          setTxtValue(formField?.textValue);
        }
      }
    }
  }, [isEmpty(dispatchFormData?.formFields)]);

  const onChange = (text) => {
    setIsValidateText(true);
    if (isFromTable === true) {
      const regex = /^[0-9]*\.?[0-9]*$/;

      if (RoundOff > 0) {
        if (regex.test(text)) {
          setTxtValue(text);
          onChangeTextValue({ value: text, id: data?.id });
        }
      } else {
        setTxtValue(text);
        onChangeTextValue({ value: text, id: data?.id });
      }
    }
    if (isFromTable === false) {
      setTxtValue(text);
      if (
        !isEmpty(formSample) &&
        store?.getState()?.form?.dispatchFormData?.formSamples?.length > 0
      ) {
        const dispatchObj =
          dispatchFormData?.formSamples?.find((obj) => {
            return formSample?.displayIndex === obj?.sample?.displayIndex;
          }) ?? {};

        const formField = [...(dispatchObj?.formFields ?? [])]?.find((obj) => {
          return obj?.formFieldId === data?.id;
        });

        let finalData;

        if (isEmpty(formField)) {
          finalData = {
            ...dispatchObj,
            formFields: [
              ...(dispatchObj?.formFields ?? []),
              {
                id: 0,
                dispatchFormId: 0,
                formFieldId: data?.id,
                textValue: text,
                isRequired: data?.isRequired,
              },
            ],
          };
        } else {
          finalData = {
            ...dispatchObj,
            formFields: [...(dispatchObj?.formFields ?? [])]?.map((obj) => {
              if (obj?.formFieldId === data?.id) {
                return {
                  ...obj,
                  textValue: text,
                  isRequired: data?.isRequired,
                };
              }
              return obj;
            }),
          };
        }
        const finalFormSample = [...dispatchFormData?.formSamples]?.map(
          (obj) => {
            if (formSample?.displayIndex === obj?.sample?.displayIndex) {
              return finalData;
            } else {
              return obj;
            }
          }
        );

        dispatch(
          setDispatchFormData({
            ...dispatchFormData,
            formSamples: finalFormSample,
          })
        );
      } else {
        const formField = [
          ...store?.getState()?.form?.dispatchFormData?.formFields,
        ]?.find((obj) => {
          return obj?.formFieldId === data?.id;
        });
        let finalData;

        if (isEmpty(formField)) {
          finalData = {
            ...store?.getState()?.form?.dispatchFormData,
            formFields: [
              ...store?.getState()?.form?.dispatchFormData?.formFields,
              {
                id: 0,
                dispatchFormId: 0,
                formFieldId: data?.id,
                textValue: text,
                isRequired: data?.isRequired,
              },
            ],
          };
        } else {
          finalData = {
            ...store?.getState()?.form?.dispatchFormData,
            formFields: [
              ...store?.getState()?.form?.dispatchFormData?.formFields,
            ]?.map((obj) => {
              if (obj?.formFieldId === data?.id) {
                return {
                  ...obj,
                  textValue: text,
                  isRequired: data?.isRequired,
                };
              }
              return obj;
            }),
          };
        }
        dispatch(setDispatchFormData(finalData));
      }
    }
  };

  return (
    <View style={{ alignItems: "center", width: "100%", marginBottom: 10 }}>
      <View style={{ flexDirection: "row", width: "100%" }}>
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
            title={"*"}
          />
        ) : null}
        {data.tooltipText && <Info content={`${data.tooltipText}`} />}
      </View>

      <View
        style={{
          height: Platform.OS === "ios" ? 35 : null,
          width: "100%",
          paddingLeft: 10,
          backgroundColor: WHITE,
          borderWidth: 1,
          borderColor: isValidateText ? LIGHT_GRAY : RED,
          borderRadius: 10,
        }}
      >
        <TextInput
          keyboardType={
            data?.fieldType === "Number" ? "decimal-pad" : "default"
          }
          placeholder={data?.placeholder}
          placeholderTextColor={DARK_GRAY}
          onBlur={(e) => {
            if (isFromTable === true) {
              const regex = /^[0-9]*\.?[0-9]*$/;
              if (RoundOff > 0) {
                if (regex.test(txtValue)) {
                  if (txtValue != "") {
                    setTxtValue(parseFloat(txtValue).toFixed(RoundOff));
                    onChangeTextValue({
                      value: parseFloat(txtValue).toFixed(RoundOff),
                      id: data?.id,
                    });
                  }
                }
              }
            }
            const text = e._dispatchInstances.memoizedProps.text
              .trim()
              .toLowerCase();
            if (/^(na|n\/a)$/i.test(text)) {
              setTxtValue("N/A");
            }
          }}
          onChangeText={(txt) => onChange(txt)}
          value={txtValue}
          style={{ flex: 1 }}
          editable={editable}
        />
      </View>
      {/* <TxtPoppinNormal title="LAX" /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  addAndCancelButtonView: {
    height: 70,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: ORANGE,
  },
});
