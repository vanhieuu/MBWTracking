import {all, takeLatest} from 'typed-redux-saga';
import * as Saga from './index';
import {loginActions} from '@store/login-reducer/reducer';

export function* loginSaga() {
  yield takeLatest(loginActions.postLogin.type.toString(), Saga.onLogin);
  yield takeLatest(
    loginActions.postOrganization.type.toString(),
    Saga.verifyOrganizationSagas,
  );
}

