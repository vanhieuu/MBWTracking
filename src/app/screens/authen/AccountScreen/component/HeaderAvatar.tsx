import {} from 'react-native';
import React from 'react';
import {UserInforType} from '@common';
import {Block, SvgIcon, Text} from '@components';
import FastImage from 'react-native-fast-image';
import {useTheme} from '@theme';
import {headerStyle} from '../style';
import isEqual from 'react-fast-compare';

type Props = {
  userInfor: UserInforType;
};

const HeaderAvatar = ({userInfor}: Props) => {
  const theme = useTheme();
  const styles = headerStyle(theme);
  return (
    <Block direction="row" alignItems="center" height={72}>
      {Object.keys(userInfor).length > 0 ? (
        <FastImage
          source={{uri: userInfor.image.replaceAll(' ', '%')}}
          style={styles.imageStyle}
          resizeMode="contain"
        />
      ) : (
        <Block
          colorTheme="primary"
          width={48}
          height={48}
          borderRadius={50}
          marginLeft={16}
          marginRight={16}
          justifyContent="center"
          alignItems="center">
          <Text numberOfLines={1}>{userInfor.employee_name}</Text>
        </Block>
      )}
      <Block>
        <Text
          fontSize={16}
          lineHeight={24}
          fontWeight="500"
          colorTheme="text_primary">
          {userInfor.employee_name}
        </Text>
        <Block direction="row" alignItems="center">
          <SvgIcon source="IconAccount" size={14} />
          <Block marginLeft={8} marginRight={4}>
            <Text fontSize={14} fontWeight="400" colorTheme="text_secondary">
              {userInfor.department !== null ? userInfor.department : '---'}
            </Text>
          </Block>
          <Block
            colorTheme="text_secondary"
            height={10} 
            width={1}
            alignItems="center"
            alignSelf="center"
            marginRight={4}
          />
          <Text fontSize={14} fontWeight="400" colorTheme="text_secondary">
            {userInfor.employee != null ? userInfor.employee : '---'}
          </Text>
        </Block>
      </Block>
    </Block>
  );
};

export default React.memo(HeaderAvatar, isEqual);
