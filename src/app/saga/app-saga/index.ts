import {ResponseGenerator} from '@common';
import {PayloadAction} from '@reduxjs/toolkit';
import {appActions, setError} from '@store/app-reducer/reducer';
import {apiGetListCustomer} from '../../store/api/appApi';
import {call, put} from 'typed-redux-saga';
import { apiVerifyOrganization } from '../../store/api/loginApi';
import { STT_OK } from '@config/api.const';
import { navigate } from '@navigation/navigation-service';
import { APP_SCREENS } from '@navigation/screen-type';
import { loginActions } from '@store/login-reducer/reducer';

export function* getListCustomerRouter(action: PayloadAction) {
  if (appActions.getCustomerRouteAction.match(action)) {
    try {
      const response: ResponseGenerator = yield call(apiGetListCustomer);
      console.log(response, 'response customer');
      if (response.result?.data.length > 0) {
        // console.log(response.result.data,'rrrrrrr')
        yield put(appActions.setDataCustomer(response.result.data));
      }
    } catch (err) {
      console.log('[error Saga:] ', err);
    }
  }
}
export function* verifyOrganizationSagas(action: PayloadAction) {
  if (appActions.postOrganization.match(action)) {
    try {
      const response: ResponseGenerator = yield call(
        apiVerifyOrganization,
        action.payload,
      );
      console.log(response,'response body')
      if (response.status === STT_OK) {
        yield put(loginActions.setResponseOrganization(response.data.result));
        navigate(APP_SCREENS.LOGIN, {
          organizationName: action.payload,
        });
      } else {
        yield put(appActions.setError(response.message));
      }
    } catch (err) {
      yield put(
        setError({
          title: null,
          message: 'Đã có lỗi xảy ra, vui lòng thử lại sau',
          viewOnly: true,
        }),
      );
    } finally {
    }
  }
}