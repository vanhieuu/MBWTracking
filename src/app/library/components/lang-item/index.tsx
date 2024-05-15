import React, {FC} from 'react';
import {StyleSheet, TouchableOpacity, ViewStyle} from 'react-native';

import {Icon} from '../icon';
import {AppTheme, useTheme} from '@theme';
import { IconTypes } from '@assets/icon';
import isEqual from 'react-fast-compare';

const LangItemComponent: FC<LangItemProps> = ({styles, flagSource, onPress}) => {
  const {colors} = useTheme();
  const theme = useTheme();
  const style = rootStyles(theme);
  return (
    <TouchableOpacity
      style={[style.root as ViewStyle, {...styles}]}
      onPress={onPress}>
      <Icon
        icon={flagSource as any}
        imageStyle={{width: 24, height: 16, marginRight: 8}}
        resizeMode={'cover'}
      />
      <Icon icon={'arrowDown'} size={16} color={colors.text_primary} />
    </TouchableOpacity>
  );
};
export const LangItem =  React.memo(LangItemComponent,isEqual);
interface LangItemProps {
  onPress: () => void;
  flagSource?: IconTypes;
  styles?: ViewStyle;
}

export const rootStyles = (theme: AppTheme) =>
  StyleSheet.create({
    root: {
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: theme.colors.border,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
  });
