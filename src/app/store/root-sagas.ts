import {all} from 'typed-redux-saga';
import {loginSaga} from '../saga/login-saga/saga';
import {appSaga} from '../saga/app-saga/saga';

export const rootSaga = function* rootSaga() {
  yield all([loginSaga(), appSaga()]);
};
