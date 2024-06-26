import {Animated, Dimensions, TouchableOpacity, View} from 'react-native';
import React, {useCallback, useRef, useState} from 'react';
import {Block, Text, AppHeader, Icon} from '@components';
import isEqual from 'react-fast-compare';
import {UserInforType, dispatch, useSelector} from '@common';
import {shallowEqual} from 'react-redux';
import {appActions} from '@store/app-reducer/reducer';
import {ActivityIndicator} from 'react-native-paper';
import {useTheme} from '@theme';
import {SafeAreaView} from 'react-native-safe-area-context';
import {rootStyles} from './style';
import HeaderAvatar from './component/HeaderAvatar';
import {listItem} from './type';
import Item from './component/Item';
import {loginActions} from '@store/login-reducer/reducer';
import {LANG_LIST, LanguageItemType, Language_Code} from '@config/app.const';

import {useMMKVString} from 'react-native-mmkv';
import Modal from 'react-native-modal';
import i18n from '@library/utils/i18n/i18n';
import { translate } from '@utils';

type Props = {};

const AccountScreen = (props: Props) => {
  const userInfor: UserInforType = useSelector(
    state => state.app.userProfile,
    shallowEqual,
  );
  const [show, setShow] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [langData, setLangData] = React.useState<LanguageItemType[]>(LANG_LIST);
  const [langCode, setLangCode] = useMMKVString(Language_Code ?? 'vi');
  const [status, setStatus] = useState<string>('inActive');
  const theme = useTheme();
  const styles = rootStyles(theme);

  const onPressLanguage = useCallback(() => {
    console.log(status, 'onPress change lang');
    setShow(prev => !prev);
  }, [langCode]);

  const onSelectItem = async (id: string, code: string) => {
    // hideAnimation();
  
    const newLangData = langData.map(item => {
      if (item.id === id) {
        return {...item, isSelected: true};
      } else {
        return {...item, isSelected: false};
      }
    });
    setLangData(newLangData);
    setLangCode(code);

    await i18n.changeLanguage(code);
  };

  React.useEffect(() => {
    setLoading(true);
    if (Object.keys(userInfor).length > 0) {
      console.log('run first');
      dispatch(appActions.getUserInfor());

      return setLoading(false);
    } else {
      dispatch(appActions.getUserInfor());
      console.log('run second');
      return setLoading(false);
    }
  }, []);

  const onLogout = () => {
    dispatch(loginActions.setResponseLogin({}));
    dispatch(loginActions.setResponseOrganization({}));
    // AppModule.storage.set(Organization, '');
  };

  const renderBottomView = useCallback(
    (item: LanguageItemType, index: number) => {
      return (
        <TouchableOpacity
          key={index}
          style={styles.langSelectButton}
          onPress={() => onSelectItem(item.id, item.code)}>
          <Block
            direction="row"
            // colorTheme='action'
            paddingHorizontal={16}
            alignItems="center"
            block
            justifyContent="flex-start">
            <Icon icon={item.image} size={24} resizeMode="contain" />
            <Block marginLeft={8}>
              <Text fontSize={16} colorTheme="text_primary">
                {translate(item.label) as string}
              </Text>
            </Block>
          </Block>
          {item.isSelected ? (
            <Icon
              icon="Check"
              colorTheme="primary"
              size={24}
              resizeMode="contain"
            />
          ) : (
            <Block width={24} height={24} />
          )}
        </TouchableOpacity>
      );
    },
    [langCode],
  );

  return loading ? (
    <Block justifyContent="center" alignItems="center" block>
      <ActivityIndicator size={'large'} color={theme.colors.primary} />
    </Block>
  ) : (
    <SafeAreaView style={styles.root}>
      <AppHeader />
      <Block block>
        <HeaderAvatar userInfor={userInfor} />
        <Block
          collapsable={false}
          colorTheme="bg_default"
          marginLeft={16}
          marginRight={16}
          borderRadius={10}>
          <Block paddingHorizontal={16}>
            {listItem.map((item, index) => {
              return (
                <Item
                  data={item}
                  key={index}
                  langCode={langCode}
                  status={status}
                  onPressChangeLang={onPressLanguage}
                />
              );
            })}
          </Block>
        </Block>
        <Block justifyContent="center" marginTop={64}>
          <TouchableOpacity
            style={styles.logoutButton}
            onPress={() => onLogout()}>
            <Text
              colorTheme="error"
              fontSize={16}
              fontWeight="500"
              lineHeight={24}>
              Đăng xuất
            </Text>
          </TouchableOpacity>
        </Block>
      </Block>
      <Modal
        isVisible={show}
        backdropOpacity={0.5}
        onBackButtonPress={() => {
          setShow(prev => !prev);
        }}
        style={{marginHorizontal: 0}}
        onBackdropPress={() => {
          setShow(prev => !prev);
        }}
        animationIn="slideInUp"
        animationOut="slideOutDown">
        <Block
          colorTheme="white"
          height={200}
          borderTopLeftRadius={16}
          borderTopRightRadius={16}
          justifyContent="flex-start"
          top={320}>
          {langData.map((item, index) => {
            return renderBottomView(item, index);
          })}
        </Block>
      </Modal>
      {/* <Animated.View
        ref={viewRef}
        collapsable={Platform.OS === 'android' && false}
        style={[styles.bottomView, {transform: [{translateY: animatedValue}]}]}>
        {langData.map((item, index) => {
          return renderBottomView(item, index);
        })}
      </Animated.View> */}
    </SafeAreaView>
  );
};

export default React.memo(AccountScreen, isEqual);
