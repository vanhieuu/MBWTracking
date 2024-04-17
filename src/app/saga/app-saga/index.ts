import {MapResponse, ResponseGenerator} from '@common';
import {PayloadAction} from '@reduxjs/toolkit';
import {appActions, setError} from '@store/app-reducer/reducer';
import {
  apiGetListCustomer,
  apiGetTravelHistory,
  apiGetUserProfile,
  changePassword,
} from '../../store/api/appApi';
import {call, put} from 'typed-redux-saga';
import {apiVerifyOrganization} from '../../store/api/loginApi';
import {STT_OK} from '@config/api.const';
import {goBack, navigate} from '@navigation/navigation-service';
import {APP_SCREENS} from '@navigation/screen-type';
import {loginActions} from '@store/login-reducer/reducer';
import {showSnack} from '@components';
import {translate} from '@utils';

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
export function* getTravelHistory(action: PayloadAction) {
  if (appActions.getTravelHistoryAction.match(action)) {
    try {
      const response: MapResponse = yield call(
        apiGetTravelHistory,
        action.payload.from_time,
        action.payload.to_time,
      );
      if (response.positions && response.positions.length > 0) {
        yield put(appActions.setTravelHistory(response));
      }
      // if(response.)
    } catch (err) {
      console.log(['error travel history: ', err]);
    }
  }
}
export function* getMoreTravelHistory(action: PayloadAction) {}

export function* getUserInfor(action: PayloadAction) {
  if (appActions.getUserInfor.match(action)) {
    try {
      const response: ResponseGenerator = yield call(apiGetUserProfile);
      if (Object.keys(response?.result).length > 0) {
        yield put(appActions.setUserProfile(response.result));
      }
    } catch (err) {
      showSnack({
        msg: 'Lỗi khi lấy dữ liệu, vui lòng thử lại',
        type: 'error',
        interval: 2000,
      });
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
      console.log(response, 'response body');
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

export function* onChangePassword(action: PayloadAction) {
  if (appActions.changePassword.match(action)) {
    try {
      yield put(appActions.onLoadApp());
      const response: ResponseGenerator = yield call(
        changePassword,
        action.payload,
      );
      if (response.message == 'Cập nhật thành công') {
        yield put(appActions.setSuccessBoolean(true));
        goBack();
      } else {
        yield put(appActions.setErrorBoolean(true));
        showSnack({
          msg: translate('error:errorOnRequest') as string,
          interval: 2000,
          type: 'error',
        });
      }
    } catch (err) {
      yield put(appActions.setErrorBoolean(true));
    } finally {
      yield put(appActions.onLoadAppEnd());
    }
  }
}
