import {PayloadAction, createAction, createSlice} from '@reduxjs/toolkit';
import {ILoginState, LOGIN_ACTION} from './type';
import {SLICE_NAME} from '@store/app-reducer/type';
import {ILogin} from '@common';

const initialLoginState: ILoginState = {
  loginResponse: {},
  organization: {},
  isSavePassword: false,
  password: '',
};
const loginSlice = createSlice({
  name: SLICE_NAME.LOGIN,
  initialState: initialLoginState,
  reducers: {
    setResponseLogin: (state, action: PayloadAction<any>) =>
      void (state.loginResponse = action.payload),
    setResponseOrganization: (state, action: PayloadAction<any>) =>
      void (state.organization = action.payload),
    setSavePassword: (state, action: PayloadAction<any>) =>
     void (state.isSavePassword = action.payload),
    setPassword: (state, action: PayloadAction<any>) =>
      void(state.password = action.payload),
  },
});

const postLogin = createAction(LOGIN_ACTION.LOGIN, (data: ILogin) => ({
  payload: data,
}));
const postOrganization = createAction(
  LOGIN_ACTION.POST_ORGANIZATION,
  (data: any) => ({payload: data}),
);

export const loginActions = {
  ...loginSlice.actions,
  postLogin,
  postOrganization,
};
export const loginReducer = loginSlice.reducer;
export const {setResponseLogin, setResponseOrganization} = loginActions;
