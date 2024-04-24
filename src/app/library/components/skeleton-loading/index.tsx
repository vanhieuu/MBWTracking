import {StyleSheet, View, ViewStyle, FlatList} from 'react-native';
import React from 'react';

import isEqual from 'react-fast-compare';
import {AppTheme, useTheme} from '@theme';
import ItemLoading from './ItemLoading';


const LoadingSkeleton = () => {
  const theme = useTheme();
  const styles = styleLoading(theme);
  const data = React.useRef<any[]>(new Array(5));
  const renderItem = () => {
    return (
      <View style={styles.container}>
        <View
          style={[
            styles.flexSpace,
            {
              paddingBottom: 16,
              borderColor: theme.colors.divider,
              borderBottomWidth: 1,
            },
          ]}>
          <ItemLoading width={100} height={25} borderRadius={8} />
          <ItemLoading width={140} height={30} borderRadius={8} />
        </View>
        <View style={{rowGap: 4}}>
          <ItemLoading width={300} height={15} borderRadius={8} />
          <ItemLoading width={200} height={15} borderRadius={8} />
        </View>
        <View style={[styles.flexSpace, {marginTop: 20}]}>
          <ItemLoading width={100} height={40} borderRadius={16} />
          <ItemLoading width={50} height={20} borderRadius={16} />
        </View>
      </View>
    );
  };

  return (
    <View>
      <FlatList
        data={data.current}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item, index) => index.toString()}
        decelerationRate={'normal'}
        renderItem={() => renderItem()}
        contentContainerStyle={{rowGap: 20}}
      />
    </View>
  );
};

export const SkeletonLoading =  React.memo(LoadingSkeleton, isEqual);

const styleLoading = (theme: AppTheme) =>
  StyleSheet.create({
    container: {
      paddingHorizontal: 16,
      paddingVertical: 12,
      backgroundColor: theme.colors.bg_default,
      borderRadius: 16,
    } as ViewStyle,
    flexSpace: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    } as ViewStyle,
  });
