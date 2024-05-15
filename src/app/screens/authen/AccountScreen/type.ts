import {SvgIconTypes} from '@assets/svgIcon';
import i18n from '@library/utils/i18n/i18n';
import {APP_SCREENS} from '@navigation/screen-type';
import { translate } from '@utils';

export type ItemType = {
  title: string;
  isToggle: boolean;
  icon: SvgIconTypes;
  dropAble: boolean;
  navigateAble: boolean;
  screen?: any;
};

export const listItem: ItemType[] = [
  // {
  //   title: 'title:travelHistory',
  //   isToggle: false,
  //   icon: 'IconTravelHistory',
  //   dropAble: false,
  //   navigateAble: true,
  //   screen: APP_SCREENS.TRAVEL_HISTORY,
  // },
  {
    title: 'title:language',
    isToggle: false,
    icon: 'IconLanguage',
    dropAble: true,
    navigateAble: false,
  },
  {
    title: 'title:accountSettings',
    isToggle: false,
    icon: 'IconSetting',
    dropAble: false,
    navigateAble: true,
    screen: APP_SCREENS.SETTING,
  },
  {
    title: 'title:theme',
    isToggle: true,
    icon: 'IconDarkMode',
    dropAble: false,
    navigateAble: false,
  },
];
