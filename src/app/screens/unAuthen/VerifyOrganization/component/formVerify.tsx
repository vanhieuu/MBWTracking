import {
  ActivityIndicator,
  Alert,
  Keyboard,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import {AppInput, Block, Icon, Text} from '@components';
// import {useTranslation} from 'react-i18next';
// import {TextInput} from 'react-native-paper';
import {useTheme} from '@theme';

import {formStyle} from '../style';

type Props = {
  onConfirmData: (data: any) => void;
  loading: boolean;
};

const FormVerifyOrganization = ({onConfirmData, loading}: Props) => {
  const theme = useTheme();
  const styles = formStyle(theme);
  // const [value, setValue] = React.useState('');
  const [organizationName, setOrganizationName] = React.useState<string>('');
  // const {t: getLabel, i18n} = useTranslation();

  return (
    <Block block paddingHorizontal={16}>
      <AppInput
        styles={{marginVertical: 20}}
        label={'Tên tổ chức'}
        value={organizationName}
        onChangeValue={setOrganizationName}
        rightIcon={
          <Icon
            icon={'Scanner'}
            size={20}
            // colorTheme='black'
            color={theme.colors.primary}
            onPress={() => {
              Keyboard.dismiss();
              // sleep(200).then(() => navigate(APP_SCREENS.AUTHORIZED));
              Alert.alert('Tính năng đang được cập nhật');
            }}
          />
        }
      />
      <Block>
        <TouchableOpacity
          style={styles.button(organizationName)}
          onPress={() => onConfirmData(organizationName)}
          disabled={loading}>
          {loading ? (
            <ActivityIndicator size="large" color={theme.colors.action} />
          ) : (
            <Text
              fontSize={16}
              colorTheme="white"
              lineHeight={24}
              fontWeight="700">
              Tiếp tục
            </Text>
          )}
        </TouchableOpacity>
      </Block>
    </Block>
  );
};

export default FormVerifyOrganization;

const styles = StyleSheet.create({});
