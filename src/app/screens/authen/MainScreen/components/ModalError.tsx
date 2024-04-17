import {StyleSheet, TouchableOpacity, ViewStyle} from 'react-native';
import React from 'react';
import isEqual from 'react-fast-compare';
import {Block, Icon, Modal, Text} from '@components';
import {AppTheme} from '@theme';

type Props = {
  modalShow: boolean;
  onGetCurrentPositionAgain: () => void;
  theme: AppTheme;
  error: string;
};

const ModalError = ({
  modalShow,
  onGetCurrentPositionAgain,
  theme,
  error,
}: Props) => {
  const styles = rootStyles(theme);

  return (
    <Modal
      isVisible={modalShow}
      backdropOpacity={0.5}
      onBackButtonPress={() => {}}
      onBackdropPress={() => {}}
      animatedIn="slideInUp"
      animatedOut="slideOutDown">
      <Block
        colorTheme="bg_default"
        height={230}
        marginLeft={16}
        marginRight={16}
        borderRadius={16}>
        <Block justifyContent="center" alignItems="center" marginTop={8}>
          <Icon icon="ErrorApiIcon" size={100} />
        </Block>
        <Block justifyContent="center" paddingVertical={8}>
          <Text
            textAlign="center"
            fontSize={16}
            fontWeight="500"
            lineHeight={27}
            colorTheme="text_primary">
            {error}
          </Text>
        </Block>
        <Block
          paddingHorizontal={16}
          justifyContent="center"
          alignItems="center"
          direction="row">
          <TouchableOpacity
            style={styles.buttonModal}
            onPress={onGetCurrentPositionAgain}>
            <Text colorTheme="white" fontSize={16} fontWeight="500">
              Thử lại
            </Text>
          </TouchableOpacity>
        </Block>
      </Block>
    </Modal>
  );
};

export default React.memo(ModalError, isEqual);

const rootStyles = (theme: AppTheme) =>
  StyleSheet.create({
    buttonModal: {
      flex: 1,
      backgroundColor: theme.colors.primary,
      height: 40,
      borderRadius: 8,
      marginRight: 8,
      marginTop: 16,
      justifyContent: 'center',
      alignItems: 'center',
    } as ViewStyle,
  });
