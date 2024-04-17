import {SvgIconTypes} from '@assets/svgIcon';
import {APP_SCREENS} from '@navigation/screen-type';

export type ItemType = {
  title: string;
  isToggle: boolean;
  icon: SvgIconTypes;
  dropAble: boolean;
  navigateAble: boolean;
  screen?: any;
};

export const listItem: ItemType[] = [
  {
    title: 'Lịch sử di chuyển',
    isToggle: false,
    icon: 'IconTravelHistory',
    dropAble: false,
    navigateAble: true,
    screen: APP_SCREENS.TRAVEL_HISTORY,
  },
  {
    title: 'Ngôn ngữ',
    isToggle: false,
    icon: 'IconLanguage',
    dropAble: true,
    navigateAble: false,
  },
  {
    title: 'Cài đặt tài khoản',
    isToggle: false,
    icon: 'IconSetting',
    dropAble: false,
    navigateAble: true,
    screen: APP_SCREENS.SETTING,
  },
  {
    title: 'Chế độ tối',
    isToggle: true,
    icon: 'IconDarkMode',
    dropAble: false,
    navigateAble: false,
  },
];
