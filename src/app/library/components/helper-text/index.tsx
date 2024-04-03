import {sharedTiming, useInterpolate, useSharedTransition} from '@animated';
import {enhance} from '@common';
import {useTheme} from '@theme';
import {ColorDefault} from '@theme/color';
import React, {memo, useCallback, useEffect, useMemo, useState} from 'react';
import equals from 'react-fast-compare';
import {
  LayoutChangeEvent,
  LayoutRectangle,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
} from 'react-native-reanimated';

import {styles} from './styles';
import {HelperTextProps} from './type';

const HelperTextComponent = (props: HelperTextProps) => {
  // state
  const {
    visible = false,
    msg,
    type,
    colorThemeError,
    colorThemeInfo,
    colorThemeTutorial,
  } = props;
  const theme = useTheme();
  const [measured, setMeasured] = useState<LayoutRectangle>({
    height: 0,
    width: 0,
    x: 0,
    y: 0,
  });
  const [currentMessage, setCurrentMessage] = useState<string>(msg ?? '');
  const progress = useSharedTransition(visible);
  const height = useSharedValue(0);
  const opacity = useInterpolate(progress, [0, 1], [0, 1]);

  // function
  const _onLayoutContent = useCallback((e: LayoutChangeEvent) => {
    setMeasured({...e.nativeEvent.layout});
  }, []);

  // style
  const textStyle = useMemo(
    () =>
      enhance([
        styles.text,
        {height: measured.height},
        type === 'error'
          ? {
              color: colorThemeError
                ? theme.colors[colorThemeError]
                : ColorDefault.error,
            }
          : type === 'info'
          ? {
              color: colorThemeInfo
                ? theme.colors[colorThemeInfo]
                : ColorDefault.info,
            }
          : {
              color: colorThemeTutorial
                ? theme.colors[colorThemeTutorial]
                : ColorDefault.black,
            },
      ]),
    [colorThemeError, colorThemeInfo, measured.height, theme.colors, type],
  );

  // effect
  useEffect(() => {
    if (msg) {
      setCurrentMessage(msg);
    }
  }, [msg]);

  useEffect(() => {
    if (visible) {
      height.value = sharedTiming(measured.height);
    } else {
      height.value = sharedTiming(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [measured.height, visible]);

  // reanimated style
  const style = useAnimatedStyle(() => ({
    height: height.value,
    opacity: opacity.value,
  }));

  // render
  return (
    <View style={[styles.container as ViewStyle]}>
      <Animated.View
        pointerEvents={'none'}
        onLayout={_onLayoutContent}
        style={[styles.hiddenView as ViewStyle]}>
        <Text style={[styles.text as ViewStyle]}>{currentMessage}</Text>
      </Animated.View>
      <Animated.View style={[style]}>
        <Text style={[textStyle as TextStyle]}>{currentMessage}</Text>
      </Animated.View>
    </View>
  );
};
export const HelperText = memo(HelperTextComponent, equals);
