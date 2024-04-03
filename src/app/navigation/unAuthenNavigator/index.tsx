import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {APP_SCREENS, UnAuthenParamList} from '@navigation/screen-type';
import MainScreen from '@features/authen/MainScreen/MainScreen';
import SelectOrganization from '@features/unAuthen/VerifyOrganization';
import LoginScreen from '@features/unAuthen/LoginScreen';

const Stack = createNativeStackNavigator<UnAuthenParamList>();

const UnAuthenNavigation = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      
      <Stack.Screen
        name={APP_SCREENS.VERIFY_ORGANIZATION}
        component={SelectOrganization}
      />
      <Stack.Screen name={APP_SCREENS.LOGIN} component={LoginScreen} />
    </Stack.Navigator>
  );
};

export default UnAuthenNavigation;

const styles = StyleSheet.create({});
