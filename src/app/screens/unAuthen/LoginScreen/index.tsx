import React, {useCallback} from 'react';
import {useTheme} from '@theme';
import {loginStyle} from './style';
import {Block, Icon, LangItem, Text} from '@components';
import isEqual from 'react-fast-compare';

import {useMMKVString} from 'react-native-mmkv';
import {Language_Code, Organization} from '@config/app.const';
import {RouteProp, useRoute} from '@react-navigation/native';
import {APP_SCREENS, UnAuthenParamList} from '@navigation/screen-type';
import {SafeAreaView} from 'react-native-safe-area-context';
import {AppModule, dispatch, useSelector} from '@common';
import {shallowEqual} from 'react-redux';
import {FormLogin} from './component/formLogin';
import {loginActions} from '@store/login-reducer/reducer';

type Props = {};

const LoginScreen = (props: Props) => {
  const theme = useTheme();
  const styles = loginStyle(theme);
  const params =
    useRoute<RouteProp<UnAuthenParamList, APP_SCREENS.LOGIN>>().params
      .organizationName;
  const organization = useSelector(
    state => state.login.organization,
    shallowEqual,
  );

  const onConfirmData = useCallback((data: any) => {
    dispatch(loginActions.postLogin(data));
  }, []);

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <Block block>
        <Block justifyContent="center" alignItems="center">
          <Text colorTheme='black' >{params ? params : organization.result.company_name}</Text>
        </Block>
        <Block marginLeft={16} marginTop={40}>
          <Text
            colorTheme="black"
            fontWeight="700"
            fontSize={24}
            lineHeight={24}>
            Đăng nhập
          </Text>
        </Block>
        <FormLogin onConfirmData={onConfirmData} />
      </Block>
    </SafeAreaView>
  );
};

export default React.memo(LoginScreen, isEqual);
