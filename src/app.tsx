import {BackHandler, LogBox, StatusBar} from 'react-native';
import React, {Suspense, useEffect} from 'react';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {I18nextProvider} from 'react-i18next';
import I18n from './app/library/utils/i18n/i18n';
import {AppNavigator} from '@navigation/app-navigator';
import {PortalProvider} from '@components';
import {Provider} from 'react-redux';
import {store} from '@store/store';
import {ClickOutsideProvider} from 'react-native-click-outside';

export const MyApp = () => {
  useEffect(() => {
    LogBox.ignoreAllLogs();
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => true,
    );
    return () => backHandler.remove();
  }, []);
  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <StatusBar
        barStyle={'dark-content'}
        hidden={false}
        backgroundColor="black"
      />
      <SafeAreaProvider>
        <Provider store={store}>
          <I18nextProvider i18n={I18n}>
            <Suspense fallback={null}>
              <PortalProvider>
                <ClickOutsideProvider>
                  <AppNavigator />
                </ClickOutsideProvider>
              </PortalProvider>
            </Suspense>
          </I18nextProvider>
        </Provider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};
