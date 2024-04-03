import {Platform} from 'react-native';

export const FontDefault = {
  primary: Platform.select({
    ios: 'SFProDisplay-Regular',
    android: 'SFProDisplay-Regular',
  }) as string,
  secondary: Platform.select({
    ios: 'SFProDisplay-Regular',
    android: 'SFProDisplay-Regular',
  }) as string,
  bold:Platform.select({
    ios:'SFProDisplay-Bold',
    android:'SFProDisplay-Bold'
  }) as string,
  medium:Platform.select({
    ios:'SFProDisplay-Medium',
    android:'SFProDisplay-Medium'
  }) as string
};
export type FontFamily = keyof typeof FontDefault;
