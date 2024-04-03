// import {ApiResponse, create} from 'apisauce';

// import axios, {
//   AxiosError,
//   AxiosInstance,
//   AxiosRequestConfig,
//   AxiosResponse,
//   CreateAxiosDefaults,
//   InternalAxiosRequestConfig,
// } from 'axios';

// import {setError} from '@store/app-reducer/reducer';
// import {dispatch} from '../common/redux';
// import {HEADER_DEFAULT, TIMEOUT} from './api.const';
// import {Api_key, Api_secret, Organization} from './app.const';
// import {AppModule} from '../common/native-module';
// import {storage} from '../common/native-module/app-module';
export const BASE_URL = 'http://hr.mbwcloud.com:8007';
export const API_EK_KEY = 'LnJqtY8kpTY4ZxAtiT5frqPZUNxkDZBXPRSyCi7P';
export const BASE_URL_MAP =
  'https://api.ekgis.vn/v2/tracking/locationHistory/position/';
// # api_key=LnJqtY8kpTY4ZxAtiT5frqPZUNxkDZBXPRSyCi7P
export const API_URL = 'http://hr.mbwcloud.com:8007/api/method/';

// const DEFAULT_CONFIG: CreateAxiosDefaults = {
//   baseURL: BASE_URL,
//   headers: {...HEADER_DEFAULT},
//   timeout: TIMEOUT,
// };

// const customAxiosInstance = axios.create(DEFAULT_CONFIG);
// // let Api = create({axiosInstance: customAxiosInstance, baseURL: BASE_URL});

// /**
//  * Middleware to handle failed request
//  */
// const handleErrorResponse = (
//   response: AxiosError | any,
// ): Promise<AxiosError> => {
//   if (response.status) {
//     const isSuccessRequest = /^2\d{2}/g.test(response.status?.toString());
//     if (isSuccessRequest && response.data?.result) {
//     } else if (
//       // throwErrorIfFailed ||
//       response.data?.message ||
//       response.data?.exception ||
//       response.data?._error_message
//     ) {
//       dispatch(
//         setError({
//           title:
//             response.data?.title ||
//             response.data?.exc_type ||
//             response.data?._error_message,
//           message:
//             response.data?.message ||
//             response.data?.exception ||
//             response.data?._server_messages,
//           viewOnly: true,
//           status: response.status,
//         }),
//       );
//     }
//   } else {
//     dispatch(
//       setError({
//         title: 'Không có kết nối đến máy chủ',
//         message: null,
//         viewOnly: true,
//       }),
//     );
//   }
//   return Promise.reject(response);
// };

// const onRequest = (
//   config: InternalAxiosRequestConfig,
//   deletedHeader?: boolean,
// ): InternalAxiosRequestConfig => {
//   config!.baseURL = BASE_URL;
//   config!.timeout = TIMEOUT;
//   config!.headers = {...HEADER_DEFAULT} as any;

//   const api_key = storage.getString(Api_key);
//   const api_secret = storage.getString(Api_secret);
//   const header =
//     api_key && api_secret ? AppModule.Auth_header(api_key, api_secret) : null;
//   let organization = AppModule.storage.getString(Organization);
//   if (organization) {
//     const organizationObj = JSON.parse(organization);
//     config.baseURL = organizationObj.erpnext_url;
//   } else {
//     config.baseURL = BASE_URL;
//   }
//   /* Logging the config object. */
//   // console.log(config)

//   if (header) {
//     config!.headers.set({...header});
//   }
//   if (deletedHeader) {
//     // config.headers.delete('Authorization');
//   }
//   return config;
// };

// const onRequestError = (error: AxiosError): Promise<AxiosError> => {
//   console.error(`[request error] [${error}]`);
//   return Promise.reject(error);
// };
// const createInstance = (deleteHeader?: boolean) => {
//   const api_key = storage.getString(Api_key);
//   const api_secret = storage.getString(Api_secret);
//   const header =
//     api_key && api_secret ? AppModule.Auth_header(api_key, api_secret) : null;
//   let organization = AppModule.storage.getString(Organization);
//   if (organization) {
//     const organizationObj = JSON.parse(organization);
//     customAxiosInstance.defaults.baseURL = organizationObj.erpnext_url;
//   } else {
//     customAxiosInstance.defaults.baseURL = BASE_URL;
//   }
//   if (deleteHeader) {
//     customAxiosInstance.defaults.headers.delete;
//   } else if (header) {
//     customAxiosInstance.defaults.headers['common'] = {...header};
//   }
//   return customAxiosInstance;
// };

// const onResponse = (response: AxiosResponse): AxiosResponse => {
//   console.info(`[response]: `, response);
//   return response;
// };

// export function setupInterceptorsTo(
//   axiosInstance: AxiosInstance,
//   deletedHeader?: boolean,
// ): AxiosInstance {
//   axiosInstance.interceptors.request.use((value) => onRequest(value,deletedHeader), onRequestError);
//   axiosInstance.interceptors.response.use(onResponse, handleErrorResponse);
//   return axiosInstance;
// }

// // const addResponseTransform (response => {
// //   handleErrorResponse(response, true);
// // });
// export const createApi = (deleteHeader?: boolean) =>
//   setupInterceptorsTo(axios, deleteHeader);


// import { BASE_URL } from '@env';
import { setError } from '@store/app-reducer/reducer';
import {ApiResponse, create} from 'apisauce';
import axios, { CreateAxiosDefaults } from 'axios';
import { dispatch } from '../common/redux';
import { HEADER_DEFAULT, TIMEOUT } from './api.const';
import { AppModule } from '@common';
import { Api_key, Api_secret, Organization } from './app.const';


const DEFAULT_CONFIG: CreateAxiosDefaults = {
  baseURL: BASE_URL,
  headers: {...HEADER_DEFAULT},
  timeout: TIMEOUT,
};

const customAxiosInstance = axios.create(DEFAULT_CONFIG);
let Api = create({axiosInstance: customAxiosInstance, baseURL: BASE_URL});

/**
 * Middleware to handle failed request
 */
const handleErrorResponse = (
  response: ApiResponse<any>,
  throwErrorIfFailed: any,
) => {
  if (response.status) {
    const isSuccessRequest = /^2\d{2}/g.test(response.status?.toString());
    if (isSuccessRequest && response.data?.result) {
      return;
    } else if (
      throwErrorIfFailed ||
      response.data?.message ||
      response.data?.exception ||
      response.data?._error_message
    ) {
      dispatch(
        setError({
          title:
            response.data?.title ||
            response.data?.exc_type ||
            response.data?._error_message,
          message:
            response.data?.message ||
            response.data?.exception ||
            response.data?._server_messages,
          viewOnly: true,
          status: response.status,
        }),
      );
      // dispatch(setProcessingStatus(false));
    }
  } else {
    dispatch(
      setError({
        title: 'Không có kết nối đến máy chủ',
        message: null,
        viewOnly: true,
      }),
    );
  }
};

const createInstance = (deleteHeader?: boolean) => {
  const api_key = AppModule.storage.getString(Api_key);
  const api_secret = AppModule.storage.getString(Api_secret);
  const header =
    api_key && api_secret ? AppModule.Auth_header(api_key, api_secret) : null;
  let organization = AppModule.storage.getString(Organization);
  // if (organization) {
  //   const organizationObj = JSON.parse(organization);
  //   Api.setBaseURL(organizationObj.erpnext_url);
  // }
  if (deleteHeader) {
    Api.deleteHeader('Authorization');
  } else if (header) {
    Api.setHeaders({...header});
  }
  return Api;
};

Api.addResponseTransform(response => {
  handleErrorResponse(response, true);
});
export const createApi = (deleteHeader?: boolean) =>
  createInstance(deleteHeader);
