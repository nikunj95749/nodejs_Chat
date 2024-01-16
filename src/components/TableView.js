import React, { useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  View,
  ScrollView,
  Alert,
  Text,
  Image,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from "react-native";
import Modal from "react-native-modal";
import CloseRed from "../assets/images/CloseRed.svg";
import MenuDots from "../assets/images/MenuDots.svg";

import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from "react-native-popup-menu";

import { BLACK, LIGHT_GRAY, ORANGE, responsiveScale, WHITE } from "../styles";
import { TxtPoppinMedium } from "./text/TxtPoppinMedium";
import FloatingBlueButton from "../assets/images/FloatingBlueButton.svg";

import { useDispatch, useSelector } from "react-redux";
import store from "../../store/configureStore";
import { isEmpty } from "lodash";
import { setDispatchFormData, setFormValidation } from "../../store/form";
import TextWithTitle from "./TextWithTitle";
import CheckBoxes from "./CheckBoxes";
import DropDownForForm from "./DropDownForForm";
import { RFValue } from "react-native-responsive-fontsize";
import Info from "./Info";

let selectedTableItem = [];

export default function TableView({ data = {}, formSample = {} }) {
  const [isEnableEdit, setEnableEdit] = useState(false);

  const [selectedTableIndex, setSelectedTableIndex] = useState(0);

  const dispatchFormData = useSelector(
    (state) => state.form?.dispatchFormData ?? {}
  );
  const dispatch = useDispatch();
  const [isShowAddNewTableModal, setIsShowAddNewTableModal] = useState(false);

  const [arrTableItem, setArrTableItem] = useState([]);

  const ShowChildUI = ({
    data,
    index = 0,
    D6938TblInfo = {},
    onValueChange = () => {},
  }) => {
    useEffect(() => {
      if (data?.formField?.isRequired) {
        arrRequiredFields = [...arrRequiredFields, `${data?.formField?.id}`];
      }
    }, []);

    if (
      data?.formField?.fieldType === "Text" ||
      data?.formField?.fieldType === "Number"
    ) {
      const [txtValue, setTxtValue] = useState("");

      useEffect(() => {
        if (isEnableEdit === false) {
          let latestValue = "";
          if (data?.formField?.remarks === "group") {
            if (arrTableItem?.length > 0) {
              latestValue =
                arrTableItem?.[arrTableItem?.length - 1]?.find(
                  (obj) => obj?.id === data?.formField?.id
                )?.value ?? "";
              onValueChange({ [data?.formField?.id]: latestValue });
              setTxtValue(latestValue);
            }
          }
          selectedTableItem = [
            ...selectedTableItem,
            {
              value: latestValue,
              id: data?.formField?.id,
              idx: arrTableItem?.length + 1,
              fieldType: "Text",
              remarks: data?.formField?.remarks ?? "",
            },
          ];
        }

        if (isEnableEdit === true) {
          const txtLatestValue = [...selectedTableItem]?.find((obj) => {
            return obj?.id === data?.formField?.id;
          })?.value;
          setTxtValue(txtLatestValue);
          onValueChange({ [data?.formField?.id]: txtLatestValue });
        }
      }, []);

      return (
        <View style={{ width: "100%" }}>
          <TextWithTitle
            value={txtValue}
            data={data?.formField}
            isFromTable={true}
            onChangeTextValue={(obj) => {
              const fieldObject = [...selectedTableItem]?.find((value) => {
                return value?.id === data?.formField?.id;
              });

              onValueChange({ [data?.formField?.id]: obj?.value });

              if (!isEmpty(fieldObject)) {
                selectedTableItem = [...selectedTableItem]?.map((value) => {
                  if (value?.id === data?.formField?.id) {
                    return { ...value, ...obj };
                  } else {
                    return value;
                  }
                });
              } else {
                selectedTableItem = [...selectedTableItem, obj];
              }
            }}
          />
        </View>
      );
    } else if (data?.formField?.fieldType === "CheckList") {
      const [txtValue, setTxtValue] = useState("");

      useEffect(() => {
        if (isEnableEdit === false) {
          let latestValue = "";
          if (data?.formField?.remarks === "group") {
            if (arrTableItem?.length > 0) {
              latestValue =
                arrTableItem?.[arrTableItem?.length - 1]?.find(
                  (obj) => obj?.id === data?.formField?.id
                )?.value ?? "";
              onValueChange({ [data?.formField?.id]: latestValue });
              setTxtValue(latestValue);
            }
          }
          selectedTableItem = [
            ...selectedTableItem,
            {
              value: latestValue,
              id: data?.formField?.id,
              idx: arrTableItem?.length + 1,
              fieldType: "CheckList",
            },
          ];
        }

        if (isEnableEdit === true) {
          const txtLatestValue = [...selectedTableItem]?.find((obj) => {
            return obj?.id === data?.formField?.id;
          })?.value;
          setTxtValue(txtLatestValue);
          onValueChange({ [data?.formField?.id]: txtLatestValue });
        }
      }, []);

      return (
        <View style={{ width: "100%" }}>
          <CheckBoxes
            onChangeTextValue={(obj) => {
              const fieldObject = [...selectedTableItem]?.find((value) => {
                return value?.id === data?.formField?.id;
              });

              onValueChange({ [data?.formField?.id]: obj?.value });

              if (!isEmpty(fieldObject)) {
                selectedTableItem = [...selectedTableItem]?.map((value) => {
                  if (value?.id === data?.formField?.id) {
                    return { ...value, ...obj };
                  } else {
                    return value;
                  }
                });
              } else {
                selectedTableItem = [...selectedTableItem, obj];
              }
            }}
            value={txtValue}
            isEnableEdit={isEnableEdit}
            isFromTable={true}
            data={data?.formField}
          />
        </View>
      );
    } else if (data?.formField?.fieldType === "Dropdown") {
      const [txtValue, setTxtValue] = useState("");

      useEffect(() => {
        if (isEnableEdit === false) {
          let latestValue = "";
          if (data?.formField?.remarks === "group") {
            if (arrTableItem?.length > 0) {
              latestValue =
                arrTableItem?.[arrTableItem?.length - 1]?.find(
                  (obj) => obj?.id === data?.formField?.id
                )?.value ?? "";
              onValueChange({ [data?.formField?.id]: latestValue });
              setTxtValue(latestValue);
            }
          }
          selectedTableItem = [
            ...selectedTableItem,
            {
              value: latestValue,
              id: data?.formField?.id,
              idx: arrTableItem?.length + 1,
              fieldType: "Text",
            },
          ];
        }

        if (isEnableEdit === true) {
          const txtLatestValue = [...selectedTableItem]?.find((obj) => {
            return obj?.id === data?.formField?.id;
          })?.value;
          setTxtValue(txtLatestValue);
          onValueChange({ [data?.formField?.id]: txtLatestValue });
        }
      }, []);
      return (
        <View style={{ width: "100%", justifyContent: "center" }}>
          <DropDownForForm
            data={data?.formField}
            isFromTable={true}
            valueForTbl={txtValue}
            onChangeTextValue={(obj) => {
              const fieldObject = [...selectedTableItem]?.find((value) => {
                return value?.id === data?.formField?.id;
              });

              if (!isEmpty(fieldObject)) {
                selectedTableItem = [...selectedTableItem]?.map((value) => {
                  if (value?.id === data?.formField?.id) {
                    return { ...value, ...obj };
                  } else {
                    return value;
                  }
                });
              } else {
                selectedTableItem = [...selectedTableItem, obj];
              }
              onValueChange({ [data?.formField?.id]: obj?.value });
            }}
          />
        </View>
      );
    }
    // else if (data?.formField?.fieldType === 'TextArea') {
    //   return (
    //     <View style={{width: '100%'}}>
    //       <TextArea data={data?.formField} />
    //     </View>
    //   );
    // } else if (data?.formField?.fieldType === 'Switch') {
    //   return (
    //     <View style={{width: '100%'}}>
    //       <SwitchController data={data?.formField} />
    //     </View>
    //   );
    // } else if (data?.formField?.fieldType === 'AddPhotoList') {
    //   return (
    //     <View style={{width: '100%'}}>
    //       <PhotoList data={data?.formField} />
    //     </View>
    //   );
    // } else if (data?.formField?.fieldType === 'AddPhoto') {
    //   return (
    //     <View style={{width: '100%'}}>
    //       <FixedImageComponentWithInput data={data?.formField} />
    //     </View>
    //   );
    // } else if (data?.formField?.fieldType === 'Sign') {
    //   return (
    //     <View style={{width: '100%', alignItems: 'center'}}>
    //       <SignatureModal data={data?.formField} />
    //     </View>
    //   );

    // } else if (data?.formField?.fieldType === 'Time') {
    //   return (
    //     <View style={{width: '100%', justifyContent: 'center'}}>
    //       <TimePickerForForm data={data?.formField} />
    //     </View>
    //   );
    // } else if (data?.formField?.fieldType === 'Number') {
    //   return (
    //     <View style={{width: '100%', paddingHorizontal: 10}}>
    //       <TextWithTitle data={data?.formField} />
    //     </View>
    //   );
    // }

    return <View />;
  };

  const onModalClose = () => {
    selectedTableItem = [];
    setEnableEdit(false);
    // setTimeout(() => {
    setIsShowAddNewTableModal(false);

    // }, 1000);
  };
  // const sleep = ms => new Promise(resolve => setTimeout(resolve, ms))
  const onPressAdd = async (latestTableItem, D6938TblInfo) => {
    if (arrRequiredFields?.length > 0) {
      for (let index = 0; index < arrRequiredFields.length; index++) {
        const element = arrRequiredFields[index];

        if (isEmpty(D6938TblInfo?.[element])) {
          Alert.alert("", "Please fill the required fields!", [
            // The "Yes" button
            {
              text: "Ok",
              onPress: () => {},
            },
          ]);
          return;
        }
      }
    }

    dispatch(setFormValidation(true));

    let mergedTableItem = [];
    if (isEnableEdit === true) {
      mergedTableItem = latestTableItem?.map((item, index) => {
        if (selectedTableIndex === index) {
          return selectedTableItem;
        }
        return item;
      });
    } else {
      mergedTableItem = [...latestTableItem, selectedTableItem];
    }

    let txtArrTableItem = JSON.stringify(mergedTableItem);

    if (!isEmpty(formSample) && dispatchFormData?.formSamples?.length > 0) {
      const dispatchObj =
        dispatchFormData?.formSamples?.find((obj) => {
          return formSample?.displayIndex === obj?.sample?.displayIndex;
        }) ?? {};

      const formField = [...(dispatchObj?.formFields ?? [])]?.find((obj) => {
        return obj?.formFieldId === data?.formField?.id;
      });

      let finalData;

      if (isEmpty(formField)) {
        finalData = {
          ...dispatchObj,
          formFields: [
            ...dispatchObj?.formFields,
            {
              id: 0,
              dispatchFormId: 0,
              formFieldId: data?.formField?.id,
              textValue: txtArrTableItem,
              isRequired: data?.formField?.isRequired,
            },
          ],
        };
      } else {
        finalData = {
          ...dispatchObj,
          formFields: [...dispatchObj?.formFields]?.map((obj) => {
            if (obj?.formFieldId === data?.formField?.id) {
              return {
                ...obj,
                textValue: txtArrTableItem,
                isRequired: data?.formField?.isRequired,
              };
            }
            return obj;
          }),
        };
      }

      const finalFormSample = [
        ...store?.getState()?.form?.dispatchFormData?.formSamples,
      ]?.map((obj) => {
        if (formSample?.displayIndex === obj?.sample?.displayIndex) {
          return finalData;
        } else {
          return obj;
        }
      });

      dispatch(
        setDispatchFormData({
          ...store?.getState()?.form?.dispatchFormData,
          formSamples: finalFormSample,
        })
      );
    } else {
      const formField = [
        ...store?.getState()?.form?.dispatchFormData?.formFields,
      ]?.find((obj) => {
        return obj?.formFieldId === data?.formField?.id;
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
              formFieldId: data?.formField?.id,
              textValue: txtArrTableItem,
              isRequired: data?.formField?.isRequired,
            },
          ],
        };
      } else {
        finalData = {
          ...store?.getState()?.form?.dispatchFormData,
          formFields: [
            ...store?.getState()?.form?.dispatchFormData?.formFields,
          ]?.map((obj) => {
            if (obj?.formFieldId === data?.formField?.id) {
              return {
                ...obj,
                textValue: txtArrTableItem,
                isRequired: data?.formField?.isRequired,
              };
            }
            return obj;
          }),
        };
      }
      dispatch(setDispatchFormData(finalData));
    }

    setArrTableItem(mergedTableItem);
    onModalClose();
  };

  const onPressDeleteTableItem = (latestTableItem, index) => {
    Alert.alert(
      "Are your sure?",
      "Are you sure you want to Delete this Record?",
      [
        // The "Yes" button
        {
          text: "Yes",
          onPress: () => {
            const mergedTableItem = [...latestTableItem]?.filter(
              (obj, i) => index !== i
            );
            setArrTableItem(mergedTableItem);
            let txtArrTableItem = JSON.stringify(mergedTableItem);

            const latestDispatchFormData = store?.getState()?.form
              ?.dispatchFormData;

            if (
              !isEmpty(formSample) &&
              latestDispatchFormData?.formSamples?.length > 0
            ) {
              const dispatchObj = latestDispatchFormData?.formSamples?.find(
                (obj) => {
                  return formSample?.displayIndex === obj?.sample?.displayIndex;
                }
              );

              let finalData = {
                ...dispatchObj,
                formFields: [...dispatchObj?.formFields]?.map((obj) => {
                  if (obj?.formFieldId === data?.formField?.id) {
                    return {
                      ...obj,
                      textValue: txtArrTableItem,
                      isRequired: data?.formField?.isRequired,
                    };
                  }
                  return obj;
                }),
              };

              const finalFormSample = [
                ...latestDispatchFormData?.formSamples,
              ]?.map((obj) => {
                if (formSample?.displayIndex === obj?.sample?.displayIndex) {
                  return finalData;
                } else {
                  return obj;
                }
              });

              dispatch(
                setDispatchFormData({
                  ...latestDispatchFormData,
                  formSamples: finalFormSample,
                })
              );
            } else {
              let finalData = {
                ...latestDispatchFormData,
                formFields: [...latestDispatchFormData?.formFields]?.map(
                  (obj) => {
                    if (obj?.formFieldId === data?.formField?.id) {
                      return {
                        ...obj,
                        textValue: txtArrTableItem,
                        isRequired: data?.formField?.isRequired,
                      };
                    }
                    return obj;
                  }
                ),
              };

              dispatch(setDispatchFormData(finalData));
            }
          },
        },
        // The "No" button
        // Does nothing but dismiss the dialog when tapped
        {
          text: "No",
        },
      ]
    );
  };

  const onPressEditTableItem = (latestTableItem, index) => {
    const mergedTableItem = [...latestTableItem]?.filter(
      (obj, i) => index === i
    );

    selectedTableItem = mergedTableItem?.[0];
    setSelectedTableIndex(index);
    setEnableEdit(true);
    setIsShowAddNewTableModal(true);
  };

  function addAfter(array, index, newItem) {
    return [...array.slice(0, index), newItem, ...array.slice(index)]?.map(
      (obj, index) => {
        return obj?.map((subObj) => {
          return { ...subObj, idx: index + 1 };
        });
      }
    );
  }

  const onPressCopyTableItem = (latestTableItem, index) => {
    const mergedTableItem = [...latestTableItem]?.filter(
      (obj, i) => index === i
    );

    const arrCopiedTableItems = addAfter(
      arrTableItem,
      index,
      mergedTableItem?.[0]
    );

    const latestDispatchFormData = store?.getState()?.form?.dispatchFormData;

    if (
      !isEmpty(formSample) &&
      latestDispatchFormData?.formSamples?.length > 0
    ) {
      const dispatchObj = latestDispatchFormData?.formSamples?.find((obj) => {
        return formSample?.displayIndex === obj?.sample?.displayIndex;
      });

      const finalData = {
        ...dispatchObj,
        formFields: [...dispatchObj?.formFields]?.map((obj) => {
          if (obj?.formFieldId === data?.formField?.id) {
            return {
              ...obj,
              textValue: JSON.stringify(arrCopiedTableItems),
              isRequired: data?.formField?.isRequired,
            };
          }
          return obj;
        }),
      };

      const finalFormSample = [
        ...(latestDispatchFormData?.formSamples ?? []),
      ]?.map((obj) => {
        if (formSample?.displayIndex === obj?.sample?.displayIndex) {
          return finalData;
        } else {
          return obj;
        }
      });

      dispatch(
        setDispatchFormData({
          ...latestDispatchFormData,
          formSamples: finalFormSample,
        })
      );
    } else {
      const finalData = {
        ...latestDispatchFormData,
        formFields: [...latestDispatchFormData?.formFields]?.map((obj) => {
          if (obj?.formFieldId === data?.formField?.id) {
            return {
              ...obj,
              textValue: JSON.stringify(arrCopiedTableItems),
              isRequired: data?.formField?.isRequired,
            };
          }
          return obj;
        }),
      };
      dispatch(setDispatchFormData(finalData));
    }
    setArrTableItem(arrCopiedTableItems);
  };

  const onPressCancel = () => {
    setIsShowAddNewTableModal(false);
    onModalClose();
  };

  const onAddNewRowInTable = () => {
    setIsShowAddNewTableModal(true);
  };

  useEffect(() => {
    if (!isEmpty(formSample) && dispatchFormData?.formSamples?.length > 0) {
      const dispatchObj = dispatchFormData?.formSamples?.find((obj) => {
        return formSample?.displayIndex === obj?.sample?.displayIndex;
      });

      if (!isEmpty(dispatchObj?.formFields)) {
        const formField = [...dispatchObj?.formFields]?.find((obj) => {
          return obj?.formFieldId === data?.formField?.id;
        });

        if (!isEmpty(formField)) {
          setArrTableItem(JSON.parse(formField?.textValue));
        }
      }
    } else {
      if (!isEmpty(dispatchFormData?.formFields)) {
        const formField = [...dispatchFormData?.formFields]?.find((obj) => {
          return obj?.formFieldId === data?.formField?.id;
        });

        if (!isEmpty(formField)) {
          setArrTableItem(JSON.parse(formField?.textValue));
        }
      }
    }

    return () => {
      selectedTableItem = [];
    };
  }, []);

  const RenderTableHeader = () => {
    return (
      <View
        style={{
          minHeight: 45,
          borderRightColor: LIGHT_GRAY,
          borderRightWidth: 2,
          borderTopColor: LIGHT_GRAY,
          borderTopWidth: 2,
          flexDirection: "row",
        }}
      >
        {data?.child?.length > 0
          ? [{ value: "delete", id: 0 }, ...data?.child]?.map((obj) => {
              return (
                <View
                  style={[
                    {
                      minHeight: 45,
                      width: obj?.value === "delete" ? 40 : 120,
                      borderLeftColor: LIGHT_GRAY,
                      borderLeftWidth: 2,
                      backgroundColor: "rgba(48,107,176,1)",
                      justifyContent: "center",
                      alignItems: "center",
                      flexDirection:'row',
                    },
                    obj?.formField?.styleJson
                      ? { ...obj?.formField?.styleJson }
                      : null,
                  ]}
                >
                  {obj?.formField?.title !== undefined && (
                    <View style={{flex:1,flexDirection:'row'}}>
                    <TxtPoppinMedium
                      style={{
                        color: WHITE,
                        fontSize: 16,
                        textAlign: "center",
                        flex:1,
                        marginLeft:3
                      }}
                      title={obj?.formField?.title}
                    />
                    {data.formField.tooltipText && <Info content={`${data.formField.tooltipText}`} style={{marginRight:5}} iconStyle={{tintColor:'white'}}/>}
                    </View>
                  ) 
                  }
                </View>
              );
            })
          : null}
      </View>
    );
  };

  const TableRowItem = ({ findTableRawObject = {}, obj }) => {
    if (findTableRawObject?.fieldType === "CheckList") {
      return (
        <View
          style={{
            minHeight: 50,
            flex: 1,
            paddingLeft: 10,
            alignItems: "center",
            flexDirection: "row",
            flexWrap: "wrap",
          }}
        >
          {findTableRawObject?.value
            ? JSON.parse(findTableRawObject?.value)?.map((obj, index) => {
                return (
                  <View
                    style={{
                      flexDirection: "row",
                      height: 50,
                      alignItems: "center",
                      marginRight: 10,
                    }}
                  >
                    {obj?.key === "OtherWithText" ? (
                      <>
                        <View
                          style={{
                            height: 20,
                            width: 20,
                            marginRight: 10,
                          }}
                        >
                          {obj?.value === true ? (
                            <Image
                              source={require("./../assets/images/CheckedCheckBox.png")}
                              style={{ width: "100%", height: "100%" }}
                            />
                          ) : (
                            <Image
                              source={require("./../assets/images/UnCheckedCheckBox.png")}
                              style={{ width: "100%", height: "100%" }}
                            />
                          )}
                        </View>
                        <TxtPoppinMedium
                          style={{ marginTop: 0, fontSize: RFValue(11) }}
                          title={!obj?.txt ? "Other" : obj?.txt}
                        />
                      </>
                    ) : (
                      <>
                        <View
                          style={{
                            height: 20,
                            width: 20,
                            marginRight: 10,
                          }}
                        >
                          {obj?.value === true ? (
                            <Image
                              source={require("./../assets/images/CheckedCheckBox.png")}
                              style={{ width: "100%", height: "100%" }}
                            />
                          ) : (
                            <Image
                              source={require("./../assets/images/UnCheckedCheckBox.png")}
                              style={{ width: "100%", height: "100%" }}
                            />
                          )}
                        </View>
                        <TxtPoppinMedium
                          style={{ marginTop: 0, fontSize: RFValue(11) }}
                          title={obj?.key}
                        />
                      </>
                    )}
                  </View>
                );
              })
            : null}
        </View>
      );
    }

    return (
      <TxtPoppinMedium
        style={{
          color: obj?.value === "delete" ? WHITE : BLACK,
          fontSize: 16,
        }}
        title={
          findTableRawObject?.value === "" ? "-" : findTableRawObject?.value
        }
      />
    );
  };

  const RenderTableItem = ({ tableItem = [], index }) => {
    return (
      <View
        style={{
          minHeight: 45,
          borderRightColor: LIGHT_GRAY,
          borderRightWidth: 2,
          borderTopColor: LIGHT_GRAY,
          borderTopWidth: 2,
          flexDirection: "row",
        }}
      >
        {data?.child?.length > 0
          ? [{ value: "delete", id: 0 }, ...data?.child]?.map((obj) => {
              let findTableRawObject = [...tableItem].find(
                (objTableRawItem) => obj?.formField?.id === objTableRawItem?.id
              );
              return (
                <View
                  style={[
                    {
                      minHeight: 45,
                      width: obj?.value === "delete" ? 40 : 120,
                      paddingHorizontal: 10,
                      borderLeftColor: LIGHT_GRAY,
                      borderLeftWidth: 2,
                      backgroundColor: WHITE,
                      justifyContent: "center",
                      alignItems: "center",
                    },
                    ,
                    obj?.formField?.styleJson
                      ? { ...obj?.formField?.styleJson }
                      : null,
                  ]}
                >
                  {obj?.value === "delete" ? (
                    <View style={{ flexDirection: "row" }}>
                      <Menu>
                        <MenuTrigger>
                          <View
                            style={{
                              height: 30,
                              width: 30,
                            }}
                          >
                            <MenuDots width={"100%"} height={"100%"} />
                          </View>
                        </MenuTrigger>

                        <MenuOptions>
                          <MenuOption
                            onSelect={() =>
                              onPressCopyTableItem(arrTableItem, index)
                            }
                            text="Copy"
                          />
                          <MenuOption
                            onSelect={() =>
                              onPressEditTableItem(arrTableItem, index)
                            }
                            text="Edit"
                          />
                          <MenuOption
                            onSelect={() =>
                              onPressDeleteTableItem(arrTableItem, index)
                            }
                          >
                            <Text style={{ color: "red" }}>Delete</Text>
                          </MenuOption>
                        </MenuOptions>
                      </Menu>
                    </View>
                  ) : (
                    <TableRowItem
                      obj={obj}
                      findTableRawObject={findTableRawObject}
                    />
                  )}
                </View>
              );
            })
          : null}
      </View>
    );
  };

  let arrRequiredFields = [];

  const AddRowModal = () => {
    const [D6938TblInfo, setD6938TblInfo] = useState({});

    useEffect(() => {
      return () => {
        setD6938TblInfo({});
        arrRequiredFields = [];
      };
    }, []);

    return (
      <Modal
        isVisible={isShowAddNewTableModal}
        onBackdropPress={() => onModalClose()}
        onBackButtonPress={() => onModalClose()}
        animationIn={"slideInUp"}
        animationOutTiming={500}
        backdropOpacity={0.6}
      >
        <View
          style={{
            width: "100%",
            flex: 1,
            borderRadius: 20,
            overflow: "hidden",
            backgroundColor: WHITE,
            alignSelf: "center",
          }}
        >
          <View
            style={{
              width: "100%",
              alignItems: "flex-end",
            }}
          >
            <TouchableOpacity
              onPress={() => onModalClose()}
              style={{
                height: 40,
                width: 40,
                marginRight: 30,
                marginTop: 30,
              }}
            >
              <CloseRed width={"100%"} height={"100%"} />
            </TouchableOpacity>
          </View>
          <TxtPoppinMedium
            style={{
              textAlign: "center",
              fontWeight: "600",
              fontSize: RFValue(15),
            }}
            title={isEnableEdit ? "Edit Item" : "Add Item"}
          />

          <View
            style={{
              alignSelf: "center",
              borderTopWidth: 2,
              marginTop: 20,
              width: "95%",
              flex: 1,
              paddingVertical: 20,
            }}
          >
            <KeyboardAvoidingView
              behavior={Platform.OS === "ios" ? "padding" : "height"}
              keyboardVerticalOffset={Platform.OS === "ios" ? 170 : 0}
            >
              <ScrollView style={{ width: "100%" }}>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                  <>
                    {data?.child?.map((item, index) => {
                      return (
                        <ShowChildUI
                          key={`${item.id}__${index}`}
                          data={item}
                          index={index}
                          D6938TblInfo={D6938TblInfo}
                          onValueChange={(obj) => {
                            setD6938TblInfo((oldObj) => {
                              return { ...oldObj, ...obj };
                            });
                          }}
                        />
                      );
                    })}
                  </>
                </TouchableWithoutFeedback>
              </ScrollView>
            </KeyboardAvoidingView>
          </View>
          {/* <View style={{width:'100%',flex:1}}></View> */}
          <View style={{ height: 70, width: "100%", flexDirection: "row" }}>
            <TouchableOpacity
              onPress={() => onPressCancel()}
              style={styles.addAndCancelButtonView}
            >
              <TxtPoppinMedium style={{ color: WHITE }} title="Cancel" />
            </TouchableOpacity>
            <View
              style={{ height: 40, width: 2, backgroundColor: WHITE }}
            ></View>
            <TouchableOpacity
              onPress={() => onPressAdd(arrTableItem, D6938TblInfo)}
              style={styles.addAndCancelButtonView}
            >
              <TxtPoppinMedium
                style={{ color: WHITE }}
                title={isEnableEdit ? "Update" : "Add"}
              />
            </TouchableOpacity>
          </View>
        </View>
        {/* </> */}
      </Modal>
    );
  };

  return (
    <View style={{ width: "100%" }}>
      {!isEmpty(data?.formField?.title) ? (
        <TxtPoppinMedium
          style={{
            fontSize: RFValue(12),
            width: "100%",
            marginTop: 10,
          }}
          title={data?.formField?.title}
        />
      ) : null}
      <ScrollView horizontal={true} style={{}}>
        <View>
          <RenderTableHeader />

          {arrTableItem?.length > 0
            ? arrTableItem?.map((obj, index) => {
                return <RenderTableItem tableItem={obj} index={index} />;
              })
            : null}
        </View>
      </ScrollView>
      <TouchableOpacity
        onPress={() => onAddNewRowInTable()}
        style={{ height: 60, width: 60, paddingTop: 14 }}
      >
        <FloatingBlueButton width={"100%"} height={"100%"} />
      </TouchableOpacity>
      {isShowAddNewTableModal ? <AddRowModal /> : null}
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
