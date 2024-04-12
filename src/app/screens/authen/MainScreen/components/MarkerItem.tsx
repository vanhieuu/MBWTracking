import {ListCustomerRouter} from '@common';
import {Block, Icon, SvgIcon} from '@components';
import {useTheme} from '@theme';
import React, {FC} from 'react';
import {TouchableOpacity, Text} from 'react-native';

interface MarkerItemProps {
  index: number;
}

const MarkerItem: FC<MarkerItemProps> = ({index}) => {
  const theme = useTheme();

  return (
    <Block alignItems="center" justifyContent="center">
      {index === 0 ? (
        <SvgIcon source="FlagStart" size={24} />
      ) : (
        <Block
          key={index.toString()}
          width={10}
          height={10}
          colorTheme="action"
          color={theme.colors.action}
          borderRadius={10}
        />
      )}
    </Block>
  );
};
export default React.memo(MarkerItem);
