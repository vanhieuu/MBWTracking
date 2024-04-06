import {getState} from '@common';
import {GET_LIST_ROUTER_MAP_VIEW, GET_USER_PROFILE} from '@config/api.const';
import {
  API_EK_KEY,
  API_REVERSE_KEY,
  BASE_URL,
  BASE_URL_MAP,
  EK_REVERSE_URL,
  createApi,
} from '@config/createApi';

const loginState = getState('login').loginResponse;
const URL_MAP =
  BASE_URL_MAP +
  'positions/' +
  `${loginState.projectId! ?? '6600fdbb9058b549ce243e5b'}` +
  `/${loginState.objectId ?? '65eadedc973f307f60fdd6ed'}` +
  `?api_key=${API_EK_KEY}`;

export const appApi = {
  getCustomerApi() {
    return createApi().get(GET_LIST_ROUTER_MAP_VIEW, {
      baseURL: BASE_URL,
    });
  },
  getUserInfor() {
    return createApi().get(GET_USER_PROFILE);
  },
  getTravelHistoryApi(from_time: any, to_time: any) {
    return createApi().get(
      URL_MAP + `&from_time=${from_time}` + `&to_time=${to_time}`,
    );
  },
  getLocation(lon: any, lat: any) {
    return createApi().get(
      EK_REVERSE_URL + `point.lon=${lon}` + `&point.lat=${lat}` + `&api_key=${API_REVERSE_KEY}`,
    );
  },
};
