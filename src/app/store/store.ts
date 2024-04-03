import {configureStore} from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';

import {persistStore, persistReducer} from 'redux-persist';

import {allReducer} from './all-reducers';
import {rootSaga} from './root-sagas';
import {reduxPersistStorage} from '@utils';

const persistedReducer = persistReducer(
  {
    key: 'root',
    storage: reduxPersistStorage,
    whitelist: ['app','login'],
    timeout: 1000,
  },
  allReducer,
);

const devMode = __DEV__;
const sagaMiddleware = createSagaMiddleware();
const middlewares = [sagaMiddleware];

const storeConfig = () => {
  const store = configureStore({
    reducer: persistedReducer,
    devTools: devMode,
    middleware: getDefaultMiddleware =>
      getDefaultMiddleware({thunk: false, serializableCheck: false}).concat(
        middlewares,
      ),
  });
  sagaMiddleware.run(rootSaga);
  return store;
};

export const store = storeConfig();
export const persistore = persistStore(store);
