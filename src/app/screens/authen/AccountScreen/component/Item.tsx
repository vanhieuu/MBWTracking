import {Animated, Dimensions, TouchableOpacity} from 'react-native';
import React, {useRef} from 'react';
import {ItemType} from '../type';
import {Block, LangItem, SvgIcon, Text} from '@components';
import isEqual from 'react-fast-compare';
import {useTheme} from '@theme';
import {itemStyle} from '../style';
import {navigate} from '@navigation/navigation-service';
import {Switch} from 'react-native-paper';
import {dispatch} from '@common';
import {appActions} from '@store/app-reducer/reducer';

type Props = {
  data: ItemType;
  onPressChangeLang: () => void;
  langCode?: string;
  status: string;
};

const Item = (props: Props) => {
  const theme = useTheme();
  const styles = itemStyle(theme);

  const {status = 'inActive'} = props;

  return (
    <TouchableOpacity
      onPress={() => {
        props.data.navigateAble
          ? navigate(props.data.screen!)
          : props.data.dropAble
          ?  props.onPressChangeLang()
          : dispatch(
            appActions.onSetAppTheme(theme.dark ? 'default' : 'dark'),
          );
      }}
      style={styles.containItem}>
      <Block direction="row" alignItems="center">
        <SvgIcon source={props.data.icon} colorTheme="white" size={26} />
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
      {props.data.dropAble ? (
        <LangItem
          flagSource={props.langCode === 'vi' ? 'VNFLag' : 'ENFlag'}
          onPress={() => props.onPressChangeLang()}
          styles={{marginTop: 24}}
        />
      ) : props.data.isToggle ? (
        <Block>
          <Switch
            value={theme.dark}
            onValueChange={() =>
              dispatch(
                appActions.onSetAppTheme(theme.dark ? 'default' : 'dark'),
              )
            }
          />
        </Block>
      ) : null}
    </TouchableOpacity>
  );
};

export default React.memo(Item, isEqual);
