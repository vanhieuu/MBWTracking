

export interface ILoginState {
    loginResponse:{
        apiKey?:string,
        apiSecret?:string,
        projectId?:string,
        objectId?:string
    },
    organization:any,
    isSavePassword?:boolean,
    password?:string
}

export enum LOGIN_ACTION {
    LOGIN = 'LOGIN_',
    POST_ORGANIZATION = 'POST_ORGANIZATION_',
    
}
export const LOGIN = LOGIN_ACTION.LOGIN + 'LOGIN'
export const POST_ORGANIZATION = LOGIN_ACTION.POST_ORGANIZATION + 'LOGIN'