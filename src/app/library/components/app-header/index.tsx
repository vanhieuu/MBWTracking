import {StyleSheet, TouchableOpacity} from 'react-native';
import React from 'react';
import {Block} from '../block';
import isEqual from 'react-fast-compare';
import {SvgIcon} from '../svg-icon';
import {Text} from '../text';
import { goBack } from '@navigation/navigation-service';

type Props = {
  isIcon?: boolean;
  headerTitle?: string;
};

const AppHeaderComponent = ({isIcon = true, headerTitle = ''}: Props) => {
  return (
    <Block
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      height={48}>
      {isIcon && (
        <TouchableOpacity  onPress={() => goBack()} >
          <Block block width={36} paddingLeft={16} justifyContent="center">
            <SvgIcon source="ArrowLeft" size={24} />
          </Block>
        </TouchableOpacity>
      )}
      <Block
        block
        alignSelf="center"
        alignItems="center"
        height={48}
        justifyContent="center">
        <Text
          fontSize={18}
          fontWeight="500"
          lineHeight={27}
          colorTheme="text_primary">
          {headerTitle}
        </Text>
      </Block>
    </Block>
  );
};

export const AppHeader = React.memo(AppHeaderComponent, isEqual);


