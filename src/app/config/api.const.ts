export const HEADER_DEFAULT = {
  'Content-Type': 'application/json',
  Accept: 'application/json',
};
export const TIMEOUT = 50000;
export const STT_OK = 200;
export const STT_CREATED = 201;
export const STT_BAD_REQUEST = 400;
export const STT_UNAUTHORIZED = 401;
export const STT_FORBIDDEN = 403;
export const STT_NOT_FOUND = 404;
export const STT_REQUEST_TIME_OUT = 408;
export const STT_INTERNAL_SERVER = 500;
export const STT_NOT_MODIFIED = 304;
const URL_PREFIX = '/api/method/mbw_dms';
export const POST_USER_LOGIN = '/api/method/mbw_account_service.api.auth.login';
export const POST_USER_LOGOUT = '/api/method/mbw_service_v2.api.auth.logout';
export const POST_USER_ORGANIZATION =
  '/api/method/mbw_ess_registration.api.ess.organization.get_info_organization';
export const POST_RESET_PASSWORD = URL_PREFIX + '.auth.reset_password';
export const PUT_USER_PROFILE =
  '/api/method/mbw_service_v2.api.user.update_profile';
export const GET_LIST_ROUTER_MAP_VIEW = '/api/method/mbw_dms.api.router.get_customer_router?view_mode=map'
export const GET_USER_PROFILE =
  '/api/method/mbw_account_service.api.user.get_employee_info';