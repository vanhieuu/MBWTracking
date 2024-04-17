import {} from 'react-native';
import React, {useCallback} from 'react';
import isEqual from 'react-fast-compare';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useTheme} from '@theme';
import {rootStyle} from './styles';
import {AppHeader, Block, Icon, Modal, Text} from '@components';
import {translate} from '@utils';
import FormChangePass from './component/FormChangePass';
import {dispatch, useDisableBackHandler, useSelector} from '@common';
import {appActions} from '@store/app-reducer/reducer';
import {shallowEqual} from 'react-redux';

const ChangePassword = () => {
  const theme = useTheme();
  const styles = rootStyle(theme);
  const success = useSelector(state => state.app.isSuccess, shallowEqual);

  useDisableBackHandler(true);

  const onBackButtonAndDrop = useCallback(() => {
    dispatch(appActions.setSuccessBoolean(false));
  }, [success]);

  const onConfirmData = useCallback((data: any) => {
    dispatch(appActions.changePassword(data));
  }, []);

  console.log(success, 'succss');

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
      <Modal
        isVisible={success!}
        animatedIn="slideInUp"
        animatedOut="slideOutDown"
        hasGesture={false}
        onBackButtonPress={onBackButtonAndDrop}
        onBackdropPress={onBackButtonAndDrop}
        backdropOpacity={0.5}>
        <Block
          marginLeft={16}
          marginRight={16}
          color={theme.colors.bg_default}
          height={168}
          borderRadius={16}>
          <Block
            justifyContent="center"
            alignItems="center"
            middle
            paddingVertical={8}>
            <Icon icon="SuccessApiIcon" size={100} />
          </Block>
          <Block justifyContent="center" alignItems="center" middle>
            <Text
              fontSize={16}
              fontWeight="500"
              lineHeight={24}
              color={theme.colors.text_primary}>
              {translate('noti:updateSuccess') as string}
            </Text>
          </Block>
        </Block>
      </Modal>
    </SafeAreaView>
  );
};

export default React.memo(ChangePassword, isEqual);
