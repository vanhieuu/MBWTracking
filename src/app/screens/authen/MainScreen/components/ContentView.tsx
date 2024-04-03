import isEqual from 'react-fast-compare';
import {} from 'react-native';
import React from 'react';
import {Block, SvgIcon, Text} from '@components';
import {SvgIconTypes} from '@assets/svgIcon';

type Props = {
  value: any;
  icon: SvgIconTypes;
  title: string;
};

const ContentView = (props: Props) => {
  return (
    <Block block alignItems='center' justifyContent='center' marginBottom={16}>
      <Text fontSize={16} colorTheme='black' fontWeight='bold'>{props.value}</Text>
      <Block direction="row"  alignItems='center'>
        <SvgIcon source={props.icon} size={20} />
        <Block marginLeft={8}>
          <Text colorTheme='text_secondary' fontSize={12} >{props.title}</Text>
        </Block>
      </Block>
    </Block>
  );
};

export default React.memo(ContentView, isEqual);
