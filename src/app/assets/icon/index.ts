/* eslint-disable camelcase */
export const icons = {
  plus: require('./source/ic_plus.png'),
  ErrorApiIcon: require('./source/error_api.png'),
  SuccessApiIcon: require('./source/success_api.png'),
  ENFlag: require('./source/ENFlag.png'),
  VNFLag: require('./source/VNFlag.png'),
  arrowDown:require('./source/arrow_down.png'),
  initLogo:require('./source/Logo.png'),
  Subject:require('./source/subject.png'),
  CurrentLocation:require('./source/Group.png'),
  Scanner:require('./source/scanner.png'),
  Tooltip:require('./source/Tooltip.png'),
  MapPinFill:require('./source/mapPin-fill.png')
};

export type IconTypes = keyof typeof icons;
