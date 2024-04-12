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
import {Text, Block, FAB, SvgIcon, Modal, Icon} from '@components';
import Mapbox from '@rnmapbox/maps';
import {MAP_TITLE_URL} from '@config/app.const';
import {AppTheme, useTheme} from '@theme';
import BackgroundGeolocation, {
  Geofence,
  GeofenceEvent,
  GeofencesChangeEvent,
  Location,
  LocationError,
  MotionChangeEvent,
  State,
} from 'react-native-background-geolocation';
import {API_EK_KEY, BASE_URL_MAP} from '@config/createApi';
import {
  AppModule,
  ListCustomerRouter,
  calculateDistance,
  computeOffsetCoordinate,
  dispatch,
  formatTime,
  getBearing,
  useDeepCompareEffect,
  useSelector,
  useTimer,
} from '@common';
import {shallowEqual} from 'react-redux';
import BackgroundFetch from 'react-native-background-fetch';
import {SafeAreaView} from 'react-native-safe-area-context';
import {appActions} from '@store/app-reducer/reducer';
import MarkerItem from './components/MarkerItem';
import ContentView from './components/ContentView';
import {navigate} from '@navigation/navigation-service';
import {APP_SCREENS} from '@navigation/screen-type';
import {postLastLocation} from '@store/api';
import {useMMKV} from 'react-native-mmkv';

const UNDEFINED_LOCATION = {
  timestamp: '',
  latitude: 0,
  longitude: 0,
};

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
  // const [updateLocations, setUpdateLocations] = React.useState<any>({});
  const [geofences, setGeofences] = React.useState<any[]>([]);
  const [odometer, setOdometer] = React.useState<any>(0);
  const [polygonGeofences, setPolygonGeofences] = React.useState<any[]>([]);
  const [geofenceEvent, setGeofenceEvent] =
    React.useState<GeofenceEvent | null>(null);
  const [geofencesChangeEvent, setGeofencesChangeEvent] =
    React.useState<GeofencesChangeEvent | null>(null);
  const [motionChangeEvent, setMotionChangeEvent] =
    React.useState<MotionChangeEvent | null>(null);
  const [geofencesHit, setGeofencesHit] = React.useState<any[]>([]);
  const [geofencesHitEvents, setGeofenceHitEvents] = React.useState<any[]>([]);
  const [coordinates, setCoordinates] = React.useState<any[]>([]);
  const [lastMotionChangeEvent, setLastMotionChangeEvent] = React.useState<
    MotionChangeEvent | any
  >(null);
  const [stopZones, setStopZones] = React.useState<any[]>([]);
  const [stationaryLocation, setStationaryLocation] =
    React.useState(UNDEFINED_LOCATION);

  /// Creating a polygon geofence

  //string errors
  const [error, setError] = React.useState(
    'Không thể lấy được vị trí GPS. Bạn nên di chuyển đến vị trí không bị che khuất và thử lại.',
  );
  const [statusError, setStatusError] = React.useState(0);
  const [status, setStatus] = React.useState('active');
  const loginState = useSelector(
    state => state.login.loginResponse,
    shallowEqual,
  );

  const {elapsedTime, isRunning, toggleTimer} = useTimer();
  const appState = useRef<AppStateStatus>('unknown');
  const URL = useRef<string>(
    BASE_URL_MAP +
      'position/' +
      `${loginState.projectId ?? '6600fdbb9058b549ce243e5b'}` +
      `/${loginState.objectId ?? '65eadedc973f307f60fdd6ed'}` +
      `?api_key=${API_EK_KEY}`,
  );
  const animatedValue = useRef(
    new Animated.Value(Dimensions.get('window').height),
  ).current;
  const subscriptions = useRef<any[]>([]);
  const hasDisclosedBackgroundPermission = AppModule.storage.getString(
    '@transistorsoft:hasDisclosedBackgroundPermission',
  );

  React.useEffect(() => {
    if (location) {
      setOdometer(location.odometer);
    } else {
      return;
    }
  }, [location]);
  // React.useEffect(() => {
  //   onEnabledChange();
  // }, [enabled]);
  const subscribe = useCallback((subscription: any) => {
    subscriptions.current.push(subscription);
  }, []);

  const unsubscribe = () => {
    subscriptions.current.forEach((subscription: any) => subscription.remove());
    subscriptions.current.splice(0, subscriptions.current.length);
  };

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
      url: URL.current
        ? URL.current
        : 'https://api.ekgis.vn/v2/tracking/locationHistory/position/6556e471178a1db24ac1a711/655824e13a62d46bf149dced?api_key=LnJqtY8kpTY4ZxAtiT5frqPZUNxkDZBXPRSyCi7P',

      desiredAccuracy: BackgroundGeolocation.DESIRED_ACCURACY_NAVIGATION,
      distanceFilter: 10,
      stopTimeout: 5,
      locationAuthorizationRequest: 'Always',
      backgroundPermissionRationale: {
        title:
          'Cho phép MBWTracking truy cập vào vị trí kể cả khi không sử dụng',
        message:
          'Ứng dụng này thu thập dữ liệu vị trí để cho phép ghi lại chuyến đi làm của bạn và tính toán khoảng cách di chuyển',
        positiveAction: 'Cho phép cấp quyền',
        negativeAction: 'Hủy bỏ',
      },
      // HTTP & Persistence
      autoSync: true,
      // autoSyncThreshold: 5,
      maxBatchSize: 50,
      batchSync: false,
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

  const onLocation = () => {
    if (!location.sample) {
      addMarker(location);
      // setList(prev => [...prev, location]);
    }
  };

  const addMarker = (location: Location) => {
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
    subscribe(
      BackgroundGeolocation.onLocation(setLocation, error => {
        console.warn('[onLocation] ERROR: ', error);
      }),
    );

    // For printing odometer in bottom toolbar.
    const locationSubscriber: any = BackgroundGeolocation.onLocation(
      setLocation,
      error => {
        console.warn('[onLocation] ERROR: ', error);
      },
    );
    // Auto-toggle [ play ] / [ pause ] button in bottom toolbar on motionchange events.
    const motionChangeSubscriber: any = BackgroundGeolocation.onMotionChange(
      location => {
        setIsMoving(location.isMoving);
        setMotionChangeEvent(location);
      },
    );
    // For printing the motion-activity in bottom toolbar.

    const notificationActionSubscriber: any =
      BackgroundGeolocation.onNotificationAction(button => {
        console.log('[onNotificationAction]', button);
      });

    // Configure BackgroundFetch (optional)
    initBackgroundFetch();

    // Configure BackgroundGeolocation.ready().
    initBackgroundGeoLocation();

    // Boilerplate authorization-listener for tracker.transistorsoft.com (nothing interesting)
    // registerTransistorAuthorizationListener(navigation);

    AppState.addEventListener('change', _handleAppStateChange);

    return () => {
      // When view is destroyed (or refreshed with dev live-reload),
      // Remove BackgroundGeolocation event-listeners.
      locationSubscriber.remove();
      motionChangeSubscriber.remove();
      clearMarkers();
      notificationActionSubscriber.remove();
      unsubscribe();
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
    console.log(location.coords, 'coords start tracking');
    setList([
      [Number(location.coords.longitude), Number(location.coords.latitude)],
    ]);
    await mapboxCameraRef.current?.flyTo(
      [location.coords.longitude, location.coords.latitude],
      500,
    );
    await mapboxCameraRef.current?.zoomTo(18, 500);
  };

  const onStopTracking = useCallback(async () => {
    location.extras!.endTime = new Date().toISOString();
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

  const onMotionChange = useCallback(async () => {
    let location = motionChangeEvent?.location;

    // console.log(motionChangeEvent?.isMoving,'isMoving')
    if (motionChangeEvent?.isMoving) {
      if (lastMotionChangeEvent) {
        setStopZones(previous => [
          ...previous,
          {
            coordinate: {
              latitude: lastMotionChangeEvent.location.coords.latitude,
              longitude: lastMotionChangeEvent.location.coords.longitude,
            },
            key: lastMotionChangeEvent.location.timestamp,
          },
        ]);
      }
      setLocation(motionChangeEvent.location);

      setList(prev => [
        ...prev,
        [
          motionChangeEvent.location.coords.longitude,
          motionChangeEvent.location.coords.latitude,
        ],
      ]);
      // console.log(location,'location')
      setOdometer(motionChangeEvent.location.odometer);
      setStationaryLocation(UNDEFINED_LOCATION);
    } else {
      let state = await BackgroundGeolocation.getState();
      setStationaryLocation({
        timestamp: location?.timestamp!,
        latitude: location?.coords.latitude!,
        longitude: location?.coords.longitude!,
      });
    }
    setLastMotionChangeEvent(motionChangeEvent);
  }, [location]);

  React.useEffect(() => {
    if (!geofenceEvent) return;
    onGeofence();
  }, [geofenceEvent]);
  React.useEffect(() => {
    if (!location) return;
    onLocation();
  }, [location]);

  React.useEffect(() => {
    if (!motionChangeEvent) return;
    onMotionChange();
  }, [motionChangeEvent, location]);
  // console.log(location,'motionChangeEvent');

  React.useEffect(() => {
    if (!geofencesChangeEvent) return;
    onGeofencesChange();
  }, [geofencesChangeEvent]);

  const onClickEnable = async (value: boolean) => {
    let state = await BackgroundGeolocation.getState();
    console.log(state.trackingMode, 'trackingMode');
    setEnabled(value);
    if (value) {
      if (state.trackingMode == 1) {
        BackgroundGeolocation.start();
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
        setLocation(location);
        if (location && location.coords.speed! > 0) {
          setIsMoving(true);
        }

        mapboxCameraRef.current?.flyTo(
          [location.coords.longitude, location.coords.latitude],
          500,
        );
        mapboxCameraRef.current?.zoomTo(18, 500);
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

  const onBackButton = useCallback(() => {
    setModalShow(false);
    // onClickGetCurrentPosition();
  }, [statusError]);

  const onGetCurrentPositionAgain = () => {
    setModalShow(false);
    onClickGetCurrentPosition();
  };

  useDeepCompareEffect(() => {
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
        console.log('[getCurrentPosition] success: ', location);
      })
      .catch((error: LocationError) => {
        backgroundErrorListener(error);
        console.warn('[getCurrentPosition] error: ', error);
      });
  }, [isMoving, enabled]);

  // console.log(sortedData(dataCustomer),'sorted Data')
  // console.log(coordinates,'coordinates')
  const onGeofence = () => {
    const location: Location | any = geofenceEvent?.location;
    // Push our geofence event coordinate onto the Polyline -- BGGeo deosn't fire onLocation for geofence events.
    setCoordinates(previous => [
      ...previous,
      {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      },
    ]);

    const marker = geofences.find((m: any) => {
      return m.identifier === geofenceEvent?.identifier;
    });

    if (!marker) {
      return;
    }

    //marker.fillColor = GEOFENCE_STROKE_COLOR_ACTIVATED;
    //marker.strokeColor = GEOFENCE_STROKE_COLOR_ACTIVATED;

    const coords = location.coords;

    let hit = geofencesHit.find((hit: any) => {
      return hit.identifier === geofenceEvent?.identifier;
    });

    if (!hit) {
      hit = {
        identifier: geofenceEvent?.identifier,
        radius: marker.radius,
        center: {
          latitude: marker.center.latitude,
          longitude: marker.center.longitude,
        },
        events: [],
      };
      setGeofencesHit(previous => [...previous, hit]);
    }
    // Get bearing of location relative to geofence center.
    const bearing = getBearing(marker.center, location.coords);
    const edgeCoordinate = computeOffsetCoordinate(
      marker.center,
      marker.radius,
      bearing,
    );
    const record = {
      coordinates: [
        edgeCoordinate,
        {latitude: coords.latitude, longitude: coords.longitude},
      ],
      heading: location.coords.heading,
      action: geofenceEvent?.action,
      key:
        geofenceEvent?.identifier +
        ':' +
        geofenceEvent?.action +
        ':' +
        location.timestamp,
    };
    setGeofenceHitEvents(previous => [...previous, record]);
  };

  const createGeofenceMarker = (geofence: Geofence) => {
    return {
      radius: geofence.radius,
      center: {
        latitude: geofence.latitude,
        longitude: geofence.longitude,
      },
      identifier: geofence.identifier,
      vertices: geofence.vertices,
    };
  };
  const createPolygonGeofenceMarker = (geofence: Geofence) => {
    return {
      identifier: geofence.identifier,
      coordinates: geofence.vertices?.map(vertex => {
        return {
          latitude: vertex[0],
          longitude: vertex[1],
        };
      }),
    };
  };
  // console.log(listLocationMarkers.current,';listLocation')

  const onGeofencesChange = () => {
    let on: any = geofencesChangeEvent?.on;
    let off: any = geofencesChangeEvent?.off;

    // Filter out all "off" geofences.
    let geofencesOn = geofences.filter((geofence: Geofence) => {
      return off.indexOf(geofence.identifier) < 0;
    });
    let polygonsOn = polygonGeofences.filter((geofence: Geofence) => {
      return off.indexOf(geofence.identifier) < 0;
    });

    // Add new "on" geofences.
    on.forEach((geofence: Geofence) => {
      const circularGeofenceMarker = geofencesOn.find((m: Geofence) => {
        return m.identifier === geofence.identifier;
      });
      if (!circularGeofenceMarker) {
        geofencesOn.push(createGeofenceMarker(geofence));
      }
      if (geofence.vertices!.length > 0) {
        const polygonGeofenceMarker = polygonsOn.find((m: Geofence) => {
          return m.identifier === geofence.identifier;
        });
        if (!polygonGeofenceMarker) {
          polygonsOn.push(createPolygonGeofenceMarker(geofence));
        }
      }
    });
    setGeofences(geofencesOn);
    setPolygonGeofences(polygonsOn);
  };

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

  const onPressStart = useCallback(() => {
    if (status === 'active') {
      setStatus('inActive');
      startAnimation();
      toggleTimer();
      BackgroundGeolocation.start();
      onStartTracking();
      setIsMoving(true);
      BackgroundGeolocation.changePace(!isMoving);
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
      // listLocationMarkers.current = [];
      BackgroundGeolocation.stop();

      // startAnimation();
    }
  }, [status]);

  // console.log(elapsedTime,'elap')
  // console.log(sortedData(dataCustomer), 'bbb');
  const clearMarkers = () => {
    setCoordinates([]);
    setStopZones([]);
    setGeofences([]);
    setPolygonGeofences([]);
    setGeofencesHit([]);
    setGeofenceHitEvents([]);
    setGeofenceEvent(null);
  };

  // useLayoutEffect(() =>{

  // },[listLocationMarkers.current])

  // console.log(list,'list')
  // console.log(updateLocations,'update Locations')
  // console.log(motionChangeEvent,'motion change')
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
          scrollEnabled
          
          logoEnabled={false}
          // styleURL={
          //   appTheme === 'dark'
          //     ? MAP_TITLE_URL.nightMap
          //     : Mapbox.StyleURL.Street
          // }
          styleURL={MAP_TITLE_URL.adminMap}
          style={styles.mapView}>
          <Mapbox.Camera
            ref={mapboxCameraRef}
            // followUserLocation

            centerCoordinate={[
              location && location.coords.longitude,
              location && location.coords.latitude,
            ]}
            animationMode={'flyTo'}
            // animationDuration={500}
            // zoomLevel={20}
          />
          <Mapbox.UserLocation
            visible={true}
            animated
            androidRenderMode="gps"
            minDisplacement={5}
            showsUserHeadingIndicator={true}
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

          {/* <Mapbox.RasterSource
            id="adminmap"
            tileUrlTemplates={[MAP_TITLE_URL.nightMap]}>
            <Mapbox.RasterLayer
              id={'adminmap'}
              sourceID={'admin'}
              style={{visibility: 'visible'}}
            />
          </Mapbox.RasterSource> */}

          {/* <Block zIndex={99999} position='absolute'> */}
        </Mapbox.MapView>

        <FAB
          type="default"
          icon="Subject"
          style={styles.buttonGetCurrent(status)}
        />
        <FAB
          type="default"
          icon="CurrentLocation"
          style={styles.buttonGetCurrent2(status)}
          onPress={onClickGetCurrentPosition}
        />
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
              isMoving && location?.coords.speed > 0
                ? Math.round(motionChangeEvent?.location.coords.speed! * 3.6)
                : 0
            }
          />
          <ContentView
            title="Phần trăm pin (%)"
            icon="IconBattery"
            value={
              location?.battery.level
                ? location?.battery.level < 0
                  ? -location?.battery.level * 100
                  : Math.round(location?.battery.level * 100)
                : 0
            }
          />
        </Block>
      </Animated.View>
      <Modal
        isVisible={modalShow}
        backdropOpacity={0.5}
        onBackButtonPress={() => {}}
        onBackdropPress={() => {}}
        animatedIn="slideInUp"
        animatedOut="slideOutDown">
        <Block
          colorTheme="bg_default"
          height={230}
          marginLeft={16}
          marginRight={16}
          borderRadius={16}>
          <Block justifyContent="center" alignItems="center" marginTop={8}>
            <Icon icon="ErrorApiIcon" size={100} />
          </Block>
          <Block justifyContent="center" paddingVertical={8}>
            <Text
              textAlign="center"
              fontSize={16}
              fontWeight="500"
              lineHeight={27}
              colorTheme="text_primary">
              {error}
            </Text>
          </Block>
          <Block
            paddingHorizontal={16}
            justifyContent="center"
            alignItems="center"
            direction="row">
            <TouchableOpacity
              style={styles.buttonModal}
              onPress={onGetCurrentPositionAgain}>
              <Text colorTheme="white" fontSize={16} fontWeight="500">
                Thử lại
              </Text>
            </TouchableOpacity>
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
  });
