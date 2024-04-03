import {ILogin} from '@common';
import {POST_USER_LOGIN, POST_USER_ORGANIZATION} from '@config/api.const';
import {createApi} from '@config/createApi';

export const loginApi = {
  verifyOrganization:(data: object)  =>{
   return createApi(true).get(POST_USER_ORGANIZATION + `?organization=${data}`,)
  },
  login: (data: ILogin, deleteHeader?: boolean) => {
  return  createApi(deleteHeader).post(POST_USER_LOGIN, data);
  },
};
