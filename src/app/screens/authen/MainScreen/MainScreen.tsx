import {
  Animated,
  AppState,
  AppStateStatus,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import React, {useCallback, useRef} from 'react';
import {Text, Block, FAB, Icon, SvgIcon} from '@components';
import Mapbox from '@rnmapbox/maps';
import {MAPBOX_TOKEN, MAP_TITLE_URL} from '@config/app.const';
import {AppTheme, useTheme} from '@theme';
import BackgroundGeolocation, {
  Geofence,
  GeofenceEvent,
  GeofencesChangeEvent,
  Location,
  LocationError,
  MotionChangeEvent,
} from 'react-native-background-geolocation';
import {API_EK_KEY, BASE_URL_MAP} from '@config/createApi';
import {
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

const UNDEFINED_LOCATION = {
  timestamp: '',
  latitude: 0,
  longitude: 0,
};

const MainScreen = () => {
  const theme = useTheme();
  const mapboxCameraRef = useRef<Mapbox.Camera>(null);
  const styles = rootStyles(theme);

  //Locations
  const locations = React.useRef<Location | any>();
  const [enabled, setEnabled] = React.useState(false);
  const [isMoving, setIsMoving] = React.useState(false);
  const [updateLocations, setUpdateLocations] = React.useState<any>({});
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
  const [error, setError] = React.useState('');
  const [status, setStatus] = React.useState('active');
  const loginState = useSelector(
    state => state.login.loginResponse,
    shallowEqual,
  );
  const dataCustomer: ListCustomerRouter[] = useSelector(
    state => state.app.data?.dataCustomer,
    shallowEqual,
  );
  const {elapsedTime, isRunning, toggleTimer} = useTimer();
  const appState = useRef<AppStateStatus>('unknown');
  const URL = useRef<string>(
    BASE_URL_MAP +
      `${loginState.projectId ?? '6600fdbb9058b549ce243e5b'}` +
      `/${loginState.objectId ?? '65eadedc973f307f60fdd6ed'}` +
      `?api_key=${API_EK_KEY}`,
  );
  const animatedValue = useRef(
    new Animated.Value(Dimensions.get('window').height),
  ).current;
  const subscriptions = useRef<any[]>([]);

  React.useEffect(() => {
    if (locations !== null && locations?.current) {
      setOdometer(locations.current.odometer);
    } else {
      return;
    }
  }, [locations]);

  const subscribe = useCallback((subscription: any) => {
    subscriptions.current.push(subscription);
  }, []);

  const unsubscribe = () => {
    subscriptions.current.forEach((subscription: any) => subscription.remove());
    subscriptions.current.splice(0, subscriptions.current.length);
  };

  const sortedData = useCallback(
    (filteredData: ListCustomerRouter[]) => {
      return filteredData
        .slice()
        .sort((a, b) => {
          const locationA = JSON.parse(a.customer_location_primary);
          const locationB = JSON.parse(b.customer_location_primary);
          const distance1 = calculateDistance(
            locations.current?.coords.latitude ?? 0,
            locations.current?.coords.longitude ?? 0,
            locationA?.lat,
            locationA?.long,
          );
          const distance2 = calculateDistance(
            locations.current?.coords.latitude ?? 0,
            locations.current?.coords.longitude ?? 0,
            locationB.lat,
            locationB.long,
          );
          return distance1 - distance2;
          // return b
        })
        .map(item => {
          let coords = JSON.parse(item.customer_location_primary);
          // console.log(coords,'coords')
          const distance = calculateDistance(
            locations.current?.coords.latitude,
            locations.current?.coords.longitude,
            coords.lat,
            coords.long,
          );
          return Math.round(distance * 100) / 100;
        });
    },
    [locations.current, motionChangeEvent],
  );

  useDeepCompareEffect(() => {
    subscribe(BackgroundGeolocation.onMotionChange(setMotionChangeEvent));
    subscribe(BackgroundGeolocation.onGeofence(setGeofenceEvent));
    subscribe(BackgroundGeolocation.onGeofencesChange(setGeofencesChangeEvent));
    subscribe(BackgroundGeolocation.onEnabledChange(setEnabled));

    // Auto-toggle [ play ] / [ pause ] button in bottom toolbar on motionchange events.
    BackgroundGeolocation.ready({
      url: URL.current
        ? URL.current
        : 'https://api.ekgis.vn/v2/tracking/locationHistory/position/6556e471178a1db24ac1a711/655824e13a62d46bf149dced?api_key=LnJqtY8kpTY4ZxAtiT5frqPZUNxkDZBXPRSyCi7P',

      desiredAccuracy: BackgroundGeolocation.DESIRED_ACCURACY_NAVIGATION,
      distanceFilter: 5,
      stopTimeout: 3,
      locationAuthorizationRequest: 'Always',
      backgroundPermissionRationale: {
        title:
          'Cho phép {applicationName} truy cập vào vị trí kể cả khi không sử dụng',
        message:
          'This app collects location data to enable recording your trips to work and calculate distance-travelled.',
        positiveAction: 'Change to "{backgroundPermissionOptionLabel}"',
        negativeAction: 'Cancel',
      },
      // HTTP & Persistence
      autoSync: true,
      autoSyncThreshold: 5,
      maxBatchSize: 50,
      batchSync: false,
      maxDaysToPersist: 14,
      // Application
      stopOnTerminate: false,
      params: {
        location: locations.current,
      },

      enableHeadless: true,
    }).then(state => {
      setOdometer(state.odometer);
      setEnabled(state.enabled);
      setIsMoving(state.isMoving || false);
    });

    initBackgroundFetch();

    AppState.addEventListener('change', _handleAppStateChange);

    return () => {
      // When view is destroyed (or refreshed with dev live-reload),
      // Remove BackgroundGeolocation event-listeners.
      unsubscribe();
      clearMarkers();
      // locationSubscriber.remove();
    };
  }, [locations.current]);

  useDeepCompareEffect(() => {}, [locations.current]);

  const backgroundErrorListener = useCallback(
    (errorCode: number) => {
      // Handle background location errors
      switch (errorCode) {
        case 0:
          setError(
            'Không thể lấy được vị trí GPS. Bạn nên di chuyển đến vị trí không bị che khuất và thử lại.',
          );
          // setEnabled(true);
          break;
        case 1:
          setError('GPS đã bị tắt. Vui lòng bật lại.');
          // setEnabled(true);
          break;
        default:
          setError(
            'Không thể lấy được vị trí GPS. Bạn nên di chuyển đến vị trí không bị che khuất và thử lại.',
          );
          // setEnabled(true);
          break;
      }
    },
    [locations],
  );

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
          samples: 2,
        });
        console.log('[getCurrentPosition]', location);
        locations.current = location;
        BackgroundFetch.finish(taskId);
      },
      async taskId => {
        console.log('[BackgroundFetch] TIMEOUT:', taskId);
        BackgroundFetch.finish(taskId);
      },
    );
  };

  const onMotionChange = async () => {
    let location = motionChangeEvent?.location;
    if (motionChangeEvent?.isMoving) {
      setUpdateLocations(location);
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
      locations.current = motionChangeEvent.location;

      setOdometer(motionChangeEvent.location.odometer);
      setStationaryLocation(UNDEFINED_LOCATION);
    } else {
      let state = await BackgroundGeolocation.getState();
      console.log(state.isMoving, 'isMoving');
      setStationaryLocation({
        timestamp: location?.timestamp!,
        latitude: location?.coords.latitude!,
        longitude: location?.coords.longitude!,
      });
    }
    setLastMotionChangeEvent(motionChangeEvent);
  };

  React.useEffect(() => {
    if (!geofenceEvent) return;
    onGeofence();
  }, [geofenceEvent]);

  React.useEffect(() => {
    if (!motionChangeEvent) return;
    onMotionChange();
  }, [motionChangeEvent]);
  // console.log(locations.current,'motionChangeEvent');

  React.useEffect(() => {
    if (!geofencesChangeEvent) return;
    onGeofencesChange();
  }, [geofencesChangeEvent]);

  const onClickEnable = async (value: boolean) => {
    let state = await BackgroundGeolocation.getState();
    setEnabled(value);
    if (value) {
      if (state.trackingMode == 1) {
        BackgroundGeolocation.start();
        dispatch(appActions.getCustomerRouteAction());
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
        locations.current = location;
        mapboxCameraRef.current?.flyTo(
          [location.coords.longitude, location.coords.latitude],
          500,
        );
      })
      .catch((error: LocationError) => {
        backgroundErrorListener(error);
      });
  };

  const _handleAppStateChange = useCallback(
    async (nextAppState: AppStateStatus) => {
      appState.current = nextAppState;
      console.log('[_handleAppStateChange]', nextAppState);
      if (nextAppState === 'background') {
        // App entered background.
      } else {
        // onClickEnable(true);
      }
    },
    [enabled],
  );

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
        locations.current = location;

        // sortedData(dataCustomer)
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
  }, [isMoving,onMotionChange]);

  // console.log(sortedData(dataCustomer),'sorted Data')

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
      toValue: Dimensions.get('window').height - 300,
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
      setIsMoving(true);
      BackgroundGeolocation.changePace(!isMoving);
      onClickEnable(true);
    } else {
      setStatus('active');
      sortedData(dataCustomer);
      hideAnimated();
      toggleTimer();
      onClickEnable(false);
      BackgroundGeolocation.changePace(!isMoving);
      setIsMoving(false);
      // BackgroundGeolocation.stop();

      // startAnimation();
    }
  };

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

  // console.log(updateLocations,'update Locations')
  // console.log(motionChangeEvent,'motion change')
  return (
    <SafeAreaView style={styles.root} edges={['bottom']}>
      <TouchableOpacity style={styles.buttonTopLeft}>
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
          styleURL={Mapbox.StyleURL.Street}
          style={styles.mapView}>
          <Mapbox.Camera
            ref={mapboxCameraRef}
            // followUserLocation
            centerCoordinate={[
              locations?.current && locations?.current !== null
                ? locations?.current.coords.longitude
                : 0,
              locations.current && locations?.current !== null
                ? locations?.current.coords.latitude
                : 0,
            ]}
            animationMode={'flyTo'}
            animationDuration={500}
            zoomLevel={11}
          />
          {/* <Poly */}
          <Mapbox.RasterSource
            id="adminmap"
            tileUrlTemplates={[MAP_TITLE_URL.adminMap]}>
            <Mapbox.RasterLayer
              id={'adminmap'}
              sourceID={'admin'}
              style={{visibility: 'visible'}}
            />
          </Mapbox.RasterSource>
          {dataCustomer && dataCustomer.length > 0
            ? dataCustomer.map((item, index) => {
                const newLocation = JSON.parse(item.customer_location_primary!);
                if (
                  sortedData(dataCustomer)[index] <= 0.5 &&
                  status != 'active'
                ) {
                  return (
                    <Mapbox.MarkerView
                      key={index}
                      coordinate={[
                        Number(newLocation.long),
                        Number(newLocation.lat),
                      ]}>
                      <MarkerItem
                        item={item}
                        index={index}
                        onPress={() => {}}
                      />
                    </Mapbox.MarkerView>
                  );
                }
              })
            : null}
          {/* <Block zIndex={99999} position='absolute'> */}
          <Mapbox.UserLocation
            visible={true}
            animated
            androidRenderMode="gps"
            minDisplacement={5}
            showsUserHeadingIndicator={true}
          />
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
            value={Math.round(odometer) / 1000}
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
              motionChangeEvent?.isMoving
                ? Math.round(motionChangeEvent?.location.coords.speed! * 3.6)
                : 0
            }
          />
          <ContentView
            title="Phần trăm pin (%)"
            icon="IconBattery"
            value={
              locations?.current?.battery.level
                ? locations?.current?.battery.level < 0
                  ? -locations?.current.battery.level * 100
                  : locations?.current.battery.level * 100
                : 0
            }
          />
        </Block>
      </Animated.View>
      {/* {status !== 'active' && (
       
      )} */}
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
  });
