import {combineReducers} from '@reduxjs/toolkit';
import { appReducer } from './app-reducer/reducer';
import { loginReducer } from './login-reducer/reducer';


export const allReducer = combineReducers({
  app: appReducer,
  login:loginReducer
  
});

export type RootState = ReturnType<typeof allReducer>;
