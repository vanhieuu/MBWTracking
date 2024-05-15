import { SvgIconTypes } from "@assets/svgIcon"
import { APP_SCREENS } from "@navigation/screen-type"
import { translate } from "@utils"


export type ItemType = {
    title?:string  | any,
    isSwitch:boolean,
    screen?:any,
    icon:SvgIconTypes
}

export const AccountItem:ItemType[] = [
    {
        title:'title:enableFaceID',
        isSwitch:true,
        screen:"",
        icon:'FaceIdIcon'
    },
    {
        title:'title:changePassword',
        isSwitch:false,
        screen:APP_SCREENS.CHANGE_PASSWORD,
        icon:'IconSetting'
    },
    // {
    //     title:'title:notificationSettings'),
    //     isSwitch:false,
    //     screen:"",
    //     icon:'IconNoti'
    // },
]