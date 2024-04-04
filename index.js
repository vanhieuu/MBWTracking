/**
 * @format
 */
import 'react-native-gesture-handler';
import 'intl-pluralrules';
import {AppRegistry} from 'react-native';
import {MyApp} from './src/app';
import {name as appName} from './app.json';

if (!__DEV__) {
  global.console = {
    info: () => {},
    log: () => {},
    assert: () => {},
    warn: () => {},
    debug: () => {},
    error: () => {},
    time: () => {},
    timeEnd: () => {},
  };
}

AppRegistry.registerComponent(appName, () => MyApp);
