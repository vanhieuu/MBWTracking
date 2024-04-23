import {
  Alert,
  BackHandler,
  Platform,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import React, {useCallback} from 'react';
import {AppModule, dispatch, useDisableBackHandler} from '@common';
import BackgroundGeolocation from 'react-native-background-geolocation';
import {Block, Icon, SvgIcon, Text} from '@components';
import {SafeAreaView} from 'react-native-safe-area-context';
import {AppTheme, useTheme} from '@theme';
import {translate} from '@utils';
import RNRestart from 'react-native-restart';
import {RouteProp, useRoute} from '@react-navigation/native';
import {APP_SCREENS, UnAuthenParamList} from '@navigation/screen-type';
import {loginActions} from '@store/login-reducer/reducer';

type Props = {};

const RequestPermission = () => {
  const theme = useTheme();
  const styles = rootStyles(theme);
  const data =
    useRoute<RouteProp<UnAuthenParamList, APP_SCREENS.REQUEST_PERMISSIONS>>()
      .params;

  const hasDisclosedBackgroundPermission = AppModule.storage.getString(
    '@transistorsoft:hasDisclosedBackgroundPermission',
  );
  const onDiscloseBackgroundPermission = () => {
    AppModule.storage.set(
      '@transistorsoft:hasDisclosedBackgroundPermission',
      'true',
    );
    // BackgroundGeolocation.start();
  };

  useDisableBackHandler(true);

  const onConfirmData = useCallback((data: any) => {
    console.log(data, 'data');
    BackgroundGeolocation.start();
    AppModule.storage.set('@usesr_onboarded', false);

    dispatch(loginActions.setAutoLogin(data));
    dispatch(loginActions.postLogin(data));
  }, []);

  React.useEffect(() => {
    if (Platform.OS === 'android' && !hasDisclosedBackgroundPermission) {
      // For Google Play Console Submission:  "disclosure for background permission".
      // This is just a simple one-time Alert.  This is your own responsibility to do this.
      Alert.alert(
        'Quyền truy cập vị trí',
        [
          ' MBW Tracking thu thập dữ liệu vị trí để cho phép theo dõi chuyến đi đi làm của bạn và tính toán quãng đường đã di chuyển ngay cả khi đóng hoặc không sử dụng ứng dụng',
          'Dữ liệu này sẽ được tải lên CSDL công ty bạn, nơi bạn có thể xem lịch sử vị trí của mình.',
        ].join('\n\n'),
        [
          {
            text: 'Đóng',
            onPress: () => onDiscloseBackgroundPermission(),
          },
        ],
      );
      return;
    }
  }, []);

  return (
    <SafeAreaView edges={['top', 'bottom']} style={styles.root}>
      <Block justifyContent="center" alignItems="center" block>
        <Icon icon="initLogo" size={100} />
        <Block
          marginTop={40}
          // marginBottom={}
          justifyContent="center"
          alignItems="center"
          paddingHorizontal={16}>
          <Text
            color={theme.colors.text_primary}
            fontWeight="bold"
            fontSize={17}>
            Cho phép ứng dụng dùng vị trí của bạn
          </Text>
          <Block height={8} />
          <Text
            textAlign="center"
            fontSize={13}
            lineHeight={18}
            fontWeight="500"
            color={theme.colors.text_primary}>
            Ứng dụng MBW Track thu thập dữ liệu vị trí để cho phép theo dõi lộ
            trình và gửi thông tin vị trí ngay cả khi ứng dụng bị đóng hoặc
            không sử dụng
          </Text>
        </Block>
        <Block>
          <SvgIcon source="MapRequest" size={300} />
        </Block>
      </Block>
      <Block
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        // colorTheme="success"
        height={80}>
        <TouchableOpacity
          style={styles.buttonDecideStyle}
          onPress={() => {
            BackHandler.exitApp();
            RNRestart.Restart();
            RNRestart.restart();
          }}>
          <Text
            color={theme.colors.text_secondary}
            fontWeight="bold"
            fontSize={14}
            lineHeight={24}>
            {translate('title:decide') as string}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.buttonConfirmStyle}
          onPress={() => onConfirmData(data)}>
          <Text
            color={theme.colors.bg_default}
            fontWeight="bold"
            fontSize={14}
            lineHeight={24}>
            {translate('title:accept') as string}
          </Text>
        </TouchableOpacity>
      </Block>
    </SafeAreaView>
  );
};

export default RequestPermission;

const rootStyles = (theme: AppTheme) =>
  StyleSheet.create({
    root: {
      flex: 1,
      backgroundColor: theme.colors.bg_default,
    } as ViewStyle,
    buttonConfirmStyle: {
      justifyContent: 'center',
      flex: 1,
      alignItems: 'center',
      backgroundColor: theme.colors.primary,
      height: 48,
      borderRadius: 20,
      marginHorizontal: 8,
    } as ViewStyle,
    buttonDecideStyle: {
      justifyContent: 'center',
      flex: 1,
      alignItems: 'center',
      backgroundColor: theme.colors.bg_disable,
      height: 48,
      borderRadius: 20,
      marginHorizontal: 8,
    } as ViewStyle,
  });
