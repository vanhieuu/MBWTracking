import { ReactNode } from "react";
import { ViewStyle,  TextStyle } from "react-native";
import { TextInputProps } from "react-native-paper";

export interface AppInputPropsBase {
    label: string;
    value: string;
    onPress?: () => void;
    onChangeValue?: (text: string) => void;
    rightIcon?: ReactNode;
    hiddenRightIcon?: boolean;
    isPassword?: boolean;
    styles?: ViewStyle;
    error?: boolean;
    inputProp?: TextInputProps;
    disable?: boolean;
    editable?: boolean;
    isRequire?: boolean;
    labelStyle?: TextStyle;
    contentStyle?: TextStyle;
    defaultValue?:string
  }
 type AppInputPropsEditable = {
    editable?: true;
  } & AppInputPropsBase;
  
  type AppInputPropsNonEditable = {
    editable?: false;
    listData?: any; // Adjust the type accordingly
    show?: boolean; // Adjust the type accordingly
  } & AppInputPropsBase;
  export type AppInputProps = AppInputPropsEditable | AppInputPropsNonEditable;