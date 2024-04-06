import {StyleSheet, TouchableOpacity} from 'react-native';
import React from 'react';
import isEqual from 'react-fast-compare';
import {Block} from '../block';
import {Text} from '../text';
import {goBack} from '@navigation/navigation-service';
import {SvgIcon} from '../svg-icon';
import moment from 'moment';
type Props = {
  backIcon?: boolean;
  title?: string;
  isContentDate?: boolean;
  onPress: () => void;
  content: Date;
};

const AppHeaderHasChildComponent = (props: Props) => {
  const {backIcon = true, title = '', isContentDate = true, onPress} = props;
  const today = moment();
  const dayToCheck = moment(props.content);
  const isToday = dayToCheck.isSame(today, 'day');

  return (
    <Block height={58} direction="row" alignItems="center">
      {backIcon && (
        <TouchableOpacity onPress={() => goBack()}>
          <Block block width={36} paddingLeft={16} justifyContent="center">
            <SvgIcon source="ArrowLeft" size={24} />
          </Block>
        </TouchableOpacity>
      )}
      <Block
        alignItems="flex-start"
        height={48}
        marginLeft={16}
        justifyContent="center">
        <Text
          fontSize={18}
          fontWeight="500"
          lineHeight={27}
          colorTheme="text_primary">
          {title}
        </Text>
        {isContentDate && (
          <TouchableOpacity onPress={onPress}>
            <Text
              fontSize={12}
              textAlign="left"
              fontWeight="500"
              lineHeight={18}
              colorTheme="text_primary">
              {isToday ? 'Hôm nay,' : ''}{' '}
              {moment(props.content).format('DD/MM/YYYY')}{' '}
              <SvgIcon source="IconArrowDown" size={15} />
            </Text>
          </TouchableOpacity>
        )}
      </Block>
    </Block>
  );
};

export const AppHeaderContent = React.memo(AppHeaderHasChildComponent, isEqual);

const styles = StyleSheet.create({});
