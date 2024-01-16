import {isEmpty} from 'lodash';

function replaceAll(str, find, replace) {
  var escapedFind = find.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, '\\$1');
  
  if (!isEmpty(str) ) {
    return str.replace(new RegExp(escapedFind, 'g'), replace); 
  }
  return '';
}

export const setOtherReportTemplate = (
  allReportTempData,
  formFieldPhotos,
  formField,
) => {
  const pageHeader = allReportTempData?.find(
    (item) => item?.name === 'PageHeader',
  );
  const pageFooter = allReportTempData?.find(
    (item) => item?.name === 'PageFooter',
  );

  let addPhoto = {}
  const addPhoto1 = allReportTempData?.find(
    (item) => item?.name === `${formField?.templatePageName}1`,
  );
  const addPhoto2 = allReportTempData?.find(
    (item) => item?.name === `${formField?.templatePageName}2`,
  );
  const addPhoto4 = allReportTempData?.find(
    (item) => item?.name === `${formField?.templatePageName}4`,
  );

  const addPhoto6 = allReportTempData?.find(
    (item) => item?.name === `${formField?.templatePageName}6`,
  );
  
    addPhoto = allReportTempData?.find(
      (item) => item?.name === `${formField?.templatePageName}`,
    );

  let htmlAllReportData = '';
  if (formFieldPhotos.length > 0) {
    const reversenFormFieldPhotos = formFieldPhotos?.sort((obj1,obj2) => {
      return obj1?.[0]?.displayIndex - obj2?.[0]?.displayIndex;
     });
     
    for (let index = 0; index < reversenFormFieldPhotos.length; index++) {
      const element = reversenFormFieldPhotos[index];

      let htmlFinal = '';

      if ( element?.length === 1) {
        htmlFinal = addPhoto1?.templateHtmlText;
      } else if (element?.length === 2) {
        htmlFinal = addPhoto2?.templateHtmlText;
      } else if (element?.length === 4) {
        htmlFinal = addPhoto4?.templateHtmlText;
      } else if (element?.length === 6) {
        htmlFinal = addPhoto6?.templateHtmlText;
      }else{
        htmlFinal = addPhoto?.templateHtmlText;
      }
      
      for (let index = 0; index < element.length; index++) {
        const element2 = element[index];
        htmlFinal = replaceAll(
          htmlFinal,
          `#AddPhoto@Img${index + 1}#`,
          `data:image/png;base64,${element2?.fileDataBase64}`,
        );
        htmlFinal = replaceAll(
          htmlFinal,
          `#AddPhoto@Remarks${index + 1}#`,
          `${element2?.remarks}`,
        );
        htmlFinal = replaceAll(
          htmlFinal,
          `{{PageHeader}}`,
          pageHeader?.templateHtmlText,
        );
        htmlFinal = replaceAll(
          htmlFinal,
          `{{PageFooter}}`,
          pageFooter?.templateHtmlText,
        );
      }
      htmlAllReportData = `${htmlAllReportData}\n${htmlFinal}`;
    }
  }

  return htmlAllReportData;
};
