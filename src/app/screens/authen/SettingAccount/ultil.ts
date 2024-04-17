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
        title:translate('title:enableFaceID'),
        isSwitch:true,
        screen:"",
        icon:'FaceIdIcon'
    },
    {
        title:translate('title:changePassword'),
        isSwitch:false,
        screen:APP_SCREENS.CHANGE_PASSWORD,
        icon:'IconSetting'
    },
    // {
    //     title:translate('title:notificationSettings'),
    //     isSwitch:false,
    //     screen:"",
    //     icon:'IconNoti'
    // },
]