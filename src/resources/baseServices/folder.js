import { callApiGet, callApiPost } from './baseApi';
import API from '../../constants/baseApi';

// export const signUp = (data = {}) => callApiPost({ url: API.SIGN_UP, data });
export const getAllDocuments = () => callApiGet({ url: API.GET_ALL_DOCUMENT_LIST});
export const downloadDocuments = (id) => callApiGet({ url: API.DOWNLOAD_DOCUMENT + '?id=' + id });
