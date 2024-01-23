import produce from "immer";

const SET_FORM_TEMPLATE = "SET_FORM_TEMPLATE";
const SET_COMMON_COLLECTION = "SET_COMMON_COLLECTION";
const SET_DISPATCH_FORM_DATA = "SET_DISPATCH_FORM_DATA";
const SET_PREVIEW_FLAG = "SET_PREVIEW_FLAG";
const RESET_PREVIEW_FLAG = "RESET_PREVIEW_FLAG";
const SET_IS_VALIDATE = "SET_IS_VALIDATE";
const SET_IS_LOADING_PREVIEW = "SET_IS_LOADING_PREVIEW";
const SET_IS_LOADING_REVIEW = "SET_IS_LOADING_REVIEW";
const SET_IS_LOADING_SAVE_AS_DRAFT = "SET_IS_LOADING_SAVE_AS_DRAFT";
const SET_FORM_SAMPLE_DATA = "SET_FORM_SAMPLE_DATA";
const SET_ALL_REPORT_TEMPLETE = "SET_ALL_REPORT_TEMPLETE";
const SET_FORM_SAMPLE_FILTERED_DATA = "SET_FORM_SAMPLE_FILTERED_DATA";
const SET_COPY_PRIOR_FORM_FIELD_DATA = "SET_COPY_PRIOR_FORM_FIELD_DATA";
const SET_SUMMARY = "SET_SUMMARY";
const SET_SUMMARY_LIST = "SET_SUMMARY_LIST";
const SET_PICKUP_DROP = "SET_PICKUP_DROP";
const SET_SYNCH_OFFFLINE_LOADER = "SET_SYNCH_OFFFLINE_LOADER";
const SET_FORM_EMPTY = "SET_FORM_EMPTY";
const SET_SELECTED_FORM_ITEM = "SET_SELECTED_FORM_ITEM";
const SET_JOB_INJURY_NOTIFY_TEXT = "SET_JOB_INJURY_NOTIFY_TEXT";

const initialState = {
  formTemplate: [],
  selectedFormItem: {},
  commonCollection: {},
  formSampleData: [],
  pickUpDropData: [],
  allReportTemplete: [],
  summaryList: [],
  formSampleFilteredData: [],
  formMultiPleCheckListTemplates: [],
  arrCopyPriorFormFieldData: [
    {
      FormFieldId: 8,
      TextValue:
        "Line hill switch gear;\n> Provided continues inspection for installation of 3/4” epoxy bolts for switchgear structure hold down, place (4) 3/4”x8” bolts with6” embedment using Hilti RE 590 (exp 1/23). Signed checklist for approved drawings. Reference P-014.\n\nFoothill/Grand;\n> Provided periodic observation of placement of rebar for soffit openings, end diaphragms and girder walls. Work in progress.",
    },
  ],
  dispatchFormData: {},
  onPreviewFlag: 0,
  isValidate: false,
  isLoadingPreview: false,
  isLoadingReview: false,
  isLoadingSaveAsDraft: false,
  arrSummary: {},
  isShowSyncOfflineLoader: false,
  jobInjuryNotifyText: "",
};

// reducer
export default (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case SET_SYNCH_OFFFLINE_LOADER:
        draft.isShowSyncOfflineLoader = action.payload;
        break;
      case SET_SELECTED_FORM_ITEM:
        draft.selectedFormItem = action.payload;
        break;
      case SET_SUMMARY:
        draft.arrSummary = action.payload;
        break;
      case SET_PICKUP_DROP:
        draft.pickUpDropData = action.payload;
        break;

      case SET_FORM_TEMPLATE:
        draft.formTemplate = action.payload;
        break;
      case SET_COMMON_COLLECTION:
        draft.commonCollection = action.payload;
        break;

      case SET_ALL_REPORT_TEMPLETE:
        draft.allReportTemplete = action.payload;
        break;

      case SET_DISPATCH_FORM_DATA:
        draft.dispatchFormData = action.payload;
        break;

      case SET_FORM_SAMPLE_DATA:
        draft.formSampleData = action.payload;
        break;

      case SET_FORM_SAMPLE_FILTERED_DATA:
        draft.formSampleFilteredData = action.payload;
        break;

      case SET_PREVIEW_FLAG:
        draft.onPreviewFlag = draft.onPreviewFlag + 1;
        break;

      case RESET_PREVIEW_FLAG:
        draft.onPreviewFlag = 0;
        break;
      case SET_IS_VALIDATE:
        draft.isValidate = action.payload;
        break;
      case SET_IS_LOADING_PREVIEW:
        draft.isLoadingPreview = action.payload;
        break;
      case SET_SUMMARY_LIST:
        draft.summaryList = action.payload;
        break;
      case SET_IS_LOADING_REVIEW:
        draft.isLoadingReview = action.payload;
        break;
      case SET_IS_LOADING_SAVE_AS_DRAFT:
        draft.isLoadingSaveAsDraft = action.payload;
        break;
      case SET_COPY_PRIOR_FORM_FIELD_DATA:
        draft.arrCopyPriorFormFieldData = action.payload;
        break;

      case SET_FORM_EMPTY:
        return initialState;
        break;
      case SET_JOB_INJURY_NOTIFY_TEXT:
        draft.jobInjuryNotifyText = action.payload;
        break;
    }
  });

export const setPickUpAndDropData = (value = []) => ({
  type: SET_PICKUP_DROP,
  payload: value,
});

export const setSyncOfflineLoader = (value = false) => ({
  type: SET_SYNCH_OFFFLINE_LOADER,
  payload: value,
});

export const setSelectedFormItem = (value = {}) => ({
  type: SET_SELECTED_FORM_ITEM,
  payload: value,
});

export const setSummary = (value = []) => ({
  type: SET_SUMMARY,
  payload: value,
});

export const setSummaryList = (value = []) => ({
  type: SET_SUMMARY_LIST,
  payload: value,
});

export const setIsLoadingPreview = (value = false) => ({
  type: SET_IS_LOADING_PREVIEW,
  payload: value,
});

export const setIsLoadingReview = (value = false) => ({
  type: SET_IS_LOADING_REVIEW,
  payload: value,
});

export const setIsLoadingSaveAsDraft = (value = false) => ({
  type: SET_IS_LOADING_SAVE_AS_DRAFT,
  payload: value,
});

export const setOnPreviewFlag = () => ({
  type: SET_PREVIEW_FLAG,
  payload: "",
});
export const setResetOnPreviewFlag = () => ({
  type: RESET_PREVIEW_FLAG,
  payload: "",
});

export const setFormTemplate = (value = []) => ({
  type: SET_FORM_TEMPLATE,
  payload: value,
});

export const setCommonCollection = (value = {}) => ({
  type: SET_COMMON_COLLECTION,
  payload: value,
});

export const setAllReportTemplate = (value = []) => ({
  type: SET_ALL_REPORT_TEMPLETE,
  payload: value,
});

export const setFormSampleData = (value = []) => ({
  type: SET_FORM_SAMPLE_DATA,
  payload: value,
});

export const setFormSampleFilteredData = (value = []) => ({
  type: SET_FORM_SAMPLE_FILTERED_DATA,
  payload: value,
});

export const setFormValidation = (value = false) => ({
  type: SET_IS_VALIDATE,
  payload: value,
});

export const setCopyPriorFormFieldDataToStore = (value) => ({
  type: SET_COPY_PRIOR_FORM_FIELD_DATA,
  payload: value,
});

export const setDispatchFormData = (value) => ({
  type: SET_DISPATCH_FORM_DATA,
  payload: value,
});

export const setFormEmpty = () => ({
  type: SET_FORM_EMPTY,
});

export const setJobInjuryNotifyText = (value) => ({
  type: SET_JOB_INJURY_NOTIFY_TEXT,
  payload: value,
});
