import {
  Alert,
  Animated,
  AppState,
  AppStateStatus,
  Dimensions,
  Platform,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import React, {useCallback, useLayoutEffect, useRef} from 'react';
import {Text, Block, FAB, SvgIcon} from '@components';
import Mapbox, {UserTrackingMode, Location as RNLocation} from '@rnmapbox/maps';
import {MAP_TITLE_URL} from '@config/app.const';
import {AppTheme, useTheme} from '@theme';
import BackgroundGeolocation, {
  Location,
  LocationError,
  State,
} from 'react-native-background-geolocation';
import {API_EK_KEY, BASE_URL_MAP} from '@config/createApi';
import {
  AppModule,
  dispatch,
  formatTime,
  height,
  useSelector,
  useTimer,
  width,
} from '@common';
import {shallowEqual} from 'react-redux';
import BackgroundFetch from 'react-native-background-fetch';
import {SafeAreaView} from 'react-native-safe-area-context';

import MarkerItem from './components/MarkerItem';
import ContentView from './components/ContentView';
import {navigate} from '@navigation/navigation-service';
import {APP_SCREENS} from '@navigation/screen-type';
import {postLastLocation} from '@store/api';
import FastImage, {ImageStyle} from 'react-native-fast-image';
import {dataMap} from './ultil';
import ModalError from './components/ModalError';
import {appActions} from '@store/app-reducer/reducer';
import Modal from 'react-native-modal';

const MainScreen = () => {
  const theme = useTheme();
  const mapboxCameraRef = useRef<Mapbox.Camera>(null);
  const styles = rootStyles(theme);
  const appTheme = useSelector(state => state.app.theme, shallowEqual);

  //Locations
  const [location, setLocation] = React.useState<Location | any>(null);
  const [list, setList] = React.useState<any[]>([]);
  const [enabled, setEnabled] = React.useState(false);
  const [isMoving, setIsMoving] = React.useState(false);
  const [modalShow, setModalShow] = React.useState(false);
  const [modalMapShow, setModalMapShow] = React.useState(false);

  // const [updateLocations, setUpdateLocations] = React.useState<any>({});
  const [odometer, setOdometer] = React.useState<any>(0);
  const [error, setError] = React.useState(
    'Không thể lấy được vị trí GPS. Bạn nên di chuyển đến vị trí không bị che khuất và thử lại.',
  );
  const [statusError, setStatusError] = React.useState(0);
  const [mapURl, setMapURl] = React.useState<string>(MAP_TITLE_URL.adminMap);
  const [status, setStatus] = React.useState('active');
  const loginState = useSelector(
    state => state.login.loginResponse,
    shallowEqual,
  );
  console.log(Object.values(loginState.key_details), '?');
  // console.log(loginState.key_details.project_id)

  const {elapsedTime, isRunning, toggleTimer} = useTimer();
  const appState = useRef<AppStateStatus>('unknown');
  const URL =
    BASE_URL_MAP +
    'position/' +
    `${loginState.key_details.project_id}` +
    `/${loginState.key_details.object_id}` +
    `?api_key=${API_EK_KEY}`;

  const animatedValue = useRef(
    new Animated.Value(Dimensions.get('window').height),
  ).current;
  const hasDisclosedBackgroundPermission = AppModule.storage.getString(
    '@transistorsoft:hasDisclosedBackgroundPermission',
  );
  // console.log(URL)

  React.useEffect(() => {
    if (location) {
      setOdometer(location.odometer);
    } else {
      return;
    }
  }, [location, list]);

  const onDiscloseBackgroundPermission = () => {
    AppModule.storage.set(
      '@transistorsoft:hasDisclosedBackgroundPermission',
      'true',
    );
  };

  useLayoutEffect(() => {
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
            onPress: () => {
              onDiscloseBackgroundPermission();
            },
          },
        ],
      );
      return;
    }
  }, []);

  const initBackgroundGeoLocation = async () => {
    const state: State = await BackgroundGeolocation.ready({
      url: URL
        ? URL
        : 'https://api.ekgis.vn/v2/tracking/locationHistory/position/6556e471178a1db24ac1a711/655824e13a62d46bf149dced?api_key=LnJqtY8kpTY4ZxAtiT5frqPZUNxkDZBXPRSyCi7P',

      desiredAccuracy: BackgroundGeolocation.DESIRED_ACCURACY_NAVIGATION,
      distanceFilter: 10,
      stopTimeout: 5,
      locationAuthorizationRequest: 'Always',
      backgroundPermissionRationale: {
        title: 'Cho phép MBWTrack truy cập vào vị trí kể cả khi không sử dụng',
        message:
          'Ứng dụng này thu thập dữ liệu vị trí để cho phép ghi lại chuyến đi làm của bạn và tính toán khoảng cách di chuyển',
        positiveAction: 'Cho phép cấp quyền',
        negativeAction: 'Hủy bỏ',
      },
      // HTTP & Persistence
      autoSync: true,
      // autoSyncThreshold: 5,
      maxBatchSize: 50,
      batchSync: true,
      maxDaysToPersist: 14,
      // Application
      stopOnTerminate: false,
      params: {
        location: location,
      },

      enableHeadless: true,
    });
    setOdometer(state.odometer);
    setEnabled(state.enabled);
    setIsMoving(state.isMoving || false);
  };

  // const onLocation = () => {
  //   if (!location.sample) {
  //     addMarker(location);
  //   } else {
  //     return;
  //   }
  // };

  const addMarker = (location: Location | any) => {
    setLocation(location);
    setList(previous => [
      ...previous,
      [location.coords.longitude, location.coords.latitude],
    ]);
  };

  // console.log(list,'listMarker')
  React.useEffect(() => {
    // Register BackgroundGeolocation event-listeners.
    BackgroundGeolocation.getState().then((state: State) => {
      setEnabled(state.enabled);
    });
    const locationSubscriber: any = BackgroundGeolocation.onLocation(
      lo => setLocation(lo),
      error => {
        console.warn('[onLocation] ERROR: ', error);
      },
    );
    const motionChangeSubscriber: any = BackgroundGeolocation.onMotionChange(
      location => {
        setIsMoving(location.isMoving);
        setLocation(location);
      },
    );
    const notificationActionSubscriber: any =
      BackgroundGeolocation.onNotificationAction(button => {
        console.log('[onNotificationAction]', button);
      });
    initBackgroundFetch();
    initBackgroundGeoLocation();
    AppState.addEventListener('change', _handleAppStateChange);

    return () => {
      // When view is destroyed (or refreshed with dev live-reload),
      // Remove BackgroundGeolocation event-listeners.
      locationSubscriber.remove();
      motionChangeSubscriber.remove();
      clearMarkers();
      notificationActionSubscriber.remove();
    };
  }, []);

  initBackgroundGeoLocation();

  // useDeepCompareEffect(() => {}, [locations.current]);

  // console.log(motionChangeEvent,'motionChangeEvent')

  const backgroundErrorListener = useCallback(
    (errorCode: number) => {
      // Handle background location errorsc
      switch (errorCode) {
        case 0:
          setError(
            'Không thể lấy được vị trí GPS. Bạn nên di chuyển đến vị trí không bị che khuất và thử lại.',
          );
          setStatusError(0);
          setModalShow(true);
          // setEnabled(true);
          break;
        case 1:
          setError('GPS đã bị tắt. Vui lòng bật lại.');
          setStatusError(1);
          setModalShow(true);

          // setEnabled(true);
          break;
        default:
          setError(
            'Không thể lấy được vị trí GPS. Bạn nên di chuyển đến vị trí không bị che khuất và thử lại.',
          );
          setStatusError(errorCode);
          setModalShow(true);

          // setEnabled(true);
          break;
      }
    },
    [location, enabled],
  );

  const onStartTracking = async () => {
    location.extras!.startTime = new Date().toISOString();
    await postLastLocation(location);
    onClickGetCurrentPosition();
  };

  const onStopTracking = useCallback(async () => {
    location.extras!.endTime = new Date().toISOString();
    dispatch(appActions.setTravelHistory([...list]));
    await postLastLocation(location);
  }, [location]);
  const initBackgroundFetch = async () => {
    BackgroundFetch.configure(
      {
        minimumFetchInterval: 15,
        enableHeadless: true,
        stopOnTerminate: false,
      },
      async taskId => {
        const location = await BackgroundGeolocation.getCurrentPosition({
          extras: {
            event: 'background-fetch',
          },
          maximumAge: 10000,
          persist: true,
          timeout: 30,
          samples: 3,
        });
        setLocation(location);
        BackgroundFetch.finish(taskId);
      },
      async taskId => {
        console.log('[BackgroundFetch] TIMEOUT:', taskId);
        BackgroundFetch.finish(taskId);
      },
    );
  };
  const onClickEnable = async (value: boolean) => {
    let state = await BackgroundGeolocation.getState();
    setEnabled(value);
    if (value) {
      if (state.trackingMode == 1) {
        BackgroundGeolocation.start();
        onClickGetCurrentPosition();
        setIsMoving(true);
        // dispatch(appActions.getCustomerRouteAction());
      } else {
        BackgroundGeolocation.startGeofences();
      }
    } else {
      BackgroundGeolocation.stop();
      // Toggle the [ > ] / [ || ] button in bottom-toolbar back to [ > ]
      setIsMoving(false);
    }
  };

  const onClickGetCurrentPosition = () => {
    BackgroundGeolocation.getCurrentPosition({
      persist: true,
      samples: 2,
      timeout: 30,
      maximumAge: 10000,
      extras: {
        getCurrentPosition: true,
      },
    })
      .then((location: Location) => {
        console.log(location, 'get current ? ');
        setLocation(location);

        mapboxCameraRef.current?.flyTo(
          [location.coords.longitude, location.coords.latitude],
          200,
        );
      })
      .catch((error: LocationError) => {
        backgroundErrorListener(error);
      });
  };

  const _handleAppStateChange = async (nextAppState: AppStateStatus) => {
    appState.current = nextAppState;
    if (nextAppState === 'background') {
    } else {
    }
  };

  const onGetCurrentPositionAgain = () => {
    setModalShow(false);
    onClickGetCurrentPosition();
  };

  React.useEffect(() => {
    BackgroundGeolocation.getCurrentPosition({
      persist: true,
      samples: 2,
      timeout: 30,
      maximumAge: 10000,
      extras: {
        getCurrentPosition: true,
      },
    })
      .then((location: Location) => {
        setLocation(location);
        mapboxCameraRef.current?.flyTo(
          [location.coords.longitude, location.coords.latitude],
          1000,
        );
      })
      .catch((error: LocationError) => {
        backgroundErrorListener(error);
      });
  }, [enabled]);

  // console.log(sortedData(dataCustomer),'sorted Data')
  // console.log(coordinates,'coordinates')

  const startAnimation = useCallback(() => {
    Animated.timing(animatedValue, {
      toValue:
        Platform.OS === 'ios'
          ? Dimensions.get('window').height - 300
          : Dimensions.get('window').height - 250,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [status]);

  const hideAnimated = useCallback(() => {
    Animated.timing(animatedValue, {
      toValue: Dimensions.get('window').height,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }, [status]);

  const onPressStart = () => {
    if (status === 'active') {
      setStatus('inActive');
      startAnimation();
      toggleTimer();
      // BackgroundGeolocation.start();
      onStartTracking();
      setIsMoving(true);
      BackgroundGeolocation.changePace(!isMoving);
      // onClickGetCurrentPosition()
      onClickEnable(true);
    } else {
      setStatus('active');
      setList([]);
      hideAnimated();
      toggleTimer();
      onStopTracking();
      onClickEnable(false);
      BackgroundGeolocation.changePace(!isMoving);
      setIsMoving(false);
    }
  };

  // console.log(location.coords,'list')
  const clearMarkers = () => {
    setList([]);
  };

  const onUpdateLocation = useCallback(
    (location: RNLocation) => {
      addMarker(location);
      setLocation(location);
      mapboxCameraRef.current?.setCamera({centerCoordinate:[location.coords.longitude,location.coords.latitude]})
      mapboxCameraRef.current?.moveTo(
        [location?.coords?.longitude, location?.coords?.latitude],
        500,
      );
      mapboxCameraRef.current?.zoomTo(18, 200);
    },
    [location],
  );

  return (
    <SafeAreaView style={styles.root} edges={['bottom']}>
      <TouchableOpacity
        style={styles.buttonTopLeft}
        onPress={() => navigate(APP_SCREENS.ACCOUNT_SETTINGS)}>
        <Block
          colorTheme="white"
          width={40}
          height={40}
          borderRadius={16}
          alignItems="center"
          justifyContent="center">
          <SvgIcon size={24} source="IconHamburger" />
        </Block>
      </TouchableOpacity>
      <Block style={styles.mapView}>
        <Mapbox.MapView
          pitchEnabled={false}
          attributionEnabled={false}
          scaleBarEnabled={false}
          zoomEnabled
          onDidFinishLoadingMap={onClickGetCurrentPosition}
          scrollEnabled
          logoEnabled={false}
          styleURL={mapURl}
          style={styles.mapView}>
          <Mapbox.Camera
            ref={mapboxCameraRef}
            animationMode={'flyTo'}
            followUserMode={UserTrackingMode.Follow}
            followPitch={40}
            animationDuration={500}
            zoomLevel={18}
          />
          <Mapbox.UserLocation
            visible={true}
            animated
            androidRenderMode="gps"
            minDisplacement={5}
            onUpdate={onUpdateLocation}
            showsUserHeadingIndicator={true}
            requestsAlwaysUse={true}
          />
          {/* <Poly */}

          {list && list.length > 0
            ? list.map((marker, index) => {
                return (
                  <Mapbox.MarkerView key={index.toString()} coordinate={marker}>
                    <MarkerItem index={index} />
                  </Mapbox.MarkerView>
                );
              })
            : null}
        </Mapbox.MapView>
        {status != 'active' && (
          <>
            <FAB
              type="default"
              icon="Subject"
              style={styles.buttonGetCurrent(status)}
              onPress={() => setModalMapShow(true)}
            />
            <FAB
              type="default"
              icon="CurrentLocation"
              style={styles.buttonGetCurrent2(status)}
              onPress={onClickGetCurrentPosition}
            />
          </>
        )}
      </Block>
      <TouchableOpacity
        style={styles.startTracking(status)}
        onPress={onPressStart}>
        <Text
          fontSize={14}
          fontWeight="500"
          colorTheme="white"
          lineHeight={24}
          fontFamily="medium">
          {' '}
          {status === 'active' ? 'Bắt đầu' : 'Kết thúc'}
        </Text>
      </TouchableOpacity>
      <Animated.View
        style={[styles.bottomView, {transform: [{translateY: animatedValue}]}]}>
        <Block
          direction="row"
          alignItems="center"
          paddingHorizontal={16}
          justifyContent="space-between">
          <ContentView
            title="Quãng đường (km)"
            icon="IconMapping"
            value={Math.round(odometer / 1000)}
          />
          <ContentView
            title="Thời gian (phút)"
            icon="IconClock"
            value={formatTime(elapsedTime)}
          />
        </Block>
        <Block
          marginTop={8}
          direction="row"
          paddingHorizontal={16}
          alignItems="center"
          justifyContent="space-between">
          <ContentView
            title="Vận tốc (km/h)"
            icon="IconOdometer"
            value={
              location?.coords?.speed > 0
                ? Math.round(location.coords.speed! * 3.6)
                : 0
            }
          />
          <ContentView
            title="Phần trăm pin (%)"
            icon="IconBattery"
            value={
              location && location?.battery?.level
                ? location?.battery.level < 0
                  ? -location?.battery.level * 100
                  : Math.round(location?.battery.level * 100)
                : 0
            }
          />
        </Block>
      </Animated.View>
      <ModalError
        modalShow={modalShow}
        onGetCurrentPositionAgain={onGetCurrentPositionAgain}
        theme={theme}
        error={error}
      />
      <Modal
        isVisible={modalMapShow}
        backdropOpacity={0.5}
        onBackButtonPress={() => setModalMapShow(false)}
        onBackdropPress={() => setModalMapShow(false)}
        style={{marginHorizontal: 0}}
        animationIn="slideInUp"
        animationOut="slideOutDown">
        <Block
          colorTheme="white"
          height={height / 3}
          borderTopLeftRadius={16}
          borderTopRightRadius={16}
          justifyContent="flex-start"
          top={320}>
          <Block direction="row" paddingVertical={8}>
            <TouchableOpacity onPress={() => setModalMapShow(false)}>
              <Block paddingLeft={16}>
                <SvgIcon source="CloseIcon" size={24} />
              </Block>
            </TouchableOpacity>
            <Block block alignSelf="center" justifyContent="center">
              <Text
                textAlign="center"
                fontSize={18}
                fontWeight="bold"
                colorTheme="text_primary">
                Loại bản đồ
              </Text>
            </Block>
          </Block>
          <Block
            justifyContent="space-between"
            marginTop={20}
            block
            direction="row">
            {dataMap.map((item, index) => {
              return (
                <Block block alignItems="center" key={index}>
                  <TouchableOpacity
                    style={styles.onSelectMapView()}
                    onPress={() => {
                      setMapURl(item.mapURl);
                    }}>
                    <FastImage
                      source={item.image}
                      resizeMode="cover"
                      style={styles.imageStyle(mapURl, item.mapURl)}
                    />
                  </TouchableOpacity>
                  <Block marginTop={8}>
                    <Text
                      fontSize={14}
                      colorTheme={
                        mapURl != item.mapURl ? 'text_primary' : 'action'
                      }>
                      {item.title}
                    </Text>
                  </Block>
                </Block>
              );
            })}
          </Block>
        </Block>
      </Modal>
    </SafeAreaView>
  );
};

export default MainScreen;

const rootStyles = (theme: AppTheme) =>
  StyleSheet.create({
    root: {
      flex: 1,
    } as ViewStyle,
    mapView: {
      width: '100%',
      height: '100%',
      zIndex: 20000,
      position: 'absolute',
    } as ViewStyle,
    onSelectMapView: (select?: any) =>
      ({
        width: 80,
        height: 80,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: theme.colors.border,
        justifyContent: 'center',
        alignItems: 'center',
        // marginHorizontal: 16,
      } as ViewStyle),

    buttonGetCurrent: (status: string) =>
      ({
        backgroundColor: 'white',
        position: 'absolute',
        bottom:
          status != 'active' ? Dimensions.get('window').height / 2.1 + 10 : 170,
        zIndex: 99999999,
      } as ViewStyle),
    buttonGetCurrent2: (status: string) =>
      ({
        backgroundColor: 'white',
        bottom:
          status != 'active' ? Dimensions.get('window').height / 2.5 : 100,
        zIndex: 99999999,
      } as ViewStyle),
    startTracking: (status: string) =>
      ({
        width: '90%',
        // flex:1,
        marginHorizontal: 22,
        backgroundColor:
          status === 'active' ? theme.colors.success : theme.colors.error,
        height: 48,
        position: 'absolute',
        zIndex: 999999,
        bottom: 40,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        opacity: 1,
        // top:0
      } as ViewStyle),
    bottomView: {
      height: 400,
      width: '100%',
      position: 'relative',
      zIndex: 90000,
      borderTopLeftRadius: 28,
      paddingTop: 20,
      borderTopRightRadius: 28,
      justifyContent: 'flex-start',
      alignItems: 'center',
      backgroundColor: theme.colors.white,
      flex: 1,
    } as ViewStyle,
    buttonTopLeft: {
      position: 'absolute',
      top: 10,
      left: 0,
      right: 20,
      zIndex: 90000,
      marginLeft: 20,
      marginTop: 40,
    } as ViewStyle,
    buttonModal: {
      flex: 1,
      backgroundColor: theme.colors.primary,
      height: 40,
      borderRadius: 8,
      marginRight: 8,
      marginTop: 16,
      justifyContent: 'center',
      alignItems: 'center',
    } as ViewStyle,
    buttonCancelModal: {
      flex: 1,
      backgroundColor: theme.colors.bg_default,
      height: 40,
      borderRadius: 8,
      marginRight: 8,
      marginTop: 16,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: theme.colors.action,
    } as ViewStyle,
    imageStyle: (mapURL: string, currentURL: string) =>
      ({
        width: 80,
        height: 80,
        borderWidth: 1,
        borderColor:
          mapURL != currentURL ? theme.colors.border : theme.colors.action,
        borderRadius: 16,
      } as ImageStyle),
  });
