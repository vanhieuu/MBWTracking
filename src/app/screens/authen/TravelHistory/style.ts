import {AppTheme} from '@theme';
import {StyleSheet, ViewStyle} from 'react-native';

export const rootStyle = (theme: AppTheme) =>
  StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor:theme.colors.bg_neutral
    } as ViewStyle,
    modalView: {
    
     
    } as ViewStyle,
  });

  export const headerStyle = (theme:AppTheme) => StyleSheet.create({

  })