import React, {useCallback, useRef, useState} from 'react';
import {useTheme} from '@theme';
import {loginStyle} from './style';
import {Block, Text} from '@components';
import isEqual from 'react-fast-compare';
import {SafeAreaView} from 'react-native-safe-area-context';
import {dispatch, useGetOnboardingStatus, useSelector} from '@common';
import {shallowEqual} from 'react-redux';
import {FormLogin} from './component/formLogin';
import {loginActions} from '@store/login-reducer/reducer';
import {Platform} from 'react-native';

import {APP_SCREENS, UnAuthenParamList} from '@navigation/screen-type';
import {NavigationProp, useNavigation} from '@react-navigation/native';
type Props = {};

const LoginScreen = (props: Props) => {
  const theme = useTheme();
  const styles = loginStyle(theme);
  const organization = useSelector(
    state => state.login.organization,
    shallowEqual,
  );
  const {isFirstLaunch} = useGetOnboardingStatus();

  const onConfirmData = useCallback((data: any) => {
    dispatch(loginActions.setAutoLogin(data));
    dispatch(loginActions.postLogin(data));
  }, []);
  const {navigate} = useNavigation<NavigationProp<UnAuthenParamList>>();

  const onFirstLaunchLogin = useCallback(
    (data: any) => {
      if (!!isFirstLaunch) {
        if (Platform.OS === 'android') {
          navigate(APP_SCREENS.REQUEST_PERMISSIONS, data);
          console.log('run on this screen');
        } else {
          console.log('run on that screen');
          onConfirmData(data);
        }
      } else {
        console.log('run third case');
        onConfirmData(data);
      }
    },
    [isFirstLaunch],
  );

  return (
    <SafeAreaView style={styles.root} edges={['top']}>
      <Block block>
        <Block justifyContent="center" alignItems="center">
          <Text colorTheme="text_secondary" fontSize={16}>
            {organization && Object.keys(organization).length > 0
              ? organization.company_name
              : organization.company_name}
          </Text>
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
        <FormLogin onConfirmData={onFirstLaunchLogin} />
      </Block>
    </SafeAreaView>
  );
};

export default React.memo(LoginScreen, isEqual);
