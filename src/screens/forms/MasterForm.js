import React, {useState} from 'react';
import {
  StyleSheet,
  View,
  SafeAreaView,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';

import {BLACK, ORANGE, responsiveScale, WHITE} from '../../styles';
import {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {TxtPoppinMedium} from '../../components/text/TxtPoppinMedium';
import {
  getAllFormSampleData,
  getAllReportTemplate,
  getCopyPriorFormFieldData,
  getDispatchFormData,
  insertOrUpdateFormAPI,
} from '../../resources/baseServices/form';
import {
  setCopyPriorFormFieldDataToStore,
  setDispatchFormData,
  setFormSampleData,
  setFormSampleFilteredData,
  setFormValidation,
  setIsLoadingPreview,
  setIsLoadingReview,
  setIsLoadingSaveAsDraft,
} from '../../../store/form';
import TopBar from '../../components/TopBar';
import store from '../../../store/configureStore';

import {
  radio_UnChecked,
  radio_Checked,
  chackboxChecked,
  chackboxUnChecked,
} from '../../helpers/base64Images';
import moment from 'moment';
import {isEmpty} from 'lodash';
import {setOtherReportTemplate} from './helper/htmlStringsForDiffrentTemplate';
import {whiteScreenBase64} from '../../helpers/logging';
import ShowChildUI from '../../components/MasterForms/ShowChildUI';
import {showMessage} from 'react-native-flash-message';
import {RFValue} from 'react-native-responsive-fontsize';
import {
  getpendingWorkOrdersResults,
  updateItemFromPendingWO,
} from '../../helpers/sqlQuery';
import {setRefreshedOfflineData} from '../../../store/workOrderForOffline';

let filteredAllReportTemplate = [];
let defaultAllReportTemplate = [];
let arrReportTemplateForCheckList = [];
let arrFormBuffers = [];

export var arrShowOnJson = [];
export var isValicationSuccessfully = true;

export var isValicationSuccessfullyTable = true;

const MasterForm = ({navigation, route}) => {
  const startTime = 'StartTime';
  const endTime = 'EndTime';
  const lunchTime = 'LunchTime';
  const ST = 'STHours';
  const OT = 'OTHours';
  const DT = 'DTHours';
  const NS = 'NSHours';
  const NSOT = 'NSOTHours';
  const NSDT = 'NSDTHours';
  
  let startTimeValue = '';
  let endTimeValue = '';
  let lunchTimeValue = '';
  let STValue = '';
  let OTValue = '';
  let DTValue = '';
  let NSValue = '';
  let NSOTValue = '';
  let NSDTValue = '';

  const internetAvailable = useSelector(
    (state) => state.workOrderForOffline?.internetAvailable,
  );

  const formTemplate = useSelector((state) => state.form?.formTemplate ?? []);
  const formSampleData = useSelector(
    (state) => state.form?.formSampleData ?? [],
  );

  const allReportTemplete = useSelector(
    (state) => state.form?.allReportTemplete ?? [],
  );

  const userDetails = useSelector((state) => state.auth?.userDetails ?? '');
  let htmlData = '';

  let addPhotoHtmlData = '';

  const dispatch = useDispatch();

  const [isLoadingData, setIsLoadingData] = useState(false);

  const [finalFormTemplateData, setFinalFormTemplateData] = useState([]);

  const [allReportTemplate, setAllReportTemplate] = useState([]);

  const mapAllReportTemplete = (data) => {
    const pageHeader = data?.find((item) => item?.name === 'PageHeader');
    const pageFooter = data?.find((item) => item?.name === 'PageFooter');

    let arrFilteredReportTemp = data
      ?.filter(
        (obj) =>
          obj?.name !== 'PageHeader' &&
          obj?.name !== 'PageFooter' &&
          obj?.name !== 'AddPhoto1' &&
          obj?.name !== 'AddPhoto2' &&
          obj?.name !== 'AddPhoto4',
      )
      ?.map((obj) => {
        return {
          ...obj,
          templateHtmlText: replaceAll(
            obj?.templateHtmlText,
            `{{PageHeader}}`,
            pageHeader?.templateHtmlText,
          ),
        };
      })
      ?.map((obj) => {
        return {
          ...obj,
          templateHtmlText: replaceAll(
            obj?.templateHtmlText,
            `{{PageFooter}}`,
            pageFooter?.templateHtmlText,
          ),
        };
      });

    filteredAllReportTemplate = arrFilteredReportTemp;
    defaultAllReportTemplate = arrFilteredReportTemp;

    setAllReportTemplate(data);
  };

  const getDispatchFormDataAPI = async () => {
    try {
      setIsLoadingData(true);

      const sqlPendigWOResults = await getpendingWorkOrdersResults();
      const findedObjectFromSqlResults = sqlPendigWOResults?.find(
        (obj) => `${obj?.itemId}` === `${route?.params?.item?.Id}`,
      );

      const res = JSON.parse(
        findedObjectFromSqlResults?.data,
      )?.dispatchFormData;
      // console.log('resresresres=== ', route?.params?.item?.Id);
      // await getDispatchFormData(
      //   route?.params?.item?.Id,
      //   route?.params?.item?.FormId,
      // );

      let filteredSampleData = [];

      if (formSampleData?.length > 0) {
        filteredSampleData = [...formSampleData]?.filter((obj) => {
          if (obj?.formSample?.formIds === null) {
            return false;
          }

          return `${obj?.formSample?.formIds}`
            ?.split(',')
            ?.includes(`${route?.params?.item?.FormId}`);
        });
      } else {
        filteredSampleData = [];
      }

      if (!isEmpty(allReportTemplete)) {
        mapAllReportTemplete(allReportTemplete);
      }

      setTimeout(() => {
        // dispatch(setFormSampleData(formSampleData?.data));
        dispatch(setFormSampleFilteredData(filteredSampleData));

        dispatch(
          setDispatchFormData({
            ...res,
            form: {
              ...res?.form,
              formId: route?.params?.item?.FormId,
              dispatchId: route?.params?.item?.Id,
              ProjectNo: route?.params?.item?.ProjectNo,
            },
          }),
        );
      }, 500);

      setTimeout(() => {
        setIsLoadingData(false);
      }, 1000);
    } catch (error) {
      setIsLoadingData(false);

      console.log('[MasterForm] getDispatchFormDataAPI error: ', error);
    } finally {
    }
  };

  const insertOrUpdateForm = async (isBackGroundSaving = false) => {
    try {
      if (isBackGroundSaving === false) {
        store.dispatch(setIsLoadingSaveAsDraft(true));
      }
      const updatedFormData = {
        ...store?.getState()?.form?.dispatchFormData,
        form: {
          ...store?.getState()?.form?.dispatchFormData.form,
          createdById: userDetails?.id,
        },
      };
      // console.log('internetAvaixxxlable====== ');
      const sqlPendigWOResults = await getpendingWorkOrdersResults();

      const findedObjectFromSqlResults = sqlPendigWOResults?.find(
        (obj) => `${obj?.itemId}` === `${route?.params?.item?.Id}`,
      );

      const data = JSON.parse(findedObjectFromSqlResults?.data);

      // console.log('internetAvailable====== ',internetAvailable);

      // if (internetAvailable) {
      //   const updatedObject = {
      //     ...findedObjectFromSqlResults,
      //     data: {...data, dispatchFormData: updatedFormData, shouldSave: false},
      //   };

      //   await updateItemFromPendingWO(
      //     JSON.stringify(updatedObject?.data),
      //     `${route?.params?.item?.Id}`,
      //   );

      //   dispatch(setRefreshedOfflineData());
      //   // Refresh SQL
      //   await insertOrUpdateFormAPI(updatedFormData);
      // } else {
      const updatedObject = {
        ...findedObjectFromSqlResults,
        data: {...data, dispatchFormData: updatedFormData, shouldSave: true},
      };

      await updateItemFromPendingWO(
        JSON.stringify(updatedObject?.data),
        `${route?.params?.item?.Id}`,
      );
      dispatch(setRefreshedOfflineData());
      // Refresh SQL
      // }

      dispatch(setDispatchFormData(updatedFormData));
      // await sleep(500);
      // await getDispatchFormDataAPI(false);
    } catch (error) {
      console.log('[MasterForm] insertOrUpdateForm error: ', error);
    } finally {
      store.dispatch(setIsLoadingSaveAsDraft(false));
    }
  };

  const ShowTemplate = ({data}) => {
    return (
      <View style={{flex: 1}}>
        {data?.formFields?.map((item, index) => {
          return (
            <ShowChildUI
              key={`__${index}`}
              data={item}
              taskCodeSamples={route?.params?.item?.TaskCodeSamples}
              isLoadingData={isLoadingData}
            />
          );
        })}
      </View>
    );
  };

  const showTemplateHtmlData = (isJustCheckFieldData = false) => {
    finalFormTemplateData?.map((data) => {
      if (data?.formFields) {
        {
          data?.formFields?.map((item) => {
            formSectionHtmlData(item, isJustCheckFieldData);
          });
        }
      }
    });
  };

  const showTemplateHtmlDataForMultipleCheckList = (
    isJustCheckFieldData = false,
  ) => {
    arrReportTemplateForCheckList = store
      .getState()
      .form?.dispatchFormData?.formSamples?.map((data) => {
        const findFormSampleObj = formSampleData?.find(
          (obj) => obj?.formSample?.id == data?.sample?.formSampleId,
        );

        const templateHtmlText = defaultAllReportTemplate?.find(
          (obj) =>
            findFormSampleObj?.formSample?.reportTemplateName == obj?.name,
        )?.templateHtmlText;
        if (isEmpty(templateHtmlText)) {
          return {...data, templateHtmlText: ''};
        } else {
          return {...data, templateHtmlText};
        }
      });

    store.getState().form?.dispatchFormData?.formSamples?.map((data) => {
      const findTamplete = formSampleData?.find((obj) => {
        return obj?.formSample?.id === data?.sample?.formSampleId;
      });

      if (findTamplete?.formFields) {
        {
          findTamplete?.formFields?.map((item) => {
            formSectionHtmlData(item, isJustCheckFieldData, data?.sample);
          });
        }
      }
    });
  };

  function formSectionHtmlData(
    data,
    isJustCheckFieldData = false,
    formSample = {},
  ) {
    const duplicateDispatchdata = store?.getState()?.form?.dispatchFormData;
    if (
      !isEmpty(formSample) &&
      duplicateDispatchdata?.formSamples?.length > 0
    ) {
      data?.child?.map((item) => {
        showChildUIHtmlData(item, isJustCheckFieldData, formSample);
      });
    } else {
      if (!isEmpty(data?.formField?.showOnJson)) {
        const fieldData = store
          .getState()
          ?.form?.dispatchFormData.formFields?.find(
            (obj) => obj?.formFieldId === data?.formField?.showOnJson?.FieldId,
          );
        if (fieldData?.textValue !== data?.formField?.showOnJson?.FieldValue) {
          return;
        }
      }

      data?.child?.map((item) => {
        showChildUIHtmlData(item, isJustCheckFieldData, formSample);
      });
    }
  }

  const replaceTableRowValue = (
    templateHtmlText = '',
    fieldData = [],
    data = {},
  ) => {
    try {
      let txtRowTable = `${templateHtmlText}`;
      fieldData?.map((subItem) => {
        if (subItem?.fieldType === 'CheckList') {
          txtRowTable = txtRowTable?.replace(
            `#${data?.formField?.name}@${subItem?.id}#`,
            `${
              isEmpty(subItem?.value)
                ? ''
                : JSON.parse(subItem?.value)
                    ?.map((item) => {
                      return item?.key === 'OtherWithText'
                        ? item?.txt
                          ? `
                      <img style="line-height:35px;
                      vertical-align:middle;" width="18px" height="18px" src="data:image/heic;base64, ${
                        item?.value ? chackboxChecked : chackboxUnChecked
                      }" /> ${item?.txt}`
                          : ''
                        : `
                      <img style="line-height:35px;
                      vertical-align:middle;" width="18px" height="18px" src="data:image/heic;base64, ${
                        item?.value ? chackboxChecked : chackboxUnChecked
                      }" /> ${item?.key}`;
                    })
                    .join('')
            }`,
          );
        } else {
          txtRowTable = txtRowTable?.replace(
            `#${data?.formField?.name}@${subItem?.id}#`,
            subItem?.value === '' ? '-' : subItem?.value,
          );
        }
      });

      return txtRowTable;
    } catch (error) {
      // console.log('finalizeTableHtml=====> ', error);
    }
  };

  const getGroupTableObject = (arr = []) => {
    if (arr?.length > 0) {
      const grouped = {};
      arr.forEach((group, index) => {
        const key = group.reduce((prev, curr) => {
          if (curr.remarks === 'group') {
            prev[curr.id] = {
              id: curr.id,
              value: curr.value,
              fieldType: curr.fieldType,
            };
          }
          return prev;
        }, {});

        const childData = group.reduce((prev, curr) => {
          if (curr.remarks !== 'group') {
            prev.push({
              [curr.id]: {
                id: curr.id,
                value: curr.value,
                fieldType: curr.fieldType,
              },
            });
          }
          return prev;
        }, []);

        const existingGroup = grouped[JSON.stringify(key)];
        if (existingGroup) {
          existingGroup.childData = [
            ...existingGroup.childData,
            ...[childData],
          ];
        } else {
          grouped[JSON.stringify(key)] = {
            ...key,
            childData: [childData],
          };
        }
      });

      const result = Object.values(grouped);
      const parsedData = [];

      result.forEach((item) => {
        const values = [];
        const childData = [];

        Object.keys(item).forEach((key) => {
          if (key !== 'childData') {
            const {id, value, fieldType} = item[key];
            values.push({id, value, fieldType});
          } else {
            item.childData.forEach((childArray) => {
              const childValues = [];
              childArray.forEach((childItem) => {
                const {id, value, fieldType} =
                  childItem[Object.keys(childItem)[0]];
                childValues.push({value, fieldType, id});
              });
              childData.push(childValues);
            });
          }
        });

        parsedData.push({values, childData});
      });
      return parsedData;
    } else {
      return [];
    }
  };

  function isJsonString(str) {
    try {
      JSON.parse(str);
    } catch (e) {
      return false;
    }
    return true;
  }

  const finalizeTableHtml = (
    templateHtmlText = '',
    fieldData = {},
    data = {},
  ) => {
    try {
      if (data?.formField?.remarks === 'group') {
        const arrTables = getGroupTableObject(
          isJsonString(fieldData?.textValue)
            ? JSON.parse(fieldData?.textValue)
            : '',
        );

        let arrTableParts = templateHtmlText?.split(
          `<tr #${data?.formField?.name}${'Start'}>`,
        );

        const tblPart1 = arrTableParts?.[0];

        const tblSubPart = arrTableParts[1]?.split(
          `</tr #${data?.formField?.name}${'End'}>`,
        );

        const tblPart2 = tblSubPart?.[0];

        const tblPart3 = tblSubPart?.[1];

        let finalArray = [];

        for (let index = 0; index < arrTables.length; index++) {
          const indexItem = arrTables[index];
          let tblSubPart = '';
          tblSubPart = `<tr>` + tblPart2 + `</tr>`;
          tblSubPart = replaceTableRowValue(
            tblSubPart,
            indexItem?.values ?? [],
            data,
          );

          let tableDesignData = '';

          let arrTablePartsForChild = tblSubPart?.split(
            `<tr #${data?.formField?.name}${'ChildStart'}>`,
          );
          let finalArrayforChild = [];

          for (let index = 0; index < arrTablePartsForChild.length; index++) {
            const secondPart = arrTablePartsForChild[index]?.split(
              `</tr #${data?.formField?.name}${'ChildEnd'}>`,
            );
            var tablePart = secondPart?.[0];
            if (tablePart) {
              if (!isEmpty(indexItem?.childData ?? []) && index !== 0) {
                tableDesignData = `${(indexItem?.childData ?? [])
                  ?.map((item) => {
                    let txtRowTable = `${tablePart}`;
                    item?.map((subItem) => {
                      if (subItem?.fieldType === 'CheckList') {
                        txtRowTable = txtRowTable?.replace(
                          `#${data?.formField?.name}@${subItem?.id}#`,
                          `${
                            isEmpty(subItem?.value)
                              ? ''
                              : JSON.parse(subItem?.value)
                                  ?.map((item) => {
                                    return item?.key === 'OtherWithText'
                                      ? item?.txt
                                        ? `
                      <img style="line-height:35px;
                      vertical-align:middle;" width="18px" height="18px" src="data:image/heic;base64, ${
                        item?.value ? chackboxChecked : chackboxUnChecked
                      }" /> ${item?.txt}`
                                        : ''
                                      : `
                      <img style="line-height:35px;
                      vertical-align:middle;" width="18px" height="18px" src="data:image/heic;base64, ${
                        item?.value ? chackboxChecked : chackboxUnChecked
                      }" /> ${item?.key}`;
                                  })
                                  .join('')
                          }`,
                        );
                      } else {
                        txtRowTable = txtRowTable?.replace(
                          `#${data?.formField?.name}@${subItem?.id}#`,
                          subItem?.value === '' ? '-' : subItem?.value,
                        );
                      }
                    });

                    return `<tr>` + txtRowTable + `</tr>`;
                  })
                  .join('')}`;

                finalArrayforChild = [
                  ...finalArrayforChild,
                  [tableDesignData, secondPart?.[1] || '']?.join(''),
                ];
              } else {
                finalArrayforChild = [
                  ...finalArrayforChild,
                  [
                    index === 0 ? secondPart?.[0] : '',
                    secondPart?.[1] || '',
                  ]?.join(''),
                ];
              }
            }
          }

          finalArray.push(finalArrayforChild?.join(''));
        }
        return `${tblPart1}${finalArray?.join('')}${tblPart3}`;
      } else {
        let tableDesignData = '';

        let arrTableParts = templateHtmlText?.split(
          `<tr #${data?.formField?.name}${'Start'}>`,
        );

        let finalArray = [];

        for (let index = 0; index < arrTableParts.length; index++) {
          const secondPart = arrTableParts[index]?.split(
            `</tr #${data?.formField?.name}${'End'}>`,
          );
          var tablePart = secondPart?.[0];
          if (tablePart) {
            if (!isEmpty(fieldData?.textValue) && index !== 0) {
              tableDesignData = `${JSON.parse(fieldData?.textValue)
                ?.map((item) => {
                  let txtRowTable = `${tablePart}`;
                  item?.map((subItem) => {
                    if (subItem?.fieldType === 'CheckList') {
                      txtRowTable = txtRowTable?.replace(
                        `#${data?.formField?.name}@${subItem?.id}#`,
                        `${
                          isEmpty(subItem?.value)
                            ? ''
                            : JSON.parse(subItem?.value)
                                ?.map((item) => {
                                  return item?.key === 'OtherWithText'
                                    ? item?.txt
                                      ? `
                        <img style="line-height:35px;
                        vertical-align:middle;" width="18px" height="18px" src="data:image/heic;base64, ${
                          item?.value ? chackboxChecked : chackboxUnChecked
                        }" /> ${item?.txt}`
                                      : ''
                                    : `
                        <img style="line-height:35px;
                        vertical-align:middle;" width="18px" height="18px" src="data:image/heic;base64, ${
                          item?.value ? chackboxChecked : chackboxUnChecked
                        }" /> ${item?.key}`;
                                })
                                .join('')
                        }`,
                      );
                    } else {
                      txtRowTable = txtRowTable?.replace(
                        `#${data?.formField?.name}@${subItem?.id}#`,
                        subItem?.value === '' ? '-' : subItem?.value,
                      );
                    }
                  });

                  return `<tr>` + txtRowTable + `</tr>`;
                })
                .join('')}`;
              finalArray = [
                ...finalArray,
                [tableDesignData, secondPart?.[1] || '']?.join(''),
              ];
            } else {
              finalArray = [
                ...finalArray,
                [
                  index === 0 ? secondPart?.[0] : '',
                  secondPart?.[1] || '',
                ]?.join(''),
              ];
            }
          }
        }

        return finalArray?.join('');
      }
    } catch (error) {
      console.log('finalizeTableHtml=====> ', error);
    }
  };

  const showChildUIHtmlData = (
    data,
    isJustCheckFieldData = false,
    formSample = {},
  ) => {
    const duplicateDispatchdata = store?.getState()?.form?.dispatchFormData;
    if (
      data?.formField?.fieldType === 'Grid' ||
      data?.formField?.fieldType === 'Section'
    ) {
      {
        data?.child?.map((item) => {
          showChildUIHtmlData(item, isJustCheckFieldData, formSample);
        });
      }
    } else if (data?.formField?.fieldType === 'Text') {
      if (
        !isEmpty(formSample) &&
        duplicateDispatchdata?.formSamples?.length > 0
      ) {
        const dispatchObj = duplicateDispatchdata?.formSamples?.find((obj) => {
          return formSample?.displayIndex === obj?.sample?.displayIndex;
        });
        const fieldData = dispatchObj?.formFields?.find(
          (obj) => obj?.formFieldId === data?.formField?.id,
        );

        if (arrReportTemplateForCheckList?.length > 0) {
          arrReportTemplateForCheckList = arrReportTemplateForCheckList?.map(
            (obj) => {
              if (formSample?.displayIndex === obj?.sample?.displayIndex) {
                return {
                  ...obj,
                  templateHtmlText: replaceAll(
                    obj?.templateHtmlText,
                    `#Field.${data?.formField?.name}#`,
                    fieldData?.textValue ?? '-',
                  ),
                };
              } else {
                return obj;
              }
            },
          );
        }
      } else {
        const fieldData = duplicateDispatchdata?.formFields?.find(
          (obj) => obj?.formFieldId === data?.formField?.id,
        );

        if (filteredAllReportTemplate?.length > 0) {
          filteredAllReportTemplate = filteredAllReportTemplate?.map((obj) => {
            return {
              ...obj,
              templateHtmlText: replaceAll(
                obj?.templateHtmlText,
                `#Field.${data?.formField?.name}#`,
                fieldData?.textValue ?? '-',
              ),
            };
          });
        }

        htmlData = htmlData?.replace(
          `#Field.${data?.formField?.name}#`,
          fieldData?.textValue ?? '-',
        );
        arrReportTemplateForCheckList = arrReportTemplateForCheckList?.map(
          (obj) => {
            return {
              ...obj,
              templateHtmlText: replaceAll(
                obj?.templateHtmlText,
                `#Field.${data?.formField?.name}#`,
                fieldData?.textValue ?? '-',
              ),
            };
          },
        );
      }
    } else if (
      data?.formField?.fieldType === 'Time' ||
      data?.formField?.fieldType === 'Date'
    ) {
      let isDate = data?.formField?.fieldType === 'Date';
      if (
        !isEmpty(formSample) &&
        duplicateDispatchdata?.formSamples?.length > 0
      ) {
        const dispatchObj = duplicateDispatchdata?.formSamples?.find((obj) => {
          return formSample?.displayIndex === obj?.sample?.displayIndex;
        });
        const fieldData = dispatchObj?.formFields?.find(
          (obj) => obj?.formFieldId === data?.formField?.id,
        );


        if (data?.formField?.name == startTime) {
          startTimeValue = fieldData?.textValue;
        } else if (data?.formField?.name == endTime) {
          endTimeValue = fieldData?.textValue;
        }

        if (arrReportTemplateForCheckList?.length > 0) {
          arrReportTemplateForCheckList = arrReportTemplateForCheckList?.map(
            (obj) => {
              if (formSample?.displayIndex === obj?.sample?.displayIndex) {
                return {
                  ...obj,
                  templateHtmlText: replaceAll(
                    obj?.templateHtmlText,
                    `#Field.${data?.formField?.name}#`,
                    fieldData?.textValue
                      ? isDate
                        ? moment(
                            fieldData?.textValue,
                            'DD-MM-YYYY h:mm a',
                          ).format('MM/DD/YYYY')
                        : moment(
                            fieldData?.textValue,
                            'DD-MM-YYYY h:mm a',
                          ).format('h:mm a')
                      : '-',
                  ),
                };
              } else {
                return obj;
              }
            },
          );
        }
      } else {
        const fieldData = duplicateDispatchdata?.formFields?.find(
          (obj) => obj?.formFieldId === data?.formField?.id,
        );
        console.log('fieldData======>111 ', fieldData, data);
        if (data?.formField?.name == startTime) {
          startTimeValue = fieldData?.textValue;
        } else if (data?.formField?.name == endTime) {
          endTimeValue = fieldData?.textValue;
        }

        if (filteredAllReportTemplate?.length > 0) {
          filteredAllReportTemplate = filteredAllReportTemplate?.map((obj) => {
            
            return {
              ...obj,
              templateHtmlText: replaceAll(
                obj?.templateHtmlText,
                `#Field.${data?.formField?.name}#`,
                fieldData?.textValue
                  ? isDate
                    ? moment(fieldData?.textValue, 'DD-MM-YYYY h:mm a').format(
                        'MM/DD/YYYY',
                      )
                    : moment(fieldData?.textValue, 'DD-MM-YYYY h:mm a').format(
                        'h:mm a',
                      )
                  : '-',
              ),
            };
          });
        }

        htmlData = replaceAll(
          htmlData,
          `#Field.${data?.formField?.name}#`,
          fieldData?.textValue
            ? isDate
              ? moment(fieldData?.textValue, 'DD-MM-YYYY h:mm a').format(
                  'MM/DD/YYYY',
                )
              : moment(fieldData?.textValue, 'DD-MM-YYYY h:mm a').format(
                  'h:mm a',
                )
            : '-',
        );
        if (isJustCheckFieldData) {
          arrFormBuffers = [...arrFormBuffers]?.map((obj) => {
            return {
              ...obj,
              templateHtmlText: replaceAll(
                obj?.templateHtmlText || '',
                `#Field.${data?.formField?.name}#`,
                fieldData?.textValue
                  ? isDate
                    ? moment(fieldData?.textValue, 'DD-MM-YYYY h:mm a').format(
                        'MM/DD/YYYY',
                      )
                    : moment(fieldData?.textValue, 'DD-MM-YYYY h:mm a').format(
                        'h:mm a',
                      )
                  : '-',
              ),
            };
          });
        }
      }
    } else if (isJustCheckFieldData === true) {
    } else if (data?.formField?.fieldType === 'TextArea') {
      if (
        !isEmpty(formSample) &&
        duplicateDispatchdata?.formSamples?.length > 0
      ) {
        const dispatchObj = duplicateDispatchdata?.formSamples?.find((obj) => {
          return formSample?.displayIndex === obj?.sample?.displayIndex;
        });
        const fieldData = dispatchObj?.formFields?.find(
          (obj) => obj?.formFieldId === data?.formField?.id,
        );

        if (arrReportTemplateForCheckList?.length > 0) {
          arrReportTemplateForCheckList = arrReportTemplateForCheckList?.map(
            (obj) => {
              if (formSample?.displayIndex === obj?.sample?.displayIndex) {
                return {
                  ...obj,
                  templateHtmlText: replaceAll(
                    obj?.templateHtmlText,
                    `#Field.${data?.formField?.name}#`,
                    replaceAll(fieldData?.textValue ?? '-', '\n', '<br>'),
                  ),
                };
              } else {
                return obj;
              }
            },
          );
        }
      } else {
        const fieldData = duplicateDispatchdata?.formFields?.find(
          (obj) => obj?.formFieldId === data?.formField?.id,
        );

        let txtExtraSummaryText = '';

        if (data?.formField?.name === 'Summary') {
          let arrSummary =
            store.getState().form.arrSummary?.txtValue?.lines ?? [];

          let lineLimit =
            store.getState().form.arrSummary?.styleJson?.lineLimit ?? 10;

          for (let index = 0; index < arrSummary.length; index++) {
            const element = arrSummary[index];
            if (index < lineLimit) {
              txtExtraSummaryText = txtExtraSummaryText + element?.text;
            }
          }
        }

        if (filteredAllReportTemplate?.length > 0) {
          filteredAllReportTemplate = filteredAllReportTemplate?.map((obj) => {
            return {
              ...obj,
              templateHtmlText: replaceAll(
                obj?.templateHtmlText,
                `#Field.${data?.formField?.name}#`,
                replaceAll(
                  data?.formField?.name === 'Summary'
                    ? txtExtraSummaryText ?? '-'
                    : fieldData?.textValue ?? '-',
                  '\n',
                  '<br>',
                ),
              ),
            };
          });
        }

        htmlData = replaceAll(
          htmlData,
          `#Field.${data?.formField?.name}#`,
          replaceAll(
            data?.formField?.name === 'Summary'
              ? txtExtraSummaryText ?? '-'
              : fieldData?.textValue ?? '-',
            '\n',
            '<br>',
          ),
        );
      }
    } else if (data?.formField?.fieldType === 'Switch') {
      if (
        !isEmpty(formSample) &&
        duplicateDispatchdata?.formSamples?.length > 0
      ) {
        const dispatchObj = duplicateDispatchdata?.formSamples?.find((obj) => {
          return formSample?.displayIndex === obj?.sample?.displayIndex;
        });

        const fieldData = dispatchObj?.formFields?.find(
          (obj) => obj?.formFieldId === data?.formField?.id,
        );
        if (arrReportTemplateForCheckList?.length > 0) {
          arrReportTemplateForCheckList = arrReportTemplateForCheckList?.map(
            (obj) => {
              if (formSample?.displayIndex === obj?.sample?.displayIndex) {
                return {
                  ...obj,
                  templateHtmlText: replaceAll(
                    obj?.templateHtmlText,
                    `#Radio.${data?.formField?.name}#`,
                    `<span>${JSON.parse(data?.formField?.options)
                      ?.map((item) => {
                        return `
                    <img style="line-height:35px;
                    vertical-align:middle;" width="25px" height="25px" src="data:image/heic;base64, ${
                      item === fieldData?.textValue
                        ? radio_Checked
                        : radio_UnChecked
                    }" /> ${item}`;
                      })
                      .join('')}</span>`,
                  ),
                };
              } else {
                return obj;
              }
            },
          );
        }
      } else {
        const fieldData = duplicateDispatchdata?.formFields?.find(
          (obj) => obj?.formFieldId === data?.formField?.id,
        );
        if (filteredAllReportTemplate?.length > 0) {
          filteredAllReportTemplate = filteredAllReportTemplate?.map((obj) => {
            return {
              ...obj,
              templateHtmlText: replaceAll(
                obj?.templateHtmlText,
                `#Radio.${data?.formField?.name}#`,
                `<span>${JSON.parse(data?.formField?.options)
                  ?.map((item) => {
                    return `
                    <img style="line-height:35px;
                    vertical-align:middle;" width="25px" height="25px" src="data:image/heic;base64, ${
                      item === fieldData?.textValue
                        ? radio_Checked
                        : radio_UnChecked
                    }" /> ${item}`;
                  })
                  .join('')}</span>`,
              ),
            };
          });
        }

        htmlData = replaceAll(
          htmlData,
          `#Radio.${data?.formField?.name}#`,
          `<span>${JSON.parse(data?.formField?.options)
            ?.map((item) => {
              return `
              <img style="line-height:35px;
              vertical-align:middle;" width="25px" height="25px" src="data:image/heic;base64, ${
                item === fieldData?.textValue ? radio_Checked : radio_UnChecked
              }" /> ${item}`;
            })
            .join('')}</span>`,
        );
      }
    } else if (data?.formField?.fieldType === 'CheckList') {
      if (
        !isEmpty(formSample) &&
        duplicateDispatchdata?.formSamples?.length > 0
      ) {
        const dispatchObj = duplicateDispatchdata?.formSamples?.find((obj) => {
          return formSample?.displayIndex === obj?.sample?.displayIndex;
        });

        const fieldData = dispatchObj?.formFields?.find(
          (obj) => obj?.formFieldId === data?.formField?.id,
        );
        if (fieldData) {
          if (arrReportTemplateForCheckList?.length > 0) {
            arrReportTemplateForCheckList = arrReportTemplateForCheckList?.map(
              (obj) => {
                if (formSample?.displayIndex === obj?.sample?.displayIndex) {
                  return {
                    ...obj,
                    templateHtmlText: replaceAll(
                      obj?.templateHtmlText,
                      `#CheckList.${data?.formField?.name}#`,
                      `<span>   ${JSON.parse(fieldData?.textValue)
                        ?.map((item) => {
                          return item?.key === 'OtherWithText'
                            ? item?.txt
                              ? `
                    <img style="line-height:35px;
                    vertical-align:middle;" width="18px" height="18px" src="data:image/heic;base64, ${
                      item?.value ? chackboxChecked : chackboxUnChecked
                    }" /> ${item?.txt}`
                              : ''
                            : `
                    <img style="line-height:35px;
                    vertical-align:middle;" width="18px" height="18px" src="data:image/heic;base64, ${
                      item?.value ? chackboxChecked : chackboxUnChecked
                    }" /> ${item?.key}`;
                        })
                        .join('')}</span>`,
                    ),
                  };
                } else {
                  return obj;
                }
              },
            );
          }
        } else {
          if (arrReportTemplateForCheckList?.length > 0) {
            arrReportTemplateForCheckList = arrReportTemplateForCheckList?.map(
              (obj) => {
                return {
                  ...obj,
                  templateHtmlText: replaceAll(
                    obj?.templateHtmlText,
                    `#CheckList.${data?.formField?.name}#`,
                    '-',
                  ),
                };
              },
            );
          }
        }
      } else {
        const fieldData = store
          ?.getState()
          ?.form?.dispatchFormData?.formFields?.find(
            (obj) => obj?.formFieldId === data?.formField?.id,
          );
        if (fieldData) {
          if (filteredAllReportTemplate?.length > 0) {
            filteredAllReportTemplate = filteredAllReportTemplate?.map(
              (obj) => {
                return {
                  ...obj,
                  templateHtmlText: replaceAll(
                    obj?.templateHtmlText,
                    `#CheckList.${data?.formField?.name}#`,
                    `<span>   ${JSON.parse(fieldData?.textValue)
                      ?.map((item) => {
                        return item?.key === 'OtherWithText'
                          ? item?.txt
                            ? `
                    <img style="line-height:35px;
                    vertical-align:middle;" width="18px" height="18px" src="data:image/heic;base64, ${
                      item?.value ? chackboxChecked : chackboxUnChecked
                    }" /> ${item?.txt}`
                            : ''
                          : `
                    <img style="line-height:35px;
                    vertical-align:middle;" width="18px" height="18px" src="data:image/heic;base64, ${
                      item?.value ? chackboxChecked : chackboxUnChecked
                    }" /> ${item?.key}`;
                      })
                      .join('')}</span>`,
                  ),
                };
              },
            );
          }

          htmlData = replaceAll(
            htmlData,
            `#CheckList.${data?.formField?.name}#`,
            `<span>   ${JSON.parse(fieldData?.textValue)
              ?.map((item) => {
                return item?.key === 'OtherWithText'
                  ? item?.txt
                    ? `
              <img style="line-height:35px;
              vertical-align:middle;" width="18px" height="18px" src="data:image/heic;base64, ${
                item?.value ? chackboxChecked : chackboxUnChecked
              }" /> ${item?.txt}`
                    : ''
                  : `
              <img style="line-height:35px;
              vertical-align:middle;" width="18px" height="18px" src="data:image/heic;base64, ${
                item?.value ? chackboxChecked : chackboxUnChecked
              }" /> ${item?.key}`;
              })
              .join('')}</span>`,
          );
        } else {
          if (filteredAllReportTemplate?.length > 0) {
            filteredAllReportTemplate = filteredAllReportTemplate?.map(
              (obj) => {
                return {
                  ...obj,
                  templateHtmlText: replaceAll(
                    obj?.templateHtmlText,
                    `#CheckList.${data?.formField?.name}#`,
                    '-',
                  ),
                };
              },
            );
          }

          htmlData = replaceAll(
            htmlData,
            `#CheckList.${data?.formField?.name}#`,
            '-',
          );
        }
      }
    } else if (data?.formField?.fieldType === 'Table') {
      if (
        !isEmpty(formSample) &&
        duplicateDispatchdata?.formSamples?.length > 0
      ) {
        const dispatchObj = duplicateDispatchdata?.formSamples?.find((obj) => {
          return formSample?.displayIndex === obj?.sample?.displayIndex;
        });
        const fieldData = dispatchObj?.formFields?.find(
          (obj) => obj?.formFieldId === data?.formField?.id,
        );

        if (arrReportTemplateForCheckList?.length > 0) {
          arrReportTemplateForCheckList = arrReportTemplateForCheckList?.map(
            (obj) => {
              if (formSample?.displayIndex === obj?.sample?.displayIndex) {
                return {
                  ...obj,
                  templateHtmlText: finalizeTableHtml(
                    obj?.templateHtmlText,
                    fieldData,
                    data,
                  ),
                };
              } else {
                return obj;
              }
            },
          );
        }
      } else {
        const fieldData = duplicateDispatchdata?.formFields?.find(
          (obj) => obj?.formFieldId === data?.formField?.id,
        );

        if (filteredAllReportTemplate?.length > 0) {
          filteredAllReportTemplate = filteredAllReportTemplate?.map((obj) => {
            return {
              ...obj,
              templateHtmlText: finalizeTableHtml(
                obj?.templateHtmlText,
                fieldData,
                data,
              ),
            };
          });
        }

        htmlData = finalizeTableHtml(htmlData, fieldData, data);
      }

      // }
    } else if (data?.formField?.fieldType === 'AddPhotoList') {
      if (
        !isEmpty(formSample) &&
        duplicateDispatchdata?.formSamples?.length > 0
      ) {
        const dispatchObj = duplicateDispatchdata?.formSamples?.find((obj) => {
          return formSample?.displayIndex === obj?.sample?.displayIndex;
        });

        const arrFieldData = dispatchObj?.formFiles?.filter(
          (obj) => obj?.formFieldId === data?.formField?.id,
        );

        arrFieldData?.map((item, index) => {
          if (arrReportTemplateForCheckList?.length > 0) {
            arrReportTemplateForCheckList = arrReportTemplateForCheckList?.map(
              (obj) => {
                if (formSample?.displayIndex === obj?.sample?.displayIndex) {
                  return {
                    ...obj,
                    templateHtmlText: replaceAll(
                      obj?.templateHtmlText,
                      `#${data?.formField?.name}@Img${index + 1}#`,
                      `data:image/jpeg;base64, ${
                        isEmpty(item?.fileDataBase64)
                          ? whiteScreenBase64
                          : item?.fileDataBase64
                      }`,
                    ),
                  };
                } else {
                  return obj;
                }
              },
            );
          }

          if (arrReportTemplateForCheckList?.length > 0) {
            arrReportTemplateForCheckList = arrReportTemplateForCheckList?.map(
              (obj) => {
                if (formSample?.displayIndex === obj?.sample?.displayIndex) {
                  return {
                    ...obj,
                    templateHtmlText: replaceAll(
                      obj?.templateHtmlText,
                      `#${data?.formField?.name}@Remarks${index + 1}#`,
                      `${item?.remarks ?? ''}`,
                    ),
                  };
                } else {
                  return obj;
                }
              },
            );
          }
        });
      } else {
        const arrFieldData = duplicateDispatchdata?.formFiles?.filter(
          (obj) => obj?.formFieldId === data?.formField?.id,
        );

        if (!isEmpty(arrFieldData)) {
          arrFieldData?.map((item, index) => {
            if (filteredAllReportTemplate?.length > 0) {
              filteredAllReportTemplate = filteredAllReportTemplate?.map(
                (obj) => {
                  return {
                    ...obj,
                    templateHtmlText: replaceAll(
                      obj?.templateHtmlText,
                      `#${data?.formField?.name}@Img${index + 1}#`,
                      `data:image/jpeg;base64, ${
                        isEmpty(item?.fileDataBase64)
                          ? whiteScreenBase64
                          : item?.fileDataBase64
                      }`,
                    ),
                  };
                },
              );
            }

            htmlData = replaceAll(
              htmlData,
              `#${data?.formField?.name}@Img${index + 1}#`,
              `data:image/jpeg;base64, ${
                isEmpty(item?.fileDataBase64)
                  ? whiteScreenBase64
                  : item?.fileDataBase64
              }`,
            );

            if (filteredAllReportTemplate?.length > 0) {
              filteredAllReportTemplate = filteredAllReportTemplate?.map(
                (obj) => {
                  return {
                    ...obj,
                    templateHtmlText: replaceAll(
                      obj?.templateHtmlText,
                      `#${data?.formField?.name}@Remarks${index + 1}#`,
                      `${item?.remarks}`,
                    ),
                  };
                },
              );
            }

            htmlData = replaceAll(
              htmlData,
              `#${data?.formField?.name}@Remarks${index + 1}#`,
              `${item?.remarks}`,
            );
          });
        }
      }
    } else if (data?.formField?.fieldType === 'Sign') {
      if (
        !isEmpty(formSample) &&
        duplicateDispatchdata?.formSamples?.length > 0
      ) {
        const dispatchObj = duplicateDispatchdata?.formSamples?.find((obj) => {
          return formSample?.displayIndex === obj?.sample?.displayIndex;
        });

        const fieldData = dispatchObj?.formFiles?.find(
          (obj) => obj?.formFieldId === data?.formField?.id,
        );

        if (!fieldData?.fileDataBase64) {
          if (arrReportTemplateForCheckList?.length > 0) {
            arrReportTemplateForCheckList = arrReportTemplateForCheckList?.map(
              (obj) => {
                if (formSample?.displayIndex === obj?.sample?.displayIndex) {
                  return {
                    ...obj,
                    templateHtmlText: replaceAll(
                      obj?.templateHtmlText,
                      `id="div.Sign.${data?.formField?.name}"`,
                      `style="display:none;"`,
                    ),
                  };
                } else {
                  return obj;
                }
              },
            );
          }
        }
        if (arrReportTemplateForCheckList?.length > 0) {
          arrReportTemplateForCheckList = arrReportTemplateForCheckList?.map(
            (obj) => {
              if (formSample?.displayIndex === obj?.sample?.displayIndex) {
                return {
                  ...obj,
                  templateHtmlText: replaceAll(
                    obj?.templateHtmlText,
                    `#Sign.${data?.formField?.name}#`,
                    `data:image/png;base64, ${fieldData?.fileDataBase64}`,
                  ),
                };
              } else {
                return obj;
              }
            },
          );
        }
      } else {
        const fieldData = duplicateDispatchdata?.formFiles?.find(
          (obj) => obj?.formFieldId === data?.formField?.id,
        );

        if (!fieldData?.fileDataBase64) {
          if (filteredAllReportTemplate?.length > 0) {
            filteredAllReportTemplate = filteredAllReportTemplate?.map(
              (obj) => {
                return {
                  ...obj,
                  templateHtmlText: replaceAll(
                    obj?.templateHtmlText,
                    `id="div.Sign.${data?.formField?.name}"`,
                    `style="display:none;"`,
                  ),
                };
              },
            );
          }

          htmlData = replaceAll(
            htmlData,
            `id="div.Sign.${data?.formField?.name}"`,
            `style="display:none;"`,
          );
          arrReportTemplateForCheckList = arrReportTemplateForCheckList?.map(
            (obj) => {
              return {
                ...obj,
                templateHtmlText: replaceAll(
                  obj?.templateHtmlText,
                  `id="div.Sign.${data?.formField?.name}"`,
                  `style="display:none;"`,
                ),
              };
            },
          );
        }
        if (filteredAllReportTemplate?.length > 0) {
          filteredAllReportTemplate = filteredAllReportTemplate?.map((obj) => {
            return {
              ...obj,
              templateHtmlText: replaceAll(
                obj?.templateHtmlText,
                `#Sign.${data?.formField?.name}#`,
                `data:image/png;base64, ${fieldData?.fileDataBase64}`,
              ),
            };
          });
        }

        htmlData = replaceAll(
          htmlData,
          `#Sign.${data?.formField?.name}#`,
          `data:image/png;base64, ${fieldData?.fileDataBase64}`,
        );

        arrReportTemplateForCheckList = arrReportTemplateForCheckList?.map(
          (obj) => {
            return {
              ...obj,
              templateHtmlText: replaceAll(
                obj?.templateHtmlText,
                `#Sign.${data?.formField?.name}#`,
                `data:image/png;base64, ${fieldData?.fileDataBase64}`,
              ),
            };
          },
        );
      }
    } else if (data?.formField?.fieldType === 'Dropdown') {
      if (
        !isEmpty(formSample) &&
        duplicateDispatchdata?.formSamples?.length > 0
      ) {
        const dispatchObj = duplicateDispatchdata?.formSamples?.find((obj) => {
          return formSample?.displayIndex === obj?.sample?.displayIndex;
        });

        const fieldData = dispatchObj?.formFields?.find(
          (obj) => obj?.formFieldId === data?.formField?.id,
        );
        if (data?.formField?.name == lunchTime) {
          lunchTimeValue = fieldData?.textValue;
        } else if (data?.formField?.name== ST) {
          STValue = fieldData?.textValue;
        } else if (data?.formField?.name == OT) {
          OTValue = fieldData?.textValue;
        } else if (data?.formField?.name == DT) {
          DTValue = fieldData?.textValue;
        } else if (data?.formField?.name == NS) {
          NSValue = fieldData?.textValue;
        } else if (data?.formField?.name == NSOT) {
          NSOTValue = fieldData?.textValue;
        } else if (data?.formField?.name == NSDT) {
          NSDTValue = fieldData?.textValue;
        }

        if (arrReportTemplateForCheckList?.length > 0) {
          arrReportTemplateForCheckList = arrReportTemplateForCheckList?.map(
            (obj) => {
              if (formSample?.displayIndex === obj?.sample?.displayIndex) {
                return {
                  ...obj,
                  templateHtmlText: replaceAll(
                    obj?.templateHtmlText,
                    `#Field.${data?.formField?.name}#`,
                    fieldData?.textValue ?? '-',
                  ),
                };
              } else {
                return obj;
              }
            },
          );
        }
      } else {
        const fieldData = duplicateDispatchdata?.formFields?.find(
          (obj) => obj?.formFieldId === data?.formField?.id,
        );
        console.log('fieldData======>2222 ', fieldData);

        if (data?.formField?.name == lunchTime) {
          lunchTimeValue = fieldData?.textValue;
        } else if (data?.formField?.name== ST) {
          STValue = fieldData?.textValue;
        } else if (data?.formField?.name == OT) {
          OTValue = fieldData?.textValue;
        } else if (data?.formField?.name == DT) {
          DTValue = fieldData?.textValue;
        } else if (data?.formField?.name == NS) {
          NSValue = fieldData?.textValue;
        } else if (data?.formField?.name == NSOT) {
          NSOTValue = fieldData?.textValue;
        } else if (data?.formField?.name == NSDT) {
          NSDTValue = fieldData?.textValue;
        }
        // formFieldId
        if (filteredAllReportTemplate?.length > 0) {
          filteredAllReportTemplate = filteredAllReportTemplate?.map((obj) => {
            return {
              ...obj,
              templateHtmlText: replaceAll(
                obj?.templateHtmlText,
                `#Field.${data?.formField?.name}#`,
                fieldData?.textValue ?? '-',
              ),
            };
          });
        }

        htmlData = replaceAll(
          htmlData,
          `#Field.${data?.formField?.name}#`,
          fieldData?.textValue ?? '-',
        );
      }
    } else if (data?.formField?.fieldType === 'Number') {
      if (
        !isEmpty(formSample) &&
        duplicateDispatchdata?.formSamples?.length > 0
      ) {
        const dispatchObj = duplicateDispatchdata?.formSamples?.find((obj) => {
          return formSample?.displayIndex === obj?.sample?.displayIndex;
        });

        const fieldData = dispatchObj?.formFields?.find(
          (obj) => obj?.formFieldId === data?.formField?.id,
        );

        if (arrReportTemplateForCheckList?.length > 0) {
          arrReportTemplateForCheckList = arrReportTemplateForCheckList?.map(
            (obj) => {
              if (formSample?.displayIndex === obj?.sample?.displayIndex) {
                return {
                  ...obj,
                  templateHtmlText: replaceAll(
                    obj?.templateHtmlText,
                    `#Field.${data?.formField?.name}#`,
                    fieldData?.textValue ?? '-',
                  ),
                };
              } else {
                return obj;
              }
            },
          );
        }
      } else {
        const fieldData = duplicateDispatchdata?.formFields?.find(
          (obj) => obj?.formFieldId === data?.formField?.id,
        );

        if (filteredAllReportTemplate?.length > 0) {
          filteredAllReportTemplate = filteredAllReportTemplate?.map((obj) => {
            return {
              ...obj,
              templateHtmlText: replaceAll(
                obj?.templateHtmlText,
                `#Field.${data?.formField?.name}#`,
                fieldData?.textValue ?? '-',
              ),
            };
          });
        }

        htmlData = replaceAll(
          htmlData,
          `#Field.${data?.formField?.name}#`,
          fieldData?.textValue ?? '-',
        );
        arrReportTemplateForCheckList = arrReportTemplateForCheckList?.map(
          (obj) => {
            return {
              ...obj,
              templateHtmlText: replaceAll(
                obj?.templateHtmlText,
                `#Field.${data?.formField?.name}#`,
                fieldData?.textValue ?? '-',
              ),
            };
          },
        );
      }
    } else if (data?.formField?.fieldType === 'AddPhoto') {
      if (
        !isEmpty(formSample) &&
        duplicateDispatchdata?.formSamples?.length > 0
      ) {
        const dispatchObj = duplicateDispatchdata?.formSamples?.find((obj) => {
          return formSample?.displayIndex === obj?.sample?.displayIndex;
        });

        let getFormFieldPhoto = [...dispatchObj?.formFiles]?.filter((obj) => {
          return obj?.formFieldId === data?.formField?.id;
        });
        if (getFormFieldPhoto?.length > 0) {
          getFormFieldPhoto = getFormFieldPhoto.reduce(function (r, a) {
            r[a.photoSectionId] = r[a.photoSectionId] || [];
            r[a.photoSectionId].push(a);
            return r;
          }, Object.create(null));
          if (!isEmpty(getFormFieldPhoto)) {
            getFormFieldPhoto = Object.values(getFormFieldPhoto);
          }
        }

        if (arrReportTemplateForCheckList?.length > 0) {
          arrReportTemplateForCheckList = [
            ...arrReportTemplateForCheckList,
          ]?.map((obj) => {
            if (formSample?.displayIndex === obj?.sample?.displayIndex) {
              let templatePhoto = setOtherReportTemplate(
                allReportTemplate,
                getFormFieldPhoto,
                data?.formField,
              );
              return {
                ...obj,
                templatePhoto: `${obj?.templatePhoto ?? ''}${templatePhoto}`,
              };
            } else {
              return obj;
            }
          });
        }
      } else {
        let getFormFieldPhoto = [...duplicateDispatchdata?.formFiles]?.filter(
          (obj) => {
            return obj?.formFieldId === data?.formField?.id;
          },
        );
        if (getFormFieldPhoto?.length > 0) {
          getFormFieldPhoto = getFormFieldPhoto.reduce(function (r, a) {
            r[a.photoSectionId] = r[a.photoSectionId] || [];
            r[a.photoSectionId].push(a);
            return r;
          }, Object.create(null));
          if (!isEmpty(getFormFieldPhoto)) {
            getFormFieldPhoto = Object.values(getFormFieldPhoto);
          }
        }

        if (filteredAllReportTemplate?.length > 0) {
          filteredAllReportTemplate = [...filteredAllReportTemplate]?.map(
            (obj) => {
              if (data?.formField?.remarks === obj?.name) {
                let templatePhoto = setOtherReportTemplate(
                  allReportTemplate,
                  getFormFieldPhoto,
                  data?.formField,
                );
                return {
                  ...obj,
                  templatePhoto: `${obj?.templatePhoto ?? ''}${templatePhoto}`,
                };
              } else {
                return obj;
              }
            },
          );
        }

        if (data?.formField?.templatePageName === 'AddPhoto') {
          addPhotoHtmlData = setOtherReportTemplate(
            allReportTemplate,
            getFormFieldPhoto,
            data?.formField,
          );
        }
      }
    }
  };

  useEffect(() => {
    window.arrShowOnJson = [];
    getDispatchFormDataAPI();
    setFinalFormTemplateData(
      formTemplate?.filter(
        (obj) => obj?.form?.id === route?.params?.item?.FormId,
      ),
    );
    setCopyPriorFormFieldData();
  }, []);

  const setCopyPriorFormFieldData = async () => {
    try {
      const res = await getCopyPriorFormFieldData(
        route?.params?.item?.Id,
        userDetails?.id,
      );
      dispatch(setCopyPriorFormFieldDataToStore(res?.data));
    } catch (error) {
      console.log('setCopyPriorFormFieldData error: ', error);
    }
  };

  function replaceAll(str, find, replace) {
    var escapedFind = find?.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, '\\$1');
    if (!isEmpty(str)) {
      return str?.replace(new RegExp(escapedFind, 'g'), replace);
    }
    return '';
  }
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const groupArray = (arr, groupSize) => {
    const grouped = [];
    for (let i = 0; i < arr.length; i += groupSize) {
      grouped.push(arr.slice(i, i + groupSize));
    }
    return grouped;
  };

  const onPressPreview = async (
    data = '',
    isCheckValidation = true,
    isShowBottomBar = true,
  ) => {
    try {
      if (isCheckValidation) {
        store.dispatch(setIsLoadingReview(true));
        dispatch(setFormValidation(true));
        await sleep(500);
        if (window.isValicationSuccessfully === false) {
          window.isValicationSuccessfully = true;
          showMessage({
            message: '',
            description: 'Please fill the required fields!',
            type: 'danger',
          });
          return;
        }
      } else {
        store.dispatch(setIsLoadingPreview(true));
        await sleep(500);
      }
      if (isCheckValidation === true) {
        insertOrUpdateForm(true);
      }

      htmlData = data;

      const woItem = route?.params?.item;

      showTemplateHtmlDataForMultipleCheckList();
      showTemplateHtmlData();

      arrFormBuffers = [];
      let arrSummary = store.getState().form.arrSummary?.txtValue?.lines ?? [];

      let lineLimit =
        store.getState().form.arrSummary?.styleJson?.lineLimit ?? 10;
      if (arrSummary?.length > lineLimit) {
        const arrSummaryLineIgnoreLineLimit = [...arrSummary]; // Create a copy of the array to avoid mutating state directly
        arrSummaryLineIgnoreLineLimit.splice(0, lineLimit);

        const arrGroupedSummaryLine = groupArray(
          arrSummaryLineIgnoreLineLimit,
          45,
        );

        for (let index = 0; index < arrGroupedSummaryLine.length; index++) {
          const objSummaryLine = arrGroupedSummaryLine[index];
          let txtExtraSummaryText = '';

          for (let index = 0; index < objSummaryLine.length; index++) {
            const element = objSummaryLine[index];
            // if (index > lineLimit - 1) {
            txtExtraSummaryText = txtExtraSummaryText + element?.text;
            // }
          }

          const additionalSummaryPage = filteredAllReportTemplate?.find(
            (item) => item?.name === 'AdditionalSummaryPage',
          );
          let htmlReportTemplate = `${additionalSummaryPage?.templateHtmlText}${
            additionalSummaryPage?.templatePhoto ?? ''
          }`;
          Object.entries(woItem).map(([key, value]) => {
            htmlReportTemplate = replaceAll(
              htmlReportTemplate,
              `#WO.${key}#`,
              value,
            );
          });

          htmlReportTemplate = replaceAll(
            htmlReportTemplate,
            `{{LogoBase64}}`,
            `${finalFormTemplateData?.[0]?.form?.logoBase64}`,
          );

          htmlReportTemplate = replaceAll(
            htmlReportTemplate,
            `#AdditionalNotes#`,
            `${replaceAll(txtExtraSummaryText ?? '-', '\n', '<br>')}`,
          );

          htmlData = htmlData + htmlReportTemplate;
        }
      }

      htmlData = htmlData + addPhotoHtmlData;

      if (
        filteredAllReportTemplate?.length > 0 &&
        window.arrShowOnJson?.length > 0
      ) {
        for (let index = 0; index < filteredAllReportTemplate.length; index++) {
          const element = filteredAllReportTemplate[index];
          if (window.arrShowOnJson.includes(element?.name)) {
            let htmlReportTemplate = `${element?.templateHtmlText}${
              element?.templatePhoto ?? ''
            }`;
            Object.entries(woItem).map(([key, value]) => {
              htmlReportTemplate = replaceAll(
                htmlReportTemplate,
                `#WO.${key}#`,
                value,
              );
            });

            htmlReportTemplate = replaceAll(
              htmlReportTemplate,
              `{{LogoBase64}}`,
              `${finalFormTemplateData?.[0]?.form?.logoBase64}`,
            );

            arrFormBuffers.push({
              ...element,
              templateHtmlText: htmlReportTemplate,
            });
          }
        }
      }

      if (arrReportTemplateForCheckList?.length > 0) {
        for (
          let index = 0;
          index < arrReportTemplateForCheckList.length;
          index++
        ) {
          const element = arrReportTemplateForCheckList[index];
          let htmlReportTemplate = `${element?.templateHtmlText}${
            element?.templatePhoto ?? ''
          }`;
          Object.entries(woItem).map(([key, value]) => {
            htmlReportTemplate = replaceAll(
              htmlReportTemplate,
              `#WO.${key}#`,
              value,
            );
          });

          htmlReportTemplate = replaceAll(
            htmlReportTemplate,
            `{{LogoBase64}}`,
            `${finalFormTemplateData?.[0]?.form?.logoBase64}`,
          );
          const findTamplete = formSampleData?.find((obj) => {
            return obj?.formSample?.id === element?.sample?.formSampleId;
          });

          arrFormBuffers.push({
            name: `${
              findTamplete?.formSample?.reportTemplateName ||
              element?.sample?.id
            }`,
            templateHtmlText: htmlReportTemplate,
          });
        }
      }

      Object.entries(woItem).map(([key, value]) => {
        htmlData = replaceAll(htmlData, `#WO.${key}#`, value);
      });

      htmlData = replaceAll(
        htmlData,
        `{{LogoBase64}}`,
        `${finalFormTemplateData?.[0]?.form?.logoBase64}`,
      );
      showTemplateHtmlData(true);

      console.log(
        '{startTimeValue, endTimeValue, lunchTimeValue, STValue, OTValue, DTValue, NSValue, NSOTValue, NSDTValue} ',
        {
          startTimeValue,
          endTimeValue,
          lunchTimeValue,
          STValue,
          OTValue,
          DTValue,
          NSValue,
          NSOTValue,
          NSDTValue,
        },
      );
      navigation.navigate('viewer', {
        isFromMasterForm: true,
        isShowBottomBar,
        type: 'pdf',
        uri: htmlData,
        isBase64: true,
        item: route?.params?.item,
        folderName: finalFormTemplateData?.[0]?.form?.title ?? '',
        arrFormBuffers,
        formDetails:{
          startTimeValue,
          endTimeValue,
          lunchTimeValue,
          STValue,
          OTValue,
          DTValue,
          NSValue,
          NSOTValue,
          NSDTValue,
        }
      });
      filteredAllReportTemplate = [];
      mapAllReportTemplete(allReportTemplate);
      htmlData = '';
      htmlOtherSectionReportData = '';
    } catch (error) {
    } finally {
      store.dispatch(setIsLoadingPreview(false));
      store.dispatch(setIsLoadingReview(false));

      // setIsLoadingPreview(false);
    }

    // }
  };

  const onPressGoBack = () => {
    navigation.goBack();
  };

  const PreviewButton = () => {
    const isLoadingPreview = useSelector(
      (state) => state.form?.isLoadingPreview ?? false,
    );

    return (
      <TouchableOpacity
        onPress={() => {
          onPressPreview(
            finalFormTemplateData?.[0]?.form?.reportHtmlText,
            false,
            false,
          );
        }}
        style={{
          height: 50,
          justifyContent: 'center',
          alignItems: 'center',
          width: 140,
          marginRight: 20,
          borderRadius: 10,
          backgroundColor: WHITE,
        }}>
        {isLoadingPreview === true ? (
          <ActivityIndicator color={BLACK} />
        ) : (
          <TxtPoppinMedium
            style={{
              fontSize: RFValue(12),
            }}
            title="Preview"
          />
        )}
      </TouchableOpacity>
    );
  };

  const ReviewButton = () => {
    const isLoadingReview = useSelector(
      (state) => state.form?.isLoadingReview ?? false,
    );

    return (
      <TouchableOpacity
        onPress={() => {
          onPressPreview(finalFormTemplateData?.[0]?.form?.reportHtmlText);
        }}
        style={{
          height: 50,
          justifyContent: 'center',
          alignItems: 'center',
          width: 140,
          marginRight: 20,
          borderRadius: 10,
          backgroundColor: WHITE,
        }}>
        {isLoadingReview === true ? (
          <ActivityIndicator color={BLACK} />
        ) : (
          <TxtPoppinMedium
            style={{
              fontSize: RFValue(12),
            }}
            title="Review"
          />
        )}
      </TouchableOpacity>
    );
  };

  const SaveAsDraftButton = () => {
    const isLoadingSaveAsDraft = useSelector(
      (state) => state.form?.isLoadingSaveAsDraft ?? false,
    );

    return (
      <TouchableOpacity
        onPress={() => insertOrUpdateForm(false)}
        style={{
          height: 50,
          justifyContent: 'center',
          alignItems: 'center',
          width: 140,
          marginRight: 20,
          borderRadius: 10,
          backgroundColor: WHITE,
        }}>
        {isLoadingSaveAsDraft === true ? (
          <ActivityIndicator color={BLACK} />
        ) : (
          <TxtPoppinMedium
            style={{
              fontSize: RFValue(12),
            }}
            title="Save"
          />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <TopBar
        onBack={onPressGoBack}
        woItem={{
          ...route?.params?.item,
          formName: finalFormTemplateData?.[0]?.form?.title,
        }}
        headerTextStyles={{width: '60%'}}
      />
      <SafeAreaView style={{flex: 1}}>
        <View style={{flex: 1}}>
          <View style={{flex: 1}}>
            <KeyboardAvoidingView
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              keyboardVerticalOffset={Platform.OS === 'ios' ? 120 : 0}>
              <ScrollView style={{width: '100%'}}>
                {/* <TouchableWithoutFeedback onPress={Keyboard.dismiss}> */}
                <View style={{flex: 1}}>
                  {finalFormTemplateData?.map((item, index) => {
                    return <ShowTemplate key={`__${index}`} data={item} />;
                  })}
                </View>
                {/* </TouchableWithoutFeedback> */}
              </ScrollView>
            </KeyboardAvoidingView>
          </View>
          <View
            style={{
              width: '95%',
              marginTop: 15,
              alignSelf: 'center',
            }}>
            <View
              style={{
                width: '100%',
                height: 70,
                borderRadius: 10,
                marginBottom: 10,
                justifyContent: 'flex-end',
                alignItems: 'center',
                flexDirection: 'row',
                backgroundColor: ORANGE,
              }}>
              <SaveAsDraftButton />
              <PreviewButton />
              <ReviewButton />
            </View>
          </View>
        </View>
        {isLoadingData ? (
          <View style={styles.loaderMainView}>
            <ActivityIndicator size={'large'} color={BLACK} />
          </View>
        ) : null}
      </SafeAreaView>
    </View>
  );
};

// PROJECT BILLABLE

export default MasterForm;

const styles = StyleSheet.create({
  container: {flex: 1},
  loaderMainView: {
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    position: 'absolute',
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  componentContainer: {width: '100%', paddingHorizontal: 10},
});
