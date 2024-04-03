import {AppInput, Block, Text} from '@components';
import React, {useCallback} from 'react';
import isEqual from 'react-fast-compare';
import {formStyle} from '../style';
import {useTheme} from '@theme';
import {TouchableOpacity} from 'react-native';
import {dispatch, useSelector} from '@common';
import {shallowEqual} from 'react-redux';
import {loginActions} from '@store/login-reducer/reducer';

type Props = {
  onConfirmData:(data:LoginData) => void
};

interface LoginData {
  usr: string;
  pwd: string;
}
const FormLoginComponents = (props: Props) => {
  const theme = useTheme();
  const styles = formStyle(theme);
  const savePassword = useSelector(
    state => state.login.isSavePassword,
    shallowEqual,
  );

  const [value, setValue] = React.useState<LoginData>({
    usr: '',
    pwd: '',
  });
  const [check, setCheck] = React.useState<boolean>(savePassword!);

  const onPressSavePassword = () => {
    console.log(check, 'check');

    if (check) {
      setCheck(false);
    } else {
      setCheck(true);
      dispatch(loginActions.setSavePassword(true));
    }
  };

  


  return (
    <Block block paddingHorizontal={16} marginTop={20}>
      <AppInput
        styles={{marginVertical: 20}}
        label="Tên đăng nhập"
        value={value.usr}
        onChangeValue={text => setValue(prev => ({...prev, usr: text}))}
      />
      <AppInput
        styles={{marginVertical: 20}}
        label="Mật khẩu"
        value={value.pwd}
        isPassword={true}
        onChangeValue={text => setValue(prev => ({...prev, pwd: text}))}
      />
      <Block
        marginTop={16}
        // colorTheme="black"
        direction="row"
        justifyContent="space-between">
        <Block direction="row" justifyContent="center" alignItems="center">
          <TouchableOpacity onPress={onPressSavePassword}>
            <Block
              borderWidth={1}
              marginLeft={5}
              width={15}
              marginRight={8}
              height={15}
              colorTheme={check ? 'primary' : 'white'}
              borderRadius={3}
              borderColor={theme.colors.black}
            />
          </TouchableOpacity>
          <Text>Lưu mật khẩu</Text>
        </Block>

        <Block>
          <TouchableOpacity>
            <Text>Quên mật khâu</Text>
          </TouchableOpacity>
        </Block>
      </Block>
      <Block marginTop={32}>
        <TouchableOpacity style={styles.button} onPress={() => props.onConfirmData(value)}>
          <Text fontSize={16} fontWeight="700" colorTheme="white">
            Đăng nhập
          </Text>
        </TouchableOpacity>
      </Block>
    </Block>
  );
};

export const FormLogin = React.memo(FormLoginComponents, isEqual);
