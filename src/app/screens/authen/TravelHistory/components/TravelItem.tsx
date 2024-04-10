import {StyleSheet, TouchableOpacity, ViewStyle} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Block, SvgIcon, Text} from '@components';
import {AppTheme, useTheme} from '@theme';
import {PositionMapResponse} from '@common';
import {getReverseAddress} from '@store/api';
import moment from 'moment';

type Props = {
  item: PositionMapResponse;
  index: number;
  data: PositionMapResponse[];
};

const TravelItem = (props: Props) => {
  const theme = useTheme();
  const styles = rootStyles(theme);
  const [address, setAddress] = useState('');

  useEffect(() => {
    const returnAddress = async () => {
      const res: any = await getReverseAddress(
        props.item.coords.longitude,
        props.item.coords.latitude,
      );
      setAddress(res.results[0].address_components[0].short_name);
    };
    returnAddress();
  }, [props.item]);

  return (
    <TouchableOpacity style={styles.rootButtonStyle} key={props.index}>
      <Block
        direction="row"
        justifyContent="space-between"
        marginBottom={8}
        alignItems="center">
        <Text
          fontSize={16}
          fontWeight="600"
          lineHeight={27}
          colorTheme="text_primary">
          {props.index === 0
            ? `8:00 - ${moment(props.data[props.index].timestamp).format(
                'HH:mm',
              )}`
            : `${moment(props.data[props.index].timestamp).format(
                'HH:mm',
              )}   - ${moment(
                props.data[
                  props.index === props.data.length - 1
                    ? props.index
                    : props.index + 1
                ].timestamp,
              ).format('HH:mm')}  `}
        </Text>
        <Block
          alignItems="center"
          justifyContent="center"
          colorTheme="bg_neutral"
          padding={8}
          borderRadius={8}>
          <Text  colorTheme='text_primary' >
            {' '}
            <SvgIcon source="TinyMapPin" size={14} colorTheme="white" />{' '}
            {props.item.odometer > 0 ? props.item.odometer/1000 : props.item.odometer} km
          </Text>
        </Block>
      </Block>
      <Block direction="row" marginTop={8}>
        <Block alignItems="center" justifyContent="center">
          <Block width={10} height={10} borderRadius={10} colorTheme="action" />
          <Block
            alignSelf="flex-start"
            alignItems="center"
            justifyContent="center"
            paddingBottom={4}>
            <SvgIcon source="LineMap" size={18} />
            <SvgIcon source="LineMap" size={18} />
          </Block>
          <SvgIcon source="IconLocation" size={18} colorTheme="action" />
        </Block>
        <Block alignItems="flex-start" justifyContent="space-between">
          <Block marginLeft={8}>
            <Text colorTheme='text_primary'>{address}</Text>
          </Block>
          <Block />

          <Block marginLeft={8}>
            <Text numberOfLines={1} colorTheme='text_primary'>{address}</Text>
          </Block>
        </Block>
      </Block>
    </TouchableOpacity>
  );
};

export default TravelItem;

const rootStyles = (theme: AppTheme) =>
  StyleSheet.create({
    rootButtonStyle: {
      //   flexDirection: 'row',
      //   justifyContent: 'space-between',
      // alignItems:'center',
      paddingHorizontal: 16,
      paddingVertical: 16,
      backgroundColor: theme.colors.white,
      borderRadius: 16,
      marginHorizontal: 16,
      marginVertical: 8,
    } as ViewStyle,
  });
