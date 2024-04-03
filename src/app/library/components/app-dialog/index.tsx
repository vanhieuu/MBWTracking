import {AppTheme, useTheme} from '@theme';
import React, {FC, ReactElement, memo} from 'react';
import {
  Modal,
  StyleSheet,
  Pressable,
  View,
  ViewStyle,
  TextStyle,
  StyleProp,
  Image,
} from 'react-native';
import {Icon} from '../icon';
import Backdrop from '../back-drop';
import { Block } from '../block';
import {Text} from '../text'
import isEqual from 'react-fast-compare';
const AppDialogComponent: FC<DialogProps> = ({
  open,
  errorType,
  title,
  message,
  closeLabel,
  submitLabel,
  onClose,
  onSubmit,
  onRequestClose,
  modalWrapType,
  modalType,
  buttonType,
  titleType,
  messageType,
  viewOnly,
  showButton,
  customModal,
}) => {
  const theme = useTheme();
  const styles = rootStyles(theme);
  return (
    <>
      <Block style={[styles.centeredView as any, modalWrapType]}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={open}
          onRequestClose={onRequestClose}>
          <Block style={[styles.centeredView as any, modalType]}>
            <Block style={styles.modalView as any}>
              {customModal ? (
                <>{customModal}</>
              ) : (
                <>
                  <Icon
                    icon={errorType ? 'ErrorApiIcon' : 'SuccessApiIcon'}
                    size={54}
                    resizeMode="contain"
                  />

                  {title && (
                    <Text style={[styles.modalText, titleType]}>{title}</Text>
                  )}
                  <Text style={[styles.messageText, messageType, ,]}>
                    {message}
                  </Text>
                  <View style={styles.buttonContainer}>
                    {showButton ? (
                      <>
                        {(Boolean(onClose) || !viewOnly) && (
                          <Pressable
                            style={[
                              styles.button,
                              buttonType,
                              // @ts-ignore
                              {},
                            ]}
                            onPress={onClose}>
                            <Text
                              style={[
                                styles.textStyle,
                                {color: theme.colors.text_secondary},
                              ]}>
                              {closeLabel}
                            </Text>
                          </Pressable>
                        )}
                        <Pressable
                          style={[
                            styles.button,
                            buttonType,
                            // @ts-ignore
                            {
                              backgroundColor: theme.colors.primary,
                              paddingHorizontal: 16,
                            },
                          ]}
                          onPress={onSubmit}>
                          <Text style={styles.textStyle}>{submitLabel}</Text>
                        </Pressable>
                      </>
                    ) : null}
                  </View>
                </>
              )}
            </Block>
          </Block>
        </Modal>
      </Block>
      <Backdrop open={open} />
    </>
  );
};

interface DialogProps {
  open: boolean;
  errorType?: boolean;
  title?: string;
  message?: string;
  closeLabel?: string;
  submitLabel?: string;
  onClose?: () => void;
  onSubmit?: () => void;
  onRequestClose?: () => void;
  modalWrapType?: ViewStyle;
  buttonType?: StyleProp<ViewStyle>;
  titleType?: StyleProp<TextStyle>;
  messageType?: StyleProp<TextStyle>;
  modalType?: ViewStyle;
  viewOnly?: boolean;
  customModal?: ReactElement;
  showButton?: boolean;
}

export const AppDialog = memo(AppDialogComponent,isEqual);

const rootStyles = (theme: AppTheme) =>
  StyleSheet.create({
    centeredView: {
      height: '100%',
      justifyContent: 'center',
      alignItems: 'center',
      alignSelf: 'center',
      position: 'absolute',
    } as ViewStyle,
    modalView: {
      margin: 20,
      width: '100%',
      borderRadius: 10,
      padding: 16,
      alignItems: 'center',
      backgroundColor: theme.colors.bg_paper,
      shadowColor: theme.colors.black,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    } as ViewStyle,
    buttonContainer: {
      flexDirection: 'row',
      justifyContent: 'space-evenly',
      width: '100%',
    } as ViewStyle,
    button: {
      borderRadius: 16,
      marginTop: 24,
      maxWidth: '40%',
      height: 36,
      justifyContent: 'center',
      alignItems: 'center',
      // backgroundColor: theme.colors.blue700,
      backgroundColor: theme.colors.bg_neutral,
      paddingHorizontal: 16,
    } as ViewStyle,
    textStyle: {
      color: theme.colors.white,
      fontWeight: '500',
      textAlign: 'center',
      fontSize: 18,
    } as TextStyle,
    modalText: {
      marginVertical: 12,
      fontSize: 16,
      fontWeight: '500',
      textAlign: 'center',
      color: theme.colors.text_primary,
    } as ViewStyle,
    messageText: {
      fontSize: 14,
      marginTop: 16,
      fontWeight: '400',
      textAlign: 'center',
      color: theme.colors.text_secondary,
    } as TextStyle,
  });
