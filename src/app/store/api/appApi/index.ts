import {appApi} from './apiApp';

export const apiGetListCustomer = () =>
  appApi.getCustomerApi().then(res => res.data);
export const apiGetUserProfile = () =>
  appApi.getUserInfor().then(res => res.data);
export const apiGetTravelHistory = (from_time: any, to_time: any) =>
  appApi.getTravelHistoryApi(from_time, to_time).then(res => res.data);
export const getReverseAddress = (lon:any,lat:any) => appApi.getLocation(lon,lat).then(res => res.data)
export const postLastLocation = (location:any) => appApi.postLastLocation(location).then(res => res.data)
export const changePassword = (data:any) => appApi.changePassword(data).then(res => res.data)