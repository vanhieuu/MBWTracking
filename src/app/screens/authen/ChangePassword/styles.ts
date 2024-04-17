import {AppTheme} from '@theme';
import {StyleSheet, ViewStyle} from 'react-native';

export const rootStyle = (theme: AppTheme) =>
  StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: theme.colors.bg_neutral,
    } as ViewStyle,
  });

export const formStyle = (theme:AppTheme) => StyleSheet.create({
   inputStyle:{
      marginVertical:16,
      
   } as ViewStyle,
     button:(value:any) => ({
      backgroundColor:  !value ? theme.colors.bg_disable:  theme.colors.primary,
      justifyContent: 'center',
      height: 48,
      alignItems: 'center',
      borderRadius: 16,
    }) as ViewStyle,
})