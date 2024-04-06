import {StyleSheet} from 'react-native';
import React from 'react';
import {Block, Modal} from '@components';
import {HeaderPicker} from './HeaderPicker';
import DatePicker from 'react-native-date-picker';
import {width} from '@common';
import {useMMKVString} from 'react-native-mmkv';
import {Language_Code} from '@config/app.const';

type Props = {
  showPicker: boolean;
  setShowPicker: React.Dispatch<React.SetStateAction<boolean>>;
  date: Date;
  onPressConfirm: () => void;
  setDate: React.Dispatch<React.SetStateAction<Date>>;
 
  onCancelPicker:() =>  void
};

const ModalPicker = (props: Props) => {
  const {showPicker, setShowPicker, onPressConfirm, setDate, date,onCancelPicker} = props;
  const [langCode] = useMMKVString(Language_Code ?? 'vi');

  return (
    <Modal
      isVisible={showPicker}
      backdropOpacity={0.5}
      onBackButtonPress={onCancelPicker}
      onBackdropPress={onCancelPicker}
      animatedIn="slideInUp"
      animatedOut="slideOutDown"
      hasGesture={false}>
      <Block
        colorTheme="white"
        height={400}
        borderTopLeftRadius={8}
        borderTopRightRadius={8}
        justifyContent="flex-end"
        top={250}>
        <HeaderPicker
          onPressConfirm={onPressConfirm}
          onCancel={onCancelPicker}
        />
        <Block block>
          <DatePicker
            date={date}
            onDateChange={setDate}
            mode="date"
            locale={langCode}
            style={{flex: 1, width, top: -150}}
          />
        </Block>
      </Block>
    </Modal>
  );
};

export default ModalPicker;

const styles = StyleSheet.create({});
