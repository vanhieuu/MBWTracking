
export const BASE_URL = 'http://hr.mbwcloud.com:8007';
export const API_EK_KEY = 'LnJqtY8kpTY4ZxAtiT5frqPZUNxkDZBXPRSyCi7P';
export const API_REVERSE_KEY ='wtpM0U1ZmE2s87LEZNSHf63Osc1a2sboaozCQNsy'
export const BASE_URL_MAP =
  'https://api.ekgis.vn/v2/tracking/locationHistory/';
export const API_URL = 'http://hr.mbwcloud.com:8007/api/method/';
export const EK_REVERSE_URL = 'https://api.ekgis.vn/v2/geocode/reverse?'

import { setError } from '@store/app-reducer/reducer';
import {ApiResponse, create} from 'apisauce';
import axios, { CreateAxiosDefaults } from 'axios';
import { dispatch, getState } from '../common/redux';
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
  const login = getState('login')
  if (organization) {
    const organizationObj = JSON.parse(organization);
    Api.setBaseURL(organizationObj.erpnext_url);
  }
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
