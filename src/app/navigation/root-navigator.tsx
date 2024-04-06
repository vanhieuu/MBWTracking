import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {APP_SCREENS, RootStackParamsList} from './screen-type';
import AuthenNavigator from './authenNavigator';
import UnAuthenNavigation from './unAuthenNavigator';
import {getState} from '../common/redux';
import {useSelector} from '../common/hooks';
import {shallowEqual} from 'react-redux';

const Stack = createNativeStackNavigator<RootStackParamsList>();

const RootNavigator = () => {
  // const state = getState('login');
  const loginState = useSelector(
    state => state.login.loginResponse,
    shallowEqual,
  );
  // console.log(state,'state')
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      {loginState &&
      Object.keys(loginState) &&
      Object.keys(loginState).length > 0 ? (
        <Stack.Screen
          name={APP_SCREENS.AUTHORIZED}
          component={AuthenNavigator}
        />
      ) : (
        <Stack.Screen
          name={APP_SCREENS.UN_AUTHORIZED}
          component={UnAuthenNavigation}
        />
      )}
    </Stack.Navigator>
  );
};

export default RootNavigator;
