import API from "../../constants/baseApi";
import { callApiPost } from "./baseApi";


export const searchReportFilter = (data = {}) =>
  callApiPost({url: API.SEARCH_REPORT_FILTER, data});