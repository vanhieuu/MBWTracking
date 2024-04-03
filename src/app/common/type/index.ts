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