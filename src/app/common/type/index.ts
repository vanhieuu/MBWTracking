import { RegisterOptions } from "react-hook-form";

export type CustomOmit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

export type NestedNavigatorParams<ParamList> = {
  [K in keyof ParamList]: undefined extends ParamList[K]
    ? {screen: K; params?: ParamList[K]}
    : {screen: K; params: ParamList[K]};
}[keyof ParamList];

export type IncludeMatchingProperties<T, V> = Pick<
  T,
  {[K in keyof T]-?: T[K] extends V ? K : never}[keyof T]
>;

export type RequireAtLeastOne<T, Keys extends keyof T = keyof T> = Pick<
  T,
  Exclude<keyof T, Keys>
> &
  {
    [K in Keys]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<Keys, K>>>;
  }[Keys];

export type ILogin = {
  usr: string;
  pwd: string;
  device_name?: string;
  device_id?: string;
};
export type ResponseGenerator = {
  config?: any;
  data?: any;
  headers?: any;
  request?: any;
  status?: any;
  code?: number;
  message?: any;
  exception?: any;
  result?: any;
};
export type ILoginResponse = {
  key_details: KeyDetails;
};
export type KeyDetails = {
  api_secret: string;
  api_key: string;
  project_id: string;
  object_id: string;
};
export type HookFormRules = Exclude<
  RegisterOptions,
  'valueAsNumber' | 'valueAsDate' | 'setValueAs'
>;
export type $Omit<T, K> = Pick<T, Exclude<keyof T, K>>;
export type $RemoveChildren<T extends React.ComponentType<any>> = $Omit<
  React.ComponentPropsWithoutRef<T>,
  'children'
>;


export type ListCustomerRouter = {
  name:string,
  customer_code:string,
  customer_location_primary:string,
  customer_primary_address:string,
  is_checkin:boolean
}
export type UserInforType = {
  cell_number: string
  current_address: string
  date_of_birth: string
  date_of_joining: string
  department: any
  designation: any
  employee: string
  employee_name: string
  gender: string
  image: string
  salutation: any
  user_id: string
}

export interface MapResponse {
  summary: Summary
  positions: PositionMapResponse[]
  resultInfo: ResultInfo
}

export interface Summary {
  _id: string
  name: string
}

export interface PositionMapResponse {
  coords: CoordsMapResponse
  extras: ExtrasMapResponse
  activity: ActivityMapResponse
  geofence: GeofenceMapResponse
  battery: BatteryMapResponse
  uuid: string
  event?: string
  is_moving: boolean
  odometer: number
  timestamp: string
}

export type CoordsMapResponse = {
  speed_accuracy: number
  speed: number
  longitude: number
  ellipsoidal_altitude: number
  floor: any
  heading_accuracy: number
  latitude: number
  accuracy: number
  altitude_accuracy: number
  altitude: number
  heading: number
}
export interface ExtrasMapResponse {
  getCurrentPosition?: boolean
}

export interface ActivityMapResponse {
  type: string
  confidence: number
}

export interface GeofenceMapResponse {}

export interface BatteryMapResponse {
  level: number
  is_charging: boolean
}

export interface ResultInfo {
  maxResults: number
  pageNumber: number
  itemsCount: number
}