import EyeSecure from './source/eye-secure.svg';
import EyeSlash from './source/eye-slash.svg';
import CloseCircle from './source/close-circle.svg';
import IconOdometer from './source/iconOdometer.svg';
import IconClock from './source/iconClock.svg';
import IconBattery from './source/iconBattery.svg'
import IconMapping from './source/iconMaping.svg';
import IconHamburger from './source/iconHamburger.svg'
export const SvgComponent = {
  EyeSlash,
  EyeSecure,
  CloseCircle,
  IconBattery,
  IconClock,
  IconMapping,
  IconOdometer,
  IconHamburger
};
export type SvgIconTypes = keyof typeof SvgComponent;
