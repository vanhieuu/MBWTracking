import {MapResponse} from '@common';
import {ThemeType} from '@theme';

export interface ListCity {
  ma_tinh: string;
  ten_tinh: string;
}

export interface ListDistrict {
  ma_huyen: string;
  ten_huyen: string;
  ma_tinh_thanh: string;
}
export interface ListWard {
  ma_xa: string;
  ten_xa: string;
  ma_quan_huyen: string;
}

export interface IAppRedux {
  error?: {
    title: string;
    message: string;
    viewOnly?: boolean;
    status?: number;
  };
  showModal: boolean;
  theme: ThemeType;
  loadingApp?: boolean;
  isProcessing?: boolean;
  travelHistory?: MapResponse | any;
  currentLocation?: any;
  data: any;
  userProfile: any;
  automaticLocation: boolean;
  enableBiometrics: boolean;
  isError?: boolean;
  isSuccess?:boolean
}

export enum SLICE_NAME {
  SET_ERROR = 'SET_ERROR_',
  SET_PROCESSING_STATUS = 'SET_PROCESSING_STATUS_',
  SET_FAILURE = 'SET_FAILURE_',
  APP = 'APP_',
  LOGIN = 'LOGIN_',
  GET_LIST_CITY = 'GET_LIST_CITY_',
  GET_LIST_DISTRICT = 'GET_LIST_DISTRICT_',
  GET_LIST_WARD = 'GET_LIST_WARD_',
  GET_LIST_CUSTOMER = 'GET_LIST_CUSTOMER_',
  POST_ORGANIZATION = 'POST_ORGANIZATION_',
  GET_USER_INFOR = 'GET_USER_INFOR_',
  GET_TRAVEL_HISTORY = 'GET_TRAVEL_HISTORY_',
  CHANGE_PASSWORD = 'CHANGE_PASSWORD_',
}

// export const RESET_APP = 'RESET_APP_RESET_APP';
// export const SET_SHOW_ERROR_MODAL = 'SET_SHOW_ERROR_MODAL_SET_SHOW_ERROR';
// export const SET_SEARCH_VISIT_VALUE =
//   'SET_SEARCH_VISIT_VALUE_SET_SEARCH_VISIT_VALUE';
// export const SET_APP_THEME = 'SET_APP_THEME_SET_APP_THEME';
// export const SET_MAIN_ADDRESS = 'SET_MAIN_ADDRESS_SET_MAIN_ADDRESS';
// export const SET_MAIN_CONTACT_ADDRESS =
//   'SET_MAIN_CONTACT_ADDRESS_SET_MAIN_CONTACT_ADDRESS';
// export const SET_NEW_CUSTOMER = 'SET_NEW_CUSTOMER_SET_NEW_CUSTOMER';
// export const SET_SHOW_MODAL = 'SET_SHOW_MODAL_SET_SHOW_MODAL';
// export const REMOVE_CONTACT_ADDRESS =
//   'REMOVE_CONTACT_ADDRESS_REMOVE_CONTACT_ADDRESS';
// export const REMOVE_ADDRESS = 'REMOVE_ADDRESS_REMOVE_ADDRESS';
// export const SET_SEARCH_CUSTOMER_VALUE =
//   'SET_SEARCH_CUSTOMER_VALUE_SET_SEARCH_CUSTOMER_VALUE';
export const GET_LIST_CUSTOMER =
  SLICE_NAME.GET_LIST_CUSTOMER + 'GET_LIST_CUSTOMER';
export const POST_ORGANIZATION =
  SLICE_NAME.POST_ORGANIZATION + 'POST_ORGANIZATION';
export const GET_USER_INFOR = SLICE_NAME.GET_USER_INFOR + 'GET_USER_INFOR_';
export const GET_TRAVEL_HISTORY =
  SLICE_NAME.GET_TRAVEL_HISTORY + 'GET_TRAVEL_HISTORY';
export const CHANGE_PASSWORD = SLICE_NAME.CHANGE_PASSWORD + 'CHANGE_PASSWORD';
