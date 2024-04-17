import {AppState, AppStateStatus, Platform} from 'react-native';
import React, {useCallback, useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {navigationRef} from './navigation-service';
import RootNavigator from './root-navigator';
import {MyAppTheme} from '@theme';
import {RXStore, useSelector} from '@common';
import {shallowEqual} from 'react-redux';
import {HandlingError, PortalHost, SnackBar} from '@components';
import Mapbox from '@rnmapbox/maps';
import {MAPBOX_TOKEN} from '@config/app.const';

Mapbox.setAccessToken(MAPBOX_TOKEN);
// if (Platform.OS === 'android') {
//   Mapbox.setConnected(true);
// }

export const AppNavigator = () => {
  const theme = useSelector(state => state.app.theme, shallowEqual);

  const handleAppStateChange = useCallback((nextState: AppStateStatus) => {
    if (nextState === 'active') {
      console.log('App has come to the foreground');
    } else if (nextState === 'background') {
      console.log('App has come to the background');
      // if (apiKey === '') {
      // } else {
      return;
      // }
    }
  }, []);

  useEffect(() => {
    AppState.addEventListener('change', handleAppStateChange);
  }, []);

  return (
    <NavigationContainer ref={navigationRef} theme={MyAppTheme[theme]}>
      <PortalHost name={'AppModal'} />
      <RootNavigator />
      <SnackBar />
      <HandlingError />
      <RXStore />
    </NavigationContainer>
  );
};
