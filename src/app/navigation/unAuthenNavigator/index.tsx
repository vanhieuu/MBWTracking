import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {APP_SCREENS, UnAuthenParamList} from '@navigation/screen-type';
import SelectOrganization from '@features/unAuthen/VerifyOrganization';
import LoginScreen from '@features/unAuthen/LoginScreen';
import {useGetOnboardingStatus} from '@common';
import RequestPermission from '@features/authen/RequestPermission';
import { Platform } from 'react-native';

const Stack = createNativeStackNavigator<UnAuthenParamList>();

const UnAuthenNavigation = () => {
  const {isFirstLaunch} = useGetOnboardingStatus();

  return (
    <Stack.Navigator screenOptions={{headerShown: false}}  >
      <Stack.Screen
        name={APP_SCREENS.VERIFY_ORGANIZATION}
        component={SelectOrganization}
      />
      <Stack.Screen name={APP_SCREENS.LOGIN} component={LoginScreen} />
      {isFirstLaunch && Platform.OS === 'android' && (
        <Stack.Screen
          name={APP_SCREENS.REQUEST_PERMISSIONS}
          component={RequestPermission}
        />
      )}
    </Stack.Navigator>
  );
};

export default UnAuthenNavigation;


