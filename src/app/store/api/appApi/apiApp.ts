import {GET_LIST_ROUTER_MAP_VIEW} from '@config/api.const';
import {BASE_URL, createApi} from '@config/createApi';

export const appApi = {
  getCustomerApi() {
    return createApi().get(GET_LIST_ROUTER_MAP_VIEW, {
      baseURL: BASE_URL,
    });
  },
};
