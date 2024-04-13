import { icons } from "@assets/icon";
import { MAP_TITLE_URL } from "@config/app.const";

export const dataMap = [
    {
        id:0,
        image:icons.MapDefault,
        title:'Bản đồ tiêu chuẩn',
        mapURl:MAP_TITLE_URL.adminMap
    },
    {
        id:1,
        image:icons.MapNight,
        title:'Bản đồ đêm',
        mapURl:MAP_TITLE_URL.nightMap

    }
]