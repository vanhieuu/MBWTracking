import {} from 'react-native';
import React, {useCallback, useEffect, useState} from 'react';
import isEqual from 'react-fast-compare';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useTheme} from '@theme';
import {rootStyle} from './styles';
import {AppHeader, Block, Text} from '@components';
import {translate} from '@utils';
import FormChangePass from './component/FormChangePass';
import {  useSelector } from '@common';
import { shallowEqual } from 'react-redux';


const ChangePassword = () => {
  const theme = useTheme();
  const styles = rootStyle(theme);
  const currentUser = useSelector(state => state.login.userAccount,shallowEqual)




  const onConfirmData = useCallback((data: any) => {
    // dispatch(appActions.changePassword(data))
    console.log(data,'data')
}, []);

 



  return (
    <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
      <AppHeader />
      <Block block>
        <Block marginTop={16} block paddingHorizontal={16} paddingBottom={10}>
          <Text fontSize={24} fontWeight="bold" colorTheme="text_primary">
            {translate('title:resetPassword') as string}
          </Text>
          <FormChangePass onConfirmPassword={onConfirmData} />
        </Block>
      </Block>
    </SafeAreaView>
  );
};

export default React.memo(ChangePassword, isEqual);
