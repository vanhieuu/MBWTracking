import {ILoginResponse, ResponseGenerator} from '@common';
import {STT_OK} from '@config/api.const';
import {Api_key, Api_secret} from '@config/app.const';
import {navigate} from '@navigation/navigation-service';
import {APP_SCREENS} from '@navigation/screen-type';
import {PayloadAction} from '@reduxjs/toolkit';
import {appActions, setError} from '@store/app-reducer/reducer';
import {loginActions, setResponseLogin} from '@store/login-reducer/reducer';
import {apiLogin, apiVerifyOrganization} from '@store/api/loginApi';
import {AppModule} from '@common';
import {call, put} from 'typed-redux-saga';
import {translate} from '@utils';
import {showSnack} from '@components';

export function* verifyOrganizationSagas(action: PayloadAction) {
  if (loginActions.postOrganization.match(action)) {
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

export function* onLogin(action: PayloadAction) {
  if (loginActions.postLogin.match(action)) {
    try {
      const response: ResponseGenerator = yield call(apiLogin, action.payload);
      console.log(response, 'response login');
      if (Object.keys(response.result).length > 0) {
        const result: ILoginResponse = response.result;
        AppModule.storage.set(Api_key, result.key_details.api_key);
        AppModule.storage.set(Api_secret, result.key_details.api_secret);
        yield* put(setResponseLogin(result));
        // navigate(APP_SCREENS.AUTHORIZED);
      } else {
        showSnack({
          msg: response.message!,
          type: 'error',
          interval: 2000,
        });
        yield* put(appActions.setError(translate('error:errorLogin')));
      }
    } catch (err) {
      showSnack({
        msg: translate('error:errorLogin') as string,
        type: 'error',
        interval: 2000,
      });
    }
  }
}
