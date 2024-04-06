import React, {useEffect} from 'react';
import {Block, Icon, LangItem, showSnack} from '@components';
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
import {ResponseGenerator, dispatch, getState} from '@common';
import {navigate} from '@navigation/navigation-service';
import {APP_SCREENS} from '@navigation/screen-type';
import {loginActions} from '@store/login-reducer/reducer';
import { STT_OK } from '@config/api.const';
// import {dispatch} from '@common';

type Props = {};

const SelectOrganization = () => {
  const theme = useTheme();
  const styles = rootStyles(theme);
  const [langCode, setLangCode] = useMMKVString(Language_Code ?? 'vi');
  const [langData, setLangData] = React.useState<LanguageItemType[]>(LANG_LIST);
  // const [_, setOrganization] = useMMKVObject<IResOrganization>(Organization);
  const handleChangeLang = () => {};

  const onConfirmData = async (data: any) => {
    console.log(data, 'data pass');
    const result: ResponseGenerator = await apiVerifyOrganization(data);
    console.log(result.status);
    if (result.status === STT_OK) {
      navigate(APP_SCREENS.LOGIN, {
        organizationName: data,
      });
      console.log('run bitch ')
      dispatch(loginActions.setResponseOrganization(result.data.result));
      // setOrganization(result.data.result);
      
    } else {
      showSnack({
        msg: 'Có lỗi xảy ra, vui lòng thử lại',
        type: 'error',
        interval: 2000,
      });
    }
    // console.log(dispatch(appActions.postOrganization(data)),'bcc');
    // console.log(data, 'datva');
  };




  
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
      <FormVerifyOrganization onConfirmData={onConfirmData} />
    </Block>
  );
};

export default SelectOrganization;
