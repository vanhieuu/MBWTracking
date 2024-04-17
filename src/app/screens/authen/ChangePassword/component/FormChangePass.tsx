import {ActivityIndicator, TouchableOpacity} from 'react-native';
import React, {useEffect, useState} from 'react';
import {AppInput, Block, Text} from '@components';
import {formStyle} from '../styles';
import {useTheme} from '@theme';
import {translate} from '@utils';
import {dispatch, useSelector} from '@common';
import {shallowEqual} from 'react-redux';
import {appActions} from '@store/app-reducer/reducer';

type Props = {
  onConfirmPassword: (value: any) => void;
};

interface Account {
  user: string;
  current_password: string;
  new_password: string;
  new_pass_again: string;
}

const FormChangePass = ({onConfirmPassword}: Props) => {
  const theme = useTheme();
  const styles = formStyle(theme);
  const currentAccount = useSelector(
    state => state.login.userAccount,
    shallowEqual,
  );
  const [formPassword, setFormPassword] = useState<Account>({
    user: currentAccount.usr,
    current_password: '',
    new_password: '',
    new_pass_again: '',
  });
  const error = useSelector(state => state.app.isError, shallowEqual);
  const loadingApp = useSelector(state => state.app.loadingApp, shallowEqual);
  const isNotEmpty = Object.values(formPassword).some(value => value !== '');

  useEffect(() => {
    if (error) {
      setTimeout(() => {
        dispatch(appActions.setErrorBoolean(false));
      }, 3000);
    } else {
      return;
    }
  }, [error]);

  return (
    <Block block paddingVertical={20} marginTop={20}>
      <AppInput
        styles={styles.inputStyle}
        label={translate('title:currentPassword') as string}
        isPassword={true}
        error={error}
        value={formPassword.current_password}
        onChangeValue={text =>
          setFormPassword(prev => ({...prev, current_password: text}))
        }
      />

      <AppInput
        styles={styles.inputStyle}
        label={translate('title:newPassword') as string}
        isPassword={true}
        error={error}
        value={formPassword.new_password}
        onChangeValue={text =>
          setFormPassword(prev => ({...prev, new_password: text}))
        }
      />

      <AppInput
        styles={styles.inputStyle}
        label={translate('title:confirmNewPassword') as string}
        isPassword={true}
        error={error}
        value={formPassword.new_pass_again}
        onChangeValue={text =>
          setFormPassword(prev => ({...prev, new_pass_again: text}))
        }
      />

      <Block marginTop={20}>
        <TouchableOpacity
          style={styles.button(isNotEmpty)}
          onPress={() => onConfirmPassword(formPassword)}>
          {loadingApp ? (
            <ActivityIndicator size="large" color={theme.colors.action} />
          ) : (
            <Text
              fontSize={16}
              colorTheme="bg_default"
              lineHeight={24}
              fontWeight="bold">
              {translate('title:confirm') as string}
            </Text>
          )}
        </TouchableOpacity>
      </Block>
    </Block>
  );
};

export default FormChangePass;
