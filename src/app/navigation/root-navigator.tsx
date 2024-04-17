import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {APP_SCREENS, RootStackParamsList} from './screen-type';
import AuthenNavigator from './authenNavigator';
import UnAuthenNavigation from './unAuthenNavigator';
import {getState} from '../common/redux';
import {useSelector} from '../common/hooks';
import {shallowEqual} from 'react-redux';
import {SafeAreaProvider} from 'react-native-safe-area-context';

const Stack = createNativeStackNavigator<RootStackParamsList>();

const RootNavigator = () => {
  // const state = getState('login');
  const loginState = useSelector(
    state => state.login.loginResponse,
    shallowEqual,
  );
  const isNotEmpty = Object.values(loginState.key_details).some(value => value !== '');

  console.log(loginState,'state')
  return (
    <SafeAreaProvider>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        {loginState.key_details &&
        Object.keys(loginState.key_details) &&
        isNotEmpty ? (
          <Stack.Screen
            name={APP_SCREENS.AUTHORIZED}
            component={AuthenNavigator}
            options={{gestureEnabled: false, headerShown: false}}
          />
        ) : (
          <Stack.Screen
            name={APP_SCREENS.UN_AUTHORIZED}
            component={UnAuthenNavigation}
            options={{gestureEnabled: false, headerShown: false}}
          />
        )}
      </Stack.Navigator>
    </SafeAreaProvider>
  );
};

export default RootNavigator;
