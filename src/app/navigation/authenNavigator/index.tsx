import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {APP_SCREENS, AuthenParamList} from '@navigation/screen-type';
import MainScreen from '@features/authen/MainScreen/MainScreen';
import AccountScreen from '@features/authen/AccountScreen';
import TravelHistory from '@features/authen/TravelHistory';
import { SettingAccount } from '@features/authen/SettingAccount';

const Stack = createNativeStackNavigator<AuthenParamList>();

const AuthenNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name={APP_SCREENS.MAIN_SCREEN} component={MainScreen} />
      <Stack.Screen
        name={APP_SCREENS.TRAVEL_HISTORY}
        component={TravelHistory}
      />
      <Stack.Screen
        name={APP_SCREENS.ACCOUNT_SETTINGS}
        component={AccountScreen}
      />
      <Stack.Screen  name={APP_SCREENS.SETTING} component={SettingAccount}  />
    </Stack.Navigator>
  );
};

export default AuthenNavigator;
