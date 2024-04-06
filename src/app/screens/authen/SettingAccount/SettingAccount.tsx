import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import isEqual from 'react-fast-compare';

type Props = {};

const SettingAccountScreens = (props: Props) => {
  return (
    <View>
      <Text>SettingAccount</Text>
    </View>
  );
};

export const SettingAccount = React.memo(SettingAccountScreens, isEqual);

const styles = StyleSheet.create({});
