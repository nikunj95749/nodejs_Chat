// development
// const BASE_URL = 'http://66.175.236.154/FASTDevAPI/api';

// production
const BASE_URL = 'https://tqfonline.com/lab/api';



const API = {
  /** Auth **/
  SIGN_IN: BASE_URL + '/auths/login',
  APP_VERSION_INFO: BASE_URL + '/appVersionInfo/create?userId=',

  /** Dashboard **/
  GET_WORK_ORDER_DASHBOARD: BASE_URL + '/DispatchForm/getWODashboardByFilter',

  GET_ALL_DOCUMENT_LIST: BASE_URL + '/document/getAll',
  DOWNLOAD_DOCUMENT: BASE_URL + '/document/downloadDocById',

  GET_WORK_ORDERS: BASE_URL + '/DispatchForm/getWOListByFilter',

  /** Time sheets **/
  CREATE_UPDATE_TIMESHEET: BASE_URL + '/employeeTimesheet/createUpdate',
  GET_TIME_SHEET_LIST: BASE_URL + '/employeeTimesheet/getByFilter',
  DELETE_TIME_SHEET: BASE_URL + '/employeeTimesheet/delete',
  FORM_TEMPLATE: BASE_URL + '/formTemplate/getAllFilterByUserId/',
  DISPATCH_FORM_DATA: BASE_URL + '/DispatchForm/getById/',

  /**  **/
  PICKUP_CHECK_LIST: BASE_URL + '/lookups/getListByType?type=PickupChecklist',


// GET	Form Summary	Get by id Form Summary Details	/api/FormSummaryTemp/getById/{Id}
// GET	Form Summary	Get by UserId Form Summary Details	/api/FormSummaryTemp/getByFilter/{userId}
// POST	Form Summary	New Form Summry Create	/api/FormSummaryTemp/create
// POST	Form Summary	New Form Summry Update	/api/FormSummaryTemp/update
// POST	Form Summary	Delete Form Summary Details by Id	/api/FormSummaryTemp/delete/{Id}


  /** Form Summary **/

  GET_FORM_SUMMARY_TEMPLATE_BY_ID: BASE_URL + '/FormSummaryTemplate/getById/',
  GET_FORM_SUMMARY_TEMPLATE_BY_USER_ID: BASE_URL + '/FormSummaryTemplate/getByFilter/',
  CREATE_FORM_SUMMARY_TEMPLATE: BASE_URL + '/FormSummaryTemplate/create',
  UPDATE_FORM_SUMMARY_TEMPLATE: BASE_URL + '/FormSummaryTemplate/update',
  DELETE_FORM_SUMMARY_TEMPLATE: BASE_URL + '/FormSummaryTemplate/delete/',



  GET_ALL_REPORT_TEMPLATE: BASE_URL + '/formTemplate/getAllReportTemplate',
  // GET_ALL_REPORT_TEMPLATE: BASE_URL + '/formTemplate/getAllFilterByUserId',

  GET_ALL_FORM_SAMPLE: BASE_URL + '/formTemplate/getAllFormSamples',

  CREATE_UPDATE_FORM_DATA: BASE_URL + '/DispatchForm/createUpdate',

  SUBMIT_FORM_DATA: BASE_URL + '/DispatchForm/submitDispatchForm',
  CANCEL_FORM_DATA: BASE_URL + '/DispatchForm/cancelDispatchForm',

  GET_COMPLETED_ORDER_PDF_DETAILS: BASE_URL + '/DispatchForm/getDispatchFormPdf',

  GET_COMPLETED_ORDER_PDF_DETAILS: BASE_URL + '/DispatchForm/getDispatchFormPdf',

  UPDATE_DISPATCH_STATUS: BASE_URL + '/DispatchForm/updateDispatchStatus',
  GET_COPY_PRIOR_FORMFIELD_DATA: BASE_URL + '/DispatchForm/getCopyPriorFormFieldData',
  GET_COMMON_COLLECTION: BASE_URL + '/DispatchForm/getCommonCollection?userId=',

  GET_APP_VERSION: BASE_URL + '/lookups/getAppVersionInfo',

  /** report filter **/
  SEARCH_REPORT_FILTER: BASE_URL + '/DispatchForm/getWOReportListByFilter',

  PICKUP_DROP_REQUEST:BASE_URL + '/DispatchForm/appPickupRequest',

  GET_USER_INFO : BASE_URL + '/DispatchForm/getDispatchMoreInfo',


  NOTIFY_DISPATCH_JOB_INJURY : BASE_URL + '/DispatchForm/notifyDispatchJobInjury',
  WO_JOB_INJURY_NOTIFY_TEXT : BASE_URL + '/lookups/getListByType?type=WOJobInjuryNotifyText',

};

export default API;
