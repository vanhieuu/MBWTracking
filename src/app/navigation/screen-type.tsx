import { NavigatorScreenParams } from "@react-navigation/native";

export enum APP_SCREENS {
  MAIN_SCREEN = 'MAIN_SCREEN',
  LOGIN = 'LOGIN',
  FORGET_PASSWORD = 'FORGET_PASSWORD',
  TRAVEL_HISTORY = 'TRAVEL_HISTORY',
  PROFILE = 'PROFILE',
  CHANGE_PASSWORD = 'CHANGE_PASSWORD',
  ACCOUNT_SETTINGS = 'ACCOUNT_SETTINGS',
  NOTIFICATION_SETTINGS = 'NOTIFICATION_SETTINGS',
  UN_AUTHORIZED = 'UN_AUTHORIZED',
  AUTHORIZED = 'AUTHORIZED',
  VERIFY_ORGANIZATION = 'VERIFY_ORGANIZATION',
  SETTING = 'SETTING',
  REQUEST_PERMISSIONS = 'REQUEST_PERMISSIONS',
}

export type UnAuthenParamList = {
  [APP_SCREENS.LOGIN]: {
    organizationName?: any,
    
  };
  [APP_SCREENS.FORGET_PASSWORD]: undefined;
  [APP_SCREENS.VERIFY_ORGANIZATION]:undefined;
  [APP_SCREENS.REQUEST_PERMISSIONS]:{
    data:any
  }
};
export type AuthenParamList = {
  [APP_SCREENS.MAIN_SCREEN]: undefined;
  [APP_SCREENS.ACCOUNT_SETTINGS]: undefined;
  [APP_SCREENS.NOTIFICATION_SETTINGS]: undefined;
  [APP_SCREENS.CHANGE_PASSWORD]: undefined;
  [APP_SCREENS.PROFILE]: undefined;
  [APP_SCREENS.TRAVEL_HISTORY]: undefined;
  [APP_SCREENS.SETTING]:undefined;
  [APP_SCREENS.CHANGE_PASSWORD]:undefined
};

export type RootStackParamsList = {
  [APP_SCREENS.UN_AUTHORIZED]: NavigatorScreenParams<UnAuthenParamList>;
  [APP_SCREENS.AUTHORIZED]: undefined;
} & UnAuthenParamList &
  AuthenParamList;
