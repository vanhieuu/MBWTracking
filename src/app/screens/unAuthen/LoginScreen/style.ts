import {AppTheme} from '@theme';
import {StyleSheet, ViewStyle} from 'react-native';

export const loginStyle = (theme: AppTheme) =>
  StyleSheet.create({
    root: {
      flex: 1,
    } as ViewStyle,
  });

export const formStyle = (theme: AppTheme) =>
  StyleSheet.create({
    button: {
      backgroundColor: theme.colors.primary,
      justifyContent: 'center',
      height: 48,
      alignItems: 'center',
      borderRadius: 16,
    } as ViewStyle,
  });
