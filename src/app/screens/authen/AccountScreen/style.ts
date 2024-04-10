import {AppTheme} from '@theme';
import {StyleSheet, ViewStyle} from 'react-native';
import {ImageStyle as FastImageStyle} from 'react-native-fast-image';

export const rootStyles = (theme: AppTheme) =>
  StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: theme.colors.bg_neutral,
    } as ViewStyle,
    logoutButton: {
      backgroundColor: theme.colors.bg_default,
      marginHorizontal: 16,
      justifyContent: 'center',
      alignItems: 'center',
      height: 48,
      borderRadius: 16,
    } as ViewStyle,
    bottomView: {
      height: 400,
      width: '100%',
      position: 'absolute',
      zIndex: 90000,
      borderTopLeftRadius: 28,
      paddingTop: 20,
      borderTopRightRadius: 28,
      justifyContent: 'flex-start',
      alignItems: 'center',
      backgroundColor: theme.colors.bg_default,
      flex: 1,
    } as ViewStyle,
    langSelectButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 16,
      marginBottom: 16,
    } as ViewStyle,
  });

export const headerStyle = (theme: AppTheme) =>
  StyleSheet.create({
    imageStyle: {
      width: 58,
      height: 58,
      borderRadius: 50,
      borderWidth: 1,
      borderColor: theme.colors.bg_neutral,
      marginHorizontal: 16,
      
    } as FastImageStyle,
  });

export const itemStyle = (theme: AppTheme) =>
  StyleSheet.create({
    containItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      height: 56,
    } as ViewStyle,
  });
