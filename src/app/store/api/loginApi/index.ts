import {ILogin} from '../../../common/type';
import {loginApi} from './apiLogin';

export const apiLogin = (data: any) =>
  loginApi.login(data).then(res => res.data);
export const apiVerifyOrganization = (data: any) =>
  loginApi.verifyOrganization(data);
