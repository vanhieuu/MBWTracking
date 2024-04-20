import React, {FC, ReactNode, useState} from 'react';
import {Text, TextInput} from 'react-native-paper';
import {TouchableOpacity} from 'react-native';
import isEqual from 'react-fast-compare';
import {useTheme} from '@theme';
import {AppInputProps} from './type';
import {SvgIcon} from '../svg-icon';

const AppInputComponent: FC<AppInputProps> = ({
  styles,
  label,
  value,
  onChangeValue,
  rightIcon,
  isPassword,
  error,
  inputProp,
  disable = false,
  editable,
  hiddenRightIcon,
  onPress,
  defaultValue,
  isRequire = false,
  labelStyle,
  contentStyle,
}) => {
  const {colors} = useTheme();
  const [isFocus, setFocus] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);

  return (
    <TouchableOpacity disabled={disable} onPress={onPress}>
      <TextInput
        onPressIn={onPress}
        contentStyle={{
          color: colors.text_primary,
          fontSize: 16,
          ...contentStyle,
        }}
        style={{
          backgroundColor: colors.bg_default,
          ...styles,
        }}
        outlineStyle={{
          borderColor: !isFocus ? colors.text_disable : error ? colors.error :  'rgba(99, 79, 145, 1)',
          borderRadius: 8,
        }}
        mode={'outlined'}
        label={
          <Text
            style={{
              color: isFocus || value ? undefined : colors.text_disable,
              fontWeight: isFocus || value ? '600' : '400',
              fontSize: 16,
              ...labelStyle,
            }}>
            {label} {isRequire ? <Text style={{color: 'red'}}>*</Text> : null}
          </Text>
        }
        onChangeText={onChangeValue}
        value={value}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        {...inputProp}
        error={error}
        right={
          rightIcon ? (
            rightIcon
          ) : isPassword ? (
            <TextInput.Icon
              icon={showPassword ? 'eye' : 'eye-off'}
              color={colors.text_secondary}
              onPress={() => setShowPassword(!showPassword)}
            />
          ) : value && !hiddenRightIcon ? (
            <TextInput.Icon
              icon={'close-circle'}
              color={colors.bg_disable}
              onPress={() => (onChangeValue ? onChangeValue('') : null)}
            />
          ) : null
        }
        editable={editable}
        defaultValue={defaultValue}
        disabled={disable}
        secureTextEntry={isPassword && !showPassword}
        clearTextOnFocus={isPassword}
      />
    </TouchableOpacity>
  );
};

export const AppInput = React.memo(AppInputComponent, isEqual);
