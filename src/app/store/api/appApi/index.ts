import {appApi} from './apiApp';

export const apiGetListCustomer = () => appApi.getCustomerApi().then(res => res.data);
