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
  yield* takeLatest(appActions.getUserInfor.type.toString(), Saga.getUserInfor);
  yield* takeLatest(
    appActions.getTravelHistoryAction.type.toString(),
    Saga.getTravelHistory,
  );
  yield* takeLatest(
    appActions.changePassword.type.toString(),
    Saga.onChangePassword,
  );
}
