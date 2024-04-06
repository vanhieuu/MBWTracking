import {remove} from '@utils';
/* eslint-disable @typescript-eslint/no-explicit-any */
import {Alert, Dimensions, Platform} from 'react-native';
import NetInfo from '@react-native-community/netinfo';

import {R} from '@assets/value';


import {dispatch} from '../redux';
import { appActions } from '@store/app-reducer/reducer';

type TypesBase =
  | 'bigint'
  | 'boolean'
  | 'function'
  | 'number'
  | 'object'
  | 'string'
  | 'symbol'
  | 'undefined';

export const onShowErrorBase = (msg: string) => {
  Alert.alert(msg);
};
export const onCheckType = (
  source: any,
  type: TypesBase,
): source is TypesBase => {
  return typeof source === type;
};
export const isIos = Platform.OS === 'ios';


export const sleep = (ms: number) =>
  new Promise(resolve => setTimeout(resolve, ms));
export const CheckNetworkState = async () => {
  const state = await NetInfo.fetch();
  if (!state.isConnected) {
    dispatch(
      appActions.setError({
        title: null,
        message: 'Không có kết nối mạng',
        viewOnly: true,
      }),
    );
    dispatch(appActions.setProcessingStatus(false));
    return;
  }
};

export const formatTime = (seconds: any) => {
  // const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  // const remainingSeconds = seconds % 60;

  const pad = (num: number) => (num < 10 ? '0' + num : num);

  return `${pad(minutes)}`;
};
export const {width,height} = Dimensions.get('window')