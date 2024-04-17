import React, {useCallback} from 'react';
import isEqual from 'react-fast-compare';
import {AppHeader, Block, Text} from '@components';
import {useTheme} from '@theme';
import {rootStyles} from './style';
import {translate} from '@utils';
import {SafeAreaView} from 'react-native-safe-area-context';
import {AccountItem} from './ultil';
import ItemSetting from './ItemSetting';
import {dispatch, useSelector} from '@common';
import {shallowEqual} from 'react-redux';
import {appActions} from '@store/app-reducer/reducer';

const SettingAccountScreens = () => {
  const theme = useTheme();
  const styles = rootStyles(theme);
  const biometricsValue = useSelector(
    state => state.app.enableBiometrics,
    shallowEqual,
  );
  const handleSwitch = useCallback(() => {
    dispatch(appActions.setBiometricsStatus(!biometricsValue));
  }, [biometricsValue]);

  return (
    <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
      <AppHeader
        headerTitle={translate('title:accountSettings') as string}
        isIcon={true}
      />
      <Block
        colorTheme="bg_default"
        paddingHorizontal={16}
        paddingVertical={16}
        margin={16}
        borderRadius={10}>
        {AccountItem.map((item, index) => {
          return (
            <ItemSetting
              key={index.toString()}
              index={index}
              valueSwitch={biometricsValue}
              data={item}
              theme={theme}
              {...item}
              handleSwitch={handleSwitch}
            />
          );
        })}
      </Block>
    </SafeAreaView>
  );
};

export const SettingAccount = React.memo(SettingAccountScreens, isEqual);
