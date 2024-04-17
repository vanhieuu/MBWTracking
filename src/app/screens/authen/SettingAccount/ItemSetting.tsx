import React from 'react';
import isEqual from 'react-fast-compare';
import {ItemType} from './ultil';
import {TouchableOpacity} from 'react-native';
import {Block, SvgIcon, Text} from '@components';
import {navigate} from '@navigation/navigation-service';
import {AppTheme} from '@theme';
import {itemStyle} from './style';
import {Switch} from 'react-native-paper';

type Props = {
  data: ItemType;
  handleSwitch: () => void;
  theme: AppTheme;
  valueSwitch?: any;
  index:number
};

const ItemSetting = (props: Props) => {
  const styles = itemStyle(props.theme);
  return (
    <TouchableOpacity
    key={props.index.toString()}
      onPress={() =>
        props.data.isSwitch ? props.handleSwitch() : navigate(props.data.screen)
      }
      style={styles.containItem}>
      <Block direction="row" alignItems="center">
        <SvgIcon source={props.data.icon} size={26} colorTheme="bg_default" />
        <Block marginLeft={8}>
          <Text
            fontSize={16}
            lineHeight={24}
            fontWeight="400"
            colorTheme="text_primary">
            {props.data.title}
          </Text>
        </Block>
      </Block>
      {props.data.isSwitch && (
        <Block>
          <Switch
            trackColor={{
              false: props.theme.colors.bg_disable,
              true: props.theme.colors.success,
            }}
            value={props.valueSwitch}
            onValueChange={() => props.handleSwitch()}
          />
        </Block>
      )}
    </TouchableOpacity>
  );
};

export default React.memo(ItemSetting, isEqual);
