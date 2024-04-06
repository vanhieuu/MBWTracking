import {
  Animated,
  Dimensions,
  FlatList,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import React, {useRef} from 'react';
import isEqual from 'react-fast-compare';
import {Block} from '../block';
import {Text} from '../text';

import {useTheme} from '@theme';


type Props = {
  //   dateDate: any[];
  //   dateMonth: any[];
  //   dataYears: any[];
  //   langCode: string;
};


const DatePickerComponent = (props: Props) => {
  const theme = useTheme();

  return (
    <Block
      direction="row"
      alignItems="center"
      justifyContent="center"
      block
      //   colorTheme='action'
    >
        {/* <DatePicker/> */}
    </Block>
  );
};

export const DateCustomPicker = React.memo(DatePickerComponent, isEqual);

const styles = StyleSheet.create({
  listView: {
    flex: 1,
    // flexGrow:0
  } as ViewStyle,
});
