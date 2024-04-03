import {SvgComponent} from '@assets/svgIcon';
import {HookFormRules, ILogin} from '@common';
import {HelperText, Text, TextField} from '@components';

import {useTheme} from '@theme';

import React, {memo} from 'react';
import isEqual from 'react-fast-compare';
import {useController, useFormContext} from 'react-hook-form';
import {TextInputProps} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';

interface InputProps<T extends string> extends TextInputProps {
  name: T extends 'login' ? keyof ILogin : string;
  label?: string;
  onSubmit?: () => void;
  nameTrigger?: T extends 'login' ? keyof ILogin : string;
  rules?: HookFormRules;
  typeInput: 'flat' | 'outline';
  secureTextEntry: boolean;
  title: string;
  type: T;
}
const InputComponent = ({
  onSubmit,
  label,
  name,
  rules,
  nameTrigger,
  placeholder,
  defaultValue = '',
  typeInput,
  title,
  secureTextEntry,
  ...rest
}: InputProps<'login'>) => {
  // state
  const {trigger, getValues} = useFormContext<ILogin>();
  const [isPassword, setIsPassword] = React.useState<boolean>(true);
  const theme = useTheme();
  const {
    field,
    fieldState: {invalid, error},
  } = useController({
    name,
    rules,
    defaultValue,
  });
  // render
  return (
    <>
      <Text
        color={theme.colors.text}
        fontFamily="medium"
        style={{marginBottom: 8}}>
        {title}
      </Text>
      <TextField
        onSubmit={onSubmit}
        ref={field.ref}
        nameTrigger={nameTrigger}
        trigger={trigger}
        error={invalid}
        inputStyle={{
          color: invalid ? theme.colors.error : 'black',
          fontSize: 16,
          // lineHeight:26,
        }}
        label={label}
        value={field.value}
        name={name}
        placeholder={placeholder}
        placeholderColor={'#B2B2B2'}
        secureTextEntry={name === 'pwd' ? isPassword : false}
        onChangeText={field.onChange}
        onBlur={field.onBlur}
        defaultValue={getValues()[name]}
        rightChildren={
          name === 'pwd' ? (
            <TouchableOpacity
              onPress={() => {
                setIsPassword(!isPassword);
              }}>
              {isPassword ? (
                <SvgComponent.EyeSecure
                  width={20}
                  height={20}
                  color={invalid ? theme.colors.error : theme.colors.gray05}
                />
              ) : (
                <SvgComponent.EyeSlash
                  width={20}
                  height={20}
                  color={invalid ? theme.colors.error : theme.colors.gray05}
                />
              )}
            </TouchableOpacity>
          ) : null
        }
        typeInput={typeInput}
        {...rest}
      />

      <HelperText visible={invalid} msg={error?.message ?? ''} type={'error'} />
    </>
  );
};

export const Input = memo(InputComponent, isEqual);
