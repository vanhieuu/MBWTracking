import {Block, Text} from '@components';
import {useTheme} from '@theme';
import React from 'react';
import isEqual from 'react-fast-compare';
import {TouchableOpacity} from 'react-native';
import {headerStyle} from '../style';

type Props = {
  onPressConfirm: () => void;
  onCancel: () => void;
};

const HeaderPickerComponent = (props: Props) => {
  const {onPressConfirm, onCancel} = props;
  const theme = useTheme();
  const styles = headerStyle(theme);

  return (
    <Block block marginTop={8}>
      <Block
        direction="row"
        width={'100%'}
        justifyContent="space-between"
        // alignItems="center"
        paddingHorizontal={16}>
        <TouchableOpacity onPress={onCancel}>
          <Text
            fontSize={16}
            colorTheme="text_secondary"
            lineHeight={24}
            fontWeight="500">
            Hủy
          </Text>
        </TouchableOpacity>
        <Text
          fontSize={18}
          lineHeight={27}
          fontWeight="600"
          colorTheme="text_primary">
          Ngày hiển thị
        </Text>
        <TouchableOpacity onPress={onPressConfirm}>
          <Text
            fontSize={16}
            colorTheme="primary"
            lineHeight={24}
            fontWeight="500">
            Áp dụng
          </Text>
        </TouchableOpacity>
      </Block>
      <Block  colorTheme='border' marginTop={8} marginBottom={8} height={1}  />
    </Block>
  );
};
export const HeaderPicker = React.memo(HeaderPickerComponent, isEqual);
