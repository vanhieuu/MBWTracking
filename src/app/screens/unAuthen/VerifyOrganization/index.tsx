import React, {useCallback, useEffect} from 'react';
import {Block, Icon, LangItem, Text, showSnack} from '@components';
import {useTheme} from '@theme';
import {rootStyles} from './style';

import {useMMKVObject, useMMKVString} from 'react-native-mmkv';
import {
  LANG_LIST,
  LanguageItemType,
  Language_Code,
  IResOrganization,
  Organization,
} from '@config/app.const';
import FormVerifyOrganization from './component/formVerify';
import {apiVerifyOrganization} from '@store/api/loginApi';
import {AppModule, ResponseGenerator, dispatch} from '@common';
import {navigate} from '@navigation/navigation-service';
import {APP_SCREENS} from '@navigation/screen-type';
import {loginActions} from '@store/login-reducer/reducer';
import {STT_OK} from '@config/api.const';
import {TouchableOpacity} from 'react-native';
import i18n from '@library/utils/i18n/i18n';
import Modal from 'react-native-modal';
import { translate } from '@utils';
// import {dispatch} from '@common';

type Props = {};

const SelectOrganization = () => {
  const theme = useTheme();
  const styles = rootStyles(theme);
  const [langCode, setLangCode] = useMMKVString(Language_Code ?? 'vi');
  const [langData, setLangData] = React.useState<LanguageItemType[]>(LANG_LIST);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [_, setOrganization] = useMMKVObject<IResOrganization>(Organization);
  const [show, setShow] = React.useState(false);
  const handleChangeLang = () => {
    setShow(!show);
  };
  

  const onConfirmData = async (data: any) => {
    setLoading(true);
    const result: ResponseGenerator = await apiVerifyOrganization({
      organization: data,
    });
    if (result.status === STT_OK) {
      navigate(APP_SCREENS.LOGIN, {
        organizationName: data,
      });
      dispatch(loginActions.setResponseOrganization(result.data.result));
      setOrganization(result.data.result);
      setLoading(false);
    } else {
      setLoading(false);
      showSnack({
        msg: translate('error:errorLogin') as string,
        type: 'error',
        interval: 2000,
      });
    }

    // console.log(dispatch(appActions.postOrganization(data)),'bcc');
    // console.log(data, 'datva');
  };

  const onSelectItem = (id: string, code: string) => {
    const newLangData = langData.map(item => {
      if (item.id === id) {
        return {...item, isSelected: true};
      } else {
        return {...item, isSelected: false};
      }
    });
    setLangData(newLangData);
    setLangCode(code);

    i18n.changeLanguage(code);
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

  useEffect(() => {
    if (!langCode) {
      setLangCode('vi');
    }
    const newData = langData.map(item => {
      if (item.code === langCode) {
        return {...item, isSelected: true};
      } else {
        return {...item, isSelected: false};
      }
    });
    setLangData(newData);
  }, [langCode]);

  return (
    <Block block>
      {/* <Block block /> */}
      <Block justifyContent="center" alignItems="center" block>
        <Icon size={100} icon="initLogo" />
        <LangItem
          flagSource={langCode === 'vi' ? 'VNFLag' : 'ENFlag'}
          onPress={() => handleChangeLang()}
          styles={{marginTop: 24}}
        />
      </Block>
      <FormVerifyOrganization onConfirmData={onConfirmData} loading={loading} />
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
    </Block>
  );
};

export default SelectOrganization;
