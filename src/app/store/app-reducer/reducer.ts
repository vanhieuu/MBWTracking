import {createAction, createSlice, PayloadAction} from '@reduxjs/toolkit';

import {IAppRedux, SLICE_NAME} from './type';
import {ThemeType} from '@theme';
import * as Actions from './type';

const initialAppState: IAppRedux = {
  error: undefined,
  theme: 'default',
  loadingApp: false,
  currentLocation: {},
  travelHistory: {},
  showModal: false,
  isProcessing: true,
  data: {},
  listDataCity: {
    city: [],
    district: [],
    ward: [],
  },
  userProfile: {},
  automaticLocation: false,
  enableBiometrics: false,
  isError: false,
  isSuccess:false
};

const appSlice = createSlice({
  name: SLICE_NAME.APP,
  initialState: initialAppState,
  reducers: {
    getErrorInfo: (state, {payload}: PayloadAction<any>) =>
      (state.error = payload),
    onSetAppTheme: (state, {payload}: PayloadAction<ThemeType>) => {
      void (state.theme = payload);
    },
    setShowModal: (state, {payload}: PayloadAction<boolean>) => {
      void (state.showModal = payload);
    },

    onLoadApp: state => {
      void (state.loadingApp = true);
    },
    onLoadAppEnd: state => {
      state.loadingApp = false;
    },
    onSetCurrentLocation: (state, action: PayloadAction<any>) => {
      state.currentLocation = action.payload;
    },
    setShowErrorModalStatus: (state, action: PayloadAction<any>) => {
      state.error = undefined;
      state.showModal = action.payload;
    },
    setProcessingStatus: (state, action: PayloadAction<any>) => {
      state.isProcessing = action.payload;
    },
    setError: (state, action: PayloadAction<any>) => {
      state.error = action.payload;
    },

    setDataCity: (state, action: PayloadAction<any>) => {
      state.listDataCity.city = action.payload;
    },
    setDataDistrict: (state, action: PayloadAction<any>) => {
      state.listDataCity.district = action.payload;
    },
    setDataWard: (state, action: PayloadAction<any>) => {
      state.listDataCity.ward = action.payload;
    },

    setUserProfile: (state, action: PayloadAction<any>) => {
      state.userProfile = action.payload;
    },
    resetDataApp: (state: any) => (state = undefined),
    setAutomaticLocation: (state, action: PayloadAction<any>) => {
      void (state.automaticLocation = action.payload);
    },
    setDataCustomer: (state, action: PayloadAction<any>) =>
      void (state.data.dataCustomer = action.payload),
    setTravelHistory: (state, action: PayloadAction<any>) =>
      void (state.travelHistory = action.payload),
    setBiometricsStatus: (state, action: PayloadAction<any>) =>
      void (state.enableBiometrics = action.payload),
    setErrorBoolean: (state, action: PayloadAction<any>) =>
      void (state.isError = action.payload),
    setSuccessBoolean: (state, action: PayloadAction<any>) =>
      void (state.isSuccess = action.payload),
  },
});

const getCustomerRouteAction = createAction(Actions.GET_LIST_CUSTOMER);

const postOrganization = createAction(
  Actions.POST_ORGANIZATION,
  (data: any) => ({payload: data}),
);

const getUserInfor = createAction(Actions.GET_USER_INFOR);
const getTravelHistoryAction = createAction(
  Actions.GET_TRAVEL_HISTORY,
  (from_time: any, to_time: any) => ({payload: {from_time, to_time}}),
);

const changePassword = createAction(Actions.CHANGE_PASSWORD, (data: any) => ({
  payload: data,
}));

export const appActions = {
  ...appSlice.actions,
  getCustomerRouteAction,
  postOrganization,
  getUserInfor,
  getTravelHistoryAction,
  changePassword
};

export const appReducer = appSlice.reducer;
export const {
  setError,
  // setMainContactAddress,

  onLoadApp,
  onLoadAppEnd,
  onSetAppTheme,
  setShowErrorModalStatus,
  setShowModal,
  // removeContactAddress,
  // removeAddress,
} = appSlice.actions;
