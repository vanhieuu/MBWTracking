import {IconTypes} from '@assets/icon';
import { API_REVERSE_KEY } from './createApi';

export const Api_key = 'Api_key';
export const Api_secret = 'Api_secret';
export const MAPBOX_TOKEN =
  'pk.eyJ1IjoibWFwYm94bmdvY3NvbjEiLCJhIjoiY2xneWlsbDVuMDl0dTNocWM5aWM2ODF6dyJ9.tQx_q1DbVfxsaSVQutF1JQ';

export const MAP_TITLE_URL = {
  adminMap:
    `https://api.ekgis.vn/v2/mapstyles/style/osmplus/standard/style.json?api_key=${API_REVERSE_KEY}`,
  nightMap:
    `https://api.ekgis.vn/v2/mapstyles/style/osmplus/dark/style.json?api_key=${API_REVERSE_KEY}`,
};
export const Organization = 'organization';
export const Language_Code = 'Language_Code';

export type LanguageItemType = {
  id: string;
  label: string;
  code: string;
  image: IconTypes;
  isSelected: boolean;
};

export type IResOrganization = {
  company_name?: string;
  erpnext_url?: string;
  country?: string;
  erpnext_setup?: string;
  first_name?: string;
  last_name?: string;
  email_id?: string;
  mobile_no?: string;
  status?: string;
};
export const LANG_LIST: LanguageItemType[] = [
  {
    id: '1',
    label: 'Tiếng Việt',
    code: 'vi',
    image: 'VNFLag',
    isSelected: true,
  },
  {
    id: '2',
    label: 'English',
    code: 'en',
    image: 'ENFlag',
    isSelected: false,
  },
];
