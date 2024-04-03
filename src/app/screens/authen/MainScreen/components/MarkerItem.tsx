import {ListCustomerRouter} from '@common';
import {Icon} from '@components';
import {useTheme} from '@theme';
import React, {FC} from 'react';
import {TouchableOpacity, Text} from 'react-native';

interface MarkerItemProps {
  item: ListCustomerRouter;
  index: number;
  onPress?: (item: ListCustomerRouter) => void;
}

const MarkerItem: FC<MarkerItemProps> = ({item, index, onPress}) => {
  const theme = useTheme();
  const {colors} = theme;
  return (
    <TouchableOpacity
      style={{alignItems: 'center', justifyContent: 'center'}}
      onPress={() => onPress && onPress(item)}>
      <Icon
        icon={'Tooltip'}
        imageStyle={{width: 20, height: 20, marginBottom: -5}}
        resizeMode={'contain'}
      />
      <Text style={{color: colors.bg_default, position: 'absolute', top: 0}}>
        {index + 1}
      </Text>
      <Icon
        icon={'MapPinFill'}
        imageStyle={{width: 32, height: 32}}
        resizeMode={'cover'}
        color={item.is_checkin ? colors.success : colors.warning}
      />
    </TouchableOpacity>
  );
};
export default React.memo(MarkerItem);
