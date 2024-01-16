import {callApiDelete, callApiGet, callApiPost, callApiPut} from './baseApi';
import API from '../../constants/baseApi';

export const getDispatchFormData = (WOId = '', FormId = '') => {
  return callApiGet({url: API.DISPATCH_FORM_DATA + WOId + '/' + FormId});
};

export const getFormTemplate = (userId = '') =>
  callApiGet({url: API.FORM_TEMPLATE + '?UserId=' + userId});

export const getAllReportTemplate = () =>
  callApiGet({url: API.GET_ALL_REPORT_TEMPLATE});

export const getAllFormSampleData = () =>
  callApiGet({url: API.GET_ALL_FORM_SAMPLE});

export const getCompletedOrderPdfDetails = (dispatchId = '') =>
  callApiGet({
    url: API.GET_COMPLETED_ORDER_PDF_DETAILS + '?dispatchId=' + dispatchId,
  });

  export const getPickUpAndDropList = () =>
  callApiGet({
    url: API.PICKUP_CHECK_LIST,
  });

  

export const getCopyPriorFormFieldData = (dispatchId = '', userId = '') => {
  return callApiGet({
    url:
      API.GET_COPY_PRIOR_FORMFIELD_DATA +
      '?dispatchId=' +
      dispatchId +
      '&userId=' +
      userId,
  });
};


export const getCommonCollectionAPI = (userId = '') => {
  return callApiGet({
    url:
      `${API.GET_COMMON_COLLECTION}${userId}`,
  });
};

export const getMoreInfo = (Id = '') =>
  callApiGet({url: API.GET_USER_INFO + '?Id=' + Id});



export const insertOrUpdateFormAPI = (data = {}) =>
  callApiPost({url: API.CREATE_UPDATE_FORM_DATA, data});

export const updateDispatchStatusAPI = (data = {}) =>
  callApiPost({url: API.UPDATE_DISPATCH_STATUS, data});

export const submitPickUpDropRequest = (data = {}) =>
  callApiPost({url: API.PICKUP_DROP_REQUEST, data});

export const getWorkOrderDashboardAPI = (data = {}) =>
  callApiPost({url: API.GET_WORK_ORDER_DASHBOARD, data});

export const submitFormDataAPI = (data = {}) =>
  callApiPost({url: API.SUBMIT_FORM_DATA, data});

export const cancelFormDataAPI = (data = {}) =>
  callApiPost({url: API.CANCEL_FORM_DATA, data});

export const getFormSummaryTemplateByIdAPI = (id) =>
  callApiGet({url: API.GET_FORM_SUMMARY_TEMPLATE_BY_ID + `${id}`});

export const getFormSummaryTemplateByUserIdAPI = (id) =>
  callApiGet({url: API.GET_FORM_SUMMARY_TEMPLATE_BY_USER_ID + `${id}`});

export const createFormSummaryAPI = (data = {}) =>
  callApiPost({url: API.CREATE_FORM_SUMMARY_TEMPLATE, data});

export const updateFormSummaryAPI = (data = {}) =>
  callApiPut({url: API.UPDATE_FORM_SUMMARY_TEMPLATE, data});

export const deleteFormSummaryAPI = (id) =>
  callApiDelete({url: API.DELETE_FORM_SUMMARY_TEMPLATE + `${id}`});
