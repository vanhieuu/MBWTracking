import {appActions} from '@store/app-reducer/reducer';
import {takeLatest} from 'typed-redux-saga';
import * as Saga from './index';

export function* appSaga() {
  yield* takeLatest(
    appActions.getCustomerRouteAction.type.toString(),
    Saga.getListCustomerRouter,
  );
  yield* takeLatest(
    appActions.postOrganization.type.toString(),
    Saga.verifyOrganizationSagas,
  );
}
