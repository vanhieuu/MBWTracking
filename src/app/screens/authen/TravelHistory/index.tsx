import {ActivityIndicator, FlatList} from 'react-native';
import React, {useCallback, useRef, useState} from 'react';
import isEqual from 'react-fast-compare';
import {AppHeaderContent, Block, SkeletonLoading} from '@components';
import {SafeAreaView} from 'react-native-safe-area-context';
import {rootStyle} from './style';
import {useTheme} from '@theme';
import {MapResponse, useDeepCompareEffect, useSelector} from '@common';

import {shallowEqual} from 'react-redux';
import ModalPicker from './components/ModalPicker';
import TravelItem from './components/TravelItem';

const TravelHistory = () => {
  const theme = useTheme();
  const styles = rootStyle(theme);
  const [loading, setLoading] = useState<boolean>(false);
  const [showPicker, setShowPicker] = useState(false);
  const currentDate = useRef(new Date());
  const [date, setDate] = useState(new Date());
  const listTravelHistory: MapResponse = useSelector(
    state => state.app.travelHistory,
    shallowEqual,
  );

  useDeepCompareEffect(() => {
    const startOfDay = currentDate.current;

    const startOfDayString = `${startOfDay.getFullYear()}-${String(
      startOfDay.getMonth() + 1,
    ).padStart(2, '0')}-${String(startOfDay.getDate()).padStart(
      2,
      '0',
    )}T00:00:00`;

    // Format the end of the day
    const endOfDay = currentDate.current;
    endOfDay.setHours(23, 59, 59, 999);
    const endOfDayString = `${endOfDay.getFullYear()}-${String(
      endOfDay.getMonth() + 1,
    ).padStart(2, '0')}-${String(endOfDay.getDate()).padStart(
      2,
      '0',
    )}T23:59:59`;

    setLoading(true);
    // dispatch(
    //   appActions.getTravelHistoryAction(startOfDayString, endOfDayString),
    // );
    setLoading(false);
    return () => {
      setLoading(false);
    };
  }, [currentDate.current]);
  // console.log(langCode)

  const onCancel = useCallback(() => {
    setDate(new Date());
    currentDate.current = new Date();
    setShowPicker(false);
  }, [currentDate, loading]);

  return loading ? (
    <Block block justifyContent="center" alignItems="center">
      <ActivityIndicator size="large" color={theme.colors.primary} />
    </Block>
  ) : (
    <SafeAreaView style={styles.root} edges={['top', 'bottom']}>
      <AppHeaderContent
        content={currentDate.current}
        title="Lịch sử di chuyển"
        onPress={() => setShowPicker(true)}
      />
      {loading ? (
        <SkeletonLoading />
      ) : (
        <FlatList
          data={listTravelHistory.positions}
          keyExtractor={(item, index) => index.toString()}
          showsVerticalScrollIndicator={false}
          decelerationRate={'fast'}
          renderItem={({item, index}) => {
            return (
              <TravelItem
                item={item}
                index={index}
                data={listTravelHistory.positions}
              />
            );
          }}
        />
      )}

      <ModalPicker
        setShowPicker={setShowPicker}
        showPicker={showPicker}
        onCancelPicker={onCancel}
        onPressConfirm={() => {
          currentDate.current = date;
          setShowPicker(false);
        }}
        date={date}
        setDate={setDate}
      />
    </SafeAreaView>
  );
};

export default React.memo(TravelHistory, isEqual);
