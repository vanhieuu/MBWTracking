

export interface ILoginState {
    loginResponse:{
        key_details: KeyDetails
    },
    organization:any,
    isSavePassword?:boolean,
    password?:string
}

export enum LOGIN_ACTION {
    LOGIN = 'LOGIN_',
    POST_ORGANIZATION = 'POST_ORGANIZATION_',
    
}
export interface KeyDetails {
    api_key: string
    api_secret: string
    object_id: any
    project_id: string
  }
export const LOGIN = LOGIN_ACTION.LOGIN + 'LOGIN'
export const POST_ORGANIZATION = LOGIN_ACTION.POST_ORGANIZATION + 'LOGIN'